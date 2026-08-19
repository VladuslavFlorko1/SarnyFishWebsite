import * as SunCalc from "suncalc";

export interface Period {
  start: Date;
  end: Date;
}

export interface SolunarData {
  moonIllumination: number; // 0..1
  moonPhaseName: string;
  majorPeriods: Period[];
  minorPeriods: Period[];
}

const LUNAR_HALF_DAY_MS = 12 * 60 * 60 * 1000 + 25 * 60 * 1000; // 12г25хв

function getMoonPhaseName(phase: number): string {
  if (phase < 0.03 || phase > 0.97) return "Новий місяць";
  if (phase < 0.22) return "Молодий місяць";
  if (phase < 0.28) return "Перша чверть";
  if (phase < 0.47) return "Молодий місяць, що росте";
  if (phase < 0.53) return "Повний місяць";
  if (phase < 0.72) return "Місяць, що спадає";
  if (phase < 0.78) return "Остання чверть";
  return "Старий місяць";
}

function findMoonTransit(date: Date, lat: number, lon: number): Date {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);

  let bestTime = dayStart;
  let bestAltitude = -Infinity;

  for (let minutes = 0; minutes < 24 * 60; minutes += 10) {
    const t = new Date(dayStart.getTime() + minutes * 60000);
    const pos = SunCalc.getMoonPosition(t, lat, lon);
    if (pos.altitude > bestAltitude) {
      bestAltitude = pos.altitude;
      bestTime = t;
    }
  }

  return bestTime;
}

export function getSolunarData(date: Date, lat: number, lon: number): SolunarData {
  const illumination = SunCalc.getMoonIllumination(date);
  const moonTimes = SunCalc.getMoonTimes(date, lat, lon);

  const transit = findMoonTransit(date, lat, lon);
  const antitransit = new Date(transit.getTime() + LUNAR_HALF_DAY_MS);

  const majorPeriods: Period[] = [
    { start: new Date(transit.getTime() - 55 * 60000), end: new Date(transit.getTime() + 55 * 60000) },
    { start: new Date(antitransit.getTime() - 55 * 60000), end: new Date(antitransit.getTime() + 55 * 60000) },
  ];

  const minorPeriods: Period[] = [];
  if (moonTimes.rise) {
    minorPeriods.push({
      start: new Date(moonTimes.rise.getTime() - 30 * 60000),
      end: new Date(moonTimes.rise.getTime() + 30 * 60000),
    });
  }
  if (moonTimes.set) {
    minorPeriods.push({
      start: new Date(moonTimes.set.getTime() - 30 * 60000),
      end: new Date(moonTimes.set.getTime() + 30 * 60000),
    });
  }

  return {
    moonIllumination: illumination.fraction,
    moonPhaseName: getMoonPhaseName(illumination.phase),
    majorPeriods,
    minorPeriods,
  };
}
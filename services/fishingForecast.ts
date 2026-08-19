import { getSolunarData, SolunarData, Period } from "@/lib/solunar";

const SARNY_LAT = 51.335;
const SARNY_LNG = 26.599;

export interface FishingForecast {
  score: number;
  activityLabel: string;
  pressure: number;
  windSpeed: number;
  cloudCover: number;
  moonPhaseName: string;
  moonIllumination: number;
  majorPeriods: Period[];
  minorPeriods: Period[];
}

function getActivityLabel(score: number): string {
  if (score >= 80) return "Дуже висока активність риби";
  if (score >= 60) return "Висока активність риби";
  if (score >= 40) return "Середня активність риби";
  if (score >= 20) return "Низька активність риби";
  return "Дуже низька активність риби";
}

function calculateScore(
  pressureTrend: number,
  windSpeed: number,
  cloudCover: number,
  moonIllumination: number
): number {
  let score = 50;

  if (Math.abs(pressureTrend) < 1) score += 15;
  else if (Math.abs(pressureTrend) < 3) score += 5;
  else score -= 10;

  if (windSpeed >= 5 && windSpeed <= 15) score += 15;
  else if (windSpeed < 5 || (windSpeed > 15 && windSpeed <= 25)) score += 5;
  else score -= 15;

  if (cloudCover >= 30 && cloudCover <= 80) score += 10;

  const distFromExtreme = Math.min(moonIllumination, 1 - moonIllumination);
  if (distFromExtreme < 0.1) score += 10;

  return Math.max(5, Math.min(98, Math.round(score)));
}

export const getFishingForecast = async (): Promise<FishingForecast> => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${SARNY_LAT}&longitude=${SARNY_LNG}&hourly=pressure_msl,cloud_cover,wind_speed_10m&timezone=auto`;

  const res = await fetch(url);
  const data = await res.json();

  const now = new Date();
  const hourIndex = data.hourly.time.findIndex((t: string) => {
    const time = new Date(t);
    return time.getHours() === now.getHours() && time.getDate() === now.getDate();
  });

  const safeIndex = hourIndex >= 0 ? hourIndex : 0;
  const prevIndex = Math.max(0, safeIndex - 3);

  const pressure = data.hourly.pressure_msl[safeIndex];
  const prevPressure = data.hourly.pressure_msl[prevIndex];
  const pressureTrend = pressure - prevPressure;

  const windSpeed = data.hourly.wind_speed_10m[safeIndex];
  const cloudCover = data.hourly.cloud_cover[safeIndex];

  const solunar: SolunarData = getSolunarData(now, SARNY_LAT, SARNY_LNG);

  const score = calculateScore(pressureTrend, windSpeed, cloudCover, solunar.moonIllumination);

  return {
    score,
    activityLabel: getActivityLabel(score),
    pressure: Math.round(pressure),
    windSpeed: Math.round(windSpeed),
    cloudCover: Math.round(cloudCover),
    moonPhaseName: solunar.moonPhaseName,
    moonIllumination: solunar.moonIllumination,
    majorPeriods: solunar.majorPeriods,
    minorPeriods: solunar.minorPeriods,
  };
};
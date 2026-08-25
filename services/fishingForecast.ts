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
  if (score >= 75) return "Висока ймовірність кльову";
  if (score >= 55) return "Середня ймовірність кльову";
  if (score >= 35) return "Нижче середнього";
  return "Низька ймовірність кльову";
}

function bellScore(value: number, sweetSpot: number, tolerance: number): number {
  const distance = Math.abs(value - sweetSpot);
  const ratio = Math.min(distance / tolerance, 1);
  return 100 * (1 - ratio);
}


function estimateWaterTemp(recentAirTemps: number[]): number {
  const avg = recentAirTemps.reduce((sum, t) => sum + t, 0) / recentAirTemps.length;
  return avg * 0.85;
}


function waterTempScore(waterTemp: number): number {
  return bellScore(waterTemp, 16, 12);
}

function calculateScore(
  pressure24hTrend: number,
  pressure3hTrend: number,
  windSpeed: number,
  cloudCover: number,
  moonIllumination: number,
  waterTemp: number
): number {
  const pressureStabilityScore = bellScore(pressure24hTrend, 0, 6);
  const pressureVolatilityPenalty = Math.min(Math.abs(pressure3hTrend) * 8, 30);
  const windScore = bellScore(windSpeed, 10, 15);
  const cloudScore = bellScore(cloudCover, 55, 45);

  const distFromExtreme = Math.min(moonIllumination, 1 - moonIllumination);
  const moonScore = distFromExtreme < 0.15 ? 100 : 50;

  const waterScore = waterTempScore(waterTemp);

  const weighted =
    pressureStabilityScore * 0.3 +
    windScore * 0.2 +
    cloudScore * 0.12 +
    moonScore * 0.08 +
    waterScore * 0.2 +
    50 * 0.1; 

  const final = weighted - pressureVolatilityPenalty;

  return Math.max(10, Math.min(95, Math.round(final)));
}

export const getFishingForecast = async (): Promise<FishingForecast> => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${SARNY_LAT}&longitude=${SARNY_LNG}&hourly=pressure_msl,cloud_cover,wind_speed_10m,temperature_2m&past_days=4&timezone=auto`;

  const res = await fetch(url);
  const data = await res.json();

  const now = new Date();
  const hourIndex = data.hourly.time.findIndex((t: string) => {
    const time = new Date(t);
    return time.getHours() === now.getHours() && time.getDate() === now.getDate();
  });

  const safeIndex = hourIndex >= 0 ? hourIndex : Math.floor(data.hourly.time.length / 2);
  const index3hAgo = Math.max(0, safeIndex - 3);
  const index24hAgo = Math.max(0, safeIndex - 24);
  const index4daysAgo = Math.max(0, safeIndex - 96);

  const pressure = data.hourly.pressure_msl[safeIndex];
  const pressure3hAgo = data.hourly.pressure_msl[index3hAgo];
  const pressure24hAgo = data.hourly.pressure_msl[index24hAgo];

  const pressure3hTrend = pressure - pressure3hAgo;
  const pressure24hTrend = pressure - pressure24hAgo;

  const windSpeed = data.hourly.wind_speed_10m[safeIndex];
  const cloudCover = data.hourly.cloud_cover[safeIndex];

  const recentAirTemps: number[] = data.hourly.temperature_2m.slice(index4daysAgo, safeIndex + 1);
  const waterTemp = estimateWaterTemp(recentAirTemps.length > 0 ? recentAirTemps : [data.hourly.temperature_2m[safeIndex]]);

  const solunar: SolunarData = getSolunarData(now, SARNY_LAT, SARNY_LNG);

  const score = calculateScore(
    pressure24hTrend,
    pressure3hTrend,
    windSpeed,
    cloudCover,
    solunar.moonIllumination,
    waterTemp
  );

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
"use client";

import { useQuery } from "@tanstack/react-query";
import { getFishingForecast } from "@/services/fishingForecast";
import styles from "./FishingForecast.module.css";

function formatTime(date: Date): string {
  return date.toLocaleTimeString("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPeriod(period: { start: Date; end: Date }): string {
  return `${formatTime(period.start)} – ${formatTime(period.end)}`;
}

export default function FishingForecast() {
  const { data, isLoading } = useQuery({
    queryKey: ["fishing-forecast"],
    queryFn: getFishingForecast,
    staleTime: 30 * 60 * 1000,
  });

  if (isLoading || !data) {
    return (
      <div className={styles.card}>
        <div className={styles.loading} />
      </div>
    );
  }

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (data.score / 100) * circumference;

  return (
    <section className={styles.card}>
      <div className={styles.cornerStat} style={{ top: 14, left: 14 }}>
        <span className={styles.cornerLabel}>Тиск</span>
        <span className={styles.cornerValue}>{data.pressure} гПа</span>
      </div>

      <div
        className={styles.cornerStat}
        style={{ top: 14, right: 14, textAlign: "right" }}
      >
        <span className={styles.cornerLabel}>Вітер</span>
        <span className={styles.cornerValue}>{data.windSpeed} км/г</span>
      </div>

      <div className={styles.center}>
        <div className={styles.periodsCol}>
          <p className={styles.periodsLabel}>Основні періоди</p>
          {data.majorPeriods.map((p, i) => (
            <p key={i} className={styles.periodsValue}>
              {formatPeriod(p)}
            </p>
          ))}
        </div>

        <div className={styles.ringWrapper}>
          <svg width={128} height={128} viewBox="0 0 128 128">
            <circle
              cx={64}
              cy={64}
              r={54}
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth={10}
            />
            <circle
              cx={64}
              cy={64}
              r={54}
              fill="none"
              stroke="#17b3d9"
              strokeWidth={10}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 64 64)"
            />
          </svg>
          <span className={styles.scoreNumber}>{data.score}</span>
        </div>

        <div className={styles.periodsCol}>
          <p className={styles.periodsLabel}>Вторинні періоди</p>
          {data.minorPeriods.map((p, i) => (
            <p key={i} className={styles.periodsValue}>
              {formatPeriod(p)}
            </p>
          ))}
        </div>
      </div>

      <p className={styles.activityLabel}>{data.activityLabel}</p>

      <div className={styles.cornerStat} style={{ bottom: 14, left: 14 }}>
        <span className={styles.cornerLabel}>Хмарність</span>
        <span className={styles.cornerValue}>{data.cloudCover}%</span>
      </div>

      <div
        className={styles.cornerStat}
        style={{ bottom: 14, right: 14, textAlign: "right" }}
      >
        <span className={styles.cornerLabel}>Місяць</span>
        <span className={styles.cornerValue}>{data.moonPhaseName}</span>
      </div>
    </section>
  );
}

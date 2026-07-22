"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import LocationsMap from "@/components/LocationsMap/LocationsMapLoader";
import { getLocationsMap } from "@/services/locations";
import styles from "./MapPage.module.css";

const FISH_TYPES = [
  "щука",
  "окунь",
  "карась",
  "короп",
  "лин",
  "лящ",
  "плотва",
  "краснопірка",
  "уклейка",
  "густера",
  "судак",
  "сом",
  "жерех",
  "пічкур",
  "йорж",
  "ротан",
  "підуст",
  "минь",
  "марена",
  "амур",
];

const LOCATION_TYPES = [
  "річка",
  "озеро",
  "струмок",
  "басейн",
  "ставок",
  "інше",
];

export default function MapPage() {
  const [type, setType] = useState("");
  const [fish, setFish] = useState("");
  const [city, setCity] = useState("");
  const [cityInput, setCityInput] = useState("");

  const [typeOpen, setTypeOpen] = useState(false);
  const [fishOpen, setFishOpen] = useState(false);

  const { data: locations = [], isLoading } = useQuery({
    queryKey: ["locations-map", type, fish, city],
    queryFn: () => getLocationsMap({ type, fish, city }),
  });

  const applyCity = () => setCity(cityInput.trim());

  const clearFilters = () => {
    setType("");
    setFish("");
    setCity("");
    setCityInput("");
  };

  const hasActiveFilters = type || fish || city;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Карта водойм</h1>

      <div className={styles.filtersCard}>
        <input
          type="text"
          className={styles.cityInput}
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyCity()}
          onBlur={applyCity}
          placeholder="Пошук за містом..."
        />

        <div className={styles.accordionSection}>
          <button
            type="button"
            className={styles.accordionHeader}
            onClick={() => setTypeOpen((prev) => !prev)}
          >
            <span className={styles.filterLabel}>
              Шукати за типом водойми
              {type && <span className={styles.activeDot} />}
            </span>
            <span
              className={`${styles.arrow} ${typeOpen ? styles.arrowOpen : ""}`}
            >
              ▾
            </span>
          </button>

          <div
            className={`${styles.collapse} ${typeOpen ? styles.collapseOpen : ""}`}
          >
            <div className={styles.collapseInner}>
              <div className={styles.chipRow}>
                {LOCATION_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`${styles.chip} ${type === t ? styles.chipActive : ""}`}
                    onClick={() => setType(type === t ? "" : t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.accordionSection}>
          <button
            type="button"
            className={styles.accordionHeader}
            onClick={() => setFishOpen((prev) => !prev)}
          >
            <span className={styles.filterLabel}>
              Шукати за видом риб
              {fish && <span className={styles.activeDot} />}
            </span>
            <span
              className={`${styles.arrow} ${fishOpen ? styles.arrowOpen : ""}`}
            >
              ▾
            </span>
          </button>

          <div
            className={`${styles.collapse} ${fishOpen ? styles.collapseOpen : ""}`}
          >
            <div className={styles.collapseInner}>
              <div className={styles.chipRow}>
                {FISH_TYPES.map((f) => (
                  <button
                    key={f}
                    type="button"
                    className={`${styles.chip} ${fish === f ? styles.chipActive : ""}`}
                    onClick={() => setFish(fish === f ? "" : f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {hasActiveFilters ? (
          <button
            type="button"
            className={styles.clearButton}
            onClick={clearFilters}
          >
            Скинути фільтри
          </button>
        ) : null}
      </div>

      <p className={styles.resultsCount}>
        {isLoading ? "Завантаження..." : `Знайдено: ${locations.length}`}
      </p>

      <LocationsMap locations={locations} />
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Image from "next/image";
import LocationMapPicker from "@/components/LocationMapPicker/LocationMapPickerLoader";
import { createLocation } from "@/services/locations";
import styles from "./AddLocationForm.module.css";

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

interface FormErrors {
  name?: string;
  description?: string;
  city?: string;
  type?: string;
  fish?: string;
  coordinates?: string;
  images?: string;
  general?: string;
}

export default function AddLocationForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [selectedFish, setSelectedFish] = useState<string[]>([]);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  const mutation = useMutation({
    mutationFn: createLocation,
    onSuccess: (data) => {
      toast.success("Локацію додано! 🎣");
      router.push(`/locations/${data._id ?? data.location?._id ?? ""}`);
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.validation?.body?.message ||
        err?.response?.data?.message ||
        "Не вдалося додати локацію";
      setErrors({ general: message });
      toast.error(message);
    },
  });

  const toggleFish = (fish: string) => {
    setSelectedFish((prev) =>
      prev.includes(fish) ? prev.filter((f) => f !== fish) : [...prev, fish],
    );
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const combined = [...images, ...files].slice(0, 10);

    setImages(combined);
    setPreviews(combined.map((file) => URL.createObjectURL(file)));
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    setPreviews(updated.map((file) => URL.createObjectURL(file)));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = "Вкажіть назву";
    } else if (name.trim().length < 3 || name.trim().length > 18) {
      newErrors.name = "Назва має бути від 3 до 18 символів";
    }

    if (
      description.trim() &&
      (description.trim().length < 10 || description.trim().length > 200)
    ) {
      newErrors.description = "Опис має бути від 10 до 200 символів";
    }

    if (!city.trim()) {
      newErrors.city = "Вкажіть місто";
    } else if (city.trim().length < 3 || city.trim().length > 18) {
      newErrors.city = "Назва міста має бути від 3 до 18 символів";
    }

    if (!type) newErrors.type = "Оберіть тип водойми";

    if (lat === null || lng === null) {
      newErrors.coordinates = "Виберіть точку на карті";
    }

    if (images.length === 0) {
      newErrors.images = "Додайте хоча б одне фото";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    mutation.mutate({
      name,
      description,
      city,
      type,
      lat: lat as number,
      lng: lng as number,
      fish: selectedFish,
      images,
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h1 className={styles.title}>Додати локацію</h1>

      {errors.general && (
        <p className={styles.generalError}>{errors.general}</p>
      )}

      <div className={styles.field}>
        <label className={styles.label}>Назва</label>
        <input
          type="text"
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Тиха заводь"
        />
        {errors.name && <span className={styles.error}>{errors.name}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Місто / населений пункт</label>
        <input
          type="text"
          className={styles.input}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Сарни"
        />
        {errors.city && <span className={styles.error}>{errors.city}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Тип водойми</label>
        <div className={styles.chipRow}>
          {LOCATION_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              className={`${styles.chip} ${type === t ? styles.chipActive : ""}`}
              onClick={() => setType(t)}
            >
              {t}
            </button>
          ))}
        </div>
        {errors.type && <span className={styles.error}>{errors.type}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Риба, яка тут водиться</label>
        <div className={styles.chipRow}>
          {FISH_TYPES.map((fish) => (
            <button
              key={fish}
              type="button"
              className={`${styles.chip} ${selectedFish.includes(fish) ? styles.chipActive : ""}`}
              onClick={() => toggleFish(fish)}
            >
              {fish}
            </button>
          ))}
        </div>
        {errors.fish && <span className={styles.error}>{errors.fish}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Опис</label>
        <textarea
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Розкажи про це місце: підхід до води, дно, глибина, час доби..."
          rows={4}
        />
        {errors.description && (
          <span className={styles.error}>{errors.description}</span>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Розташування на карті</label>
        <LocationMapPicker
          lat={lat}
          lng={lng}
          onChange={(newLat, newLng) => {
            setLat(newLat);
            setLng(newLng);
          }}
        />

        <div className={styles.coordsRow}>
          <div className={styles.coordField}>
            <label className={styles.smallLabel}>Широта</label>
            <input
              type="number"
              step="any"
              className={styles.input}
              value={lat ?? ""}
              onChange={(e) =>
                setLat(e.target.value ? Number(e.target.value) : null)
              }
              placeholder="51.335"
            />
          </div>
          <div className={styles.coordField}>
            <label className={styles.smallLabel}>Довгота</label>
            <input
              type="number"
              step="any"
              className={styles.input}
              value={lng ?? ""}
              onChange={(e) =>
                setLng(e.target.value ? Number(e.target.value) : null)
              }
              placeholder="26.599"
            />
          </div>
        </div>
        {errors.coordinates && (
          <span className={styles.error}>{errors.coordinates}</span>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Фото (до 10)</label>
        <label className={styles.uploadButton}>
          Додати фото
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImagesChange}
            className={styles.hiddenInput}
          />
        </label>

        {previews.length > 0 && (
          <div className={styles.previewGrid}>
            {previews.map((src, i) => (
              <div key={i} className={styles.previewItem}>
                <Image
                  src={src}
                  alt={`preview-${i}`}
                  fill
                  className={styles.previewImage}
                />
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => removeImage(i)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        {errors.images && <span className={styles.error}>{errors.images}</span>}
      </div>

      <button
        type="submit"
        className={styles.submitButton}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Додавання..." : "Додати локацію"}
      </button>
    </form>
  );
}

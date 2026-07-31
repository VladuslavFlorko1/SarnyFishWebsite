"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Image from "next/image";
import LocationMapPicker from "@/components/LocationMapPicker/LocationMapPickerLoader";
import { getLocationById, updateLocation } from "@/services/locations";
import styles from "@/components/AddLocationForm/AddLocationForm.module.css";

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

interface EditLocationFormProps {
  locationId: string;
}

interface FormErrors {
  name?: string;
  description?: string;
  city?: string;
  type?: string;
  coordinates?: string;
  images?: string;
  general?: string;
}

export default function EditLocationForm({
  locationId,
}: EditLocationFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: location, isLoading } = useQuery({
    queryKey: ["location", locationId],
    queryFn: () => getLocationById(locationId),
  });

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [selectedFish, setSelectedFish] = useState<string[]>([]);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!location) return;
    setName(location.name);
    setDescription(location.description ?? "");
    setCity(location.city);
    setType(location.type);
    setSelectedFish(location.fish);
    setLat(location.coordinates.lat);
    setLng(location.coordinates.lng);
    setExistingImages(location.images);
  }, [location]);

  const mutation = useMutation({
    mutationFn: (payload: Parameters<typeof updateLocation>[1]) =>
      updateLocation(locationId, payload),
    onSuccess: () => {
      toast.success("Локацію оновлено");
      queryClient.invalidateQueries({ queryKey: ["location", locationId] });
      router.push(`/locations/${locationId}`);
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.validation?.body?.message ||
        err?.response?.data?.message ||
        "Не вдалося оновити локацію";
      setErrors({ general: message });
      toast.error(message);
    },
  });

  const toggleFish = (fish: string) => {
    setSelectedFish((prev) =>
      prev.includes(fish) ? prev.filter((f) => f !== fish) : [...prev, fish],
    );
  };

  const toggleRemoveExisting = (url: string) => {
    setImagesToRemove((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url],
    );
  };

  const handleNewImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const remainingSlots =
      10 - (existingImages.length - imagesToRemove.length) - newImages.length;
    const accepted = files.slice(0, Math.max(remainingSlots, 0));

    const combined = [...newImages, ...accepted];
    setNewImages(combined);
    setNewPreviews(combined.map((file) => URL.createObjectURL(file)));
  };

  const removeNewImage = (index: number) => {
    const updated = newImages.filter((_, i) => i !== index);
    setNewImages(updated);
    setNewPreviews(updated.map((file) => URL.createObjectURL(file)));
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

    const remainingCount =
      existingImages.length - imagesToRemove.length + newImages.length;
    if (remainingCount === 0) {
      newErrors.images = "Локація повинна мати хоча б одне фото";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !location) return;

    mutation.mutate({
      name: name !== location.name ? name : undefined,
      description:
        description !== (location.description ?? "") ? description : undefined,
      city: city !== location.city ? city : undefined,
      type: type !== location.type ? type : undefined,
      lat: lat !== location.coordinates.lat ? lat! : undefined,
      lng: lng !== location.coordinates.lng ? lng! : undefined,
      fish: selectedFish,
      removeImages: imagesToRemove.length > 0 ? imagesToRemove : undefined,
      newImages: newImages.length > 0 ? newImages : undefined,
    });
  };

  if (isLoading || !location) {
    return <div className={styles.loading}>Завантаження...</div>;
  }

  const visibleExisting = existingImages.filter(
    (img) => !imagesToRemove.includes(img),
  );
  const totalCount = visibleExisting.length + newImages.length;

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h1 className={styles.title}>Редагувати локацію</h1>

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
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Опис</label>
        <textarea
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
        {errors.coordinates && (
          <span className={styles.error}>{errors.coordinates}</span>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Фото ({totalCount}/10)</label>

        {existingImages.length > 0 && (
          <div className={styles.previewGrid}>
            {existingImages.map((src) => {
              const marked = imagesToRemove.includes(src);
              return (
                <div
                  key={src}
                  className={styles.previewItem}
                  style={{ opacity: marked ? 0.4 : 1 }}
                >
                  <Image
                    src={src}
                    alt="Фото локації"
                    fill
                    className={styles.previewImage}
                  />
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => toggleRemoveExisting(src)}
                  >
                    {marked ? "↺" : "✕"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {totalCount < 10 && (
          <label className={styles.uploadButton}>
            Додати нові фото
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleNewImagesChange}
              className={styles.hiddenInput}
            />
          </label>
        )}

        {newPreviews.length > 0 && (
          <div className={styles.previewGrid}>
            {newPreviews.map((src, i) => (
              <div key={i} className={styles.previewItem}>
                <Image
                  src={src}
                  alt={`нове фото ${i}`}
                  fill
                  className={styles.previewImage}
                />
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => removeNewImage(i)}
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
        {mutation.isPending ? "Збереження..." : "Зберегти зміни"}
      </button>
    </form>
  );
}

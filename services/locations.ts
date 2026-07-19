import { api } from "@/lib/api";
import { Location, LocationsResponse } from "@/types/location";

export const getLocations = async (perPage = 10): Promise<Location[]> => {
  const { data } = await api.get("/locations", {
    params: { page: 1, perPage, sort: "newest" },
  });
  return data.locations;
};

export const getPopularLocations = async (perPage = 5): Promise<Location[]> => {
  const { data } = await api.get("/locations", {
    params: { page: 1, perPage, sort: "popular" },
  });
  return data.locations;
};

export const getLocationsFeed = async (
  page: number,
  perPage = 10
): Promise<LocationsResponse> => {
  const { data } = await api.get("/locations", {
    params: { page, perPage, sort: "newest" },
  });
  return data;
};

export const toggleLike = async (id: string) => {
  const { data } = await api.patch(`/locations/${id}/like`);
  return data;
};

export interface CreateLocationPayload {
  name: string;
  description: string;
  city: string;
  type: string;
  lat: number;
  lng: number;
  fish: string[];
  images: File[];
}

export const createLocation = async (payload: CreateLocationPayload) => {
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("description", payload.description);
  formData.append("city", payload.city);
  formData.append("type", payload.type);
  formData.append("lat", String(payload.lat));
  formData.append("lng", String(payload.lng));

  payload.fish.forEach((f) => formData.append("fish", f));
  payload.images.forEach((img) => formData.append("images", img));

  const { data } = await api.post("/locations", formData);

  return data;
};


export interface LocationsMapFilters {
  city?: string;
  type?: string;
  fish?: string;
}

export const getLocationsMap = async (
  filters: LocationsMapFilters
): Promise<Location[]> => {
  const { data } = await api.get("/locations", {
    params: {
      page: 1,
      perPage: 100,
      ...(filters.city ? { city: filters.city } : {}),
      ...(filters.type ? { type: filters.type } : {}),
      ...(filters.fish ? { fish: filters.fish } : {}),
    },
  });

  return data.locations;
};
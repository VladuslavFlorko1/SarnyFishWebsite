import { api } from "@/lib/api";
import { Location, LocationsResponse } from "@/types/location";

export const getLocations = async (
  perPage = 10
): Promise<Location[]> => {
  const { data } = await api.get("/locations", {
    params: {
      page: 1,
      perPage,
      sort: "newest",
    },
  });

  return data.locations;
};

export const getPopularLocations = async (
  perPage = 5
): Promise<Location[]> => {
  const { data } = await api.get("/locations", {
    params: {
      page: 1,
      perPage,
      sort: "popular",
    },
  });

  return data.locations;
};


export const getLocationsFeed = async (
  page: number,
  perPage = 10
): Promise<LocationsResponse> => {
  const { data } = await api.get("/locations", {
    params: {
      page,
      perPage,
      sort: "newest",
    },
  });

  return data;
};

export const toggleLike = async (id: string) => {
  const { data } = await api.patch(`/locations/${id}/like`);

  return data;
};
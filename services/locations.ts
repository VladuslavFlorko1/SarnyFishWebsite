import { api } from "@/lib/api";
import { Location } from "@/types/location";

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
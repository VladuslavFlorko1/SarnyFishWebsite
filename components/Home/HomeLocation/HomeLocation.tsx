"use client";

import { useQuery } from "@tanstack/react-query";
import { getLocations } from "@/services/locations";
import HomeLocationsCarousel from "./HomeLocationsCarousel";

const HomeLocations = () => {
  const { data: locations = [] } = useQuery({
    queryKey: ["home-locations"],
    queryFn: () => getLocations(5),
  });

  return <HomeLocationsCarousel locations={locations} />;
};

export default HomeLocations;

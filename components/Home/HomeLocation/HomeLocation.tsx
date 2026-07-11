import { getLocations } from "@/services/locations";
import HomeLocationsCarousel from "./HomeLocationsCarousel";

const HomeLocations = async () => {
  const locations = await getLocations(5);

  return <HomeLocationsCarousel locations={locations} />;
};

export default HomeLocations;
import HeroBaner from "@/components/Home/HeroBaner/HeroBaner";
import HomeLocation from "@/components/Home/HomeLocation/HomeLocation";
import HomePopular from "@/components/Home/HomePopular/HomePopular";
import About from "@/components/Home/About/About";
import Features from "@/components/Home/Features/Features";
import Map from "@/components/Home/Map/Map";


import { getPopularLocations } from "@/services/locations";

const Home = async () => {
  const popularLocations = await getPopularLocations();

  return (
    <>
      <HeroBaner />
      <HomeLocation />
      <Features />
      <HomePopular locations={popularLocations} />
      <Map />
      <About />
    </>
  );
};

export default Home;

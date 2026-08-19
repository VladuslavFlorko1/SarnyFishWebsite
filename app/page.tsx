import HeroBaner from "@/components/Home/HeroBaner/HeroBaner";
import HomeLocation from "@/components/Home/HomeLocation/HomeLocation";
import HomePopular from "@/components/Home/HomePopular/HomePopular";
import About from "@/components/Home/About/About";
import Features from "@/components/Home/Features/Features";
import Map from "@/components/Home/Map/Map";
import FishingForecast from "@/components/Home/FishingForecast/FishingForecast";

const Home = () => {
  return (
    <>     
      <HeroBaner />
      <FishingForecast />
      <HomeLocation />
      <Features />
      <HomePopular />
      <Map />
      <About />
    </>
  );
};

export default Home;

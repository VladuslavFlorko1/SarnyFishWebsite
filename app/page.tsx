import HeroBaner from "@/components/Home/HeroBaner/HeroBaner";
import HomeLocation from "@/components/Home/HomeLocation/HomeLocation";
import HomePopular from "@/components/Home/HomePopular/HomePopular";
import About from "@/components/Home/About/About";
import Features from "@/components/Home/Features/Features";
import Map from "@/components/Home/Map/Map";

const Home = () => {
  return (
    <>
      <HeroBaner />
      <HomeLocation />
      <Features />
      <HomePopular />
      <Map />
      <About />
    </>
  );
};

export default Home;

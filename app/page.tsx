import Header from "@/components/layout/Header";
import Hero from "@/components/hero/Hero";
import Services from "@/components/sections/Services";
import SparklingProjects from "@/components/sections/SparklingProjects";
import FounderProfile from "@/components/sections/FounderProfile";
import Footer from "@/components/footer/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Services />
      <SparklingProjects />
      <FounderProfile />
      <Footer />
    </>
  );
}

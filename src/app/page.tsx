
import CTA from "@/components/Consultationcta";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Press from "@/components/Press";
import Process from "@/components/Process";
import Projects from "@/components/Projects";
import Stats from "@/components/Stats";
import Team from "@/components/Team";
import Testimonials from "@/components/Testimonials";


export default function Home() {
  return (
   <div>
    <Hero/>
    <Intro/>
    <Projects/>
    <Process/>
    <Stats/>
    <Team/>
    <Press/>
    <Testimonials/>
    <CTA/>
   </div>
  );
}

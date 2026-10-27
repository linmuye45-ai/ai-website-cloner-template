import { Nav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import { Plain } from "@/components/site/plain";
import { WhyNow, Edge } from "@/components/site/sections";
import { Sheet } from "@/components/site/sheet";
import { Ladder } from "@/components/site/ladder";
import { Moat } from "@/components/site/moat";
import { Odds, Three } from "@/components/site/verdict";
import { Method, Footer } from "@/components/site/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <Plain />
        <WhyNow />
        <Sheet />
        <Edge />
        <Ladder />
        <Moat />
        <Odds />
        <Three />
        <Method />
      </main>
      <Footer />
    </>
  );
}

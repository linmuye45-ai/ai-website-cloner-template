import { Nav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import { WhyNow, Edge } from "@/components/site/sections";
import { Sheet } from "@/components/site/sheet";
import { Ladder } from "@/components/site/ladder";
import { Odds, Three } from "@/components/site/verdict";
import { Method, Footer } from "@/components/site/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <WhyNow />
        <Sheet />
        <Edge />
        <Ladder />
        <Odds />
        <Three />
        <Method />
      </main>
      <Footer />
    </>
  );
}

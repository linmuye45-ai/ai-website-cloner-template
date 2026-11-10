import { NavbarHud } from "@/components/NavbarHud";
import { HeroSection } from "@/components/HeroSection";
import { MacroNarrativeSection } from "@/components/MacroNarrativeSection";
import { FoundersSection } from "@/components/FoundersSection";
import { ValuePropositionSection } from "@/components/ValuePropositionSection";
import { ProductCapabilitiesSection } from "@/components/ProductCapabilitiesSection";
import { ArchitectureSection } from "@/components/ArchitectureSection";
import { DeploymentSection } from "@/components/DeploymentSection";
import { ClinicalStandardsSection } from "@/components/ClinicalStandardsSection";
import { TrustBadgesSection } from "@/components/TrustBadgesSection";
import { ROICalculatorSection } from "@/components/ROICalculatorSection";
import { UpgradePathSection } from "@/components/UpgradePathSection";
import { CTASection } from "@/components/CTASection";
import { ComplianceAndFooter } from "@/components/ComplianceAndFooter";
import { ModalsHud } from "@/components/ModalsHud";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-zj-white text-zj-ink">
      <NavbarHud />
      <main className="flex-1">
        <HeroSection />
        <MacroNarrativeSection />
        <FoundersSection />
        <ValuePropositionSection />
        <ProductCapabilitiesSection />
        <ArchitectureSection />
        <DeploymentSection />
        <ClinicalStandardsSection />
        <TrustBadgesSection />
        <ROICalculatorSection />
        <UpgradePathSection />
        <CTASection />
      </main>
      <ComplianceAndFooter />
      <ModalsHud />
    </div>
  );
}

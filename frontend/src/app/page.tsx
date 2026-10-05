// Landing page: explains Vachan and sends visitors to sign up.
import { FeatureGrid } from "@/components/landing/feature-grid";
import { FinalCta } from "@/components/landing/final-cta";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { LanguageShowcase } from "@/components/landing/language-showcase";

export default function LandingPage() {
  return (
    <>
      <LandingHeader />
      <main>
        <Hero />
        <LanguageShowcase />
        <HowItWorks />
        <FeatureGrid />
        <FinalCta />
      </main>
      <LandingFooter />
    </>
  );
}

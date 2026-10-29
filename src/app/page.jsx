import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import TowerHero from "@/components/tower/TowerHero";
import TowerParallax from "@/components/tower/TowerParallax";
import PhilosophySection from "@/components/tower/PhilosophySection";
import ProjectShowcase from "@/components/tower/ProjectShowcase";
import SkillsetSection from "@/components/tower/SkillsetSection";
import ContactSection from "@/components/tower/ContactSection";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen px-4 sm:px-6 lg:px-8 max-w-4xl xl:max-w-5xl mx-auto">
        {/* Living Ambient Tower Animation in Background */}
        <TowerParallax />

        {/* Content Column: Centered, Generous & Readable */}
        <div className="relative z-10 w-full pt-16 lg:pt-24 pb-20">
          <TowerHero />
          {/* <PhilosophySection /> */}
          <ProjectShowcase />
          <SkillsetSection />
          <ContactSection />

          <footer className="pt-12 pb-8 border-t border-stone-200/60 dark:border-stone-800/60 text-xs text-stone-500 dark:text-stone-400 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} Rizki Aprita. All rights reserved.</p>
            <p className="font-mono text-[11px]">

            </p>
          </footer>
        </div>
      </main>
    </SmoothScrollProvider>
  );
}

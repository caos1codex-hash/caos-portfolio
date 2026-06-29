"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";

// Loading Screen
import LoadingScreen from "@/components/portfolio/LoadingScreen";

// Navigation
import Navigation from "@/components/portfolio/Navigation";

// Sections
import Hero from "@/components/portfolio/Hero";
import About from "@/components/portfolio/About";
import Technologies from "@/components/portfolio/Technologies";
import Skills from "@/components/portfolio/Skills";
import Services from "@/components/portfolio/Services";
import Experience from "@/components/portfolio/Experience";
import Projects from "@/components/portfolio/Projects";
import Roadmap from "@/components/portfolio/Roadmap";
import Achievements from "@/components/portfolio/Achievements";
import Contact from "@/components/portfolio/Contact";
import Footer from "@/components/portfolio/Footer";

// Effects
import CustomCursor from "@/components/effects/CustomCursor";
import ScrollProgress from "@/components/effects/ScrollProgress";

// 3D Scene - Dynamic import to avoid SSR
const Scene = dynamic(() => import("@/components/three/Scene"), {
  ssr: false,
});

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
    // Small delay before showing content for smooth transition
    setTimeout(() => setShowContent(true), 100);
  }, []);

  // Enable smooth scrolling with Lenis
  useEffect(() => {
    if (!showContent) return;

    let lenis: ReturnType<typeof import("lenis").default> | null = null;

    const initLenis = async () => {
      const Lenis = (await import("lenis")).default;
      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical" as const,
        gestureOrientation: "vertical" as const,
        smoothWheel: true,
      });

      function raf(time: number) {
        lenis?.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    };

    initLenis();

    return () => {
      lenis?.destroy();
    };
  }, [showContent]);

  return (
    <>
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Scroll Progress */}
      <ScrollProgress />

      {/* 3D Background */}
      <Scene />

      {/* Loading Screen */}
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      </AnimatePresence>

      {/* Main Content */}
      {showContent && (
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Navigation */}
          <Navigation />

          {/* Main Sections */}
          <main>
            <Hero />
            <About />
            <Technologies />
            <Skills />
            <Services />
            <Experience />
            <Projects />
            <Roadmap />
            <Achievements />
            <Contact />
          </main>

          {/* Footer */}
          <Footer />
        </div>
      )}
    </>
  );
}

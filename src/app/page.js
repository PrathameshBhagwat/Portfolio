"use client";

import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";

const Timeline = dynamic(() => import("@/components/Timeline"), { ssr: false });
const Toolbox = dynamic(() => import("@/components/Toolbox"), { ssr: false });
const Projects = dynamic(() => import("@/components/Projects"), { ssr: false });
const Certificates = dynamic(() => import("@/components/Certificates"), { ssr: false });
const Contact = dynamic(() => import("@/components/Contact"), { ssr: false });
const ScrollReveal = dynamic(() => import("@/components/ScrollReveal"), { ssr: false });

import Footer from "@/components/Footer";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { SpeechProvider } from "@/context/SpeechContext";
const AIAssistant = dynamic(() => import("@/components/AIAssistant"), { ssr: false });
import { FaReact, FaPython, FaJava, FaDatabase } from "react-icons/fa";

export default function Home() {
  return (
    <SpeechProvider>
      <SmoothScrollProvider>
        <Header />
        <main style={{ minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
          
          {/* Floating Technology Logo Background Nodes (Refined Theme) */}
          <div className="floatingTechNode techNode1" aria-hidden="true">
            <FaReact />
          </div>
          <div className="floatingTechNode techNode2" aria-hidden="true">
            <FaPython />
          </div>
          <div className="floatingTechNode techNode3" aria-hidden="true">
            <FaJava />
          </div>
          <div className="floatingTechNode techNode4" aria-hidden="true">
            <FaDatabase />
          </div>

          {/* Global background glow shapes */}
          <div className="shape shape-3" />

          {/* Modular Sections */}
          <Hero />
          <About />
          <Experience />
          <Timeline />
          <Toolbox />
          <Projects />
          <Certificates />
          <Contact />

          {/* GSAP ScrollTrigger animations (synced with Lenis) */}
          <ScrollReveal />

          {/* Floating AI Portfolio Assistant (Lazy loaded Chat window) */}
          <AIAssistant />
        </main>
        <Footer />
      </SmoothScrollProvider>
    </SpeechProvider>
  );
}

"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, Phone, MessageCircle, ArrowRight } from "lucide-react";
import { TypeAnimation } from "react-type-animation";

gsap.registerPlugin(ScrollTrigger);

export default function HSDHeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sloganRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const title = titleRef.current;
    const slogan = sloganRef.current;
    const cta = ctaRef.current;
    const scrollIndicator = scrollIndicatorRef.current;
    const background = backgroundRef.current;

    if (!hero || !title || !slogan || !cta || !scrollIndicator || !background)
      return;

    // Professional Apple-style loading animation sequence
    const tl = gsap.timeline({ delay: 0.5 });

    // Title character reveal with professional stagger
    const titleText = title.textContent || "";
    title.innerHTML = titleText
      .split("")
      .map((char) =>
        char === " "
          ? " "
          : `<span class="inline-block" style="transform: translateY(40px); opacity: 0;">${char}</span>`
      )
      .join("");

    tl.to(title.children, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.05,
      ease: "power3.out",
    })
      .fromTo(
        slogan,
        { y: 30, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" },
        "-=0.4"
      )
      .fromTo(
        cta.children,
        { y: 25, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.3"
      )
      .fromTo(
        scrollIndicator,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.2"
      );

    // Multi-layer parallax on scroll
    ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        // Multi-layer parallax
        gsap.to(title, {
          y: progress * -60,
          opacity: 1 - progress * 0.6,
          scale: 1 - progress * 0.08,
          duration: 0.1,
        });

        gsap.to(slogan, {
          y: progress * -45,
          opacity: 1 - progress * 0.8,
          duration: 0.1,
        });

        gsap.to(cta, {
          y: progress * -35,
          opacity: 1 - progress * 0.9,
          duration: 0.1,
        });

        gsap.to(background, {
          y: progress * 80,
          scale: 1 + progress * 0.1,
          duration: 0.1,
        });
      },
    });

    // Enhanced scroll indicator animation
    gsap.to(scrollIndicator, {
      y: 12,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const scrollToNext = () => {
    const handelSection = document.getElementById("handel");
    if (handelSection) {
      handelSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById("kontakt");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Video/Image */}
      <div ref={backgroundRef} className="absolute inset-0 z-0">
        <img
          src="/hero-felgen.png"
          alt="HSD GmbH - Professionelle Felgenaufbereitung"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60"></div>
      </div>

      <div className="relative z-20 text-center px-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 rounded-full border border-white/10 mb-8">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-white">
              Professionelle Felgenaufbereitung
            </span>
          </div>
        </div>

        <h1
          ref={titleRef}
          className="text-4xl md:text-5xl lg:text-6xl text-white mb-6 max-w-4xl mx-auto leading-tight font-bold"
        >
          HSD GmbH
        </h1>

        <div className="mb-8">
          <TypeAnimation
            sequence={[
              "Professionelle Felgenaufbereitung",
              2000,
              "Lackierung & Pulverbeschichtung",
              2000,
              "Bordsteinschäden reparieren",
              2000,
              "Glanzdrehen & Polieren",
              2000,
              "Handel mit Felgen & Reifen",
              2000,
            ]}
            wrapper="div"
            speed={50}
            className="text-xl md:text-2xl text-red-500 font-medium min-h-[2rem]"
            repeat={Infinity}
          />
        </div>

        <p
          ref={sloganRef}
          className="text-lg md:text-xl text-gray-300 mb-16 max-w-3xl mx-auto leading-relaxed"
        >
          <span className="text-red-500 font-medium">Handel</span> •
          <span className="text-red-500 font-medium"> Service</span> •
          <span className="text-red-500 font-medium"> Dienstleistung</span>
          <br />
          <span className="text-base md:text-lg text-gray-400">
            rund um Felgen und Reifen
          </span>
        </p>

        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <button
            onClick={scrollToContact}
            className="group bg-red-500 text-white px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 hover:bg-red-600 hover:scale-105 flex items-center gap-3"
          >
            Jetzt anfragen
            <ArrowRight
              size={20}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>

          <a
            href="tel:+4917612345678"
            className="group flex items-center gap-3 px-8 py-4 rounded-xl border border-white/20 text-white hover:border-red-500 hover:bg-white/5 hover:scale-105 transition-all duration-300"
          >
            <Phone size={20} />
            <span className="font-medium">Direkt anrufen</span>
          </a>
        </div>
      </div>
    </section>
  );
}

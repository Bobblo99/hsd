"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ShoppingCart,
  Mail,
  MessageCircle,
  Truck,
  Shield,
  Star,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function HandelSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const content = contentRef.current;

    if (!section || !title || !content) return;

    ScrollTrigger.create({
      trigger: section,
      start: "top 75%",
      onEnter: () => {
        const tl = gsap.timeline();

        // Enhanced title animation
        const titleText = title.textContent || "";
        title.innerHTML = titleText
          .split("")
          .map((char) =>
            char === " "
              ? " "
              : `<span class="inline-block" style="transform: translateY(50px); opacity: 0;">${char}</span>`
          )
          .join("");

        tl.to(title.children, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.04,
          ease: "power3.out",
        }).fromTo(
          content.children,
          { y: 40, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.5"
        );
      },
    });

    cardsRef.current.forEach((card, index) => {
      if (card) {
        ScrollTrigger.create({
          trigger: card,
          start: "top 85%",
          onEnter: () => {
            gsap.fromTo(
              card,
              { y: 40, opacity: 0, scale: 0.9 },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.2,
                delay: index * 0.1,
                ease: "power3.out",
              }
            );
          },
        });

        // Professional hover effects
        const handleMouseEnter = () => {
          gsap.to(card, {
            y: -8,
            scale: 1.03,
            duration: 0.4,
            ease: "power2.out",
          });
        };

        const handleMouseLeave = () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
          });
        };

        card.addEventListener("mouseenter", handleMouseEnter);
        card.addEventListener("mouseleave", handleMouseLeave);
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      id="handel"
      ref={sectionRef}
      className="py-32 px-6 bg-gray-900 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2
            ref={titleRef}
            className="text-6xl md:text-7xl font-light mb-6 text-white"
          >
            <span className="text-red-500 font-bold">H</span>andel
          </h2>
        </div>

        <div
          ref={contentRef}
          className="grid lg:grid-cols-2 gap-16 items-center mb-20"
        >
          <div className="space-y-8">
            <p className="text-xl text-gray-300 leading-relaxed">
              Wir bieten Ihnen eine umfassende Auswahl an hochwertigen Felgen
              und Reifen. Ob Neuwaren oder geprüfte Gebrauchtware – bei uns
              finden Sie die perfekte Lösung für Ihr Fahrzeug.
            </p>

            <p className="text-lg text-gray-400 leading-relaxed">
              Unser Sortiment umfasst Premium-Marken und preiswerte
              Alternativen. Gerne beraten wir Sie persönlich und erstellen Ihnen
              ein individuelles Angebot.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:info@hsd-gmbh.com"
                className="group flex items-center gap-3 px-6 py-4 bg-red-500 text-white rounded-xl hover:bg-red-600 hover:scale-105 transition-all duration-300"
              >
                <Mail size={20} />
                <span className="font-medium">E-Mail Anfrage</span>
              </a>

              <a
                href="https://wa.me/4917612345678"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/20 text-white rounded-xl hover:bg-white/10 hover:scale-105 transition-all duration-300"
              >
                <MessageCircle size={20} />
                <span className="font-medium">WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10">
              <img
                src="https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg"
                alt="Felgen und Reifen Handel"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <ShoppingCart size={32} />,
              title: "Neuware",
              description: "Premium Felgen und Reifen der führenden Hersteller",
              features: ["Garantie", "Neueste Modelle", "Sofort verfügbar"],
            },
            {
              icon: <Truck size={32} />,
              title: "Gebrauchtware",
              description: "Geprüfte und aufbereitete Felgen in Top-Qualität",
              features: ["Qualitätskontrolle", "Faire Preise", "Große Auswahl"],
            },
            {
              icon: <Shield size={32} />,
              title: "Beratung",
              description: "Persönliche Beratung für die optimale Lösung",
              features: [
                "Fachberatung",
                "Individuelle Angebote",
                "Schnelle Abwicklung",
              ],
            },
          ].map((service, index) => (
            <div
              key={service.title}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className="group bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-red-500/50 transition-all duration-300 hover:bg-white/10"
            >
              <div className="text-red-500 mb-4">{service.icon}</div>

              <h3 className="text-xl font-semibold mb-3 text-white">
                {service.title}
              </h3>

              <p className="text-gray-300 mb-4 leading-relaxed">
                {service.description}
              </p>

              <ul className="space-y-2">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="text-sm text-gray-400 flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Paintbrush,
  Zap,
  Wrench,
  Sparkles,
  RotateCcw,
  Layers,
  Mail,
  MessageCircle,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function DienstleistungSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement[]>([]);
  const beforeAfterRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const content = contentRef.current;
    const beforeAfter = beforeAfterRef.current;

    if (!section || !title || !content) return;

    ScrollTrigger.create({
      trigger: section,
      start: "top 75%",
      onEnter: () => {
        const tl = gsap.timeline();

        // Enhanced title character reveal
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
        })
          .fromTo(
            content.children,
            { y: 40, opacity: 0, scale: 0.95 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.7,
              stagger: 0.08,
              ease: "power3.out",
            },
            "-=0.5"
          )
          .fromTo(
            beforeAfter,
            { y: 50, opacity: 0, scale: 0.9 },
            { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" },
            "-=0.4"
          );
      },
    });

    servicesRef.current.forEach((service, index) => {
      if (service) {
        ScrollTrigger.create({
          trigger: service,
          start: "top 85%",
          onEnter: () => {
            gsap.fromTo(
              service,
              { y: 50, opacity: 0, scale: 0.9 },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.2,
                delay: index * 0.08,
                ease: "power3.out",
              }
            );
          },
        });

        const handleMouseEnter = () => {
          gsap.to(service, {
            y: -10,
            scale: 1.05,
            duration: 0.4,
            ease: "power3.out",
          });
        };

        const handleMouseLeave = () => {
          gsap.to(service, {
            y: 0,
            scale: 1,
            duration: 0.4,
            ease: "power3.out",
          });
        };

        service.addEventListener("mouseenter", handleMouseEnter);
        service.addEventListener("mouseleave", handleMouseLeave);
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const services = [
    {
      icon: <Paintbrush size={32} />,
      title: "Nasslackierung",
      description: "Hochwertige Lackierung für perfekte Optik und Schutz",
    },
    {
      icon: <Zap size={32} />,
      title: "Pulverbeschichtung",
      description: "Robuste und langlebige Oberflächenveredelung",
    },
    {
      icon: <Wrench size={32} />,
      title: "Bordsteinschäden reparieren",
      description: "Professionelle Reparatur von Beschädigungen",
    },
    {
      icon: <Sparkles size={32} />,
      title: "Glanzdrehen",
      description: "Präzise Bearbeitung für perfekte Oberflächen",
    },
    {
      icon: <RotateCcw size={32} />,
      title: "Entlacken",
      description: "Schonende Entfernung alter Beschichtungen",
    },
    {
      icon: <Layers size={32} />,
      title: "Sandstrahlen",
      description: "Gründliche Oberflächenvorbereitung",
    },
  ];

  return (
    <section
      id="dienstleistung"
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
            <span className="text-red-500 font-bold">D</span>ienstleistung
          </h2>
        </div>

        <div ref={contentRef} className="text-center mb-20">
          <p className="text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto mb-8">
            Unsere Dienstleistungen umfassen spezialisierte handwerkliche
            Arbeiten zur Felgeninstandsetzung. Mit modernster Technik und
            jahrelanger Erfahrung bringen wir Ihre Felgen in neuwertige Qualität
            zurück.
          </p>

          <p className="text-lg text-gray-400 leading-relaxed max-w-3xl mx-auto">
            Von der Reparatur kleinster Schäden bis zur kompletten
            Neuaufbereitung – wir bieten das komplette Spektrum professioneller
            Felgenaufbereitung.
          </p>
        </div>

        {/* Before/After Section */}
        <div ref={beforeAfterRef} className="mb-20">
          <div className="grid md:grid-cols-2 gap-8 bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="relative group">
              <div className="aspect-square rounded-xl overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg"
                  alt="Felge vorher"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="bg-red-500 px-3 py-1 rounded-full text-sm font-medium">
                    Vorher
                  </span>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="aspect-square rounded-xl overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg"
                  alt="Felge nachher"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-medium">
                    Nachher
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => (
            <div
              key={service.title}
              ref={(el) => {
                if (el) servicesRef.current[index] = el;
              }}
              className="group bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-red-500/50 transition-all duration-300 hover:bg-white/10"
            >
              <div className="text-red-500 mb-4">{service.icon}</div>

              <h3 className="text-lg font-semibold mb-3 text-white">
                {service.title}
              </h3>

              <p className="text-gray-300 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white/5 rounded-2xl p-8 border border-white/10">
          <h3 className="text-3xl font-semibold mb-6 text-white">
            Kostenvoranschlag anfordern
          </h3>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Senden Sie uns Bilder Ihrer Felgen für einen unverbindlichen
            Kostenvoranschlag
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="mailto:aufbereitung@hsd-gmbh.com"
              className="group flex items-center gap-3 px-8 py-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300"
            >
              <Mail size={20} />
              <span className="font-medium">E-Mail mit Bildern</span>
            </a>

            <a
              href="https://wa.me/4917612345678"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-all duration-300"
            >
              <MessageCircle size={20} />
              <span className="font-medium">WhatsApp Bilder</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

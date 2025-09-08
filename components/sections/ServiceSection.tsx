"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Settings,
  Gauge,
  CheckCircle,
  Car,
  Mail,
  MessageCircle,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function ServiceSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const content = contentRef.current;
    const cta = ctaRef.current;

    if (!section || !title || !content || !cta) return;

    // Clean up any existing ScrollTriggers
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.trigger === section) {
        trigger.kill();
      }
    });

    // Main section animation
    ScrollTrigger.create({
      trigger: section,
      start: "top 75%",
      onEnter: () => {
        const tl = gsap.timeline();

        // Title character animation
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
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.1,
              ease: "power2.out",
            },
            "-=0.4"
          )
          .fromTo(
            cta,
            { y: 40, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" },
            "-=0.3"
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
                delay: index * 0.1,
                ease: "power3.out",
              }
            );
          },
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        const serviceDivs = servicesRef.current.filter(
          (el): el is HTMLDivElement => !!el
        );
        if (
          trigger.trigger === section ||
          serviceDivs.includes(trigger.trigger as HTMLDivElement)
        ) {
          trigger.kill();
        }
      });
    };
  }, []);

  const services = [
    {
      icon: <Settings size={40} />,
      title: "Reifen ab- und aufziehen",
      description: "Professionelle Reifenmontage mit modernster Technik",
    },
    {
      icon: <Gauge size={40} />,
      title: "Wuchten",
      description: "Präzises Auswuchten für optimalen Fahrkomfort",
    },
    {
      icon: <CheckCircle size={40} />,
      title: "Schlagprüfung",
      description: "Umfassende Felgenkontrolle auf Beschädigungen",
    },
    {
      icon: <Car size={40} />,
      title: "Montage am Fahrzeug",
      description: "Komplette Montage direkt an Ihrem Fahrzeug",
    },
  ];

  return (
    <section
      id="service"
      ref={sectionRef}
      className="py-32 px-6 bg-gray-800 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2
            ref={titleRef}
            className="text-6xl md:text-7xl font-light mb-6 text-white"
          >
            <span className="text-red-500 font-bold">S</span>ervice
          </h2>
        </div>

        <div ref={contentRef} className="text-center mb-20">
          <p className="text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto mb-8">
            Unser Service umfasst alle direkten Arbeiten am Fahrzeug und
            erstklassigen Kundenservice vor Ort. Wir sorgen für die perfekte
            Montage und optimale Performance Ihrer Räder.
          </p>

          <p className="text-lg text-gray-400 leading-relaxed max-w-3xl mx-auto">
            Mit modernster Ausrüstung und jahrelanger Erfahrung garantieren wir
            höchste Qualität bei allen Serviceleistungen.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          {services.map((service, index) => (
            <div
              key={service.title}
              ref={(el) => {
                if (el) servicesRef.current[index] = el;
              }}
              className="group bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-red-500/50 transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:-translate-y-2"
            >
              <div className="flex items-start gap-6">
                <div className="text-red-500 transition-transform duration-300 group-hover:scale-110">
                  {service.icon}
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-red-500 transition-colors duration-300">
                    {service.title}
                  </h3>

                  <p className="text-gray-300 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div
          ref={ctaRef}
          className="text-center bg-white/5 rounded-2xl p-8 border border-white/10"
        >
          <h3 className="text-3xl font-semibold mb-6 text-white">
            Service-Termin vereinbaren
          </h3>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Kontaktieren Sie uns für einen Termin oder eine unverbindliche
            Beratung
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="mailto:service@hsd-gmbh.com"
              className="group flex items-center gap-3 px-8 py-4 bg-red-500 text-white rounded-xl hover:bg-red-600 hover:scale-105 transition-all duration-300"
            >
              <Mail size={20} />
              <span className="font-medium">E-Mail senden</span>
            </a>

            <a
              href="https://wa.me/4917612345678"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/20 text-white rounded-xl hover:bg-white/10 hover:scale-105 transition-all duration-300"
            >
              <MessageCircle size={20} />
              <span className="font-medium">WhatsApp Chat</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

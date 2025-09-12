"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Send,
  Clock,
  Star,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function HSDContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const contactInfoRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const form = formRef.current;
    const contactInfo = contactInfoRef.current;

    if (!section || !title || !form || !contactInfo) return;

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
        })
          .fromTo(
            form,
            { x: -40, opacity: 0, scale: 0.95 },
            { x: 0, opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" },
            "-=0.5"
          )
          .fromTo(
            contactInfo.children,
            { x: 40, opacity: 0, scale: 0.95 },
            {
              x: 0,
              opacity: 1,
              scale: 1,
              duration: 0.7,
              stagger: 0.08,
              ease: "power3.out",
            },
            "-=0.6"
          );
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log("Form submitted:", formData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section
      id="kontakt"
      ref={sectionRef}
      className="py-32 px-6 bg-black relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2
            ref={titleRef}
            className="text-5xl md:text-6xl font-light mb-6 text-white"
          >
            Kontakt
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-2xl font-semibold text-white mb-6">
                Anfrage senden
              </h3>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400"
                      placeholder="Ihr Name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400"
                      placeholder="Ihre Telefonnummer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    E-Mail *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400"
                    placeholder="ihre@email.de"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Service
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 text-white"
                  >
                    <option value="" className="bg-black">
                      Service auswählen
                    </option>
                    <option value="handel" className="bg-black">
                      Handel - Felgen/Reifen
                    </option>
                    <option value="service" className="bg-black">
                      Service - Montage/Wuchten
                    </option>
                    <option value="dienstleistung" className="bg-black">
                      Dienstleistung - Aufbereitung
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Nachricht *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 resize-none text-white placeholder-gray-400"
                    placeholder="Beschreiben Sie Ihr Anliegen..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="group w-full bg-red-500 text-white px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 hover:bg-red-600 hover:scale-105 flex items-center justify-center gap-3"
                >
                  <Send size={20} />
                  Anfrage senden
                </button>
              </div>
            </div>
          </form>

          {/* Contact Information */}
          <div ref={contactInfoRef} className="space-y-8">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-2xl font-semibold mb-8 text-white">
                Kontaktmöglichkeiten
              </h3>

              <div className="space-y-6">
                <a
                  href="mailto:info@hsd-gmbh.com"
                  className="flex items-center gap-4 group cursor-pointer p-3 rounded-xl hover:bg-white/5 hover:scale-105 transition-all duration-300"
                >
                  <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <Mail size={20} className="text-red-500" />
                  </div>
                  <div>
                    <div className="font-medium text-white">E-Mail</div>
                    <div className="text-gray-400">info@hsd-gmbh.com</div>
                  </div>
                </a>

                <a
                  href="tel:+4917612345678"
                  className="flex items-center gap-4 group cursor-pointer p-3 rounded-xl hover:bg-white/5 hover:scale-105 transition-all duration-300"
                >
                  <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <Phone size={20} className="text-red-500" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Telefon</div>
                    <div className="text-gray-400">+49 176 12345678</div>
                  </div>
                </a>

                <a
                  href="https://wa.me/4917612345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group cursor-pointer p-3 rounded-xl hover:bg-white/5 hover:scale-105 transition-all duration-300"
                >
                  <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <MessageCircle size={20} className="text-red-500" />
                  </div>
                  <div>
                    <div className="font-medium text-white">WhatsApp</div>
                    <div className="text-gray-400">Direkt chatten</div>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-3 rounded-xl">
                  <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <MapPin size={20} className="text-red-500" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Adresse</div>
                    <div className="text-gray-400">
                      Untere au 5<br />
                      74239 Hardthausen am Kocher
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-xl">
                  <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <Clock size={20} className="text-red-500" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Öffnungszeiten</div>
                    <div className="text-gray-400">
                      Mo-Fr: 8:00-18:00
                      <br />
                      Sa: 9:00-14:00
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h4 className="text-xl font-semibold mb-6 text-white">
                Schnellkontakt
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <a
                  href="https://wa.me/4917612345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-4 bg-green-500/20 rounded-xl hover:bg-green-500/25 hover:scale-105 transition-all duration-300 text-center"
                >
                  <MessageCircle size={24} className="text-green-500" />
                  <span className="text-sm font-medium text-white">
                    WhatsApp
                  </span>
                </a>

                <a
                  href="tel:+4917612345678"
                  className="flex flex-col items-center gap-2 p-4 bg-blue-500/20 rounded-xl hover:bg-blue-500/25 hover:scale-105 transition-all duration-300 text-center"
                >
                  <Phone size={24} className="text-blue-500" />
                  <span className="text-sm font-medium text-white">
                    Anrufen
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto pt-20 mt-20 border-t border-white/10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-2xl font-bold text-red-500 mb-4 md:mb-0">
            HSD GmbH
          </div>
          <div className="text-gray-400 text-sm text-center md:text-right">
            © 2025 HSD GmbH. Alle Rechte vorbehalten.
            <br />
            Handel • Service • Dienstleistung
          </div>
        </div>
      </div>
    </section>
  );
}

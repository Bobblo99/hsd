"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, MessageCircle, MapPin, Clock } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const content = contentRef.current;
    
    if (!footer || !content) return;

    ScrollTrigger.create({
      trigger: footer,
      start: 'top 90%',
      onEnter: () => {
        gsap.fromTo(content.children,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      ref={footerRef}
      className="bg-black border-t border-gray-800 py-16 px-6"
    >
      <div ref={contentRef} className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="text-3xl font-bold text-red-500 mb-6">
              HSD GmbH
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Ihr Partner für professionelle Felgenaufbereitung, Reifenservice und Handel. 
              Mit jahrelanger Erfahrung und modernster Technik sorgen wir für höchste Qualität.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://wa.me/4917612345678"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-500 transition-colors duration-300"
              >
                <MessageCircle size={18} />
              </a>
              <a
                href="mailto:info@hsd-gmbh.com"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-500 transition-colors duration-300"
              >
                <Mail size={18} />
              </a>
              <a
                href="tel:+4917612345678"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-500 transition-colors duration-300"
              >
                <Phone size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Navigation</h4>
            <ul className="space-y-3">
              {['Home', 'Handel', 'Service', 'Dienstleistung', 'Kontakt'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-300"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Kontakt</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-red-500 mt-1 flex-shrink-0" />
                <div className="text-gray-400 text-sm">
                  Musterstraße 123<br />
                  12345 Musterstadt
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-red-500 flex-shrink-0" />
                <a 
                  href="tel:+4917612345678"
                  className="text-gray-400 text-sm hover:text-red-500 transition-colors duration-300"
                >
                  +49 176 12345678
                </a>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-red-500 flex-shrink-0" />
                <a 
                  href="mailto:info@hsd-gmbh.com"
                  className="text-gray-400 text-sm hover:text-red-500 transition-colors duration-300"
                >
                  info@hsd-gmbh.com
                </a>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock size={16} className="text-red-500 mt-1 flex-shrink-0" />
                <div className="text-gray-400 text-sm">
                  Mo-Fr: 8:00-18:00<br />
                  Sa: 9:00-14:00
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Overview */}
        <div className="border-t border-gray-800 pt-12 mb-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h5 className="text-red-500 font-semibold mb-3">Handel</h5>
              <p className="text-gray-400 text-sm">
                Felgen & Reifen • Neu & Gebraucht • Beratung
              </p>
            </div>
            <div className="text-center">
              <h5 className="text-red-500 font-semibold mb-3">Service</h5>
              <p className="text-gray-400 text-sm">
                Montage • Wuchten • Schlagprüfung
              </p>
            </div>
            <div className="text-center">
              <h5 className="text-red-500 font-semibold mb-3">Dienstleistung</h5>
              <p className="text-gray-400 text-sm">
                Lackierung • Pulverbeschichtung • Reparatur
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            © 2025 HSD GmbH. Alle Rechte vorbehalten.
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <button className="hover:text-red-500 transition-colors duration-300">
              Impressum
            </button>
            <button className="hover:text-red-500 transition-colors duration-300">
              Datenschutz
            </button>
            <button className="hover:text-red-500 transition-colors duration-300">
              AGB
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
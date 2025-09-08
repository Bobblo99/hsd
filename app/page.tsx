"use client";

import React, { useEffect, useState } from "react";
import HSDHeroSection from "@/components/sections/HSDHeroSection";
import HandelSection from "@/components/sections/HandelSection";
import ServiceSection from "@/components/sections/ServiceSection";
import DienstleistungSection from "@/components/sections/DienstleistungSection";
import HSDContactSection from "@/components/sections/HSDContactSection";
import Navigation from "@/components/Navigation";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import Footer from "@/components/Footer";
import { client } from "@/lib/appwrite";
import { AppwriteException } from "appwrite";

type Log = {
  date: Date;
  method: string;
  path: string;
  status: number;
  response: string;
};

export default function Home() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [status, setStatus] = useState("idle");
  const [showLogs, setShowLogs] = useState(false);
  useEffect(() => {
    console.log("✅ Browser mounted");
    console.log("Status:", status, "Logs:", logs);
    console.log("Appwrite Client:", client);
  }, [status, logs]);

  // async function sendPing() {
  //   if (status === "loading") return;
  //   setStatus("loading");
  //   try {
  //     const result = await client();
  //     const log = {
  //       date: new Date(),
  //       method: "GET",
  //       path: "/v1/ping",
  //       status: 200,
  //       response: JSON.stringify(result),
  //     };
  //     setLogs((prevLogs) => [log, ...prevLogs]);
  //     setStatus("success");
  //   } catch (err) {
  //     const log = {
  //       date: new Date(),
  //       method: "GET",
  //       path: "/v1/ping",
  //       status: err instanceof AppwriteException ? err.code : 500,
  //       response:
  //         err instanceof AppwriteException
  //           ? err.message
  //           : "Something went wrong",
  //     };
  //     setLogs((prevLogs) => [log, ...prevLogs]);
  //     setStatus("error");
  //   }
  //   setShowLogs(true);
  // }

  return (
    <SmoothScrollProvider>
      <main className="relative overflow-x-hidden bg-gray-900">
        <Navigation />

        <div className="dark-gradient-mesh">
          <HSDHeroSection />
          {/* <button
            onClick={sendPing}
            className={`cursor-pointer rounded-md bg-[#FD366E] px-2.5 py-1.5 ${
              status === "loading" ? "hidden" : "visible"
            }`}
          >
            <span className="text-white">Send a ping</span>
          </button> */}
          <HandelSection />
          <ServiceSection />
          <DienstleistungSection />
          <HSDContactSection />
          <Footer />
        </div>
      </main>
    </SmoothScrollProvider>
  );
}

"use client";

import IndiaMap from "@/components/Map";
import TypingAnimation from "@/components/ui/typing-animation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// Rotating text for hero section
const herotext = [
  { language: "English", script: "Sanskriti" },
  { language: "Hindi", script: "संस्कृति" },
  { language: "Kannada", script: "ಸಂಸ್ಕೃತಿ" },
  { language: "Bengali", script: "সংস্কৃতি" },
  { language: "Gujarati", script: "સંસ્કૃતિ" },
  { language: "Odia", script: "ସଂସ୍କୃତି" },
];

// Dummy dataset of cultural heritage places (later replace with API)
const heritagePlaces = [
  { name: "Hampi", lat: 15.335, lon: 76.46 },
  { name: "Taj Mahal", lat: 27.1751, lon: 78.0421 },
  { name: "Qutub Minar", lat: 28.5244, lon: 77.1855 },
  { name: "Mysore Palace", lat: 12.3052, lon: 76.6552 },
  { name: "Konark Sun Temple", lat: 19.8876, lon: 86.0945 },
];

export default function Home() {
  const router = useRouter();
  const [currentText, setCurrentText] = useState(herotext[0].script);
  const [nearestPlace, setNearestPlace] = useState<string | null>(null);

  // Cycle hero text
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex =
        (herotext.findIndex((item) => item.script === currentText) + 1) %
        herotext.length;
      setCurrentText(herotext[nextIndex].script);
    }, 6000);
    return () => clearInterval(interval);
  }, [currentText]);

  // Find nearest heritage site based on user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;

          let nearest = heritagePlaces[0];
          let minDist = Number.MAX_VALUE;

          heritagePlaces.forEach((place) => {
            const dist = Math.sqrt(
              Math.pow(latitude - place.lat, 2) +
                Math.pow(longitude - place.lon, 2)
            );
            if (dist < minDist) {
              minDist = dist;
              nearest = place;
            }
          });

          setNearestPlace(nearest.name);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setNearestPlace("Could not fetch location");
        }
      );
    } else {
      setNearestPlace("Geolocation not supported");
    }
  }, []);

  return (
    <div className="ml-16 flex flex-row px-16 pt-12 w-fit overflow-hidden min-h-screen">
      {/* Left Section */}
      <div className="flex flex-col justify-center h-[550px] items-start w-1/3 ml-36 mt-24">
        <TypingAnimation
          key={currentText}
          className="text-8xl font-bold text-[#4d1414]"
          text={currentText}
        />
        <div className="text-xl my-8">
          Welcome to Sanskriti - A dynamic platform designed to explore and
          immerse yourself in the diverse cultures and vibrant festivals of
          India. With{" "}
          <span className="text-[#4d1414] font-semibold">
            interactive maps, immersive timelines, engaging video content, and
            exciting games
          </span>
          , this platform offers a rich, multimedia experience to discover the
          traditions, customs, and celebrations that make India unique.
        </div>

        {/* Nearest Heritage Place */}
        {nearestPlace && (
          <div className="bg-yellow-200 text-[#4d1414] font-semibold px-4 py-2 rounded-lg my-4 shadow-md">
            📍 Nearest Cultural Heritage Site: {nearestPlace}
          </div>
        )}

        <button
          onClick={() => router.push("/login")}
          className="bg-[#4d1414] text-yellow-300 font-semibold px-4 py-2 rounded-xl hover:scale-105 transition-all duration-300"
        >
          Login
        </button>
      </div>

      {/* Right Section (Map) */}
      <div className="w-7/12 overflow-hidden h-[70vh] flex items-center justify-center">
        <IndiaMap />
      </div>
    </div>
  );
}

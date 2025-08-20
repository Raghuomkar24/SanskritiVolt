"use client";

import { useEffect, useMemo, useState } from "react";

type Site = {
  id: string;
  name: string;
  category: string;
  lat: number;
  lon: number;
  wikidata?: string | null;
  wikipedia?: string | null;
  rawTags?: Record<string, string>;
};

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371e3; // meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // meters
}

export default function NearbyHeritage() {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [radius, setRadius] = useState(5000); // meters
  const [sites, setSites] = useState<Site[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [desc, setDesc] = useState<Record<string, string>>({}); // id -> text

  // Ask for location once (works on http://localhost)
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
      (err) => {
        setError(err.message || "Failed to get location");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const sorted = useMemo(() => {
    if (!coords) return sites;
    return [...sites].sort((a, b) => {
      const da = haversine(coords.lat, coords.lon, a.lat, a.lon);
      const db = haversine(coords.lat, coords.lon, b.lat, b.lon);
      return da - db;
    });
  }, [sites, coords]);

  async function fetchSites() {
    if (!coords) return;
    setLoading(true);
    setError(null);
    try {
      const url = `/api/heritage?lat=${coords.lat}&lon=${coords.lon}&radius=${radius}`;
      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Server error");
      setSites(data.sites || []);
    } catch (e: any) {
      setError(e?.message || "Failed to load places");
    } finally {
      setLoading(false);
    }
  }

  async function getDescription(site: Site) {
    // lazy-load description
    if (desc[site.id]) return;
    try {
      const res = await fetch("/api/heritage/describe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: site.name,
          state: site.rawTags?.state || site.rawTags?.["is_in:state"],
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setDesc((d) => ({ ...d, [site.id]: data.text }));
      }
    } catch {
      // ignore
    }
  }

  return (
    <div className="w-full flex justify-center">
      <div
        className="
          fixed z-40
          top-28
          w-[90vw] max-w-3xl
          bg-yellow-100/90
          backdrop-blur
          rounded-2xl shadow-xl
          border border-yellow-300
          p-4
        "
      >
        <div className="flex items-center justify-between gap-3 mb-3">
          <h2 className="text-xl font-bold text-[#4d1414]">Nearby Cultural Heritage</h2>
          <div className="flex items-center gap-2">
            <label className="text-sm">Radius (m):</label>
            <input
              type="number"
              className="w-28 rounded-md border px-2 py-1"
              value={radius}
              min={1000}
              step={500}
              onChange={(e) => setRadius(Number(e.target.value || 5000))}
            />
            <button
              onClick={fetchSites}
              disabled={!coords || loading}
              className="bg-[#4d1414] text-yellow-300 px-3 py-1 rounded-md disabled:opacity-50"
            >
              {loading ? "Searching..." : "Find Places"}
            </button>
          </div>
        </div>

        {!coords && !error && (
          <p className="text-sm">Requesting your location… allow permission if prompted.</p>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="max-h-[55vh] overflow-y-auto pr-2 space-y-3">
          {sorted.length === 0 && coords && !loading && (
            <p className="text-sm">No places found. Try increasing the radius.</p>
          )}

          {sorted.map((site) => {
            const distance =
              coords ? Math.round(haversine(coords.lat, coords.lon, site.lat, site.lon)) : null;
            return (
              <div
                key={site.id}
                className="rounded-lg bg-white/80 border p-3 shadow-sm hover:shadow transition"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="font-semibold">{site.name}</div>
                    <div className="text-xs text-neutral-600">
                      {site.category} {distance !== null && `• ${Math.round(distance / 100) / 10} km`}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${site.lat},${site.lon}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm underline"
                    >
                      Map
                    </a>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${site.lat},${site.lon}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm underline"
                    >
                      Route
                    </a>
                    {process.env.NEXT_PUBLIC_ENABLE_DESCRIPTIONS !== "false" && (
                      <button
                        className="text-sm underline"
                        onClick={() => getDescription(site)}
                      >
                        More info
                      </button>
                    )}
                  </div>
                </div>
                {desc[site.id] && (
                  <p className="mt-2 text-sm leading-5 text-neutral-800">{desc[site.id]}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

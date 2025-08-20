import { NextRequest, NextResponse } from "next/server";

const OVERPASS_PRIMARY = "https://overpass-api.de/api/interpreter";
const OVERPASS_FALLBACK = "https://overpass.kumi.systems/api/interpreter";

function buildQuery(lat: number, lon: number, radius: number) {
  // Pull typical cultural/heritage POIs
  return `
[out:json][timeout:30];
(
  node["heritage"](around:${radius},${lat},${lon});
  way["heritage"](around:${radius},${lat},${lon});
  relation["heritage"](around:${radius},${lat},${lon});

  node["historic"](around:${radius},${lat},${lon});
  way["historic"](around:${radius},${lat},${lon});
  relation["historic"](around:${radius},${lat},${lon});

  node["tourism"="museum"](around:${radius},${lat},${lon});
  way["tourism"="museum"](around:${radius},${lat},${lon});
  relation["tourism"="museum"](around:${radius},${lat},${lon});
);
out center tags;
`.trim();
}

type OSMElement = {
  id: number;
  type: "node" | "way" | "relation";
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

async function fetchOverpass(query: string) {
  const body = new URLSearchParams({ data: query });
  const headers = { "Content-Type": "application/x-www-form-urlencoded" as const };

  // Try primary, then fallback
  for (const url of [OVERPASS_PRIMARY, OVERPASS_FALLBACK]) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers,
        body,
        // Disable caching so results are live
        cache: "no-store",
      });
      if (res.ok) return res.json();
    } catch {
      // try next
    }
  }
  throw new Error("All Overpass endpoints failed");
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = Number(searchParams.get("lat"));
    const lon = Number(searchParams.get("lon"));
    const radius = Number(searchParams.get("radius") || 5000); // meters

    if (!lat || !lon) {
      return NextResponse.json({ error: "lat & lon are required" }, { status: 400 });
    }

    const query = buildQuery(lat, lon, radius);
    const data = await fetchOverpass(query);

    const elements: OSMElement[] = data?.elements || [];
    const sites = elements
      .map((el) => {
        const name = el.tags?.["name:en"] || el.tags?.name || "Unnamed place";
        const category =
          el.tags?.heritage ||
          el.tags?.historic ||
          el.tags?.tourism ||
          el.tags?.amenity ||
          "cultural";
        const point = {
          lat: el.lat ?? el.center?.lat,
          lon: el.lon ?? el.center?.lon,
        };
        return {
          id: `${el.type}/${el.id}`,
          name,
          category,
          lat: point.lat,
          lon: point.lon,
          wikidata: el.tags?.wikidata || null,
          wikipedia: el.tags?.wikipedia || null,
          osm: { type: el.type, id: el.id },
          rawTags: el.tags || {},
        };
      })
      .filter((s) => typeof s.lat === "number" && typeof s.lon === "number");

    return NextResponse.json({ count: sites.length, sites }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed to fetch heritage sites" },
      { status: 500 }
    );
  }
}

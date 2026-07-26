import { useQuery } from "@tanstack/react-query";
import { LatLngBounds } from "leaflet";

import { EarthquakeFeature } from "../components/earthquake/types/Earthquake";

type EarthquakeGeoJSON = {
  features: EarthquakeFeature[];
};

type EarthquakeQuery = {
  bounds: LatLngBounds | null;
  startTime?: string;
  endTime?: string;
  limit?: number;
};

const fetchEarthquakes = async ({
  bounds,
  startTime,
  endTime,
  limit
}: EarthquakeQuery): Promise<EarthquakeGeoJSON> => {
  if (!bounds) {
    throw new Error(`Bounds are required`);
  }

  const params = new URLSearchParams({
    format: "geojson",
    starttime: startTime ?? "2024-01-01",
    endtime: endTime ?? "2025-01-30",
    limit: (limit ?? 20000).toString(),
    minlatitude: bounds.getSouth().toString(),
    maxlatitude: bounds.getNorth().toString(),
    minlongitude: bounds.getWest().toString(),
    maxlongitude: bounds.getEast().toString()
  });

  const result = await fetch(
    `https://earthquake.usgs.gov/fdsnws/event/1/query?${params.toString()}`
  );

  if (!result.ok) {
    throw new Error(`Failed to fetch earthquakes: ${result.status}`);
  }

  return result.json();
};

export const useEarthquakes = (params: EarthquakeQuery) => {
  return useQuery({
    queryKey: [
      "earthquakes",
      params.bounds?.getSouth(),
      params.bounds?.getNorth(),
      params.bounds?.getWest(),
      params.bounds?.getEast(),
      params.startTime,
      params.endTime,
      params.limit
    ],
    queryFn: () => fetchEarthquakes(params),
    enabled: !!params.bounds,
    staleTime: 60_000
  });
};

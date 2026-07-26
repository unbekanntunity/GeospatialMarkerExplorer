export type EarthquakeFeature = {
  type: "Feature";
  properties: {
    mag: number;
    place: string;
    time: number;
    updated: number;
    url: string;
    detail: string;
    felt: number | null;
    cdi: number | null;
    mmi: number | null;
    alert: string | null;
    status: string;
    tsunami: number;
    sig: number;
    net: string;
    code: string;
    ids: string;
    sources: string;
    type: string;
    title: string;
  };
  geometry: {
    type: "Point";
    coordinates: [number, number, number]; // long, lat, depth
  };
  id: string;
};

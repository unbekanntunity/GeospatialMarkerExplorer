import { LatLngTuple } from "leaflet";

export const convertToCoordinate = (
  lat: string,
  lng: string
): LatLngTuple | undefined => {
  const latitude = Number(lat);
  const longitude = Number(lng);

  const isValid =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180;

  return isValid ? [latitude, longitude] : undefined;
};

import { LatLng } from "leaflet";

export function stringToCoords(input?: string): LatLng {
  if (input === undefined) {
    return new LatLng(0, 0);
  }

  const asFloats = input.split(",").map(val => parseFloat(val));
  
  return new LatLng(asFloats[0], asFloats[1]);
}
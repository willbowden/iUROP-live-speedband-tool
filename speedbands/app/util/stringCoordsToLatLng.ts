import { LatLng } from "leaflet";

export function stringToCoords(input?: string): LatLng {
  if (input === undefined) {
    return new LatLng(0, 0);
  }

  const asFloats = input.split(",").map(val => parseFloat(val));
  
  return new LatLng(asFloats[0], asFloats[1]);
}

export function prettyCoords(input: LatLng): string {
  return `${input.lat.toFixed(4)}, ${input.lng.toFixed(4)}`;
}
import { LatLng, LatLngExpression } from "leaflet";

export function StringToCoords(input?: string): LatLngExpression {
  if (input === undefined) {
    return new LatLng(0, 0);
  }

  const asFloats = input.split(",").map(val => parseFloat(val));
  
  return new LatLng(asFloats[0], asFloats[1]);
}
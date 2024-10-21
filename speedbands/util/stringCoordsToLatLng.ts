import { LatLng, LatLngExpression } from "leaflet";

export function StringToCoords(input: string): LatLngExpression {
  const asFloats = input.split(",").map(val => parseFloat(val));
  
  return new LatLng(asFloats[0], asFloats[1]);
}
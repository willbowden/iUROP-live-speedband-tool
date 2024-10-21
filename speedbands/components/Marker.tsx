import { StringToCoords } from "@/util/stringCoordsToLatLng";
import { Marker } from "react-leaflet";

type MarkerProps = {
  coords: string;
  label: string;
  color: string;
  opacity: number;
}

export default function MapMarker({ coords, label, color, opacity }: MarkerProps) {
  return (
    <Marker position={StringToCoords(coords)} opacity={opacity} />
  )
}
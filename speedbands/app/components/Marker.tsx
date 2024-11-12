import { MarkerObj } from "@/lib/speedband";
import { Marker } from "react-leaflet";

type MarkerProps = {
  onClick: () => void;
  marker: MarkerObj;
  opacity: number;
}

export default function MapMarker({ onClick, marker, opacity}: MarkerProps) {
  return (
    <Marker position={marker.coords} opacity={opacity} eventHandlers={{
      click: onClick
    }} />
  )
}
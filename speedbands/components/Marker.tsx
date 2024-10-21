import { LatLngExpression } from "leaflet";
import { Marker } from "react-leaflet";

type MarkerProps = {
  coords: LatLngExpression;
  label: string;
  color: string;
  opacity: number;
}

export default function MapMarker({ coords, label, color, opacity }: MarkerProps) {
  return (
    <Marker position={coords} opacity={opacity} />
  )
}
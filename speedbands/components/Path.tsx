import { LatLngExpression } from "leaflet";
import { Polyline } from "react-leaflet";

type PathProps = {
  whenSelected: () => void;
  start: LatLngExpression;
  end: LatLngExpression;
  color: string;
  weight: number;
  label: string;
  opacity: number;
}

export default function MapPath({whenSelected, start, end, color, weight, label, opacity}: PathProps) {
  const lineOptions = {
    color: color,
  }

  const positions = [
    start, end
  ];

  return (
    <Polyline pathOptions={lineOptions} positions={positions} opacity={opacity} eventHandlers={{
      click: () => {whenSelected()}
    }}/>
  )
}
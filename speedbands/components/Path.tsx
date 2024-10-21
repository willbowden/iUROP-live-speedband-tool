import { Polyline } from "react-leaflet";
import { StringToCoords } from "@/util/stringCoordsToLatLng";

type PathProps = {
  whenSelected: () => void;
  start: string;
  end: string;
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
    StringToCoords(start),
    StringToCoords(end),
  ];

  return (
    <Polyline pathOptions={lineOptions} positions={positions} opacity={opacity} eventHandlers={{
      click: () => {whenSelected()}
    }}/>
  )
}
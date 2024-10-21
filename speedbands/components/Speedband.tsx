import { StringToCoords } from "@/util/stringCoordsToLatLng";
import MapMarker from "./Marker";
import MapPath from "./Path";

export interface MarkerObj {
  objectType: "marker" | "path";
  start?: string;
  end?: string;
  coords?: string;
  color: string;
  label: string;
  weight?: number;
}

type SpeedbandProps = {
  markers: Array<MarkerObj>;
}

export default function Speedband({ markers }: SpeedbandProps) {
  const defaultLatLng = {lat: 0, lng: 0};

  return (
    <>
      {markers.map(marker => {
        if (marker.objectType == "marker") {
          return <MapMarker
            coords={marker.coords ? StringToCoords(marker.coords) : defaultLatLng}
            label={marker.label}
            color={marker.color}
            opacity={1}
          ></MapMarker>
        } else if (marker.objectType == "path") {
          return <MapPath
            whenSelected={() => { }}
            start={marker.start ? StringToCoords(marker.start) : defaultLatLng}
            end={marker.end ? StringToCoords(marker.end) : defaultLatLng}
            color={marker.color}
            label={marker.label}
            weight={marker.weight || 10}
            opacity={1}>
          </MapPath>
        }
      })}
    </>
  )
}
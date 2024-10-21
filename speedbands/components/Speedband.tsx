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
  return (
    <>
      {markers.map(marker => {
        if (marker.objectType == "marker") {
          return <MapMarker
            coords={marker.coords || ""}
            label={marker.label}
            color={marker.color}
            opacity={1}
          ></MapMarker>
        } else if (marker.objectType == "path") {
          return <MapPath
            whenSelected={() => { }}
            start={marker.start || ""}
            end={marker.end || ""}
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
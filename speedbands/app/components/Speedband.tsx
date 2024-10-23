import { Speedband } from "@/lib/speedband";
import { useEffect, useState } from "react";
import MapMarker from "./Marker";
import MapPath from "./Path";
import { LatLngExpression } from "leaflet";

type SpeedbandProps = {
  band: Speedband;
}

export default function SpeedbandAnnotation({ band }: SpeedbandProps) {
  const [id, setId] = useState<LatLngExpression>();

  useEffect(() => {
    setId(band.start.coords);
  }, [])

  // Temporary for development
  const speedbandClicked = () => {
    alert(`You clicked ${id}`);
  }

  return (
    <>
      {band.markers.map(marker => {
        return <MapMarker
          onClick={speedbandClicked}
          marker={marker}
          opacity={1}
        ></MapMarker>
      })}
      <MapPath
        onClick={speedbandClicked}
        path={band.path}
        opacity={1}
      ></MapPath>
    </>
  )
}
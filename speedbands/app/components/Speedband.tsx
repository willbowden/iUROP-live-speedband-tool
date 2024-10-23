import { Speedband } from "@/lib/speedband";
import MapMarker from "./Marker";
import MapPath from "./Path";

type SpeedbandProps = {
  speedband: Speedband;
}

export default function SpeedbandAnnotation({ speedband }: SpeedbandProps) {
  // Temporary for development
  const speedbandClicked = () => {
    alert(`You clicked ${speedband.id}`);
  }

  return (
    <>
      {speedband.markers.map(marker => {
        return <MapMarker
          onClick={speedbandClicked}
          marker={marker}
          opacity={1}
        ></MapMarker>
      })}
      <MapPath
        onClick={speedbandClicked}
        path={speedband.path}
        opacity={1}
      ></MapPath>
    </>
  )
}
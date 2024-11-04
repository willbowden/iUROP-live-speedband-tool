import { Speedband } from "@/lib/speedband";
import MapMarker from "@/components/Marker";
import MapPath from "@/components/Path";

type SpeedbandProps = {
  speedband: Speedband;
}

export default function SpeedbandAnnotation({ speedband }: SpeedbandProps) {
  const DEFAULT_OPACITY = 0.5;

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
          opacity={DEFAULT_OPACITY}
        ></MapMarker>
      })}
      <MapPath
        onClick={speedbandClicked}
        path={speedband.path}
        opacity={DEFAULT_OPACITY}
      ></MapPath>
    </>
  )
}
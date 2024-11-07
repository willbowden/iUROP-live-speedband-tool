import { Speedband } from "@/lib/speedband";
import MapMarker from "@/components/Marker";
import MapPath from "@/components/Path";
import { publish } from "@/lib/events";

type SpeedbandProps = {
  speedband: Speedband;
}

export default function SpeedbandAnnotation({ speedband }: SpeedbandProps) {
  const DEFAULT_OPACITY = 0.5;

  const speedbandClicked = () => {
    publish("speedbandClicked", { band: speedband })
  }

  return (
    <>
      {speedband.markers.map(marker => {
        return <MapMarker
          key={`${marker.coords}`}
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
"use client"

import MapMarker from "@/components/Marker";
import MapPath from "@/components/Path";
import { Speedband } from "@/lib/speedband";
import { SpeedbandContext, SpeedbandDispatchContext } from "@/lib/SpeedbandContext";
import { useContext } from "react";

type SpeedbandProps = {
  speedband: Speedband;
}

export default function SpeedbandAnnotation({ speedband }: SpeedbandProps) {
  const dispatch = useContext(SpeedbandDispatchContext);
  const { selectedSpeedbands } = useContext(SpeedbandContext);

  const DEFAULT_OPACITY = 0.5;

  const speedbandClicked = () => {
    dispatch({
      type: 'SpeedbandClicked',
      speedbands: [speedband],
    })
  }

  const opacity = selectedSpeedbands.includes(speedband) ? 1 : DEFAULT_OPACITY;

  return (
    <>
      {speedband.markers.map(marker => {
        return <MapMarker
          key={`${marker.coords}`}
          onClick={speedbandClicked}
          marker={marker}
          opacity={opacity}
        ></MapMarker>
      })}
      <MapPath
        onClick={speedbandClicked}
        path={speedband.path}
        opacity={opacity}
      ></MapPath>
    </>
  )
}
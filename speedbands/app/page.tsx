"use client"

import { LatLng } from "leaflet";
import dynamic from "next/dynamic";
import { useEffect, useMemo } from "react";
import NavBar from "./components/NavBar";
import SpeedbandList from "./components/SpeedbandList";
import { getSpeedbands, setSpeedbands } from "./lib/features/speedbands/speedbandSlice";
import { useAppDispatch, useAppSelector } from "./lib/hooks";
import { Speedband } from "./lib/speedband";
import styles from "./page.module.css";

export default function Home() {
  const Map = useMemo(() => dynamic(
    () => import('@/components/Map'),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [])

  const speedbands = useAppSelector(getSpeedbands);
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/willbowden/iUROP-live-speedband-tool/refs/heads/main/data/viable_markers.json").then((res) => res.json().then(obj => {
      dispatch(setSpeedbands(Speedband.jsonToSpeedbands(obj)));
    }));
  }, [])

  return (
    <>
      <NavBar></NavBar>
      <div className={styles.pageContent}>
        <SpeedbandList speedbands={speedbands}></SpeedbandList>
        <Map
          position={new LatLng(1.28960592759792, 103.84835955306676)}
          zoom={12}
          className={styles.mapContainer}
          speedbands={speedbands}>
        </Map>
      </div>
    </>
  );
}

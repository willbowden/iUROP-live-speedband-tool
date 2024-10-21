"use client"

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";
import { MarkerObj } from "@/components/Speedband";

export default function Home() {
  const Map = useMemo(() => dynamic(
    () => import('@/components/Map'),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [])

  const [markers, setMarkers] = useState<Array<MarkerObj>>([])

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/willbowden/iUROP-live-speedband-tool/refs/heads/main/data/viable_markers.json").then((res) => res.json().then(obj => {
      setMarkers(obj);
    }));
  }, [])

  return (
    <>
      <Map position={[1.28960592759792, 103.84835955306676]} zoom={12} className={styles.mapContainer} markers={markers} />
    </>
  );
}

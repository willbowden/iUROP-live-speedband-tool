"use client"

import NavBar from "@/components/NavBar/NavBar";
import { Speedband } from "@/lib/speedband";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import styles from "./dashboard.module.css"
import { LatLng } from "leaflet";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const Map = useMemo(() => dynamic(
    () => import('@/components/Map'),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [])

  const [speedbands, setSpeedbands] = useState<Array<Speedband>>([]);
  // const dispatch = useAppDispatch();

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/willbowden/iUROP-live-speedband-tool/refs/heads/main/data/viable_markers.json").then((res) => res.json().then(obj => {
      setSpeedbands(Speedband.jsonToSpeedbands(obj));
    }));
  }, [])

  return (
    <>
      <NavBar></NavBar>
      <div className={styles.pageContent}>
        <div className={styles.sideMenu}>{children}</div>
        <Map
          position={new LatLng(1.28960592759792, 103.84835955306676)}
          zoom={12}
          className={styles.mapContainer}
          speedbands={speedbands}>
        </Map>
      </div>
    </>
  )
}
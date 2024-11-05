"use client"

import { Speedband } from "@/lib/speedband";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useState } from "react";
import styles from "./dashboard.module.css"
import { LatLng } from "leaflet";
import { Layout } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";

const dashboardStyle: React.CSSProperties = {
  width: "100vw",
  display: "flex",
}

const sideMenuStyle: React.CSSProperties = {
  height: "90vh",
  paddingLeft: "2em",
  paddingRight: "2em",
}

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
    <Layout style={dashboardStyle}>
      <Sider width="25%" style={sideMenuStyle}>
        {children}
      </Sider>
      <Map
        position={new LatLng(1.28960592759792, 103.84835955306676)}
        zoom={12}
        className={styles.mapContainer}
        speedbands={speedbands}>
      </Map>
    </Layout>
  )
}
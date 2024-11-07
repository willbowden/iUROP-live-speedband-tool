"use client"

import { Speedband } from "@/lib/speedband";
import { initialSpeedbandState, SpeedbandContext, SpeedbandDispatchContext, speedbandReducer } from "@/lib/SpeedbandContext";
import { Layout } from "antd";
import Sider from "antd/es/layout/Sider";
import { LatLng } from "leaflet";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useReducer } from "react";

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

  const [speedbandState, dispatch] = useReducer(speedbandReducer, initialSpeedbandState);

  useEffect(() => {
    if (speedbandState.status === 'pending') {
      fetch("https://raw.githubusercontent.com/willbowden/iUROP-live-speedband-tool/refs/heads/main/data/viable_markers.json").then((res) => res.json().then(obj => {
        dispatch({
          type: 'Success',
          speedbands: Speedband.jsonToSpeedbands(obj),
        })
      }));
    }
  }, [])

  return (
    <SpeedbandContext.Provider value={speedbandState}>
      <SpeedbandDispatchContext.Provider value={dispatch}>
        <Layout style={dashboardStyle}>
          <Sider width="25%" style={sideMenuStyle}>
            {children}
          </Sider>
          <Map
            position={new LatLng(1.28960592759792, 103.84835955306676)}
            zoom={12}>
          </Map>
        </Layout>
      </SpeedbandDispatchContext.Provider>
    </SpeedbandContext.Provider>
  )
}
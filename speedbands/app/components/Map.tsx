"use client"

import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import "leaflet/dist/leaflet.css"
import { MapContainer, TileLayer } from "react-leaflet"
import SpeedbandAnnotation from "@/components/Speedband";
import { Speedband } from "@/lib/speedband"
import { LatLng } from "leaflet"

type MapProps = {
  position: LatLng;
  zoom: number;
  className: string;
  speedbands: Array<Speedband>;
}

export default function Map({position, zoom, className, speedbands}: MapProps) {

  return <MapContainer center={position} zoom={zoom} scrollWheelZoom={true} className={className}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {speedbands.map(band => {
      return <SpeedbandAnnotation
        speedband={band}>
      </SpeedbandAnnotation>
    })}
  </MapContainer>
}
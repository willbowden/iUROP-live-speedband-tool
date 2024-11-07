"use client"

import SpeedbandAnnotation from "@/components/Speedband"
import { SpeedbandContext } from "@/lib/SpeedbandContext"
import { LatLng } from "leaflet"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import "leaflet/dist/leaflet.css"
import { useContext } from "react"
import { MapContainer, TileLayer } from "react-leaflet"

type MapProps = {
  position: LatLng;
  zoom: number;
}

// Leaflet Map Container needs an absolute width and height to display properly.
const mapContainerStyle: React.CSSProperties = {
  width: "75vw",
  height: "90vh",
}

export default function Map({position, zoom}: MapProps) {
  const {speedbands, status} = useContext(SpeedbandContext);

  return <MapContainer center={position} zoom={zoom} scrollWheelZoom={true} style={mapContainerStyle}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {(status === 'idle') && speedbands.map(band => {
      return <SpeedbandAnnotation
        key={`${band.id}`}
        speedband={band}>
      </SpeedbandAnnotation>
    })}
  </MapContainer>
}
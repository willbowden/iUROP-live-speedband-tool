"use client"

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import Speedband, { MarkerObj } from "./Speedband"

function GroupMarkers(markers: Array<MarkerObj>): Array<Array<MarkerObj>> {
  let out = [];

  for (let i = 0; i < markers.length; i += 4) {
    out.push([markers[i], markers[i + 1], markers[i + 2], markers[i + 3]]);
  }

  return out;
}

export default function Map(props: any) {
  const { position, zoom, className, markers } = props

  const groupedMarkers = GroupMarkers(markers);

  return <MapContainer center={position} zoom={zoom} scrollWheelZoom={true} className={className}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {groupedMarkers.map(group => {
      return <Speedband
        markers={group}>
      </Speedband>
    })}
  </MapContainer>
}
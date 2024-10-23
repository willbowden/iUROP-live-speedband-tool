import { stringToCoords } from "@/util/stringCoordsToLatLng";
import { LatLng } from "leaflet";

export interface MarkerJson {
  objectType: "marker" | "path";
  start?: string;
  end?: string;
  coords?: string;
  color: string;
  label: string;
  weight?: number;
}

export interface MarkerObj {
  coords: LatLng;
  color: string;
  label: string;
}

export interface PathObj {
  start: LatLng;
  end: LatLng;
  color: string;
  weight: number;
  label: string;
}

export class Speedband {
  id: LatLng;
  start!: MarkerObj;
  end!: MarkerObj;
  camera!: MarkerObj;
  path!: PathObj;

  static jsonToSpeedbands(markers: Array<MarkerJson>): Array<Speedband> {
    let out = [];
  
    for (let i = 0; i < markers.length; i += 4) {
      out.push(new Speedband([markers[i], markers[i + 1], markers[i + 2], markers[i + 3]]));
    }
  
    return out;
  }

  constructor(markers: Array<MarkerJson>) {
    markers.forEach(m => {
      if (m.objectType == "path") {
        this.path = {
          start: stringToCoords(m.start),
          end: stringToCoords(m.end),
          color: m.color,
          weight: m.weight || 10,
          label: m.label,
        }
      } else if (m.objectType == "marker") {
        let newMarker = {
          coords: stringToCoords(m.coords),
          color: m.color,
          label: m.label,
        }
        switch (m.label) {
          case "S":
            this.start = newMarker;
            break;
          case "E":
            this.end = newMarker;
            break;
          case "C":
            this.camera = newMarker;
            break;
        }
      }
    })

    this.id = this.start.coords;
  }

  get markers() {
    return [this.start, this.end, this.camera];
  }
}
import { stringToCoords } from "@/util/stringCoordsToLatLng";
import { LatLng } from "leaflet";

export interface SpeedbandJson {
  cameraId: string;
  roadName: string;
  linkId: string;
  pathStart: string;
  pathEnd: string;
  cameraCoords: string;
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
  id: string;
  start!: MarkerObj;
  end!: MarkerObj;
  camera!: MarkerObj;
  path!: PathObj;

  static jsonToSpeedbands(bands: Array<SpeedbandJson>): Array<Speedband> {
    let out: Array<Speedband> = [];
  
    bands.forEach(b => {
      out.push(new Speedband(b));
    })
  
    return out;
  }

  constructor(b: SpeedbandJson) {

      this.path = {
        start: stringToCoords(b.pathStart),
        end: stringToCoords(b.pathEnd),
        color: "cyan",
        weight: 10,
        label: b.roadName,
      };

      this.start = {
        coords: stringToCoords(b.pathStart),
        color: "green",
        label: "S"
      }

      this.end = {
        coords: stringToCoords(b.pathEnd),
        color: "red",
        label: "E"
      }

      this.camera = {
        coords: stringToCoords(b.cameraCoords),
        color: "blue",
        label:" C"
      }

    this.id = b.cameraId;
  }

  get markers() {
    return [this.start, this.end, this.camera];
  }

  get streetName() {
    return this.path.label;
  }
}
import { Map, Path, Marker } from "leaflet";

interface MarkerObj {
  objectType: "marker" | "path";
  coords: string;
  color: string;
  label: string;
}

interface PathObj {
  objectType: "marker" | "path";
  start: string;
  end: string;
  color: string;
  label: string;
  weight: number;
}

export class Speedband {
  id: string;
  roadName: string;
  private selected: boolean;
  private startMarker: Marker;
  private endMarker: Marker;
  private cameraMarker: Marker;
  private path: Path;

  constructor(mapRef: Map, pathObj: PathObj, startMarkerObj: MarkerObj, endMarkerObj: MarkerObj, cameraMarkerObj: MarkerObj) {
    this.id = startMarkerObj.coords;
    this.roadName = pathObj.label
    this.selected = false;

    this.startMarker = this.addMarker(mapRef, startMarkerObj);
    this.cameraMarker = this.addMarker(mapRef, cameraMarkerObj);
    this.endMarker = this.addMarker(mapRef, endMarkerObj);
    this.path = this.addPath(mapRef, pathObj);

    const elementClicked = () => {
      const ev = new CustomEvent("speedband-selected", { detail: { id: this.id } });
      document.dispatchEvent(ev);
    }

    this.startMarker.on("click", elementClicked.bind(this));
    this.endMarker.on("click", elementClicked.bind(this));
    this.cameraMarker.on("click", elementClicked.bind(this));
    this.path.on("click", elementClicked.bind(this));
  }

  setSelected(value: boolean) {
    this.selected = value;
    this.setOpacities(this.selected ? 1 : 0.5);
  }

  setOpacities(val: number) {
    this.startMarker.setOpacity(val);
    this.endMarker.setOpacity(val);
    this.cameraMarker.setOpacity(val);
    this.path.setStyle({ opacity: val });
  }

  addMarker(mapRef: Map, marker: MarkerObj) {
    let coords = marker.coords.split(",").map((coord) => parseFloat(coord));

    let iconName, popupText;

    switch (marker.label) {
      case "S":
        iconName = "bi-1-circle-fill";
        popupText = "Speedband Start";
        break;
      case "E":
        iconName = "bi-2-circle-fill";
        popupText = "Speedband End";
        break;
      case "C":
        iconName = "bi-camera-fill";
        popupText = "Camera Location"
        break;
      default:
        iconName = "bi-circle-fill";
    }

    return 


    return L.marker(
      coords,
      {
        icon: L.AwesomeMarkers.icon({
          prefix: "bi",
          icon: iconName,
          markerColor: marker.color,
        }),
        opacity: this.selected ? 1 : 0.5
      }
    ).addTo(mapRef).bindPopup(popupText);
  }

  addPath(mapRef, path) {
    const coords = [
      path.start.split(",").map((coord) => parseFloat(coord)),
      path.end.split(",").map((coord) => parseFloat(coord))
    ];

    return L.polyline(
      coords,
      {
        color: path.color,
        weight: path.weight,
        opacity: this.selected ? 1 : 0.5
      }
    ).addTo(mapRef).bindPopup(path.label);
  }
}
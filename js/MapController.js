class SelectorList {
  constructor(speedbands) {
    const element = document.createElement("div");
    element.className = "speedband-selector";

    const table = this.generateTable(speedbands);
    element.append(table);
    console.log(table);

    document.body.prepend(element)
  }

  static shortenCoords(coords) {
    return coords.split(",").map(val => parseFloat(val).toFixed(4)).join(", ");
  }

  generateTable(speedbands) {
    let tableElem = document.createElement("table")
    tableElem.innerHTML = `
    <tr>
      <th>Check</th>
      <th>Coords</th>
      <th>Road Name</th>
    </tr>`;

    speedbands.forEach(band => {
      let rowElem = document.createElement("tr")
      rowElem.innerHTML = `
      <tr>
        <td>NO</td>
        <td>${SelectorList.shortenCoords(band.id)}</td>
        <td>${band.roadName}</td>
      </tr>`;

      tableElem.append(rowElem)
    })

    return tableElem;
  }
}

class Speedband {
  constructor(mapRef, pathObj, startMarkerObj, endMarkerObj, cameraMarkerObj) {
    this.id = startMarkerObj.coords;
    this.roadName = pathObj.label
    this._selected = false;

    this._startMarker = this.addMarker(mapRef, startMarkerObj);
    this._cameraMarker = this.addMarker(mapRef, cameraMarkerObj);
    this._endMarker = this.addMarker(mapRef, endMarkerObj);
    this._path = this.addPath(mapRef, pathObj);

    const elementClicked = () => {
      const ev = new CustomEvent("speedband-selected", { detail: { id: this.id } });
      document.dispatchEvent(ev);
    }

    this._startMarker.on("click", elementClicked.bind(this));
    this._endMarker.on("click", elementClicked.bind(this));
    this._cameraMarker.on("click", elementClicked.bind(this));
    this._path.on("click", elementClicked.bind(this));
  }

  setSelected(value) {
    this._selected = value;
    this.setOpacities(this._selected ? 1 : 0.5);
  }

  setOpacities(val) {
    this._startMarker.setOpacity(val);
    this._endMarker.setOpacity(val);
    this._cameraMarker.setOpacity(val);
    this._path.setStyle({ opacity: val });
  }

  addMarker(mapRef, marker) {
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

    return L.marker(
      coords,
      {
        icon: L.AwesomeMarkers.icon({
          prefix: "bi",
          icon: iconName,
          markerColor: marker.color,
        }),
        opacity: this._selected ? 1 : 0.5
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
        opacity: this._selected ? 1 : 0.5
      }
    ).addTo(mapRef).bindPopup(path.label);
  }
}

export class MapController {
  constructor(mapDivId, centreCoords) {
    if (!document.querySelector(`#${mapDivId}`)) return;

    this.speedbands = [];
    this.selectedSpeedbandIds = [];

    this.map = L.map(mapDivId, { zoomControl: false }).setView(centreCoords, 12);
    this.centreCoords = centreCoords;

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);

    L.control.zoom({ position: "bottomright" }).addTo(this.map);

    this.addCentreMapButton(mapDivId);

    fetch("./data/viable_markers.json").then(text => text.json().then((obj) => {
      this.addSpeedbands(obj);
      let s = new SelectorList(this.speedbands);
    }))


    document.addEventListener("speedband-selected", this.selectSpeedband.bind(this));
  }

  selectSpeedband(event) {
    const id = event.detail.id;
    const sb = this.speedbands.find((band) => band.id === id);

    if (this.selectedSpeedbandIds.includes(id)) {
      this.selectedSpeedbandIds = this.selectedSpeedbandIds.filter((bandId) => bandId !== id);
      sb.setSelected(false);
    } else {
      this.selectedSpeedbandIds.push(id);
      sb.setSelected(true);
    }
  }

  addCentreMapButton() {
    let centreButton = document.createElement("button");
    centreButton.id = "centre-button";
    centreButton.innerHTML = "Centre Map";
    centreButton.addEventListener("click", this.centreMap.bind(this));

    document.body.prepend(centreButton);

    // Centre button after it has been rendered so we know its width
    centreButton.style.left = (document.documentElement.clientWidth / 2) - (centreButton.clientWidth / 2) + "px";
  }

  centreMap() {
    this.map.setView(this.centreCoords, 12);
  }

  addSpeedbands(m) {
    for (let i = 0; i < m.length; i += 4) {
      this.speedbands.push(new Speedband(this.map, m[i], m[i + 1], m[i + 2], m[i + 3]));
    }
  }
}
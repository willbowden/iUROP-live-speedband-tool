export class MapController {
  constructor(mapDivId, centreCoords) {
    if (!document.querySelector(`#${mapDivId}`)) return;

    this.map = L.map(mapDivId).setView(centreCoords, 12);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    fetch("./data/viable_markers.json").then(text => text.json().then((obj) => {
      this.addMarkers(obj);
    }))
  }

  addCentreMapButton(mapDivId) {
    const mapDiv = document.querySelector(`#${mapDivId}`);

    let centreButton = new Element("button");
    centreButton.id = "centre-button";
    centreButton.style.left = (document.documentElement.clientWidth / 2) - (centreButton.clientWidth / 2) + "px";
    centreButton.addEventListener("click", this.centreMap.bind(this));

    mapDiv.prepend(centreButton);
  }

  centreMap() {
    this.map.setView(centreCoords, 12);
  }

  addMarkers(markerList) {
    for (const marker of markerList) {
      switch (marker.objectType) {
        case "path":
          this.addPath(marker);
          break;
        case "marker":
          this.addMarker(marker);
          break;
      }
    }
  }

  addPath(pathObj) {
    const coords = [
      pathObj.start.split(",").map((coord) => parseFloat(coord)),
      pathObj.end.split(",").map((coord) => parseFloat(coord))
    ];

    L.polyline(
      coords,
      {
        color: pathObj.color,
        weight: pathObj.weight,
      }
    ).addTo(this.map).bindPopup(pathObj.label);
  }

  addMarker(markerObj) {
    let coords = markerObj.coords.split(",").map((coord) => parseFloat(coord));

    let iconName, popupText;

    switch (markerObj.label) {
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

    L.marker(
      coords,
      {
        icon: L.AwesomeMarkers.icon({
          prefix: "bi",
          icon: iconName,
          markerColor: markerObj.color,
        }),
      }
    ).addTo(this.map).bindPopup(popupText);

  }
}
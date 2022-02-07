// Karte erstellen und auf Braunschweig zentrieren
const map = L.map("map").setView([52.26, 10.52], 10);

// OpenStreetMap als Hintergrundkarte einbinden
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const gpsButton = L.control.GPSButton({position: "topleft"}).addTo(map);


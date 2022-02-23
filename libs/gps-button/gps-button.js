L.Control.GPSButton = L.Control.extend({

    active: false,
    marker: null,
    button: null,
    map: null,
    watchId: null,
    
    /**
     * Funktion geerbt von L.Control. Wird ausgefuehrt, wenn der Control
     * zur Karte hinzugefuegt wird. Es wird eine leere Div erstellt, die ueber
     * die ergaenzten CSS Klassen das GPS Icon anzeigt. Beim Klick auf den Button
     * wird das Auslesen der GPS Koordinaten gestartet bzw. gestoppt.
     * @param {Map} map Die Leaflet Karte
     * @returns 
     */
    onAdd: function(map) {

        // Map als Propertie der GPSButton Klasse speichern
        this.map = map;

        // Button erstellen und die CSS Klassen ergaenzen
        this.button = L.DomUtil.create('div');
        this.button.className ="gpsButton gps_deactive";

        // Definieren, welche Funktion beim Klick auf den Button aufgerufen werden soll
        this.button.onclick = this.onclick.bind(this);

        // Der Button wird zurueckgegeben und auf der Oberflaeche angezeigt
        return this.button;
    },
    /**
     * Funktion geerbt von L.Control. Wird ausgefuehrt, wenn der Control
     * von der Karte entfernt wird
     * @param {*} map Die Leaflet Karte
     */
    onRemove: function(map) {
        // Bei entfernen des Buttons muss nichts passieren
    },

    /**
     * Wird ausfeuehrt, wenn auf den Button geklickt wird. Je nachdem ob der Button
     * derzeit aktiv ist oder nicht, wird das Icon des Buttons "gedreht" und das Auslesen
     * der GPS Koordinaten gestartet bzw. gestoppt. 
     */
    onclick: function() {
        if(this.active) {
            // GPS wird deaktiviert
            this.active = false;
            this.button.classList.remove('gps_active');
            this.button.classList.add('gps_deactive');
            this.stopGPSUpdate();

        } else {
            // GPS wird aktiviert
            this.active = true;
            this.button.classList.remove('gps_deactive');
            this.button.classList.add('gps_active');
            this.startGPSUpdate();
        }
    },

    /**
     * Startet das Auslesen der GPS Koordinaten. Beim ersten Auslesen der Koordinaten
     * wird ein neuer Marker an der entsprechenenden Position zur Karte hinzugefuegt. Bei
     * allen weiteren Aktualisierungen der Koordinaten wird die Position des bereits
     * existierenden Markers angepasst
     */
    startGPSUpdate: function() {
        if (navigator.geolocation) {

            // Abfrage der GPS Koordinaten starten
            this.watchId = navigator.geolocation.watchPosition(function(position) {
                
                // Lat und Long auslesen
                const lat = position.coords.latitude;
                const long = position.coords.longitude;

                // Wenn noch kein Marker auf der Karte ist...
                if(!this.marker) {

                    //... wird ein neues pulsierendes Icon erstellt...
                    const icon = L.divIcon({className: 'position_marker pulse'})
                    
                    // ...welches einem neuen Marker zugeordnet wird.
                    this.marker = L.marker([lat, long], {
                        icon:icon
                    }).addTo(this.map);

                }else{
                    // Wenn der Marker bereits existiert, dann wird die Position aktualisiert.
                    this.marker.setLatLng([lat, long]);
                }

            }.bind(this));
        } else {
            // Fehlermeldung in der Konsole ausgeben, wenn die Koordinaten nicht ausgelesen werden konnt.
            console.log("Der Browser unterstützt das Auslesen der GPS Koordinaten nicht.");
        }
    },

    /**
     * Wird ausgefuehrt, wenn das Auslesen der GPS Koordinaten gestoppt werden soll.
     * Zusaetzlich wird der Marker von der Karte entfernt.
     */
    stopGPSUpdate: function() {
        if (navigator.geolocation && this.watchId) {

            // Auslesen der GPS Koordinaten stoppen. Hierfuer wird die WatchId benoetig, die zuvor gespeichert wurde.
            navigator.geolocation.clearWatch(this.watchId);

            if(this.marker) {
                this.marker.remove();
                this.marker = null;
            }
        }
    }
});

L.control.GPSButton = function(opts) {
    return new L.Control.GPSButton(opts);
}
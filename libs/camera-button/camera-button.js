L.Control.CameraButton = L.Control.extend({

    button: null,
    input: null,
    imageControl: null,
    imageDiv: null,

    /**
     * Funktion geerbt von L.Control. Wird ausgefuehrt, wenn der Control
     * zur Karte hinzugefuegt wird. Es wird eine leere Div erstellt, die ueber
     * die ergaenzten CSS Klassen das GPS Icon anzeigt. Beim Klick auf den Button
     * wird das Auslesen der GPS Koordinaten gestartet bzw. gestoppt.
     * @param {Map} map Die Leaflet Karte
     * @returns 
     */
    onAdd: function(map) {


        // Button erstellen und die CSS Klassen ergaenzen
        this.button = document.createElement("label");
        this.button.for = "cameraInput";
        this.button.className ="cameraButton";

        this.input = document.createElement("input");
        this.input.id = "cameraInput";
        this.input.type = "file";
        this.input.accept = "image/*";
        this.input.capture = "environment"

        this.button.appendChild(this.input);

        this.imageControl = L.control({position: 'bottomleft'})
        this.imageControl.onAdd = function() {

            const div = document.createElement("div");
            div.classList.add("imageContainer");
            this.imageDiv = document.createElement("img");
            this.imageDiv.classList.add("image");

            div.appendChild(this.imageDiv);
            return div;
        }.bind(this);
        this.imageControl.addTo(map);

        // Definieren, welche Funktion beim Klick auf den Button aufgerufen werden soll
        this.input.onchange = this.onchange.bind(this);

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
    onchange: function() {
        const file = this.input.files[0];
        const reader = new FileReader();
    
        reader.addEventListener("load", function(event) {
            this.imageDiv.src = event.target.result;
        }.bind(this));
        reader.readAsDataURL(file);
    },
});

L.control.CameraButton = function(opts) {
    return new L.Control.CameraButton(opts);
}
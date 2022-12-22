// Variablen
let timer;
let rudolph, currentScientist;
let rudolphIcon, grinchIcon, presentIcon, scientist1Icon, scientist2Icon, 
    scientist3Icon, scientist4Icon, scientist5Icon;
let scientistsIcons;

// Alle Positionen an denen Wissenschaftler auf ihre Geschenke warten
let scientists = [[52.286126, 10.539771], [52.285731, 10.540570], [52.285764, 10.538832], [52.284842, 10.539411], 
                  [52.285367, 10.538663],[52.285544, 10.541452],[52.285918, 10.541409],[52.285839, 10.542074],
                  [52.285032, 10.542374],[52.284487, 10.540260],[52.283968, 10.538393],[52.284434, 10.540850],
                  [52.284165, 10.541075],[52.284585, 10.541740],[52.284342, 10.542078],[52.284867, 10.542722],
                  [52.285441, 10.542534],[52.285493, 10.541998]];

// Karte erstellen und Hintergrundkarte ergaenzen                 
const map = L.map("map").setView( [52.285119, 10.541059], 18);

L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
  maxZoom: 20,
  attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);

// Schnee Effekt zur Karte hinzufuegen
const snow = L.snow([[52.283190, 10.535334], [52.286928, 10.535334], [52.286928, 10.548340], [52.283190, 10.548340]],{
  color:"#fcf8f7",
  speed: 200,
  layersCount:4,
  size: 20
});

snow.addTo(map);

// Das Spiel initalisieren
initGame();

//------------- Init-Funktionen -----------------------

/**
 * Initalisiert das Spiel. Rudolph und der Timer werden zur Karte hinzugefuegt.
 * Mit einem Klick auf die Karte startet das Spiel und der Timer beginnt runterzuzaehlen.
 */
function initGame() {
  initIcons();
  initRudolph();
  initTimer();

  // Array mit den Positionen der Wissenschaftler durchmischen
  scientists = shuffleArray(scientists);

  // Klick-Listener fuer die Karte erstellen, damit das Spiel beginnen kann
  map.once("click", function() {
    timer.startTimer();
    showNextScientist();
  })
}

/**
 * Erstellt alle Icons, die fuer die Marker auf der Karte verwendet
 * werden.
 */
function initIcons() {
  // Alle Icons erzeugen
  rudolphIcon = L.icon({iconUrl:"./../img/reindeer.jpg", iconSize:[50,50]});
  grinchIcon = L.icon({iconUrl:"./../img/grinch.png", iconSize:[50,50]});
  presentIcon = L.icon({iconUrl:"./../img/present.svg", iconSize:[50,50]});
  scientist1Icon = L.icon({iconUrl:"./../img/scientist1.png",iconSize: [60, 60]});
  scientist2Icon = L.icon({iconUrl:"./../img/scientist2.png",iconSize: [60, 60]});
  scientist3Icon = L.icon({iconUrl:"./../img/scientist3.png",iconSize: [60, 60]});
  scientist4Icon = L.icon({iconUrl:"./../img/scientist4.png",iconSize: [60, 60]});
  scientist5Icon = L.icon({iconUrl:"./../img/scientist5.png",iconSize: [60, 60]});

  // Die fuenf Icons der Wissenschaftler in einem Array speichern
  scientistsIcons =[scientist1Icon, scientist2Icon, scientist3Icon, scientist4Icon, scientist5Icon]
}

/**
 * Erstellt einen Marker fuer Rudolph. Der Marker soll sich bewegen koennen, deswegen
 * wird das Plugin MovinMarker verwendet
 */
function initRudolph() {
  rudolph = L.Marker.movingMarker([[52.285119, 10.541059]], [500], {icon:rudolphIcon});
  rudolph.addTo(map);
}

/**
 * Erstellt den Timer der von 20 runterzaehlt. Wenn der Timer abgelaufen ist,
 * dann wird der Verlierer-Banner angezeigt.
 */
function initTimer() {
  timer = new Timer(20);
  timer.on("finished", function() {
    // Verlierer-Banner anzeigen
    showBanner(true);
    setBannerText(false);

    // Klick Event vom aktuellen Wissenschaftler entfernen
    currentScientist.off("click");
  })
}


//------------- Scientists -----------------------

/**
 * Zeigt den naechsten Wisschenschaftler auf der Karte an. Wenn bereits ein Wischenschaftler
 * auf der Karte angezeigt wurde, dann wird dieser von der Karte entfernt und es wird ein euer
 * Marker an seiner Position hinzugefuegt, der das ausgelieferte Geschenk anzeigt. Wenn kein
 * Wissenschaftler mehr uebrig ist, dann wird der Gewonnen-Banner angezeigt.
 */
function showNextScientist() {

  // Pruefen, ob bereits ein Wissenschaftler in der Karte angezeigt wird
  if(currentScientist) {
    // Wissenschaftler aus der Karte entfernen
    map.removeLayer(currentScientist);

    // Geschenkt an die Position des Wissenschaftlers positionieren (als Marker)
    addMarker(currentScientist.getLatLng(), {icon: presentIcon});
  }
    
  // Wenn noch ein Wissenschaftler uebrig ist... 
  if(scientists.length > 0) {
    //...den naechsten Wissenschaftler auf der Karte platzieren
    setCurrentScientist();
  } else {
    // ...ansonsten den Timer stoppen und den Gewinner Banner anzeigen
    timer.stopTimer();
    showBanner(true);
    setBannerText(true);
  }
}

/**
 * Liest die Position des ersten Wissenschaftler aus dem scientists Array aus. Auf Basis der
 * ausgelesenen Position wird ein neuer Marker erstellt und als currentScientist zwischen gespeichert.
 */
function setCurrentScientist() {

  // Vorderste Position aus dem scientists Array entnehmen und einen Marker erstellen
  currentScientist = addMarker(scientists.shift(), {icon:getRandomScientistIcon()})

  // Wenn auf den Marker des aktuellen Wissenschaftlers geklickt wird...
  currentScientist.on("click", function() {
    
    currentScientistPosition = [currentScientist.getLatLng().lat, currentScientist.getLatLng().lng];

    //.. laeuft Rudolph zu dieser Position
    rudolph.moveTo(currentScientistPosition, 500);
    
    // ... dann wird der naechste Wissenschaftler aus der Liste angezeigt
    showNextScientist();

    //... und ein neuer Grinch wird zur Karte hinzugefuegt.
    addGrinch();
  })
}

/**
 * Gibt ein beliebiges Wissenschafter Icon zurueck
 * @returns Ein Icon
 */
function getRandomScientistIcon() {
  const random = Math.floor(Math.random() * scientistsIcons.length);
  return scientistsIcons[random];
}


//------------- Grinch-----------------------

/**
 * Fuegt einen neuen Grinch Marker zur Karte hinzu. Wenn ausversehen
 * auf den Grinch Marker geklickt wird, dann ist das Spiel verloren. 
 */
function addGrinch() {
  const grinch = addMarker(getRandomGrinchPosition(), {icon:grinchIcon});
    
  grinch.on("click", function() {
    // Timer anhalten
    timer.stopTimer();

    //den Verlierer-Banner anzeigen
    showBanner(true);
    setBannerText(false);

    // Klick-Listener vom aktuellen Wissenschaftler entfernen
    currentScientist.off("click");
  })
}

/**
 * Gibt ein beliebiges Koordinatenpaar auf dem Nordcampus zurueck
 * @returns [lat, lng] ein Koordinatenpaar 
 */
function getRandomGrinchPosition() {
  const lat = (Math.random() * (52.285946 - 52.283651) + 52.283651).toFixed(6);
  const lng = (Math.random() * (10.543461 - 10.538379) + 10.538379).toFixed(6);

  return [lat, lng];
}

/**
 * Fuegt einen Marker zur Karte hinzu
 * @param {[lat, lng]} position Das Koordinatenpaar als Array 
 * @param {*} options Die optionalen Einstellungen des Markers (z.B. das Icon)
 */
 function addMarker(position, options) {
  return L.marker(position, options).addTo(map);
}

/**
 * Die Funktion durchmischt alle Elemente des uebergebenen Arrays und gibt
 * diesen zurueck.
 * @param {Array} array Der Array, der durchmischt werden soll
 */
 function shuffleArray(array) {
  for(let i = array.length-1; i > 0; i--){
      const j = Math.floor(Math.random() * i)
      const temp = array[i]
      array[i] = array[j]
      array[j] = temp
  }
  return array;
}

/**
  * Zeigt bzw. versteckt den Banner ueber der Karte in Abhaengigkeit der uebergebenen Wertes.
  * Hierzu werden die entsprechenden CSS Klassen zum Banner HTML Element hinzugefuegt und entfernt.
  * @param {Boolean} isShow Gibt an, ob der Banner gezeigt oder versteckt werden soll (true/false)
  */
 function showBanner(isShow) {
  let banner = document.getElementById("banner");
  
  if(isShow) {
    if(banner.classList.contains("hide")) {
      banner.classList.remove("hide");
    }
    banner.classList.add("show");
  } else{
    if(banner.classList.contains("show")) {
      banner.classList.remove("show");
    }
    banner.classList.add("hide");
  }
}

/**
* Der Text des Banners wird in Anhaengigkeit des uebergebenen Wertes gesetzt. Es gibt
* einen Text fuer "Gewonnen" und einen fuer "Verloren".
* @param {Boolean} isWinner Gibt an, ob der Benutzer gewonnen hat (true/false)
*/
function setBannerText(isWinner) {
   let banner = document.getElementById("banner");
   if(isWinner) {
       banner.innerHTML = "<h3>Gewonnen</h3><div>Yuppi...alle Geschenke wurden rechtzeitig augeliefert. Rudolph, du bist der Beste!</div><img src='./img/christmastree.png' class='banner-img'>";
   } else {
       banner.innerHTML = "<h3>Verloren</h3><div>Der Grinch hat Weihnachten sabortiert! Die Mitarbeiter des Nordcampus müssen leider ohne Geschenke ins Bett...</div><img src='./img/sad_scientist.jpg' class='banner-img'>";
   }
}
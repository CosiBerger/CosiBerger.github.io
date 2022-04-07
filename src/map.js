// Share Button von der HTML Seite beziehen
const shareButton = document.getElementById("shareButton");

// Klick-Listener fuer den Button
shareButton.addEventListener("click" , async function() {
    try{
        // Darauf warten, dass das Bild geteilt wurde
        await navigator.share({title:"Bild teilen", url:"../image/miniproject_screenshot_berger.png"});

        // Erfolgreiches Teilen in der Konsole loggen
        console.log("Bild wurde erfolgreich geteilt.")
    }catch(error){
        // Fehler in der Konsole loggen
        console.log(error);
    }
});


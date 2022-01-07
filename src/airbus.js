window.onload = () => {

    setTimeout(function(){
        renderAirbus();
    }, 30000)

    const alertDiv = document.getElementById("alert");
    navigator.geolocation.watchPosition(function(pos) {
        alertDiv.innerHTML = pos.coords.latitude + ", " + pos.coords.longitude + ", " + pos.coords.accuracy;
        console.log(pos);
    }, function(error) {
        alertDiv.innerHTML = error.message;
    }, {});
    
};

function renderAirbus() {
    let scene = document.querySelector('a-scene');
    let camera = document.querySelector('a-camera');
    console.log(camera);
    cameraPosition = camera.components["gps-projected-camera"].originCoords;

    // add place icon
    const icon = document.createElement('a-entity');
    icon.setAttribute('position', cameraPosition[0] + ' 1 '  + cameraPosition[1]);
    icon.setAttribute('id', 'a380');
    icon.setAttribute('rotation', '0 180 0');
    icon.setAttribute('gltf-model', '../models/a380.gltf');

    // for debug purposes, just show in a bigger scale, otherwise I have to personally go on places...
    icon.setAttribute('scale', '0.05 0.05 0.05');

    scene.appendChild(icon);
}
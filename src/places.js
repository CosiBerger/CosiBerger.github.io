window.onload = () => {

    const alertDiv = document.getElementById("alert");
    navigator.geolocation.watchPosition(function(pos) {
        alertDiv.innerHTML = pos.coords.latitude + ", " + pos.coords.longitude + ", " + pos.coords.accuracy;
        console.log(pos);
    }, function(error) {
        alertDiv.innerHTML = error.message;
    }, {});
    
};


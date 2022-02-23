const image = document.getElementById("photo");
const input = document.getElementById("camera");

input.addEventListener("change" , function() {
    const file = input.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", function(event) {
        image.src = event.target.result;
    });
    reader.readAsDataURL(file);
})

const video = document.getElementById("video");
const image = document.getElementById("image");
const takePhotoButton = document.getElementById("takePhoto");
const canvas = document.createElement("canvas");

navigator.mediaDevices.getUserMedia({ video: true })
  .then(mediaStream => {
    // Do something with the stream.
    video.srcObject = mediaStream;
});

takePhotoButton.addEventListener("click", function() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    // Other browsers will fall back to image/png
    image.src = canvas.toDataURL("image/webp");
})
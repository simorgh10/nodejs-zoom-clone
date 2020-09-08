
const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

navigator.mediaDevices.getUserMedia({
    video : true,
    audio : true
}).then(stream => appendVideoStream(myVideo, stream));

const  appendVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => video.play());
    videoGrid.appendChild(video);
};

socket.emit('join-room', ROOM_ID);

socket.on('user-connected', () => {
    connectToNewUser();
});

connectToNewUser = () => {
    console.log("A new user connected !");
};

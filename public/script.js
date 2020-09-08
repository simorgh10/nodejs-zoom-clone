
const peer = new Peer(undefined, {
    host: '/',
    port: '3030',
    path: '/peerjs'
});
const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

navigator.mediaDevices.getUserMedia({
    video : true,
    audio : false
}).then(stream => {
    appendVideoStream(myVideo, stream);
    peer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', remoteStream =>  {
           appendVideoStream(video, remoteStream);
        });
    });

    socket.on('user-connected', (userId) => {
        connectToNewUser(userId, stream);
    });
});


peer.on('open', userId => {
    console.log(userId);
    socket.emit('join-room', ROOM_ID, userId);
});

const connectToNewUser = (userId, stream) => {
    console.log(`User ${userId} connected !`);
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', remoteStream => {
        appendVideoStream(video, remoteStream);
    });
};

const  appendVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => video.play());
    videoGrid.appendChild(video);
};


// const getUserMedia2 = (navigator.mozGetUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia).bind(navigator);
// getUserMedia2({
//     video : true,
//     audio : true
// }, stream => appendVideoStream(myVideo, stream), err => {});

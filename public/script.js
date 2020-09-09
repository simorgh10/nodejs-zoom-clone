
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

    const messageContainer = document.getElementById('message_container');
    messageContainer.onkeypress = (e) => {
        let message = messageContainer.value;
        if (e.keyCode === 13 && message !== '') {
            addNewMessage(userId, message);
            socket.emit('message', ROOM_ID, userId, message);
            messageContainer.value = '';
        }
    };
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

socket.on('create-message', (userId, message) => {
    addNewMessage(userId, message);
});

function addNewMessage(userId, message) {
    //let p = document.createElement('p');
    //li.innerHTML = userId + " " + message;
    let li = `<li><b>${userId}</b><br/>${message}</li>`;
    let messageList = document.getElementById('message-list');
    messageList.innerHTML += li;
    scrollToBottom();
}

const scrollToBottom = () => {
    let chatWindow = document.getElementById('chat-window');
    chatWindow.scrollTop = chatWindow.scrollHeight - chatWindow.clientHeight;
};

// const getUserMedia2 = (navigator.mozGetUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia).bind(navigator);
// getUserMedia2({
//     video : true,
//     audio : true
// }, stream => appendVideoStream(myVideo, stream), err => {});

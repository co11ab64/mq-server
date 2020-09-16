const serverURL = `${window.location.protocol}//${window.location.host}`;

function generateQRCode(token) {
    let qrcode = document.querySelector("img"),
        a = document.querySelector("a"),
        baseURL = "https://api.qrserver.com/v1/create-qr-code/?size=150x150",
        data = `${serverURL}/controller.html?token=${token}`;

    qrcode.src = `${baseURL}&data=${data}`;
    a.href = data;
}

window.onload = async function () {
    //Connect to the mq-server
    const socket = io(serverURL);
    let token;
    socket.on("welcome-msg", data => console.log(data));
    socket.emit("create-room", '1234', data => {
        token = data.roomTitle;
        generateQRCode(token);
    });
    socket.on("action-from-server", data => {
        window.top.postMessage(`${data.action}:${data.value}`, " https://sactrial-saceu10-e7imrcd69ivxk4fblyi8bf51.eu10.hanacloudservices.cloud.sap/");
    });
}
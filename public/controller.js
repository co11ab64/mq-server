const token = getToken();
const serverURL = `${window.location.protocol}//${window.location.host}`;
const socket = io(serverURL);

socket.emit("joinRoom", { roomTitle: token }); 

function getToken() {
    let token = window.location.search.match(/token=.*/);
    if (token) return token[0].split("=").pop();
    else return "";
}
function onGrossMarginPress() {
    let data = {
        token: token,
        actions: [
            {
                action: "filter",
                value: "GrossMargin",
                ts: new Date().getTime()
            }
        ]
    };
    socket.emit("messageToServer",data);
}
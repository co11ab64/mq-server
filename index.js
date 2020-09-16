const express = require('express');
const socketio = require('socket.io');
const Room = require("./classes/Room");
const { v4: uuidv4 } = require('uuid');

//Create the express app
const app = express();
//Serve the public folder
app.use(express.static(__dirname + "/public"));
const port = process.env.PORT || 8080;
const expressServer = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

app.get("/",(req,res)=>{
    res.render(__dirname+"/public/index.html");
})

//Create the socket server
const io = socketio(expressServer);
let rooms = [];
io.on('connection', socket => {
    socket.emit('welcome-msg', { msg: "Welcome to server 2.0" });

    socket.on('create-room', (data, ackFn) => {
        //Create a new room for the analytics designer app
        let room = new Room(rooms.length, uuidv4());
        rooms.push(room);

        //Send the room title to the ui to generate the qr-code
        ackFn({ roomTitle: room.roomTitle })

        //Join the newly created room
        socket.join(room.roomTitle);
    });
    
    // socket.emit('action-from-server',{});
    
    // socket.on('messageToServer', data => {
    //     // socket.to(data.roomTitle).emit("")
    //     console.log(`Action ${data}`)
    // });
    
    socket.on('joinRoom', data => {
        let room = rooms.find(room => room.roomTitle === data.roomTitle);
        if (!room) return;// TODO: Error handling here
        socket.join(room.roomTitle);

        console.log("Controller joined room", room.roomTitle);

        socket.to(room.roomTitle).on('messageToServer', data => {
            // socket.to(data.roomTitle).emit("")
            console.log(`Action ${data}`)
        });
    });
})
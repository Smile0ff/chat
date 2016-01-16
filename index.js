"use strict";

let express = require("express");
let app = express();

let http = require("http").createServer(app);
let io = require("socket.io")(http);
let port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/"));
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

let numUsers = 0;

io.on("connection", (socket) => {
    let isAddedUser = false;
    let isOnline = false;
    //user connected
    
    socket.on("new-user", (nickname) => {
        if(isAddedUser) return;

        socket.nickname = nickname;

        numUsers++;
        isAddedUser = true;
        isOnline = true;

        socket.emit("login", {
            isOnline: isOnline,
            numUsers: numUsers
        });

        socket.broadcast.emit("user-joined", {
            nickname: nickname,
            isOnline: isOnline,
            numUsers: numUsers
        });

    });

    socket.on("type-start", () => {
        socket.broadcast.emit("type-start", socket.nickname);
    });
    socket.on("type-end", () => {
        socket.broadcast.emit("type-end");
    });

    socket.on("message", (msg) => {

        socket.broadcast.emit("broadcast", {
            message: msg,
            nickname: socket.nickname
        });

    });

    socket.on("disconnect", () => {
        if(!isAddedUser && !isOnline) return;
        numUsers--;

        isOnline = false;
        
        socket.emit("exit", {
            isOnline: isOnline,
            numUsers: numUsers
        });

        socket.broadcast.emit("user-left", {
            nickname: socket.nickname,
            isOnline: isOnline,
            numUsers: numUsers
        });

    });

});

http.listen(port);
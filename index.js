var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var game = require("./game.js");

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});
app.use('/', express.static(__dirname + '/public'));

io.on('connection', function(socket){
    console.log('connected socket: %s', socket.id);
    socket.on('disconnect', function(){
		console.log('disconnected socket: %s', socket.id);
    });
    socket.on('createRoom', function(data){
        var roomId = game.initGame(data.m, data.n, data.k, data.id, socket.id);
		console.log('%s created room %s', socket.id, data.id);
		socket.emit("gameCreated", {m: game.rooms[roomId].m, n: game.rooms[roomId].n, k: game.rooms[roomId].k, turn: true, sign: "white", gameId: game.rooms[roomId].id});
    });
    socket.on('move', function(data){
        var move = game.move(socket.id, data.x, data.y, data.gameId);
        switch (move){
            case 1:
                socket.emit("move", {type: 1, gameUpdate: { board: game.rooms[data.gameId].board, turn: game.rooms[data.gameId].turn}});
                break;
            case 2:
                socket.emit("move", {type: 2});
                break;
            case 3:
                socket.emit("move", {type: 3});
                break;
            default:
                socket.emit("move", {type: 0});
        }
    });
});

http.listen(8080, function(){
    console.log('listening on *:8080');
});
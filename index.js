var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var game = require("./game.js");

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
app.use('/', express.static(__dirname + '/public'));

io.on('connection', function (socket) {
    socket.on('disconnect', function () {
        console.log('disconnected socket: %s', socket.id);
    });
    socket.on('createRoom', function (data) {
        console.log(game.rooms.hasOwnProperty(data.id));
        if (!game.rooms.hasOwnProperty(data.id)) {
            var roomId = game.initGame(data.m, data.n, data.k, data.id, socket.id);
            socket.emit("gameCreated", {
                m: game.rooms[roomId].m,
                n: game.rooms[roomId].n,
                k: game.rooms[roomId].k,
                turn: true,
                sign: "white",
                gameId: game.rooms[roomId].id
            });
        } else
            socket.emit("err", {id: 4});
    });
    socket.on('move', function (data) {
        var move = game.move(socket.id, data.x, data.y, data.gameId);
        switch (move.type) {
            case 1:
                socket.emit("move", {
                    gameUpdate: {
                        board: game.rooms[data.gameId].board,
                        turn: game.rooms[data.gameId].turn
                    }
                });
                socket.broadcast.to(move.firstPlayer == socket.id ? move.secondPlayer : move.firstPlayer).emit("move", {
                    type: 1,
                    gameUpdate: {board: game.rooms[data.gameId].board, turn: game.rooms[data.gameId].turn}
                });
                break;
            case 2:
                socket.emit("err", {id: 1});
                break;
            case 3:
                socket.emit("err", {id: 2});
                break;
            case 4:
                socket.emit("gameFinished", {win: move.win, winType: 1, board: move.board});
                socket.broadcast.to(move.firstPlayer == socket.id ? move.secondPlayer : move.firstPlayer).emit("gameFinished", {win: move.win, winType: 1, board: move.board});
                game.deleteGame(data.gameId);
                break;
            default:
                socket.emit("err", {id: 0});
        }
    });
    socket.on('joinRoom', function (data) {
        var join = game.joinRoom(socket.id, data.gameId);
        if (join.type == 1) {
            socket.emit("gameCreated", {
                m: game.rooms[data.gameId].m,
                n: game.rooms[data.gameId].n,
                k: game.rooms[data.gameId].k,
                turn: false,
                sign: "black",
                gameId: game.rooms[data.gameId].id
            });
            socket.emit("gameStarted");
            socket.broadcast.to(join.firstPlayer).emit('gameStarted');
        } else
            socket.emit("err", {id: 3});

    });
});

http.listen(8080, function () {
    console.log('listening on *:8080');
});
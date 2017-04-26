var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var game = require("./game.js");
var RandomBot = require("./bots/random.js");

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
app.use('/', express.static(__dirname + '/public'));


io.on('connection', function (socket) {
    game.rooms.forEach(function (room) {
        if(room.secondPlayer == null){
            io.emit('updateGameList', {
                type: 1,
                id: room.id,
                m: room.m,
                n: room.n,
                k: room.k
            });
        }
    });

    socket.on('disconnect', function () {
        console.log('disconnected socket: %s', socket.id);
        game.rooms.forEach(function (room) {
            if(room.firstPlayer == socket.id){
                room.turn = 2;
                send.move(socket, room.id, game.finishGame(room.id));
            } else if(room.secondPlayer == socket.id){
                room.turn = 1;
                send.move(socket, room.id, game.finishGame(room.id));
            }
        });
    });
    socket.on('createRoom', function (data) {
        if (!game.rooms.hasOwnProperty(data.id)) {
            var roomId = game.initGame(data.m, data.n, data.k, data.id, socket.id);
            send.createRoom(socket, roomId);
        } else
            socket.emit("err", {id: 4});
    });
    socket.on('move', function (data) {
        var move = game.move(socket.id, data.x, data.y, data.gameId);
        send.move(socket, data.gameId, move);
    });
    socket.on('startBot', function (data) {
        switch(data.type){
			case 'random':
				if (this.rooms.hasOwnProperty(data.gameId)) {
					if(game.rooms[data.gameId].secondPlayer == null)
						game.rooms[data.gameId].secondPlayer = new RandomBot(m, n);
				}
				break;
		}
		//var move = game.move(socket.id, data.x, data.y, data.gameId);
        //send.move(socket, data.gameId, move);
    });
    socket.on('joinRoom', function (data) {
        var join = game.joinRoom(socket.id, data.gameId);
        send.joinRoom(socket, data.gameId, join);
    });
});

var send = {
    createRoom: function (socket, room) {
        socket.emit("gameCreated", {
            m: game.rooms[room].m,
            n: game.rooms[room].n,
            k: game.rooms[room].k,
            turn: true,
            sign: "white",
            gameId: game.rooms[room].id
        });
        io.emit('updateGameList', {
            type: 1,
            id: game.rooms[room].id,
            m: game.rooms[room].m,
            n: game.rooms[room].n,
            k: game.rooms[room].k
        });
    },
    move: function (socket, room, move) {
        switch (move.type) {
            case 1:
                socket.emit("move", {
                    gameUpdate: {
                        board: game.rooms[room].board,
                        turn: game.rooms[room].turn
                    }
                });
                socket.broadcast.to(move.firstPlayer == socket.id ? move.secondPlayer : move.firstPlayer).emit("move", {
                    type: 1,
                    gameUpdate: {board: game.rooms[room].board, turn: game.rooms[room].turn}
                });
                break;
            case 2:
                socket.emit("err", {id: 1});
                break;
            case 3:
                socket.emit("err", {id: 2});
                break;
            case 4:
                socket.emit("gameFinished", {win: move.win, winType: move.winType, board: move.board});
                socket.broadcast.to(move.firstPlayer == socket.id ? move.secondPlayer : move.firstPlayer).emit("gameFinished", {win: move.win, winType: move.winType, board: move.board});
                game.deleteGame(room);
                break;
            default:
                socket.emit("err", {id: 0});
        }
    },
    joinRoom: function (socket, room, join) {
        if (join.type == 1) {
            socket.emit("gameCreated", {
                m: game.rooms[room].m,
                n: game.rooms[room].n,
                k: game.rooms[room].k,
                turn: false,
                sign: "black",
                gameId: game.rooms[room].id
            });
            socket.emit("gameStarted");
            socket.broadcast.to(join.firstPlayer).emit('gameStarted');
            io.emit('updateGameList', {
                type: 2,
                id: game.rooms[room].id
            });
        } else
            socket.emit("err", {id: 3});
    }
}

http.listen(8080, function () {
    console.log('listening on *:8080');
});
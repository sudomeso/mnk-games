module.exports = {
    rooms: [],
    socket: null,
    initGame: function (m, n, k, id, owner) {
        this.rooms[id] = {};
        this.rooms[id].id = id;
        this.rooms[id].board = this.setBoard(m, n);
        this.rooms[id].m = m;
        this.rooms[id].n = n;
        this.rooms[id].k = k;
        this.rooms[id].firstPlayer = owner;
        this.rooms[id].secondPlayer = null;
        this.rooms[id].turn = 1;
        this.rooms[id].turnsToEnd = m*n;
        return this.rooms[id].id;
    },
    setBoard: function (m, n) {
        var r = new Array(m);
        for (var i = 0; i < m; i++) {
            r[i] = new Array(n);
            for (var j = 0; j < n; j++) {
                r[i][j] = 0;
            }
        }
        return r;
    },
    move: function (player, x, y, gameId) {
        if ((this.rooms[gameId].turn == 1 && this.rooms[gameId].firstPlayer == player) || (this.rooms[gameId].turn == 2 && this.rooms[gameId].secondPlayer == player)) {
            if (this.rooms[gameId].board[x][y] == 0) {
                this.rooms[gameId].board[x][y] = (this.rooms[gameId].turn == 1 ? 1 : 2);
                this.rooms[gameId].turnsToEnd--;
                if(this.chceckWin(x, y, this.rooms[gameId].turn, gameId) || this.rooms[gameId].turnsToEnd == 0)
                    return this.finishGame(gameId);
                else {
                    this.rooms[gameId].turn = (this.rooms[gameId].turn == 1 ? 2 : 1);
                    return {
                        type: 1,
                        firstPlayer: this.rooms[gameId].firstPlayer,
                        secondPlayer: this.rooms[gameId].secondPlayer
                    };
                }
            } else
                return {type: 2};
        } else
            return {type: 3};

    },
    joinRoom: function (player, room) {
        if (this.rooms.hasOwnProperty(room)) {
            if (this.rooms[room].firstPlayer != player && this.rooms[room].secondPlayer == null)
                this.rooms[room].secondPlayer = player;
            return {type: 1, firstPlayer: this.rooms[room].firstPlayer, secondPlayer: this.rooms[room].secondPlayer};
        }
        return {type: 0};
    },
    finishGame: function (room) {
        if(this.rooms[room].turnsToEnd == 0){
            return {
                type: 4,
                win: 0,
                winType: 2,
                firstPlayer: this.rooms[room].firstPlayer,
                secondPlayer: this.rooms[room].secondPlayer,
                board: this.rooms[room].board
            };
        }else {
            return {
                type: 4,
                win: this.rooms[room].turn,
                winType: 1,
                firstPlayer: this.rooms[room].firstPlayer,
                secondPlayer: this.rooms[room].secondPlayer,
                board: this.rooms[room].board
            };
        }
    },
    deleteGame: function (room) {
        delete this.rooms[room];
    },
    joinGame: function (room) {
        socket.emit("joinRoom", {gameId: room});
    },
    chceckWin: function (x, y, sign, room) {
        var countRowPoints = 1;
        for (var i = x - 1; i >= 0; i--) { //horizontal to left
            if (this.rooms[room].board[i][y] == sign) countRowPoints++;
            else break;
        }
        for (var i = x + 1; i < this.rooms[room].m; i++) { //horizontal to right
            if (this.rooms[room].board[i][y] == sign) countRowPoints++;
            else break;
        }

        if (countRowPoints >= this.rooms[room].k) return true;
        countRowPoints = 1;
        for (var i = y - 1; i >= 0; i--) { //vertical to top
            if (this.rooms[room].board[x][i] == sign)
                countRowPoints++;
            else break;
        }
        for (var i = y + 1; i < this.rooms[room].n; i++) { //vertical to down
            if (this.rooms[room].board[x][i] == sign)
                countRowPoints++;
            else break;
        }

        if (countRowPoints >= this.rooms[room].k) return true;
        countRowPoints = 1;
        for (var i = -1; x + i >= 0 && y + i >= 0; i--) { //in diagonally to left top
            if (this.rooms[room].board[x + i][y + i] == sign)
                countRowPoints++;
            else break;
        }
        for (var i = 1; x + i < this.rooms[room].m && y + i < this.rooms[room].n; i++) { //in diagonally to left top
            if (this.rooms[room].board[x + i][y + i] == sign)
                countRowPoints++;
            else break;
        }

        if (countRowPoints >= this.rooms[room].k) return true;
        countRowPoints = 1;
        for (var i = -1; x - i < this.rooms[room].m && y + i >= 0; i--) { //in diagonally to right top
            if (this.rooms[room].board[x - i][y + i] == sign)
                countRowPoints++;
            else break;
        }
        for (var i = 1; x - i >= 0 && y + i < this.rooms[room].n; i++) { //in diagonally to left down
            if (this.rooms[room].board[x - i][y + i] == sign)
                countRowPoints++;
            else break;
        }
        if (countRowPoints >= this.rooms[room].k) return true;
        return false;
    }
};
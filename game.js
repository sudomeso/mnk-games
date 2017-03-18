module.exports = {
    rooms: [],
    socket: null,
    initGame: function (m, n, k, id, owner) {
        this.rooms[id] = {};
        this.rooms[id].id = id;
        this.rooms[id].board = this.setBoard(m, n);
        this.rooms[id].m = m;
        this.rooms[id].n = n;
        this.rooms[id].firstPlayer = owner;
        this.rooms[id].secondPlayer = null;
        this.rooms[id].turn = 1;
        return this.rooms[id].id;
    },
    setBoard: function (m, n) {
        var r = new Array(m);
        for(var i = 0; i < m; i++){
            r[i] = new Array(n);
            for(var j = 0; j < n; j++){
                r[i][j] = 0;
            }
        }
        return r;
    },
    move: function (player, x, y, gameId) {
        console.log("%s / %s / %s", this.rooms[gameId].turn, this.rooms[gameId].firstPlayer, player);
        if((this.rooms[gameId].turn == 1 && this.rooms[gameId].firstPlayer == player) || (this.rooms[gameId].turn == 2 && this.rooms[gameId].secondPlayer == player)){
            if(this.rooms[gameId].board[x][y] == 0){
                this.rooms[gameId].board[x][y] = (this.rooms[gameId].turn == 1 ? 1 : 2);
                this.rooms[gameId].turn = (this.rooms[gameId].turn == 1 ? 2 : 1);
                return 1
            }else
                return 2;
        }else
            return 3;

    },
    joinRoom: function (room, player) {
        if(this.rooms[room].firstPlayer != player)
            this.rooms[room].secondPlayer = player;
    }
};
module.exports = {
    rooms: [],
    socket: null,
    setSocket: function (socket) {
        this.socket = socket;
    },
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
        console.log("%s / %s / %s / %s /", player, x, y, gameId);
    },
    joinRoom: function (room, player) {
        if(this.rooms[room].firstPlayer != player)
            this.rooms[room].secondPlayer = player;
    }
};
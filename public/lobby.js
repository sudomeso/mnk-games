var lobby = {
	vue: new Vue({
		el: '#lobby',
		data: {
			gameList: {},
            newGame_m: null,
            newGame_n: null,
            newGame_k: null,
            newGame_id: null
		},
        methods: {
            createGame: function () {
            	lobby.createGame(this.newGame_m, this.newGame_n, this.newGame_k, this.newGame_id);
            },
            joinGame: function (id) {
            	lobby.joinGame(id);
            }
        }
	}),
	obj: document.getElementById('lobby'),
	showLobby: function (){
        game.hideGameElement();
		lobby.obj.style.display = "block";
	},
	hideLobby: function (){
		lobby.obj.style.display = "none";
	},
	createGame: function (m, n, k, id) {
		socket.emit("createRoom", {m: m, n: n, k: k, id: id});
    },
	joinGame: function (id) {
		socket.emit("joinRoom", {gameId: id});
    }
}
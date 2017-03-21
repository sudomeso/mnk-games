var lobby = {
	vue: new Vue({
		el: '#lobby',
		data: {
			gameList: []
		}
	}),
	obj: document.getElementById('lobby'),
	showLobby: function (){
        game.hideGameElement();
		lobby.obj.style.display = "block";
	},
	hideLobby: function (){
		lobby.obj.style.display = "none";
	}
}
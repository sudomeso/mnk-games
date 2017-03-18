var socket = io();

socket.on('joinGame', function(game){

});
socket.on('gameCreated', function (data) {
    game.prepareGame(data.m, data.n, data.k, data.turn, data.sign, data.gameId);
    game.showGameElement();
});
socket.on('move', function (data) {
    switch (data.type){
        case 0:
            console.log("undefined error");
            break;
        case 1:
            game.reciveData(data.gameUpdate);
            break;
        case 2:
            console.log("the field is not empty");
            break;
        case 3:
            console.log("it is not your turn");
            break;
    }
});
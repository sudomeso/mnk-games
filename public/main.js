var socket = io();

socket.on('joinGame', function (game) {

});
socket.on('gameCreated', function (data) {
    game.prepareGame(data.m, data.n, data.k, data.turn, data.sign, data.gameId);
    game.showGameElement();
});
socket.on('move', function (data) {
    game.reciveData(data.gameUpdate);
});
socket.on('gameStarted', function () {
    game.startGame();
    game.log("Game have started!");
});
socket.on('err', function (data) {
    switch (data.id) {
        case 0:
            console.log('Undefined error');
        case 1:
            console.log('This field is not empty');
            break;
        case 2:
            console.log('It is not your turn');
            break;
        case 3:
            console.log('Room does not exist');
            break;
        case 4:
            console.log('Room with the id has already existed');
            break;
    }
});
socket.on('gameFinished', function (data) {
    console.log(data);
    switch (data.winType) {
        case 1:
            game.drawBoardfromReciveData(data);
            game.log((data.win == 1 ? game.signType.WHITE : game.signType.BLACK)+' wins game!');
            game.stopGame();
            break;
        case 2:
            game.drawBoardfromReciveData(data);
            game.log('Remis!');
            game.stopGame();
            break;
    }
});
socket.on('addGameToList', function (data) {
    lobby.gameList.push({id: data.game});
});
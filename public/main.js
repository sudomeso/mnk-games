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
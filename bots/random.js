module.exports = class RandomBot {
	constructor(m, n){
		this.isBot = true;
		this.moves = [];
		this.m = m;
		this.n = n;
		this.generateMoves(m, n);
		console.log(this.moves);
	}
	move(){

	}
	generateMoves(m, n){
		for (let i = 0; i < m; i++) {
            r[i] = new Array(n);
            for (let j = 0; j < n; j++) {
				this.moves.push(i+'.'+j);
            }
        }
	}
};
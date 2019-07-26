
const names = [ "Rock", "Paper", "Scissors" ];

const plays = {
	1: 1,
	2: 0,
	3: 2
};

const score = { 
	'player': 0, 
	'computer': 0,
	'tie': 0
};

const x = [];
const y = [];

let i = 0,
		tmpMove = [],
		middle,
		lastWinner,
		lastMove,
		scoreResults;

const nn = new MLP( 3, 3, 3, 0.1, 300 );

const play = function(player){
	const move = Array(3).fill(0);
	move[player] = 1;
	tmpMove.push( move );
	if( tmpMove.length > 2 ){
		x.push( tmpMove.shift() );
		y.push( tmpMove[0] );
	}
	let computer;
	if( y.length < 3 ){
		computer = Math.floor( Math.random() * 3 );
	}else{
		if( lastWinner !== 'computer' ){ 
			nn.shuffle( x, y );
			nn.fit( x, y );
		}
		let prediction = nn.predict( lastMove ).data;
		computer = (prediction.indexOf(Math.max(...prediction)) + 1) % 3;
	}
	const win = plays[player+computer];
	lastWinner = player === computer || win === undefined ? 'tie' : win === player ? 'player' : 'computer';
	score[lastWinner]++;
	updateScore(player, computer, lastWinner);
	lastMove = move;
}

const updateScore = function(p, c, w){
	for(let player of Object.keys(score) ){
		scoreResults[player].innerHTML = player+"<br>"+score[player];
	}
	middle.innerHTML = names[p]+" x "+names[c]+"<br>"+w;
}

const init = function(){
	const top = document.createElement('div');
	top.className = "row";
	scoreResults = {};
	for(let k of Object.keys( score )){
		let d = document.createElement('div');
		d.innerHTML = k+"<br>&nbsp;";
		scoreResults[k] = d;
		top.appendChild( d ); 
	}
	middle = document.createElement('div');
	middle.className = "row";
	const bottom = document.createElement('div');
	bottom.className = "row";
	for(let i = 0; i < names.length; i++){
		const btn = document.createElement('button');
		btn.innerText = names[i];
		btn.addEventListener('click', ()=>play(i) );
		bottom.appendChild( btn );
	}
	document.body.appendChild( top );
	document.body.appendChild( middle );
	document.body.appendChild( bottom );
}

init();

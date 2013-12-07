var cw = 10;
var dimension = 32;
var thickness = 2;
var offset = thickness / 2;
var canvas, ctx, w, h, xOffset, yOffset; 
var grid = new Array(dimension);
var changes = new Array(dimension);

$(document).ready(function() {
	canvas = $("#canvas")[0];
	ctx = canvas.getContext("2d");
	w = $("#canvas").width();
	h = $("#canvas").height();
	xOffset = $("#canvas").offset().left;
	yOffset = $("#canvas").offset().top;
	ctx.lineWidth = 2;
	ctx.strokeStyle = 'black';
	var i, j;
	
	for (i = 0; i < dimension; i++) {
		grid[i] = new Array(dimension);
		changes[i] = new Array(dimension);
	}

	for (i = 0; i < dimension; i++) {
		for (j = 0; j < dimension; j++) {
			grid[i][j] = false;
			changes[i][j] = false;
		}
	}  

	for (var i = offset; i <= w; i += cw) {
		for (var j = offset; j <= w; j += cw) {
			ctx.strokeRect(i, j, cw, cw);
		}
	}

	$("#canvas").mousedown(function(event) {
		var x = event.pageX - xOffset;
		var y = event.pageY - yOffset;
		var indexX = Math.floor(x / cw);
		var indexY = Math.floor(y / cw);
		changes[indexX][indexY] = !changes[indexX][indexY];
		drawChange(indexX, indexY);
		updateChanges();
	});

	$("#start-game").click(function(event) {
		gameLoop();
		if (typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(gameLoop, 1000);
		$('#start-game').button("disable");
		$("#pause-game").button("enable");
	});
	
	$("#pause-game").click(function(event) {
		clearInterval(game_loop);
		$('#start-game').button("enable");
		$("#pause-game").button("disable");
	});

	$("#gosper-glider-gun").click(function(event) {
		gosperGliderGun();
	});

	function gameLoop() {
		for (i = 0; i < dimension; i++) {
			for (j = 0; j < dimension; j++) {	
					var neighbours = 0;
					// left
					if (i && grid[i - 1][j])
							neighbours++;
					// right
					if (i < 31 && grid[i + 1][j])
							neighbours++;
					// top
					if (j && grid[i][j - 1])
							neighbours++;
					// bottom
					if (j < 31 && grid[i][j + 1])
							neighbours++;
					// top-left
					if ((i && j) && grid[i - 1][j - 1])
							neighbours++;
					// top-right
					if ((i < 31 && j) && grid[i + 1][j - 1])
							neighbours++;
					// bottom-left
					if ((i && j < 31) && grid[i - 1][j + 1])
							neighbours++;
					// bottom-right
					if ((i < 31 && j < 31) && grid[i + 1][j + 1])
							neighbours++;
					
					if (neighbours) {
						//console.log("Neighbours: " + neighbours + " (" + i + ", " + j + ")");
					}

					// Cell has less than 2 neighbours and is alive, becomes dead.
					if (neighbours < 2 && grid[i][j]) {
						changes[i][j] = false;
					}

					// Cell has more than 3 neighbours and is alive, becomes dead.
	 				if (neighbours > 3 && grid[i][j])
						changes[i][j] = false;

					// Cell has exactly 3 neighbours and is dead, becomes alive.
					if (!grid[i][j] && neighbours == 3)
						changes[i][j] = true;
			}
		}  
		drawAllChanges();
		updateChanges();
	}
});

function updateChanges() {
	for (i = 0; i < dimension; i++) {
		for (j = 0; j < dimension; j++) {	
			grid[i][j] = changes[i][j];
		}
	}
}

function drawAllChanges() {
	for (i = 0; i < dimension; i++) {
		for (j = 0; j < dimension; j++) {	
			drawChange(i, j);
		}
	}
}

function drawChange(indexX, indexY) {
	var startX = offset + indexX * cw;
	var startY = offset + indexY * cw;
	if (changes[indexX][indexY]) {
		ctx.fillRect(startX, startY, cw, cw);
	} else {
		ctx.clearRect(startX + offset, startY + offset, cw - thickness, cw - thickness);
	}
}

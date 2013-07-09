var CANVAS_WIDTH = 769; //window.outerWidth; //720;//700;
var CANVAS_HEIGHT = 1279; //window.outerHeight;//1280;//1100;
var TILE_SIZE = 32;
var FPS = 30;
var canvas = false;
var ctx = false;


$(document).ready(function() {
//init canvas
    var ctx = document.createElement("canvas");
    ctx.setAttribute('width',CANVAS_WIDTH);
    ctx.setAttribute('height',CANVAS_HEIGHT);
    var container = document.getElementById("gesture");
    container.appendChild(ctx);
    canvas = ctx.getContext('2d');
//init game
    game.map = mapone;
});




function update() {
    console.log("updating");
    Update_Player_Direction();
    if (Check_Player_Collision()) {
        Update_Player_Location();
    }
    

}

var game = {
}

function draw() {
    canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawMap(game.map);
    player.draw();
}

var player = {
    color: "#0AA",
    direction: "down",
    x: 32,
    y: 32,
    width: 32,
    height: 32,
    speed: 4,
    draw: function () {
        canvas.fillStyle = this.color;
        canvas.fillRect(this.x, this.y, this.width, this.height);
    }
};


var Spawns = {
    frequency: 5,
    color: "#0AA",
}

function Check_Player_Collision() {
    var x = player.x;
    var y = player.y;
    var i;
    var j; 
    switch (player.direction) {
        case "up":
            y = player.y - player.speed;
            i = Math.floor(x/TILE_SIZE);
            j = Math.floor(y/TILE_SIZE);
            if ( game.map[j][i]!=="g") {
                return false;
            }
            x += player.width;
            i = Math.floor(x/TILE_SIZE);
            if ( game.map[j][i]!=="g") {
                return false;
            }
            break;
        case "down":
            y = player.y + player.speed + TILE_SIZE;
            i = Math.floor(x/TILE_SIZE);
            j = Math.floor(y/TILE_SIZE);
            console.log(i + " "+j);
            if ( game.map[j][i]!=="g") {
                return false;
            }
            x += player.width;
            i = Math.floor(x/TILE_SIZE);
            if ( game.map[j][i]!=="g") {
                return false;
            }
            break;
        case "left":
            x = player.x - player.speed;

            i = Math.floor(x/TILE_SIZE);
            j = Math.floor(y/TILE_SIZE);
            if ( game.map[j][i]!=="g") {
                return false;
            }
            y = player.y + player.height;
            i = Math.floor(x/TILE_SIZE);
            if ( game.map[j][i]!=="g") {
                return false;
            }
            break;
        case "right":
            x = player.x + player.speed + TILE_SIZE;
            i = Math.floor(x/TILE_SIZE);
            j = Math.floor(y/TILE_SIZE);
            if ( game.map[j][i]!=="g") {
                return false;
            }
            y = player.y + player.height;
            i = Math.floor(x/TILE_SIZE);
            if ( game.map[j][i]!=="g") {
                return false;
            }
            break;
    }
    switch (player.direction) {
        case "up":
            player.y -= player.speed;
            break;
        case "down":
            player.y += player.speed;
            break;
        case "left":
            player.x -= player.speed;
            break;
        case "right":
            player.x += player.speed;
            break;
    }
}

function Update_Player_Direction() {
    if (keydown.left) {
        player.direction = "left";
    }
    if (keydown.right) {
        player.direction = "right";
    }
    if (keydown.up) {
        player.direction = "up";
    }
    if (keydown.down) {
        player.direction = "down";
    }
}

function Update_Player_Location() {
    switch (player.direction) {
        case "up":
            player.y -= player.speed;
            break;
        case "down":
            player.y += player.speed;
            break;
        case "left":
            player.x -= player.speed;
            break;
        case "right":
            player.x += player.speed;
            break;
    }
}

//]]>

//}
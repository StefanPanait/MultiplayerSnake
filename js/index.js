var CANVAS_WIDTH = window.innerWidth; // 769; //
var CANVAS_HEIGHT = window.innerHeight-1;//1279; //1280;//1100;
var TILE_SIZE = 32;
var FPS = 30;
var canvas = false;
var ctx = false;


/*$(document).ready(function() {
    var ctx = document.createElement("canvas");
    ctx.setAttribute('width',CANVAS_WIDTH);
    ctx.setAttribute('height',CANVAS_HEIGHT);
    var container = document.getElementById("gameCanvas");
    container.appendChild(ctx);
    canvas = ctx.getContext('2d');


//init game
    console.log("init");
    game.map = mapone;
    //Setup_Gesture_Recognition();
   setInterval(function () {
       update();
       draw();
   }, 1000 / FPS);
    console.log("innerHeight is " +CANVAS_WIDTH);
});*/




function update() {
    Process_Movement();
}

var game = {
    map: null,
    spawn_locations: [],
    collision: function(i, j, type) {
        switch (type) {
            case "boundary":
                if ( game.map[j][i]==="b") {
                    return true;
                }
                break;
        }
    }

}

function draw() {
    canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawMap(game.map);
    player.draw();
}

var player = {
    color: "#00A",
    direction: "down",
    x: 32,
    y: 32,
    width: 32,
    height: 32,
    speed: 8,
    draw: function () {
        canvas.fillStyle = this.color;
        canvas.fillRect(this.x, this.y, this.width, this.height);
    }
};


var Spawns = {
    frequency: 5,
    color: "#0AA",
}

function Player_Movement_Allowed() {
    var x = player.x;
    var y = player.y;
    var i;
    var j; 
    switch (player.direction) {
        case "up":
            y = player.y - player.speed;
            i = Math.floor(x/TILE_SIZE);
            j = Math.floor(y/TILE_SIZE);
            if (game.collision(i,j,"boundary") ) { //game.map[j][i]!=="g" && game.map[j][i]!=="y") {
                return false;
            }
            x += player.width-1;
            i = Math.floor(x/TILE_SIZE);
            if ( game.collision(i,j,"boundary") ) {//game.map[j][i]!=="g") {
                return false;
            }
            break;
        case "down":
            y = player.y + player.speed + TILE_SIZE -1;
            i = Math.floor(x/TILE_SIZE);
            j = Math.floor(y/TILE_SIZE);
            if ( game.collision(i,j,"boundary") ) {//game.map[j][i]!=="g") {
                return false;
            }
            x += player.width-1;
            i = Math.floor(x/TILE_SIZE);
            if ( game.collision(i,j,"boundary") ) {//game.map[j][i]!=="g") {
                return false;
            }
            break;
        case "left":
            x = player.x - player.speed;
            i = Math.floor(x/TILE_SIZE);
            j = Math.floor(y/TILE_SIZE);
            if ( game.collision(i,j,"boundary") ) {// game.map[j][i]!=="g") {
                return false;
            }
            y = player.y + player.height-1;
            j = Math.floor(y/TILE_SIZE);
            if ( game.collision(i,j,"boundary") ) {// game.map[j][i]!=="g") {
                return false;
            }
            break;
        case "right":
            x = player.x + player.speed + TILE_SIZE-1;
            i = Math.floor(x/TILE_SIZE);
            j = Math.floor(y/TILE_SIZE);
            if ( game.collision(i,j,"boundary") ) {//game.map[j][i]!=="g") {
                return false;
            }
            y = player.y + player.height-1;
            j = Math.floor(y/TILE_SIZE);
            if ( game.collision(i,j,"boundary") ) {//game.map[j][i]!=="g") {
                return false;
            }
            break;
    }
    return true;
}

function Player_Update_Direction() {
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

function Player_Update_Location() {
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

function Process_Movement(){
    Player_Update_Direction();
    if (Player_Movement_Allowed()) {
        Player_Update_Location();
    }
}

function Load_Map_Spawns() {

   var tile;

   var i, j;   // the x and y loop variables
   for(i=0; i<game.map.length; i++)
   {
      for(j=0; j<game.map[i].length; j++)
      {
         tile = mapData[i][j];   // get the tile, ie. 'r' or 'g'
         drawTile(j, i, tile);
      }
   }

}
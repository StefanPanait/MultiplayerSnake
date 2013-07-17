/*/
b = black - out of bounds
g = green - in bounds
y = yellow - points
map design: points only accessible to short tails

*/
var mapone =
[
   ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b'],
   ['b', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'b'],
   ['b', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'b'],
   ['b', 'g', 'g', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'g', 'g', 'b', 'g', 'g', 'b', 'y', 'g', 'g', 'g', 'g', 'g', 'g', 'b'],
   ['b', 'g', 'g', 'b', 'y', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'b', 'g', 'g', 'g', 'b', 'g', 'g', 'g', 'g', 'g', 'g', 'b'],
   ['b', 'g', 'g', 'b', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'b', 'g', 'g', 'g', 'g', 'b', 'g', 'g', 'g', 'g', 'g', 'b'],
   ['b', 'g', 'g', 'b', 'g', 'g', 'b', 'b', 'g', 'g', 'g', 'g', 'b', 'g', 'g', 'g', 'g', 'g', 'b', 'g', 'g', 'g', 'g', 'b'],
   ['b', 'g', 'g', 'b', 'g', 'g', 'b', 'b', 'g', 'g', 'g', 'g', 'b', 'g', 'g', 'g', 'g', 'g', 'g', 'b', 'g', 'g', 'g', 'b'],
   ['b', 'g', 'g', 'b', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'y', 'b', 'y', 'g', 'g', 'g', 'g', 'g', 'g', 'b', 'g', 'g', 'b'],
   ['b', 'g', 'g', 'b', 'g', 'g', 'g', 'g', 'g', 'g', 'b', 'b', 'b', 'b', 'b', 'g', 'g', 'g', 'g', 'g', 'y', 'b', 'g', 'b'],
   ['b', 'g', 'g', 'b', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'b'],
   ['b', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'b'],
   ['b', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'b'],
   ['b', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'b'],
   ['b', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'b'],
   ['b', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'b'],
   ['b', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'b', 'b', 'g', 'y', 'b', 'b', 'y', 'g', 'b', 'b', 'g', 'g', 'g', 'b'],
   ['b', 'g', 'g', 'g', 'g', 'b', 'b', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'b'],
   ['b', 'g', 'g', 'g', 'g', 'y', 'b', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'b'],
   ['b', 'g', 'g', 'b', 'b', 'g', 'b', 'g', 'g', 'g', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'g', 'g', 'g', 'b'],
   ['b', 'g', 'g', 'g', 'g', 'g', 'b', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'b'],
   ['b', 'g', 'g', 'g', 'g', 'g', 'b', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'b'],
   ['b', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'b', 'b', 'y', 'g', 'b', 'b', 'g', 'y', 'b', 'b', 'g', 'g', 'g', 'b'],
   ['b', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'b'],
   ['b', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'b'],
   ['b', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'b'],
   ['b', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'b'],
   ['b', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'b', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'b'],
   ['b', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'b', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'b'],
   ['b', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'b', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'b', 'g', 'b', 'g', 'b'],
   ['b', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'y', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'b', 'g', 'g', 'b', 'g', 'b'],
   ['b', 'g', 'g', 'b', 'g', 'g', 'g', 'b', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'b', 'g', 'g', 'b', 'g', 'b'],
   ['b', 'g', 'g', 'g', 'b', 'g', 'b', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'b', 'g', 'g', 'b', 'g', 'b'],
   ['b', 'g', 'g', 'g', 'g', 'y', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'b', 'r', 'g', 'b', 'g', 'b'],
   ['b', 'g', 'g', 'g', 'b', 'g', 'b', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'b', 'b', 'g', 'g', 'b'],
   ['b', 'g', 'g', 'b', 'g', 'g', 'g', 'b', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'b'],
   ['b', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'b'],
   ['b', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'b'],
   ['b', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'b'],
   ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b']
];

function drawMap(mapData) {

   var tile;

   var i, j;   // the x and y loop variables
   for(i=0; i<mapData.length; i++)
   {
      for(j=0; j<mapData[i].length; j++)
      {
         tile = mapData[i][j];   // get the tile, ie. 'r' or 'g'
         drawTile(j, i, tile);
      }
   }

}

function drawTile(i, j, tile) {
	var color;

	switch (tile) {
		case "b":
			color = "#000";
			break;
		case "g":
			color = "#78AB46";
			break;
    case "y":
      color = "#FFFF00";
      break;
    case "r":
      color = "#FF0000";
      break;
 	}

    canvas.fillStyle = color;
    canvas.fillRect(i*TILE_SIZE, j*TILE_SIZE, TILE_SIZE, TILE_SIZE);

}

//setup all gestures
function Setup_Gesture_Recognition() {
    var screen = new Hammer(document.getElementById("gesture"), {});
    console.log("screen1: "+screen);
    screen.ondoubletap = function(ev) {
        console.log("shit doesn't works bro");
    }
    screen.onswiperight = function(ev) {
        console.log("shit doesn't works bro");
        player.direction = "right";
    }
}
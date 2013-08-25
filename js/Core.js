//setup all gestures

function Setup_Gesture_Recognition() {
    var screen = new Hammer(document.getElementById("gameCanvas"), {
      hold_timeout: 500
    });

    console.log("setup gesture");
    screen.ondoubletap = function (ev) {
        _g.snake.player.ndirection=4;
    }
    screen.ondragright = function (ev) {
        _g.snake.player.ndirection = 2;
    }
    screen.ondragleft = function (ev) {
        _g.snake.player.ndirection = 1;
    }
    screen.onswipeup = function (ev) {
        _g.snake.player.ndirection = 3;
    }
    screen.onswipedown = function (ev) {
        _g.snake.player.ndirection = 4;
    }

}
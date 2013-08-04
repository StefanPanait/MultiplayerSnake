var _g = {
    snake: null
};

var Snake = cc.Layer.extend({

    physics: null,
    background: null,
    player: null,
    points: null,

    init:function()
    {
        var tmx, n;
        this._super();

        this.setKeyboardEnabled(true);

        tmx = cc.TMXTiledMap.create('Maps/Level_One.xml');
        this.physics = new Worker('js/Box2dWebWorker.js');
        this.physics.addEventListener('message', function (e) {
            //console.log(e.data.msg);
            if (e.data.player) {
               // console.log(e.data.player.x);
                /* If player data exists, update our position and rotation. */
/*                _g.snake.player.setPosition(new cc.Point(
                    e.data.player.x,
                    e.data.player.y
                ));*/
                //_g.snake.player.setRotation(e.data.player.r / (Math.PI * 2.0) * 360.0);
            } else if (e.data.msg === 'remove') {
            /* If we need to remove sprites (i.e. player ran into a coin), update our counter. */
                
                console.log("stuck");

                _g.snake.removeChild(_g.snake.points.sprites[e.data.index]);
                _g.snake.points.sprites[e.data.index] = null;
                
                console.log("stuck");

                var newLocation = NewBodyLocation();
                console.log("new location : "+ newLocation.x + ": " + newLocation.y);
                _g.snake.player.body.push(cc.Sprite.create('Maps/tmw_desert_spacing.png', new cc.Rect(224+8, 160+6, 32.0, 32.0)));
                _g.snake.player.body[_g.snake.player.body.length-1].setPosition(
                    new cc.Point(
                        newLocation.x,
                        newLocation.y
                    )
                );
                
                console.log("axis is : " + newLocation.axis);

                _g.snake.addChild(_g.snake.player.body[_g.snake.player.body.length-1], 2);
                _g.snake.player.body[_g.snake.player.body.length-1].movement = [];
                _g.snake.player.body[_g.snake.player.body.length-1].movement.push({axis:newLocation.axis,amount:newLocation.amount});

                console.log("stuck");

            } else if (e.data.msg === 'wallb' ) {
                console.log("wallb");
            } else if (e.data.msg === 'walla') {
                console.log("walla");
            } else if (e.data.msg === 'no prob') {
                _g.snake.player.cx = _g.snake.player.nx;
                _g.snake.player.cy = _g.snake.player.ny;
                _g.snake.player.setPosition(new cc.Point(
                    _g.snake.player.cx,
                    _g.snake.player.cy
                ));
                if (_g.snake.player.body.length>0){
                    _g.snake.player.body[0].movement.push(GetHeadMovement());
                }
                for (var i = 0; i<_g.snake.player.body.length;i++){
                    console.log("traversing body");
                    var movementAllowed = _g.snake.player.speed;
                    var movementRequired;
                    var movementDone;
                    var currentPosition;
                    var body = _g.snake.player.body[i];

                    while (movementAllowed!=0) {
                        console.log("stuck in here");
                        var axis = body.movement[0].axis;
                        var amount = body.movement[0].amount;
                        var signMultiplier = 1;

                        console.log("axis is: " + axis);
                        if (axis==="x") { //movement goal is on x axies
                            console.log("axis is x");
                            if (body.getPosition().x>amount) { // moving positive or negative x values
                                signMultiplier = -1;
                            }
                            movementRequired = Math.abs(amount - body.getPosition().x); // how much do we need to move

                            if (movementRequired > movementAllowed) { // if we need to move more than we allowed, only move the amount we are allowed
                                movementDone = movementAllowed * signMultiplier;
                                movementAllowed = 0; // we've done all the movement we're allowed
                            } else {
                                movementDone = movementRequired * signMultiplier; //otherwise move amount we need 
                                movementAllowed = movementAllowed - movementRequired; //update movementAllowed
                                body.movement.splice(0,1); //remove the current goal, because we moved the required amount means that we met the goal!
                            }
                            //perform the actual movement
                            body.setPosition( 
                                new cc.Point
                                    (
                                    body.getPosition().x + movementDone,
                                    body.getPosition().y
                                    )
                            );
                            currentPosition = body.getPosition().x;
                            if (i+1!=_g.snake.player.body.length) { //there exists another body after this one
                                 _g.snake.player.body[i+1].movement.push(
                                 {
                                    axis: "x",
                                    amount: currentPosition
                                 })
                            }
                        } else if (axis==="y") {
                            console.log("axis is y");
                            if (body.getPosition().y>amount) { // moving positive or negative x values
                                signMultiplier = -1;
                            }
                            movementRequired = Math.abs(amount - body.getPosition().y); // how much do we need to move

                            if (movementRequired > movementAllowed) { // if we need to move more than we allowed, only move the amount we are allowed
                                movementDone = movementAllowed * signMultiplier;
                                movementAllowed = 0;
                            } else {
                                movementDone = movementRequired * signMultiplier; //otherwise move amount we need 
                                movementAllowed = movementAllowed - movementRequired; //update movementAllowed
                                body.movement.splice(0,1); //remove the current goal, because we moved the required amount means that we met the goal!
                            }
                            //perform the actual movement
                            body.setPosition( 
                                new cc.Point
                                    (
                                    body.getPosition().x,
                                    body.getPosition().y + movementDone
                                    )
                            );
                            currentPosition = body.getPosition().y;
                            if (i+1!=_g.snake.player.body.length) { //there exists another body after this one
                                 _g.snake.player.body[i+1].movement.push(
                                 {
                                    axis: "y",
                                    amount: currentPosition
                                 })
                            }

                        }
                        movementAllowed=0;
                    }
                }
            }
                           // console.log(_g.snake.player.x + " : " + _g.snake.player.y);
        });
        _g.snake = this;
        this.setKeyboardEnabled(true);

        this.physics.postMessage({
            msg: 'init',
            walls: tmx.getObjectGroup('Walls').getObjects(),
            points: tmx.getObjectGroup('Points').getObjects(),
            startPoints: tmx.getObjectGroup('StartPoints').getObjects()
        });

        this.background = cc.Sprite.create('Maps/Level_One.png');
        this.background.setAnchorPoint(new cc.Point(0.0, 0.0));
        this.background.setPosition(new cc.Point(0.0, 0.0));
        this.addChild(this.background, 0);

        var startPoints = tmx.getObjectGroup('StartPoints').getObjects();

        this.player = cc.Sprite.create('Maps/tmw_desert_spacing.png', new cc.Rect(224+8 +1, 160+6 +1, 31.0, 31.0));
       // this.player.setAnchorPoint(new cc.Point(0.5, 0.5));
        this.player.setPosition(new cc.Point(((startPoints[0].x+1) + 30 / 2.0), ((startPoints[0].y+1) + 30 / 2.0)));
        this.player.cx = ((startPoints[0].x+1) + 30 / 2.0);
        this.player.cy = ((startPoints[0].y+1) + 30 / 2.0);
        console.log("starting location:  " +this.player.cx +":"+this.player.cy +"startPoint y:"+startPoints[0].y);
        this.player.nx;
        this.player.ny;
        this.player.speed = 2;
        this.player.j = []; /* Will hold the impulse force acting on the player. */
        this.player.cdirection = 1;
        this.player.ndirection = 1;
        this.player.body = [];
        this.addChild(this.player, 3);
        console.log("starting location:  " +this.player.getPosition().x +":"+this.player.getPosition().y);

        /* Load the points. */
        this.points = tmx.getObjectGroup('Points').getObjects();
        this.points.sprites = [];
        for (n = 0; n < this.points.length; n = n + 1) {

            this.points.sprites.push(cc.Sprite.create('Maps/tmw_desert_spacing.png', new cc.Rect(224+8, 160+6, 32.0, 32.0)));
            this.points.sprites[n].setPosition(
                new cc.Point(
                    this.points[n].x + this.points[n].width / 2.0,
                    this.points[n].y + this.points[n].height / 2.0
                )
            );
            this.addChild(this.points.sprites[n], 2);
        }
        this.points.sprites.count = this.points.sprites.length;


        this.schedule(this.update);


        return true;
    },
    onKeyDown: function (e) {
       // console.log((Math.round(this.player.getPosition().x)-16));
      //  console.log((Math.round(this.player.getPosition().y)-16));

            

            if (e === 37) {             //left
                 _g.snake.player.ndirection = 1;
             } else if (e === 39) { //right
                 _g.snake.player.ndirection = 2;
             } else if (e === 38) { //up
                 _g.snake.player.ndirection = 3;
             } else if (e === 40) { //down
                 _g.snake.player.ndirection = 4;
             }
      //  }
    },
    update: function () {
    if (((this.player.cx-16)%32===0) &&((this.player.cy-16)%32===0)) {
        this.player.cdirection = this.player.ndirection;
      }
      //this.player.cdirection = this.player.ndirection;
        //console.log("current location: "+ this.player.cx + " : " + this.player.cy );
        switch (_g.snake.player.cdirection) {
            case 1:
                this.player.nx = this.player.cx - this.player.speed;
                this.player.ny = this.player.cy;
                break;
            case 2:
                this.player.nx = this.player.cx + this.player.speed;
                this.player.ny = this.player.cy;
                break;
            case 3:
                this.player.nx = this.player.cx;
                this.player.ny = this.player.cy + this.player.speed;
                break;
            case 4:
                this.player.nx = this.player.cx;
                this.player.ny = this.player.cy - this.player.speed;
                break;
        }


        this.physics.postMessage({
            msg: 'ApplyImpulse',
            j: this.player.j,
            x: this.player.nx,
            y: this.player.ny
        });
    }

});

var SnakeScene = cc.Scene.extend({
    onEnter:function(){
        this._super();
        var layer = new Snake();
        layer.init();
        this.addChild(layer);
    }
})

function NewBodyLocation() {
    var cx, cy, nx, ny, axis, amount;
    if (_g.snake.player.body.length === 0 ) {
        cx = _g.snake.player.cx;
        cy = _g.snake.player.cy;
    } else {
        cx = _g.snake.player.body[_g.snake.player.body.length-1].getPosition().x;
        cy = _g.snake.player.body[_g.snake.player.body.length-1].getPosition().y;
    }
    switch (_g.snake.player.cdirection) {
        case 1:
            nx = cx + 30;
            ny = cy;
            axis = "x";
            amount = cx;
            break;
        case 2:
            nx = cx - 30;
            ny = cy;
            axis = "x";
            amount = cx;
            break;
        case 3:
            nx = cx;
            ny = cy - 30;
            axis = "y";
            amount = cy;
            break;
        case 4:
            nx = cx;
            ny = cy + 30;
            axis = "y";
            amount = cy;
            break;
    }
    return {x:nx,y:ny, axis: axis, amount: amount}
}

function GetHeadMovement() {
    var axis, amount;
    switch (_g.snake.player.cdirection) {
        case 1:
            axis = "x";
            amount = _g.snake.player.cx;
            break;
        case 2:
            axis = "x";
            amount = _g.snake.player.cx;
            break;
        case 3:
            axis = "y";
            amount = _g.snake.player.cy;
            break;
        case 4:
            axis = "y";
            amount = _g.snake.player.cy;
            break;
    }
    console.log(axis)
    return {axis: axis , amount: amount}
}
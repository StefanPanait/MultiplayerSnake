var _g = {
    snake: null
};

var Snake = cc.Layer.extend({
    freewill: null,
    physics: null,
    background: null,
    player: null,
    points: null,
    score: null,
    label_Score: null,
    timer: 0,
    label_Timer: null,
    collision_Timer: 0,
    fps: 30,
    menuLayer:null,

    init:function()
    {
        var tmx, n;
        this._super();
        this.setKeyboardEnabled(true);
        tmx = cc.TMXTiledMap.create('Maps/'+GameSettings.mapName+'.tmx');

        this.physics = new Worker('js/Box2dWebWorker.js');
        this.physics.addEventListener('message', function (e) {
            if (e.data.msg === 'remove') { //remove point from map
                if(GameSettings.sound) {
                    cc.AudioEngine.getInstance().playEffect('sound/point.mp3');
                }
                //update score
                _g.snake.score += +_g.snake.points.sprites[e.data.index].points * _g.snake.player.body.length;
                _g.snake.label_Score.setString("Score: "+_g.snake.score);
                //update speed
                if (_g.snake.points.sprites[e.data.index].speed==="increase") {
                    GameSettings.IncrementSpeed();
                    _g.snake.player.newSpeed =  GameSettings.GetSpeed();
                }
                if (_g.snake.points.sprites[e.data.index].speed==="decrease") {
                    GameSettings.DecrementSpeed();
                    _g.snake.player.newSpeed =  GameSettings.GetSpeed();
                }

                _g.snake.removeChild(_g.snake.points.sprites[e.data.index]);
                _g.snake.points.sprites[e.data.index] = null;

                var newLocation = NewBodyLocation();
                _g.snake.player.body.push(cc.Sprite.create('images/snakebody.png'));
                _g.snake.player.body[_g.snake.player.body.length-1].setPosition(
                    new cc.Point(
                        newLocation.x,
                        newLocation.y
                    )
                );
                _g.snake.addChild(_g.snake.player.body[_g.snake.player.body.length-1], 2);
                _g.snake.player.body[_g.snake.player.body.length-1].movement = [];
                _g.snake.player.body[_g.snake.player.body.length-1].movement.push({axis:newLocation.axis,amount:newLocation.amount});
                _g.snake.player.bodyLocations.push({x:newLocation.x,y:newLocation.y});

            } else if (e.data.msg === 'no prob') {
                _g.snake.collision_Timer = 0;
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

                    var movementAllowed = _g.snake.player.speed;
                    var movementRequired;
                    var movementDone;
                    var currentPosition;
                    var body = _g.snake.player.body[i];

                    while (movementAllowed!=0) {

                        var axis = body.movement[0].axis;
                        var amount = body.movement[0].amount;
                        var signMultiplier = 1;


                        if (axis==="x") { //movement goal is on x axies
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
                    }
                    _g.snake.player.bodyLocations[i].x = body.getPosition().x;
                    _g.snake.player.bodyLocations[i].y = body.getPosition().y;
    
                }
            }

        });
        _g.snake = this;
        this.setKeyboardEnabled(true);

        this.physics.postMessage({
            msg: 'init',
            walls: tmx.getObjectGroup('Walls').getObjects(),
            points: tmx.getObjectGroup('Points').getObjects(),
            startPoints: tmx.getObjectGroup('StartPoints').getObjects()
        });

        this.background = cc.Sprite.create('Maps/'+GameSettings.mapName+'.png');
        this.background.setAnchorPoint(new cc.Point(0.0, 0.0));
        this.background.setPosition(new cc.Point(0.0, 0.0));
        this.addChild(this.background, 0);

        var startPoints = tmx.getObjectGroup('StartPoints').getObjects();

        this.player = cc.Sprite.create('images/snakehead.png');
       // this.player.setAnchorPoint(new cc.Point(0.5, 0.5));
        this.player.setPosition(new cc.Point(((startPoints[0].x+1) + 30 / 2.0), ((startPoints[0].y+1) + 30 / 2.0)));
        this.player.cx = ((startPoints[0].x+1) + 30 / 2.0);
        this.player.cy = ((startPoints[0].y+1) + 30 / 2.0);
        this.player.nx;
        this.player.ny;
        GameSettings.SetSpeed(0);
        this.player.speed = GameSettings.GetSpeed();
        this.player.newSpeed = GameSettings.GetSpeed();
        this.player.cdirection = 2;
        this.player.ndirection = 2;
        this.player.body = [];
        this.player.bodyLocations = [];
        this.addChild(this.player, 3);

        /* Load the points. */
        this.points = tmx.getObjectGroup('Points').getObjects();
        this.points.sprites = [];
        for (n = 0; n < this.points.length; n = n + 1) {
            var sprite = cc.Sprite.create('images/rabbit_points_01.png');
            sprite.points = this.points[n].points;
            if (this.points[n].speed) {
                sprite.speed = this.points[n].speed;
            }
            if (this.points[n].duration) {
                sprite.duration = this.points[n].duration;
            }
            if (this.points[n].removebody) {
                sprite.removebody = this.points[n].removebody;
            }
            this.points.sprites.push(sprite);
            this.points.sprites[n].setPosition(
                new cc.Point(
                    this.points[n].x + this.points[n].width / 2.0,
                    this.points[n].y + this.points[n].height / 2.0
                )
            );
            this.addChild(this.points.sprites[n], 2);
        }
        this.points.sprites.count = this.points.sprites.length;

        /* Display Score */
        this.label_Score = cc.LabelTTF.create("Score: 0", "Arial", 30);
        this.label_Score.setPosition(new cc.Point(window.innerWidth*.1,window.innerHeight*.1));
        this.label_Score.setColor(new cc.Color3B(0,34,102));
        this.addChild(this.label_Score,5);

        /* Display Timer */
        this.label_Timer = cc.LabelTTF.create("Time: 0", "Arial", 30);
        this.label_Timer.setPosition(new cc.Point(window.innerWidth*.1,window.innerHeight*.05));
        this.label_Timer.setColor(new cc.Color3B(84,84,84));
        this.addChild(this.label_Timer);



        /* Controls */
        var btn_up = new cc.MenuItemImage.create('images/btn_up.png','images/btn_up.png', this.MoveUp, this);
        btn_up.setPosition(new cc.Point(window.innerWidth*.5,window.innerHeight*.12));

        var btn_down = new cc.MenuItemImage.create('images/btn_down.png','images/btn_down.png', this.MoveDown, this);
        btn_down.setPosition(new cc.Point(window.innerWidth*.5,window.innerHeight*.04));

        var btn_left = new cc.MenuItemImage.create('images/btn_left.png','images/btn_left.png', this.MoveLeft, this);
        btn_left.setPosition(new cc.Point(window.innerWidth*.35,window.innerHeight*.09));

        var btn_right = new cc.MenuItemImage.create('images/btn_right.png','images/btn_right.png', this.MoveRight, this);
        btn_right.setPosition(new cc.Point(window.innerWidth*.65,window.innerHeight*.085));

        var menu = new cc.MenuItemImage.create('images/btn_menu.png','images/btn_pressed_menu.png', this.OpenMenu, this);
        menu.setPosition(new cc.Point(window.innerWidth*.85,window.innerHeight*.03));

        var menu = cc.Menu.create(menu);
        menu.setPosition(new cc.Point(0,0));
        this.addChild(menu,2);

        /*Setup Gestures */
        var controls = document.getElementById("freewill");

        if (this.freewill===null) {
            this.freewill = new Freewill({
                container: freewill  
            });
     
            var joystick = this.freewill.move = this.freewill.addJoystick({
                imageBase: 'images/freewill/dpad.png',
                imagePad: 'images/freewill/pad.png',
                fixed: true,
                pos: [window.innerWidth*.4,window.innerHeight*.86],
                opacLow: 80.0
            });

            this.freewill.move.onTouchMove = function () {
                if (this.direction === 0) {
                    _g.snake.player.ndirection = 1;
                }
                if (this.direction === 4) {
                    _g.snake.player.ndirection = 2;
                }
                if (this.direction === 2) {
                    _g.snake.player.ndirection = 4;
                }
                if (this.direction === 6) {
                    _g.snake.player.ndirection = 3;
                }
            };
        } else {
            controls.style.visibility="visible";
        }

        /* Setup Schedule */
        this.schedule(this.update);

        this.OpenGoalScreen();

        return true;
    },
    onKeyDown: function (e) {
            if (e === 37) {         //left
                    _g.snake.player.ndirection = 1;
             } else if (e === 39) { //right
                    _g.snake.player.ndirection = 2;
             } else if (e === 38) { //up
                    _g.snake.player.ndirection = 3;
             } else if (e === 40) { //down
                    _g.snake.player.ndirection = 4;
             }
    },
    update: function () {
    //timer
    // this.setScale(2,2);
    // this.setPosition(-(this.player.cx-(window.innerWidth/2)),-(this.player.cy-window.innerHeight/2));
    this.timer++;
    if (this.timer%GameSettings.fps===0) {
        this.label_Timer.setString("Time: "+this.timer/GameSettings.fps);
        //game has ended
        if (this.timer/GameSettings.fps===GameSettings.endTimer) {
            GameOverLayer();
        }
    }

    //collision for too long
    if (this.collision_Timer===GameSettings.fps) {
        GameOverLayer();
    }
    this.collision_Timer ++;

    //direction
    if (((this.player.cx-16)%32===0) &&((this.player.cy-16)%32===0)) {
        this.player.cdirection = this.player.ndirection;
        this.player.speed = this.player.newSpeed;
      }
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
        this.player.nx = Math.round(this.player.nx*10)/10;
        this.player.ny = Math.round(this.player.ny*10)/10;
        this.physics.postMessage({
            msg: 'ApplyImpulse',
            x: this.player.nx,
            y: this.player.ny,
            body: this.player.bodyLocations,
            direction: this.player.cdirection
        });
    },
    MoveUp: function () {
        _g.snake.player.ndirection = 3;
    },
    MoveDown: function () {
        _g.snake.player.ndirection = 4;
    },
    MoveLeft: function () {
        _g.snake.player.ndirection = 1;
    },
    MoveRight: function () {
        _g.snake.player.ndirection = 2;
    },
    OpenMenu: function () {
        //pause game
        _g.snake.pauseSchedulerAndActions();

        var controls = document.getElementById("freewill");
        controls.style.visibility="hidden";
        //create new layer
        _g.snake.menuLayer = cc.Layer.create();

        var menuBackground = cc.Sprite.create('images/layer_gameover.png');
        menuBackground.setPosition(window.innerWidth*.5,window.innerHeight*.5);
        _g.snake.menuLayer.addChild(menuBackground);

        var btn_Resume = new cc.MenuItemImage.create('images/btn_resume.png','images/btn_pressed_resume.png', this.Resume, this);
        btn_Resume.setPosition(new cc.Point(window.innerWidth*.5,window.innerHeight*.50));

        var btn_quit = new cc.MenuItemImage.create('images/btn_quit.png','images/btn_pressed_quit.png', this.Quit, this);
        btn_quit.setPosition(new cc.Point(window.innerWidth*.5,window.innerHeight*.45));

        var offbutton = cc.MenuItemImage.create("images/btn_off_sound.png");
        var onbutton = cc.MenuItemImage.create("images/btn_on_sound.png");
        if (GameSettings.sound) {
            var toggler = new cc.MenuItemToggle.create(onbutton);
            toggler.addSubItem(offbutton);
        } else {
            var toggler = new cc.MenuItemToggle.create(offbutton);
            toggler.addSubItem(onbutton);
        }

        toggler.setTarget(this.ToggleSound, this);
        toggler.setPosition(new cc.Point(window.innerWidth*.75  ,window.innerHeight*.45));

        var menu = cc.Menu.create(btn_Resume,btn_quit,toggler);
        menu.setPosition(new cc.Point(0,0));
        _g.snake.menuLayer.addChild(menu);


        _g.snake.addChild(_g.snake.menuLayer,3);
        },
    Resume: function () {
        _g.snake.removeChild(_g.snake.menuLayer);
        var controls = document.getElementById("freewill");
        controls.style.visibility="visible";
        _g.snake.resumeSchedulerAndActions();
    },
    Quit: function () {
        var scene = cc.Scene.create();
        var menuLayer = Menu.layer();
        scene.addChild(menuLayer);
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
    },
    ToggleSound: function () {
        GameSettings.ToggleSound();
    },
    OpenGoalScreen: function () {   //pause game
        var controls = document.getElementById("freewill");
        controls.style.visibility="hidden";
        //create new layer
        _g.snake.menuLayer = cc.Layer.create();

        var menuBackground = cc.Sprite.create('images/layer_gameover.png');
        menuBackground.setPosition(window.innerWidth*.5,window.innerHeight*.5);
        _g.snake.menuLayer.addChild(menuBackground);

        var btn_Resume = new cc.MenuItemImage.create('images/btn_resume.png','images/btn_pressed_resume.png', this.Resume, this);
        btn_Resume.setPosition(new cc.Point(window.innerWidth*.5,window.innerHeight*.50));

        var label_Goal = cc.LabelTTF.create("GOAL is 1000 points!", "Arial", 30);
        label_Goal.setPosition(new cc.Point(window.innerWidth*.1,window.innerHeight*.1));
        label_Goal.setColor(new cc.Color3B(0,34,102));
        _g.snake.menuLayer.addChild(this.label_Score,5);

        var offbutton = cc.MenuItemImage.create("images/btn_off_sound.png");
        var onbutton = cc.MenuItemImage.create("images/btn_on_sound.png");
        if (GameSettings.sound) {
            var toggler = new cc.MenuItemToggle.create(onbutton);
            toggler.addSubItem(offbutton);
        } else {
            var toggler = new cc.MenuItemToggle.create(offbutton);
            toggler.addSubItem(onbutton);
        }

        toggler.setTarget(this.ToggleSound, this);
        toggler.setPosition(new cc.Point(window.innerWidth*.75  ,window.innerHeight*.45));

        var menu = cc.Menu.create(btn_Resume,toggler);
        menu.setPosition(new cc.Point(0,0));
        _g.snake.menuLayer.addChild(menu);


        _g.snake.addChild(_g.snake.menuLayer,3);
        },

});

Snake.layer = function () {
    var sg = new Snake();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};



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
    return {axis: axis , amount: amount}
}

function GameOverLayer() {
    //stop all actions
    _g.snake.pauseSchedulerAndActions();
    //create end game layer

    var controls = document.getElementById("freewill");
    controls.style.visibility="hidden";

    var endGameLayer = cc.Sprite.create('images/layer_gameover.png');
    endGameLayer.setPosition(window.innerWidth*.5,window.innerHeight*.5);
    _g.snake.addChild(endGameLayer,3);

    //create menu
    var btn_Continue = new cc.MenuItemImage.create('images/btn_continue.png','images/btn_pressed_continue.png', ContinueToMenu, this);
    btn_Continue.setPosition(new cc.Point(window.innerWidth*.5,window.innerHeight*.42));
    var menu = cc.Menu.create(btn_Continue);
    menu.setPosition(new cc.Point(0,0));
    _g.snake.addChild(menu,3);

    //why did the game end
    var endGameString;
    if (_g.snake.timer/GameSettings.fps === GameSettings.endTimer) {
        endGameString = "Time Over!";
    } else {
        endGameString = "Collision!";
    }
    var endGameLabel = cc.LabelTTF.create(endGameString, "Arial", 50);
    endGameLabel.setPosition(new cc.Point(window.innerWidth*.5,window.innerHeight*.50));
    endGameLabel.setColor(new cc.Color3B(165,42,42));
    _g.snake.addChild(endGameLabel,3);

    //display score
    _g.snake.label_Score.setPosition(new cc.Point(window.innerWidth*.5,window.innerHeight*.46));
    _g.snake.label_Score.setColor(new cc.Color3B(165,42,42));



}
function ContinueToMenu() {
    var scene = cc.Scene.create();
    var menuLayer = Menu.layer();
    scene.addChild(menuLayer);
    cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
}

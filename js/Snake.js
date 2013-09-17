var _g = {
    snake: null
};

var Snake = cc.Layer.extend({
    physics: null,
    background: null,
    player: null,
    points: null,
    score: 0,
    label_Score: null,
    label_Speed: null,
    label_Multiplier: null,
    label_CollisionBuffer: null,
    timer: 0,
    label_Timer: null,
    collision_Timer: 0,
    fps: 30,
    menuLayer: null,
    menuLayerExists: false,
    schedulerSetup: false,
    spriteLocations: [],
    spriteSpawnTimer: 0,
    pointToAdd: null,
    scoreMultiplier: 1,
    collisionBuffer: 0,
    lastPointGained: null,
    bonusAvailable: null,
    shakeToggler: null,
    speedupAvailable: null,
    init: function () {
        var tmx, n;
        this._super();
        this.setKeyboardEnabled(true);
        tmx = cc.TMXTiledMap.create('Maps/' + GameSettings.mapName + '.tmx');

        this.physics = new Worker('js/Box2dWebWorker.js');
        this.physics.addEventListener('message', function (e) {
            if (e.data.msg === 'remove') { //remove point from map
                if (GameSettings.sound) {
                    cc.AudioEngine.getInstance().playEffect('sound/crunch.mp3');
                }
                //update score
                _g.snake.score = _g.snake.score + 10*_g.snake.scoreMultiplier;
                //+_g.snake.points.sprites[e.data.index].points * _g.snake.player.body.length;
                _g.snake.label_Score.setString("Score: " + _g.snake.score);
                //update speed
                if (_g.snake.points.sprites[e.data.index].speed === "increase") {
                    console.log("speed up");
                    _g.snake.speedupAvailable++;
                    if (_g.snake.speedupAvailable===3) {
                        GameSettings.IncrementSpeed();
                        _g.snake.player.newSpeed = GameSettings.GetSpeed();
                        _g.snake.speedupAvailable= 0;
                    }
                    if (_g.snake.bonusAvailable===-1) {
                        _g.snake.bonusAvailable = 0;
                        _g.snake.shakeToggler.activate();
                        _g.snake.shakeToggler.setEnabled(false);
                    }
                    if (_g.snake.lastPointGained===2) {
                        _g.snake.bonusAvailable++;
                    } else {
                        _g.snake.bonusAvailable = 0;
                    }
                    _g.snake.lastPointGained = 2;

                }
                if (_g.snake.points.sprites[e.data.index].multiplier === "increase") {
                    _g.snake.scoreMultiplier += 1;
                    console.log("increase multi "+_g.snake.scoreMultiplier);
                    _g.snake.label_Multiplier.setString("Multiplier: "+_g.snake.scoreMultiplier+"x");
                    if (_g.snake.bonusAvailable===-1) {
                        _g.snake.bonusAvailable = 0;
                        _g.snake.shakeToggler.activate();
                        _g.snake.shakeToggler.setEnabled(false);
                    }
                    if (_g.snake.lastPointGained===3) {
                        _g.snake.bonusAvailable++;
                    } else {
                        _g.snake.bonusAvailable = 0;
                    }

                    _g.snake.lastPointGained = 3;
                }

                if (_g.snake.points.sprites[e.data.index].collision === "increase") {
                    _g.snake.collisionBuffer += 3;
                    console.log("increase buffer: "+_g.snake.collisionBuffer);
                    _g.snake.label_CollisionBuffer.setString("Collision Buffer: "+(((GameSettings.fps/2)+_g.snake.collisionBuffer)/30));
                    if (_g.snake.bonusAvailable===-1) {
                        _g.snake.bonusAvailable = 0;
                        _g.snake.shakeToggler.activate();
                        _g.snake.shakeToggler.setEnabled(false);
                    }
                    if (_g.snake.lastPointGained===4) {
                        _g.snake.bonusAvailable++;
                    } else {
                        _g.snake.bonusAvailable = 0;
                    }

                    _g.snake.lastPointGained = 4;
                }
                console.log(_g.snake.bonusAvailable);
                if (_g.snake.bonusAvailable===2) {
                    _g.snake.shakeToggler.setEnabled(true);
                    _g.snake.shakeToggler.activate();
                    _g.snake.bonusAvailable=-1;
                }

                _g.snake.removeChild(_g.snake.points.sprites[e.data.index]);
                _g.snake.points.sprites[e.data.index] = null;
                _g.snake.spriteLocations.push(e.data.index);

                var newLocation = NewBodyLocation();
                _g.snake.player.body.push(cc.Sprite.create('images/snakebodytest.png'));
                _g.snake.player.body[_g.snake.player.body.length - 1].setPosition(
                    new cc.Point(
                        newLocation.x,
                        newLocation.y
                    )
                );
                _g.snake.addChild(_g.snake.player.body[_g.snake.player.body.length - 1], 2);
                _g.snake.player.body[_g.snake.player.body.length - 1].movement = [];
                _g.snake.player.body[_g.snake.player.body.length - 1].movement.push({
                    axis: newLocation.axis,
                    amount: newLocation.amount
                });
                _g.snake.player.bodyLocations.push({
                    x: newLocation.x,
                    y: newLocation.y
                });

            } else if (e.data.msg === 'no prob') {
                _g.snake.collision_Timer = 0;
                _g.snake.player.cx = _g.snake.player.nx;
                _g.snake.player.cy = _g.snake.player.ny;
                _g.snake.player.setPosition(new cc.Point(
                    _g.snake.player.cx,
                    _g.snake.player.cy
                ));
                if (_g.snake.player.body.length > 0) {
                    _g.snake.player.body[0].movement.push(GetHeadMovement());
                }
                for (var i = 0; i < _g.snake.player.body.length; i++) {

                    var movementAllowed = _g.snake.player.speed;
                    var movementRequired;
                    var movementDone;
                    var currentPosition;
                    var body = _g.snake.player.body[i];

                    while (movementAllowed != 0) {

                        var axis = body.movement[0].axis;
                        var amount = body.movement[0].amount;
                        var signMultiplier = 1;


                        if (axis === "x") { //movement goal is on x axies
                            if (body.getPosition().x > amount) { // moving positive or negative x values
                                signMultiplier = -1;
                            }
                            movementRequired = Math.abs(amount - body.getPosition().x); // how much do we need to move
                            if (movementRequired > movementAllowed) { // if we need to move more than we allowed, only move the amount we are allowed
                                movementDone = movementAllowed * signMultiplier;
                                movementAllowed = 0; // we've done all the movement we're allowed
                            } else {
                                movementDone = movementRequired * signMultiplier; //otherwise move amount we need 
                                movementAllowed = movementAllowed - movementRequired; //update movementAllowed
                                body.movement.splice(0, 1); //remove the current goal, because we moved the required amount means that we met the goal!
                            }
                            //perform the actual movement
                            body.setPosition(
                                new cc.Point(
                                    body.getPosition().x + movementDone,
                                    body.getPosition().y
                                )
                            );
                            currentPosition = body.getPosition().x;
                            if (i + 1 != _g.snake.player.body.length) { //there exists another body after this one
                                _g.snake.player.body[i + 1].movement.push({
                                    axis: "x",
                                    amount: currentPosition
                                })
                            }
                        } else if (axis === "y") {

                            if (body.getPosition().y > amount) { // moving positive or negative x values
                                signMultiplier = -1;
                            }
                            movementRequired = Math.abs(amount - body.getPosition().y); // how much do we need to move

                            if (movementRequired > movementAllowed) { // if we need to move more than we allowed, only move the amount we are allowed
                                movementDone = movementAllowed * signMultiplier;
                                movementAllowed = 0;
                            } else {
                                movementDone = movementRequired * signMultiplier; //otherwise move amount we need 
                                movementAllowed = movementAllowed - movementRequired; //update movementAllowed
                                body.movement.splice(0, 1); //remove the current goal, because we moved the required amount means that we met the goal!
                            }
                            //perform the actual movement
                            body.setPosition(
                                new cc.Point(
                                    body.getPosition().x,
                                    body.getPosition().y + movementDone
                                )
                            );
                            currentPosition = body.getPosition().y;
                            if (i + 1 != _g.snake.player.body.length) { //there exists another body after this one
                                _g.snake.player.body[i + 1].movement.push({
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

        //refresh variables
        this.spriteLocations = [];
        this.score= 0;
        this.timer = 0;
        this.collision_Timer = 0;
        this.menuLayer = null;
        this.menuLayerExists = false;
        this.schedulerSetup = false;
        this.spriteSpawnTimer = 0;
        this.pointToAdd = null;
        this.scoreMultiplier = 1;
        this.collisionBuffer = 0;
        this.lastPointGained = null;
        this.bonusAvailable = 0;
        this.shakeToggler = null;
        this.speedupAvailable = 0;

        this.background = cc.Sprite.create('Maps/' + GameSettings.mapName + '.png');
        this.background.setAnchorPoint(new cc.Point(0.0, 0.0));
        this.background.setPosition(new cc.Point(0.0, 0.0));
        this.addChild(this.background, 0);

        var startPoints = tmx.getObjectGroup('StartPoints').getObjects();

        this.player = cc.Sprite.create('images/snakeheadtest.png');
        // this.player.setAnchorPoint(new cc.Point(0.5, 0.5));
        this.player.setPosition(new cc.Point(((startPoints[0].x + 1) + 30 / 2.0), ((startPoints[0].y + 1) + 30 / 2.0)));
        this.player.cx = ((startPoints[0].x + 1) + 30 / 2.0);
        this.player.cy = ((startPoints[0].y + 1) + 30 / 2.0);
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
        this.points.sprites = new Object();
        for (n = 0; n < this.points.length; n = n + 1) {
            var sprite = ChoosePoint();
            sprite.points = this.points[n].points;
            this.points.sprites[this.points[n].x + "," + this.points[n].y] = sprite;
            this.points.sprites[this.points[n].x + "," + this.points[n].y].setPosition(
                new cc.Point(
                    this.points[n].x + this.points[n].width / 2.0,
                    this.points[n].y + this.points[n].height / 2.0
                )
            );
            this.addChild(this.points.sprites[this.points[n].x + "," + this.points[n].y], 2);
        }
        
        /* Display Score */
        this.label_Score = cc.LabelTTF.create("Score: 0", "Arial", 35);
        this.label_Score.setPosition(new cc.Point(window.innerWidth * .12, window.innerHeight * .1));
        this.label_Score.setColor(new cc.Color3B(0, 34, 102));
        this.addChild(this.label_Score, 5);

        /* Display Timer */
        this.label_Timer = cc.LabelTTF.create("Time: 0", "Arial", 35);
        this.label_Timer.setPosition(new cc.Point(window.innerWidth * .1, window.innerHeight * .05));
        this.label_Timer.setColor(new cc.Color3B(84, 84, 84));
        this.addChild(this.label_Timer);

        /* Display Multiplier */
        this.label_Multiplier = cc.LabelTTF.create("Multiplier: 1", "Arial", 35);
        this.label_Multiplier.setPosition(new cc.Point(window.innerWidth * .5, window.innerHeight * .13));
        this.label_Multiplier.setColor(new cc.Color3B(0, 34, 102));
        this.addChild(this.label_Multiplier, 5);

        /* Display Speed */
        this.label_Speed = cc.LabelTTF.create("Speed: "+GameSettings.speedIndex, "Arial", 35);
        this.label_Speed.setPosition(new cc.Point(window.innerWidth * .5, window.innerHeight * .08));
        this.label_Speed.setColor(new cc.Color3B(0, 34, 102));
        this.addChild(this.label_Speed, 5);

                /* Display Score */
        this.label_CollisionBuffer = cc.LabelTTF.create("Collision Buffer: 0.5", "Arial", 35);
        this.label_CollisionBuffer.setPosition(new cc.Point(window.innerWidth * .5, window.innerHeight * .03));
        this.label_CollisionBuffer.setColor(new cc.Color3B(0, 34, 102));
        this.addChild(this.label_CollisionBuffer, 5);


        var btn_shake = cc.MenuItemImage.create("images/btn_shake.png");
        var btn_pressed_shake = cc.MenuItemImage.create("images/btn_pressed_shake.png");
        this.shakeToggler = new cc.MenuItemToggle.create(btn_pressed_shake);
        this.shakeToggler.addSubItem(btn_shake);
        this.shakeToggler.setTarget(this.Shake, this);
        this.shakeToggler.setPosition(new cc.Point(window.innerWidth*.80,window.innerHeight*.08));
        this.shakeToggler.setEnabled(false);
    
        var menu = cc.Menu.create(this.shakeToggler);
        menu.setPosition(new cc.Point(0,0));
        this.addChild(menu,5);
        
        GameSettings.currentScene = this;
        GameSettings.OpenGoal();
        GameSettings.running = true;

        switch (GameSettings.mapName) {
            case "elegantmansion":
                cc.AudioEngine.getInstance().playMusic('sound/jungle.mp3',true);
                break;
            case "crystalcave":
                cc.AudioEngine.getInstance().playMusic('sound/caverns.mp3',true);
                break;
        }
        if (GameSettings.sound===false) {
            cc.AudioEngine.getInstance().pauseMusic();
        }


        //done loading
        _spinner.stop();
        return true;
    },
    onKeyDown: function (e) {
        if (e === 37) { //left
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
        if (this.timer % GameSettings.fps === 0) {
            this.label_Timer.setString("Time: " + this.timer / GameSettings.fps);
            //game has ended
            if (this.timer / GameSettings.fps === GameSettings.endTimer) {
                GameSettings.OpenGameOver();
            }
        }

        //collision for too long
        if (this.collision_Timer === (GameSettings.fps/2)+this.collisionBuffer) {
            GameSettings.OpenGameOver();
        }
        this.collision_Timer++;

        this.spriteSpawnTimer++;
        if (this.spriteSpawnTimer % (60 * 4) === 0) {
            this.SpawnPoint();
        }

        //direction
        if (((this.player.cx - 16) % 32 === 0) && ((this.player.cy - 16) % 32 === 0)) {
            this.player.cdirection = this.player.ndirection;
            this.player.speed = this.player.newSpeed;
            this.label_Speed.setString("Speed: " + GameSettings.speedIndex);
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
        this.player.nx = Math.round(this.player.nx * 10) / 10;
        this.player.ny = Math.round(this.player.ny * 10) / 10;
        this.physics.postMessage({
            msg: 'ApplyImpulse',
            x: this.player.nx,
            y: this.player.ny,
            body: this.player.bodyLocations,
            direction: this.player.cdirection,
            pointToAdd: this.pointToAdd
        });
        this.pointToAdd = null;
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
    SpawnPoint: function () {
        if (this.spriteLocations.length===0) {
            return;
        }
        var index = Math.floor((Math.random() * this.spriteLocations.length));
        this.pointToAdd = this.spriteLocations[index];
        var x = parseInt(this.spriteLocations[index].split(",")[0]);
        var y = parseInt(this.spriteLocations[index].split(",")[1]);
        console.log("adding at: "+x +", "+y);
        var sprite = ChoosePoint();
        this.points.sprites[this.spriteLocations[index]] = sprite;
        this.points.sprites[this.spriteLocations[index]].setPosition(new cc.Point((x + 16),(y + 16)));
        this.addChild(this.points.sprites[this.spriteLocations[index]],2);
        this.spriteLocations.splice(index, 1);
    },
    Shake: function () {
        if (this.bonusAvailable===-1) {
            this.shakeToggler.setEnabled(false);
            this.score += 150*this.scoreMultiplier;
            _g.snake.label_Score.setString("Score: " + _g.snake.score);
            if (GameSettings.sound) {
                cc.AudioEngine.getInstance().playEffect('sound/bonus.mp3');
            }
        }

    }
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
    if (_g.snake.player.body.length === 0) {
        cx = _g.snake.player.cx;
        cy = _g.snake.player.cy;
    } else {
        cx = _g.snake.player.body[_g.snake.player.body.length - 1].getPosition().x;
        cy = _g.snake.player.body[_g.snake.player.body.length - 1].getPosition().y;
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
    return {
        x: nx,
        y: ny,
        axis: axis,
        amount: amount
    }
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
    return {
        axis: axis,
        amount: amount
    }
}

function ChoosePoint () {
    var type = Math.floor((Math.random() * 3));
    if (type===0) {
        var type = Math.floor((Math.random() * 3));
        var positive = Math.floor((Math.random() * 2));
        if (type===0) {
            var sprite = cc.Sprite.create('images/rabbitpoint2.png');
            sprite.speed = "increase";
        } else if (type===1) {
            var sprite = cc.Sprite.create('images/rabbitpoint3.png');
            sprite.multiplier = "increase";
        } else if (type===2) {
            var sprite = cc.Sprite.create('images/rabbitpoint4.png');
            sprite.collision = "increase";
        } 
    } else {
        var sprite = cc.Sprite.create('images/rabbitpoint1.png');
        sprite.normal = true;
    }
    return sprite;
}
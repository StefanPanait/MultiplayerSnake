var WildFeast = {
    fps: 30,
    mapName: null,
    gesturesSet: false,
    endTimer: 120,
    speeds: [3.2, 4, 6.4, 8],
    speedIndex: 0,
    sound: false,
    running: false,
    touchX: null,
    touchY: null,
    touchStarted: false,
    menuLayerExists: false,
    menuLayer: null,
    currentScene: null,
    WildFeastScene: null,
    gameOver: false,
    scale: 1.5,
    displayLayer: null,
    gameplayLayer: null,
    connected: false,


    IncrementSpeed: function () {
        if (this.speedIndex != this.speeds.length - 1) {
            this.speedIndex++;
        }
    },
    DecrementSpeed: function () {
        if (this.speedIndex != 0) {
            this.speedIndex--;
        }
    },
    GetSpeed: function () {
        return this.speeds[this.speedIndex];
    },
    SetSpeed: function (i) {
        this.speedIndex = i;
    },
    ToggleSound: function () {
        this.sound = !this.sound;
        if (this.sound === false) {
            cc.AudioEngine.getInstance().pauseAllEffects();
            cc.AudioEngine.getInstance().pauseMusic();
        } else {
            cc.AudioEngine.getInstance().resumeAllEffects();
            cc.AudioEngine.getInstance().resumeMusic();
        }
    },
    OpenMenu: function () {
        //pause game
        if (this.running) {
            this.currentScene.pauseSchedulerAndActions();
            //Disable movement controls
            var controls = document.getElementById("freewill");
            controls.style.visibility = "hidden";

            var btn_quit = new cc.MenuItemImage.create('images/btn_quit.png', 'images/btn_pressed_quit.png', this.Quit, this);
            btn_quit.setPosition(new cc.Point(window.innerWidth * .5, window.innerHeight * .43));
        }
        // replace menu if it already exists
        if (this.menuLayerExists) {
            this.currentScene.removeChild(this.menuLayer);
        }

        //create new layer
        this.menuLayer = cc.Layer.create();
        var menuBackground = cc.Sprite.create('images/layer_menu.png');
        menuBackground.setPosition(window.innerWidth * .5, window.innerHeight * .5);
        this.menuLayer.addChild(menuBackground);
        if (this.gameOver) {
            var btn_Resume = new cc.MenuItemImage.create('images/btn_pressed_resume.png', 'images/btn_pressed_resume.png', this.DisabledButton, this);
        } else {
            var btn_Resume = new cc.MenuItemImage.create('images/btn_resume.png', 'images/btn_pressed_resume.png', this.CloseMenu, this);
        }
        btn_Resume.setPosition(new cc.Point(window.innerWidth * .5, window.innerHeight * .49));

        var offbutton = cc.MenuItemImage.create("images/btn_off_sound.png");
        var onbutton = cc.MenuItemImage.create("images/btn_on_sound.png");
        if (WildFeast.sound) {
            var toggler = new cc.MenuItemToggle.create(onbutton);
            toggler.addSubItem(offbutton);
        } else {
            var toggler = new cc.MenuItemToggle.create(offbutton);
            toggler.addSubItem(onbutton);
        }
        toggler.setTarget(this.ToggleSound, this);
        toggler.setPosition(new cc.Point(window.innerWidth * .77, window.innerHeight * .44));

        var menu = cc.Menu.create(btn_Resume, toggler);
        if (this.running) {
            menu.addChild(btn_quit);
        }
        menu.setPosition(new cc.Point(0, 0));
        this.menuLayer.addChild(menu);


        this.currentScene.addChild(this.menuLayer, 3);
        this.menuLayerExists = true;
    },
    CloseMenu: function () {
        //remove menu layer
        this.currentScene.removeChild(this.menuLayer);
        this.menuLayerExists = false;
        //set controls to visible
        if (this.running) {
            var controls = document.getElementById("freewill");
            controls.style.visibility = "visible";
            if (this.gameplayLayer.schedulerSetup === false) {
                console.log("setup update");
                this.currentScene.schedule(this.update);
                this.gameplayLayer.schedulerSetup = true;
            } else {
                this.currentScene.resumeSchedulerAndActions();
            }
        }
    },
    OpenGoal: function () {
        //create new layer
        this.menuLayer = cc.Layer.create();

        var menuBackground = cc.Sprite.create('images/layer_gameover.png');
        menuBackground.setPosition(window.innerWidth * .5, window.innerHeight * .5);
        this.menuLayer.addChild(menuBackground);

        var btn_Play = new cc.MenuItemImage.create('images/btn_play.png', 'images/btn_pressed_play.png', this.CloseMenu, this);
        btn_Play.setPosition(new cc.Point(window.innerWidth * .5, window.innerHeight * .43));

        var label_Goal = cc.LabelTTF.create("Collect as many points as you can!", "Arial", 35);
        label_Goal.setPosition(new cc.Point(window.innerWidth * .5, window.innerHeight * .5));
        label_Goal.setColor(new cc.Color3B(165, 42, 42));
        this.menuLayer.addChild(label_Goal);

        var layerMenu = cc.Menu.create(btn_Play);
        layerMenu.setPosition(new cc.Point(0, 0));

        this.menuLayer.addChild(layerMenu);

        this.currentScene.addChild(this.menuLayer, 3);
        this.menuLayerExists = true;
    },
    Quit: function () {
        var children = this.WildFeastScene.getChildren();
        for(var i = 0; i< children.length; i++) {
            console.log("removing: "+children[i]);
            this.WildFeastScene.removeChild(children[i]);
        }
        
        this.displayLayer = null;
        this.gameplayLayer = null;

        var scene = cc.Scene.create();
        var menuLayer = Menu.layer();
        scene.addChild(menuLayer);
        WildFeast.running = false;
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
    },
    OpenGameOver: function () {
        //stop all actions
        this.currentScene.pauseSchedulerAndActions();
        this.gameOver = true;
        //hide disable controls
        var controls = document.getElementById("freewill");
        controls.style.visibility = "hidden";
        //create end game layer
        this.menuLayer = cc.Layer.create();
        var menuBackground = cc.Sprite.create('images/layer_gameover.png');
        menuBackground.setPosition(window.innerWidth * .5, window.innerHeight * .5);
        this.menuLayer.addChild(menuBackground);
        //create menu
        var btn_Quit = new cc.MenuItemImage.create('images/btn_quit.png', 'images/btn_pressed_quit.png', this.Quit, this);
        btn_Quit.setPosition(new cc.Point(window.innerWidth * .5, window.innerHeight * .42));
        var menu = cc.Menu.create(btn_Quit);
        menu.setPosition(new cc.Point(0, 0));
        this.menuLayer.addChild(menu);
        //why did the game end
        var endGameString;
        if ( WildFeast.gameplayLayer.timer / this.fps === this.endTimer) {
            endGameString = "Time Over!";
        } else {
            endGameString = "Collision!";
        }
        var endGameLabel = cc.LabelTTF.create(endGameString, "Arial", 50);
        endGameLabel.setPosition(new cc.Point(window.innerWidth * .5, window.innerHeight * .51));
        endGameLabel.setColor(new cc.Color3B(165, 42, 42));
        this.menuLayer.addChild(endGameLabel, 3);
        //display score
        var label_Score = cc.LabelTTF.create("Score: " +  WildFeast.gameplayLayer.score, "Arial", 50);
        label_Score.setPosition(new cc.Point(window.innerWidth * .5, window.innerHeight * .47));
        label_Score.setColor(new cc.Color3B(165, 42, 42));
        this.menuLayer.addChild(label_Score, 5);

        this.currentScene.addChild(this.menuLayer, 3);
        this.menuLayerExists = true;
    },
    DisabledButton: function () {

    },
    WildFeast: function () {
        this.WildFeastScene = cc.Scene.create();

        this.gameplayLayer = new gameplay();
        this.gameplayLayer.init();

        this.displayLayer = new display();
        this.displayLayer.init();
        this.WildFeastScene.addChild(this.gameplayLayer);
        this.WildFeastScene.addChild(this.displayLayer);



        this.currentScene = this.WildFeastScene
        WildFeast.OpenGoal();
        return this.WildFeastScene;
    },
    update: function () {
        //timer
        // this.setScale(2,2);
        //this.setPosition(-(this.player.cx-(window.innerWidth/2)),-(this.player.cy-window.innerHeight/2));
        WildFeast.gameplayLayer.timer++;
        if (WildFeast.gameplayLayer.timer % WildFeast.fps === 0) {
            WildFeast.displayLayer.label_Timer.setString("Time: " + WildFeast.gameplayLayer.timer / WildFeast.fps);
            //game has ended
            if (WildFeast.gameplayLayer.timer / WildFeast.fps === WildFeast.endTimer) {
                WildFeast.OpenGameOver();
            }
        }

        //collision for too long
        if (WildFeast.gameplayLayer.collision_Timer === (WildFeast.fps / 2) + WildFeast.gameplayLayer.collisionBuffer) {
            WildFeast.OpenGameOver();
        }
        WildFeast.gameplayLayer.collision_Timer++;

        WildFeast.gameplayLayer.spriteSpawnTimer++;
        if (WildFeast.gameplayLayer.spriteSpawnTimer % (60 * 4) === 0) {
            WildFeast.gameplayLayer.SpawnPoint();
        }

        //direction
        if (((WildFeast.gameplayLayer.player.cx - 16) % 32 === 0) && ((WildFeast.gameplayLayer.player.cy - 16) % 32 === 0)) {
            WildFeast.gameplayLayer.player.cdirection =  WildFeast.gameplayLayer.player.ndirection;
            WildFeast.gameplayLayer.player.speed =  WildFeast.gameplayLayer.player.newSpeed;
            WildFeast.displayLayer.label_Speed.setString("Speed: " + WildFeast.speedIndex);
        }
        switch (WildFeast.gameplayLayer.player.cdirection) {
        case 1:
            WildFeast.gameplayLayer.player.nx = WildFeast.gameplayLayer.player.cx - WildFeast.gameplayLayer.player.speed;
            WildFeast.gameplayLayer.player.ny = WildFeast.gameplayLayer.player.cy;
            break;
        case 2:
            WildFeast.gameplayLayer.player.nx = WildFeast.gameplayLayer.player.cx + WildFeast.gameplayLayer.player.speed;
            WildFeast.gameplayLayer.player.ny = WildFeast.gameplayLayer.player.cy;
            break;
        case 3:
            WildFeast.gameplayLayer.player.nx = WildFeast.gameplayLayer.player.cx;
            WildFeast.gameplayLayer.player.ny = WildFeast.gameplayLayer.player.cy + WildFeast.gameplayLayer.player.speed;
            break;
        case 4:
            WildFeast.gameplayLayer.player.nx = WildFeast.gameplayLayer.player.cx;
            WildFeast.gameplayLayer.player.ny = WildFeast.gameplayLayer.player.cy - WildFeast.gameplayLayer.player.speed;
            break;
        }
        WildFeast.gameplayLayer.player.nx = Math.round(WildFeast.gameplayLayer.player.nx * 10) / 10;
        WildFeast.gameplayLayer.player.ny = Math.round(WildFeast.gameplayLayer.player.ny * 10) / 10;
        WildFeast.gameplayLayer.physics.postMessage({
            msg: 'ApplyImpulse',
            x: WildFeast.gameplayLayer.player.nx,
            y: WildFeast.gameplayLayer.player.ny,
            body: WildFeast.gameplayLayer.player.bodyLocations,
            direction: WildFeast.gameplayLayer.player.cdirection,
            pointToAdd: WildFeast.gameplayLayer.pointToAdd
        });
        WildFeast.gameplayLayer.pointToAdd = null;
    }
};


function NewBodyLocation() {
    var cx, cy, nx, ny, axis, amount;
    if ( WildFeast.gameplayLayer.player.body.length === 0) {
        cx =  WildFeast.gameplayLayer.player.cx;
        cy =  WildFeast.gameplayLayer.player.cy;
    } else {
        cx =  WildFeast.gameplayLayer.player.body[ WildFeast.gameplayLayer.player.body.length - 1].getPosition().x;
        cy =  WildFeast.gameplayLayer.player.body[ WildFeast.gameplayLayer.player.body.length - 1].getPosition().y;
    }
    switch ( WildFeast.gameplayLayer.player.cdirection) {
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
    switch ( WildFeast.gameplayLayer.player.cdirection) {
    case 1:
        axis = "x";
        amount =  WildFeast.gameplayLayer.player.cx;
        break;
    case 2:
        axis = "x";
        amount =  WildFeast.gameplayLayer.player.cx;
        break;
    case 3:
        axis = "y";
        amount =  WildFeast.gameplayLayer.player.cy;
        break;
    case 4:
        axis = "y";
        amount =  WildFeast.gameplayLayer.player.cy;
        break;
    }
    return {
        axis: axis,
        amount: amount
    }
}

function ChoosePoint() {
    var type = Math.floor((Math.random() * 3));
    if (type === 0) {
        var type = Math.floor((Math.random() * 3));
        var positive = Math.floor((Math.random() * 2));
        if (type === 0) {
            var sprite = cc.Sprite.create('images/rabbitpoint2.png');
            sprite.speed = "increase";
        } else if (type === 1) {
            var sprite = cc.Sprite.create('images/rabbitpoint3.png');
            sprite.multiplier = "increase";
        } else if (type === 2) {
            var sprite = cc.Sprite.create('images/rabbitpoint4.png');
            sprite.collision = "increase";
        }
    } else {
        var sprite = cc.Sprite.create('images/rabbitpoint1.png');
        sprite.normal = true;
    }
    return sprite;
}

function physicsListener(e) {
    if (e.data.msg === 'remove') { //remove point from map
        if (WildFeast.sound) {
            cc.AudioEngine.getInstance().playEffect('sound/crunch.mp3');
        }
        //update score
        WildFeast.gameplayLayer.score = WildFeast.gameplayLayer.score + 10 * WildFeast.gameplayLayer.scoreMultiplier;
        //+ WildFeast.gameplayLayer.points.sprites[e.data.index].points *  WildFeast.gameplayLayer.player.body.length;
        WildFeast.displayLayer.label_Score.setString("Score: " + WildFeast.gameplayLayer.score);
        //update speed
        if (WildFeast.gameplayLayer.points.sprites[e.data.index].speed === "increase") {
             WildFeast.gameplayLayer.speedupAvailable++;
            if ( WildFeast.gameplayLayer.speedupAvailable === 3) {
                WildFeast.IncrementSpeed();
                 WildFeast.gameplayLayer.player.newSpeed = WildFeast.GetSpeed();
                 WildFeast.gameplayLayer.speedupAvailable = 0;
            }
            if ( WildFeast.gameplayLayer.bonusAvailable === -1) {
                 WildFeast.gameplayLayer.bonusAvailable = 0;
                 WildFeast.gameplayLayer.shakeToggler.activate();
                 WildFeast.gameplayLayer.shakeToggler.setEnabled(false);
            }
            if (WildFeast.gameplayLayer.lastPointGained === 2) {
                WildFeast.gameplayLayer.bonusAvailable++;
            } else {
                 WildFeast.gameplayLayer.bonusAvailable = 0;
            }
             WildFeast.gameplayLayer.lastPointGained = 2;

        }
        if ( WildFeast.gameplayLayer.points.sprites[e.data.index].multiplier === "increase") {
             WildFeast.gameplayLayer.scoreMultiplier += 1;
             WildFeast.displayLayer.label_Multiplier.setString("Multiplier: " +  WildFeast.gameplayLayer.scoreMultiplier + "x");
            if ( WildFeast.gameplayLayer.bonusAvailable === -1) {
                 WildFeast.gameplayLayer.bonusAvailable = 0;
                 WildFeast.displayLayer.shakeToggler.activate();
                 WildFeast.displayLayer.shakeToggler.setEnabled(false);
            }
            if ( WildFeast.gameplayLayer.lastPointGained === 3) {
                 WildFeast.gameplayLayer.bonusAvailable++;
            } else {
                 WildFeast.gameplayLayer.bonusAvailable = 0;
            }

             WildFeast.gameplayLayer.lastPointGained = 3;
        }

        if ( WildFeast.gameplayLayer.points.sprites[e.data.index].collision === "increase") {
             WildFeast.gameplayLayer.collisionBuffer += 3;
            console.log("increase buffer: " +  WildFeast.gameplayLayer.collisionBuffer);
             WildFeast.displayLayer.label_CollisionBuffer.setString("Collision Buffer: " + (((WildFeast.fps / 2) +  WildFeast.gameplayLayer.collisionBuffer) / 30));
            if ( WildFeast.gameplayLayer.bonusAvailable === -1) {
                 WildFeast.gameplayLayer.bonusAvailable = 0;
                 WildFeast.displayLayer.shakeToggler.activate();
                 WildFeast.displayLayer.shakeToggler.setEnabled(false);
            }
            if ( WildFeast.gameplayLayer.lastPointGained === 4) {
                 WildFeast.gameplayLayer.bonusAvailable++;
            } else {
                 WildFeast.gameplayLayer.bonusAvailable = 0;
            }

             WildFeast.gameplayLayer.lastPointGained = 4;
        }
        console.log( WildFeast.gameplayLayer.bonusAvailable);
        if ( WildFeast.gameplayLayer.bonusAvailable === 2) {
             WildFeast.displayLayer.shakeToggler.setEnabled(true);
             WildFeast.displayLayer.shakeToggler.activate();
             WildFeast.gameplayLayer.bonusAvailable = -1;
        }

         WildFeast.gameplayLayer.removeChild( WildFeast.gameplayLayer.points.sprites[e.data.index]);
         WildFeast.gameplayLayer.points.sprites[e.data.index] = null;
         WildFeast.gameplayLayer.spriteLocations.push(e.data.index);

        var newLocation = NewBodyLocation();
         WildFeast.gameplayLayer.player.body.push(cc.Sprite.create('images/snakebodytest.png'));
         WildFeast.gameplayLayer.player.body[ WildFeast.gameplayLayer.player.body.length - 1].setPosition(
            new cc.Point(
                newLocation.x,
                newLocation.y
            )
        );
         WildFeast.gameplayLayer.addChild( WildFeast.gameplayLayer.player.body[ WildFeast.gameplayLayer.player.body.length - 1], 2);
         WildFeast.gameplayLayer.player.body[ WildFeast.gameplayLayer.player.body.length - 1].movement = [];
         WildFeast.gameplayLayer.player.body[ WildFeast.gameplayLayer.player.body.length - 1].movement.push({
            axis: newLocation.axis,
            amount: newLocation.amount
        });
         WildFeast.gameplayLayer.player.bodyLocations.push({
            x: newLocation.x,
            y: newLocation.y
        });

    } else if (e.data.msg === 'no prob') {
         WildFeast.gameplayLayer.collision_Timer = 0;
         WildFeast.gameplayLayer.player.cx =  WildFeast.gameplayLayer.player.nx;
         WildFeast.gameplayLayer.player.cy =  WildFeast.gameplayLayer.player.ny;

        // WildFeast.gameplayLayer.setPosition(-( WildFeast.gameplayLayer.player.cx*2),-(( WildFeast.gameplayLayer.player.cy*2)-window.innerHeight/2));
         WildFeast.gameplayLayer.setPosition(-(( WildFeast.gameplayLayer.player.cx * WildFeast.scale) - ((window.innerWidth / 2) * WildFeast.scale)), -(( WildFeast.gameplayLayer.player.cy * WildFeast.scale) - (window.innerHeight / 2) * WildFeast.scale));

         WildFeast.gameplayLayer.player.setPosition(new cc.Point(
             WildFeast.gameplayLayer.player.cx,
             WildFeast.gameplayLayer.player.cy
        ));

        if ( WildFeast.gameplayLayer.player.body.length > 0) {
             WildFeast.gameplayLayer.player.body[0].movement.push(GetHeadMovement());
        }
        for (var i = 0; i <  WildFeast.gameplayLayer.player.body.length; i++) {

            var movementAllowed =  WildFeast.gameplayLayer.player.speed;
            var movementRequired;
            var movementDone;
            var currentPosition;
            var body =  WildFeast.gameplayLayer.player.body[i];

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
                    if (i + 1 !=  WildFeast.gameplayLayer.player.body.length) { //there exists another body after this one
                         WildFeast.gameplayLayer.player.body[i + 1].movement.push({
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
                    if (i + 1 !=  WildFeast.gameplayLayer.player.body.length) { //there exists another body after this one
                         WildFeast.gameplayLayer.player.body[i + 1].movement.push({
                            axis: "y",
                            amount: currentPosition
                        })
                    }

                }
            }
             WildFeast.gameplayLayer.player.bodyLocations[i].x = body.getPosition().x;
             WildFeast.gameplayLayer.player.bodyLocations[i].y = body.getPosition().y;

        }
    }

}
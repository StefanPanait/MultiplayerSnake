var GameSettings = {
    fps: 30,
    mapName: null,
    gesturesSet: false,
    endTimer: 120,
    speeds: [3.2, 4, 6.4, 8],
    speedIndex: 0,
    sound: true,
    running: false,
    touchX: null,
    touchY: null,
    touchStarted: false,
    menuLayerExists: false,
    menuLayer: null,
    currentScene: null,
    gameOver: false,
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
        if (GameSettings.sound) {
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
            if (this.currentScene.schedulerSetup === false) {
                this.currentScene.schedule(_g.snake.update);
                this.currentScene.schedulerSetup = true;
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
        var scene = cc.Scene.create();
        var menuLayer = Menu.layer();
        scene.addChild(menuLayer);
        GameSettings.running = false;
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
        if (_g.snake.timer / this.fps === this.endTimer) {
            endGameString = "Time Over!";
        } else {
            endGameString = "Collision!";
        }
        var endGameLabel = cc.LabelTTF.create(endGameString, "Arial", 50);
        endGameLabel.setPosition(new cc.Point(window.innerWidth * .5, window.innerHeight * .51));
        endGameLabel.setColor(new cc.Color3B(165, 42, 42));
        this.menuLayer.addChild(endGameLabel, 3);
        //display score
       	var label_Score = cc.LabelTTF.create("Score: " + _g.snake.score,"Arial", 50);
		label_Score.setPosition(new cc.Point(window.innerWidth * .5, window.innerHeight * .47));
        label_Score.setColor(new cc.Color3B(165, 42, 42));
        this.menuLayer.addChild(label_Score, 5);

        this.currentScene.addChild(this.menuLayer, 3);
        this.menuLayerExists = true;
    },
    DisabledButton: function () {

    }
}
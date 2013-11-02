var activityIndicator;
var ccApplication = cc.Application.extend({
    config:document['ccConfig'],
    ctor:function (scene) {
        this._super();
        this.startScene = scene;
        cc.COCOS2D_DEBUG = this.config['COCOS2D_DEBUG'];
        cc.initDebugSetting();
        cc.setup(this.config['tag']);
        cc.AppController.shareAppController().didFinishLaunchingWithOptions();       
    },
    applicationDidFinishLaunching:function () {
        // initialize director
        var director = cc.Director.getInstance();

        // enable High Resource Mode(2x, such as iphone4) and maintains low resource on other devices.
//     director->enableRetinaDisplay(true);

        // turn on display FPS
        director.setDisplayStats(this.config['showFPS']);

        // set FPS. the default value is 1.0/60 if you don't call this
        director.setAnimationInterval(1.0 / this.config['frameRate']);
        //load resources
        var resources = [
        //tiles
            {src: 'Maps/tile02.png'},
            {src: 'Maps/tile04-edited.jpg'},
            {src: 'Maps/tile12.png'},
            {src: 'Maps/tile20.png'},
            {src: 'Maps/tile29.png'},
            {src: 'Maps/tile30.png'},
            {src: 'Maps/tile31.png'},
            {src: 'Maps/tile35.png'},
            {src: 'Maps/tile06edited.png'},
            {src: 'Maps/tile06edited02.png'},
            {src: 'Maps/Untitled-1.png'},
            {src: 'Maps/tile13.png'},
            {src: 'Maps/tile21.png'},
            {src: 'Maps/tile17.png'},
        //controls
            {src: 'images/btn_up.png'},
            {src: 'images/btn_down.png'},
            {src: 'images/btn_left.png'},
            {src: 'images/btn_right.png'},
        //snake
            {src: 'images/snakebody.png'},
            {src: 'images/snakehead.png'},
            {src: 'images/snakebodytest.png'},
            {src: 'images/snakeheadtest.png'},
            {src: 'images/btn_play.png'},
            {src: 'images/btn_pressed_play.png'},
            {src: 'images/rabbitpoint1.png'},
            {src: 'images/rabbitpoint2.png'},
            {src: 'images/rabbitpoint3.png'},
            {src: 'images/rabbitpoint4.png'},
        //points
            {src: 'images/rabbit_points_01.png'},
        //main menu
            {src: 'images/btn_startgame.png'},
            {src: 'images/btn_pressed_startgame.png'},
            {src: 'images/btn_howtoplay.png'},
            {src: 'images/btn_pressed_howtoplay.png'},
            {src: 'images/btn_highscore.png'},
            {src: 'images/menubackground.png'},
            {src: 'images/btn_share.png'},
            {src: 'images/btn_pressed_share.png'},
            {src: 'images/layer_menu.png'},
            {src: 'images/tutorial1.png'},
            {src: 'images/tutorial2.png'},
            {src: 'images/tutorial3.png'},
        //mapselection
            {src: 'images/mapselection.png'},
            {src: 'images/elegantmansionthumb.png'},
            {src: 'images/btn_mansion.png'},
            {src: 'images/btn_pressed_mansion.png'},
            {src: 'images/crystalcavethumb.png'},
            {src: 'images/btn_caverns.png'},
            {src: 'images/btn_pressed_caverns.png'},
            {src: 'images/tropicalforestthumb.png'},
            {src: 'images/btn_back.png'},
            {src: 'images/btn_pressed_back.png'},
        //maps
            {src: 'Maps/elegantmansion.tmx'},
            {src: 'Maps/elegantmansion.png'},
            {src: 'Maps/crystalcave.tmx'},
            {src: 'Maps/crystalcave.png'},
            {src: 'Maps/pyramid.png'},
            {src: 'Maps/pyramid.tmx'},
        //snake
            {src: 'images/btn_pressed_continue.png'},
            {src: 'images/btn_continue.png'},
            {src: 'images/layer_gameover.png'},
            {src: 'images/btn_menu.png'},
            {src: 'images/btn_pressed_menu.png'},
            {src: 'images/btn_resume.png'},
            {src: 'images/btn_pressed_resume.png'},
            {src: 'images/btn_quit.png'},
            {src: 'images/btn_pressed_quit.png'},
            {src: 'images/btn_shake.png'},
            {src: 'images/btn_pressed_shake.png'},
        //sounds
            {src: 'sound/The Complex.mp3'},
            {src: 'images/btn_on_sound.png'},
            {src: 'images/btn_off_sound.png'},
            {src: 'sound/menubutton.wav'},
            {src: 'sound/point.mp3'},
            {src: 'sound/crunch.mp3'},
            {src: 'sound/caverns.mp3'},
            {src: 'sound/jungle.mp3'},
            {src: 'sound/bonus.mp3'},
            ];

        cc.Loader.preload(resources, function () {
            cc.Director.getInstance().runWithScene(new this.startScene());
        }, this);

        cc.AudioEngine.getInstance().init("mp3,ogg,wav");

        console.log("adding back/fore listeners");
/*        blackberry.event.addEventListener("pause", onPause);
        blackberry.event.addEventListener("resume", onResume);
        blackberry.event.addEventListener("swipedown", onSwipeDown);*/

        var controls = document.getElementById("freewill");
        controls.style.visibility="hidden";
        /*Setup Gestures */
        var freewill = new Freewill({
                container: controls  
            });
     
        var joystick = freewill.move = freewill.addJoystick({
            imageBase: 'images/freewill/dpad.png',
            imagePad: 'images/freewill/pad.png',
            fixed: true,
            pos: [window.innerWidth*.5 - 80,window.innerHeight*.5 - (5*32)],
            trigger: [0.0, 0.0, window.innerWidth, window.innerHeight*.8],
            opacLow: 0.0,
            opacHigh: 0.0
        });

        freewill.move.onTouchStart = function (touch, point) {
            WildFeast.touchX = point[0];
            WildFeast.touchY = point[1];
            WildFeast.touchStarted=true;
        }

        freewill.move.onTouchMove = function (touch, point) {
            if (WildFeast.touchStarted) {
                if ((WildFeast.touchY - point[1]) < (-50)) {
                    WildFeast.gameplayLayer.player.ndirection = 4;
                    WildFeast.touchStarted = false;
                } else if (WildFeast.touchY- point[1] > 50) {
                    WildFeast.gameplayLayer.player.ndirection = 3;
                    WildFeast.touchStarted = false;
                } else if (WildFeast.touchX - point[0] > 50) {
                    WildFeast.gameplayLayer.player.ndirection = 1;
                    WildFeast.touchStarted = false;
                } else if (WildFeast.touchX - point[0] < -50) {
                    WildFeast.gameplayLayer.player.ndirection = 2;
                    WildFeast.touchStarted = false;
                }
            }
        };


        return true;
    }
});
var myApp = new ccApplication(Menu.scene);

function onPause () {
    if (WildFeast.sound) {
        cc.AudioEngine.getInstance().pauseAllEffects();
        cc.AudioEngine.getInstance().pauseMusic();
    }
    if (WildFeast.running) {
        WildFeast.OpenMenu();
    }
}

function onResume () {
    if (WildFeast.sound) {
        cc.AudioEngine.getInstance().resumeAllEffects();
        cc.AudioEngine.getInstance().resumeMusic();
    }
}

function onSwipeDown () {
    WildFeast.OpenMenu();
}
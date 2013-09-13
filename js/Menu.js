var Menu = cc.Layer.extend({
    init:function () {
        var background = cc.Sprite.create('images/menubackground.png');
        background.setAnchorPoint(new cc.Point(0.0, 0.0));
        background.setPosition(new cc.Point(0,0));
        this.addChild(background);

        var playGame = new cc.MenuItemImage.create('images/btn_startgame.png','images/btn_pressed_startgame.png', this.MapSelection, this);
        playGame.setPosition(new cc.Point(window.innerWidth*.7,window.innerHeight*.6));

        var share = new cc.MenuItemImage.create('images/btn_share.png','images/btn_pressed_share.png', this.Share, this);
        share.setPosition(new cc.Point(window.innerWidth*.69,window.innerHeight*.53));

        var menu = cc.Menu.create(playGame,share);
        menu.setPosition(new cc.Point(0,0));

        cc.AudioEngine.getInstance().setMusicVolume(0.5)

        if(GameSettings.sound) {
           // cc.AudioEngine.getInstance().playMusic('sound/The Complex.mp3',true);
        }

        this.addChild(menu);
        //bbm.register();

        GameSettings.currentScene = this;
        GameSettings.gameOver = false;
        _spinner.stop();


        return true;
    },
    PlayGame:function (pSender) {
        var scene = cc.Scene.create();
        var snakeLayer = Snake.layer();
        scene.addChild(snakeLayer);
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
    },
    MapSelection: function () {
        if(GameSettings.sound) {
            cc.AudioEngine.getInstance().playEffect('sound/menubutton.wav');
        }
        var scene = cc.Scene.create();
        var mapselectionLayer = MapSelection.layer();
        scene.addChild(mapselectionLayer);
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
    },
    Share: function () {
        bbm.inviteToDownload();
    }
});

Menu.layer = function () {
    var sg = new Menu();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};

Menu.scene = function () {
    var scene = cc.Scene.create();
    var layer = Menu.layer();
    scene.addChild(layer);
    return scene;
}

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}
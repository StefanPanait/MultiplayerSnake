var Menu = cc.Layer.extend({
    init:function () {
        var background = cc.Sprite.create('images/menubackground.png');
        background.setAnchorPoint(new cc.Point(0.0, 0.0));
        background.setPosition(new cc.Point(0,0));
        this.addChild(background);

        var playGame = new cc.MenuItemImage.create('images/btn_startgame.png','images/btn_pressed_startgame.png', this.MapSelection, this);
        playGame.setPosition(new cc.Point(window.innerWidth*.7,window.innerHeight*.6));

        var share = new cc.MenuItemImage.create('images/btn_share.png','images/btn_pressed_share.png', bbm.inviteToDownload, this);
        share.setPosition(new cc.Point(window.innerWidth*.69,window.innerHeight*.53));

        var howToPlay = new cc.MenuItemImage.create('images/btn_howtoplay.png','images/btn_howtoplay.png', this.PlayGame, this);
        howToPlay.setPosition(new cc.Point(window.innerWidth*.7,window.innerHeight*.47));

        var highscore = new cc.MenuItemImage.create('images/btn_highscore.png','images/btn_highscore.png', this.PlayGame, this);
        highscore.setPosition(new cc.Point(window.innerWidth*.78,window.innerHeight*.35));

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
        toggler.setPosition(new cc.Point(window.innerWidth*.85,window.innerHeight*.1));

        var menu = cc.Menu.create(playGame,toggler);
        menu.setPosition(new cc.Point(0,0));

        cc.AudioEngine.getInstance().setMusicVolume(0.5)

        if(GameSettings.sound) {
            cc.AudioEngine.getInstance().playMusic('sound/The Complex.mp3',true);
        }


        this.addChild(menu);
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
    ToggleSound: function () {
        GameSettings.ToggleSound();
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


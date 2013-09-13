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



        var menu = cc.Menu.create(playGame);
        menu.setPosition(new cc.Point(0,0));

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
        var scene = cc.Scene.create();
        var mapselectionLayer = MapSelection.layer();
        scene.addChild(mapselectionLayer);
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
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


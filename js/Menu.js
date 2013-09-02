var Menu = cc.Layer.extend({
    init:function () {
        var background = cc.Sprite.create('images/menubackground.png');
        background.setAnchorPoint(new cc.Point(0.0, 0.0));
        background.setPosition(new cc.Point(0,0));
        this.addChild(background, 0);

        var playGame = new cc.MenuItemImage.create('images/btn_play.png','images/btn_play.png', this.PlayGame, this);
        playGame.setPosition(new cc.Point(window.innerWidth*.7,window.innerHeight*.6));

        var howToPlay = new cc.MenuItemImage.create('images/btn_howtoplay.png','images/btn_howtoplay.png', this.PlayGame, this);
        howToPlay.setPosition(new cc.Point(window.innerWidth*.7,window.innerHeight*.47));

        var highscore = new cc.MenuItemImage.create('images/btn_highscore.png','images/btn_highscore.png', this.PlayGame, this);
        highscore.setPosition(new cc.Point(window.innerWidth*.78,window.innerHeight*.35));



        var menu = cc.Menu.create(playGame,howToPlay,highscore);
        menu.setPosition(new cc.Point(0,0));

        this.addChild(menu,0);

        return true;
    },
    PlayGame:function (pSender) {
        var scene = cc.Scene.create();

        var snakeLayer = Snake.layer();

        scene.addChild(snakeLayer);

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


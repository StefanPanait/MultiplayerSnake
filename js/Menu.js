var Menu = cc.Layer.extend({
    init:function () {

console.log("eh");


console.log("eh2");
        var background = cc.Sprite.create('images/menubackground.png');
        background.setAnchorPoint(new cc.Point(0.0, 0.0));
        background.setPosition(new cc.Point(window.innerWidth/2,window.innerHeight/2));
        this.addChild(background, 0);

        var playGameSprite = cc.Sprite.create ('images/btn_play.png');
        var playGameSpriteClicked = cc.Sprite.create ('images/btn_play.png');
                console.log("running");
       // var playGame = new cc.MenuItemSprite.create(playGameSprite,null, this.PlayGame, this);
var playGame = new cc.MenuItemFont.create("Play Game",this.PlayGame,this);
      playGame.setColor(new cc.Color3B(255,0,0));
        playGame.setPosition(new cc.Point(window.innerWidth*.7,window.innerHeight*.6));

        var menu = cc.Menu.create(playGame);
        menu.setPosition(new cc.Point(0,0));

        this.addChild(menu,1);

        return true;
    },
    PlayGame:function (pSender) {
                var tmx = cc.TMXTiledMap.create('Maps/Level_One.tmx');
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


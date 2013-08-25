var Menu = cc.Layer.extend({
    init:function () {

        var helloLabel = cc.LabelTTF.create("Hello world", "Arial", 30);
        helloLabel.setPosition(new cc.Point(1000/2,1000/2));
        helloLabel.setColor(new cc.Color3B(255,0,0));
        //this.addChild(helloLabel,0);

        //this.initWithColor(new cc.Color4B(0,0,0,255));
        var size = cc.Director.getInstance().getWinSize();

        var PlayGame = new cc.MenuItemFont.create("Play Game",this.PlayGame,this);


        PlayGame.setPosition(new cc.Point(1000/2,1000/2));
        PlayGame.setColor(new cc.Color3B(255,0,0));

        var menu = cc.Menu.create(PlayGame);
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
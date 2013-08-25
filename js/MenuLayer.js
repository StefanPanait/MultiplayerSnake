
var Menu = cc.Layer.extend({
    init:function () {
        var about = cc.LabelTTF.create("   This showcase utilizes many features from Cocos2d-html5 engine, including: Parallax background, tilemap, actions, ease, frame animation, schedule, Labels, keyboard Dispatcher, Scene Transition. \n    Art and audio is copyrighted by Enigmata Genus Revenge, you may not use any copyrigted material without permission. This showcase is licensed under GPL. \n\nProgrammer: \n Shengxiang Chen\n Dingping Lv \n Effects animation: Hao Wu\n Quality Assurance:  Sean Lin", "Arial", 14, cc.size(window.innerWidth * 0.85, 320), cc.TEXT_ALIGNMENT_LEFT );
        about.setPosition(cc.p(window.innerWidth / 2,  window.innerHeight/2 -20) );
        about.setAnchorPoint( cc.p(0.5, 0.5));
        this.addChild(about);

        var label = cc.LabelTTF.create("Go back", "Arial", 14);
        var back = cc.MenuItemLabel.create(label, this, this.backCallback);
        var menu = cc.Menu.create(back);
        menu.setPosition(cc.p(window.innerWidth / 2, 40));
        this.addChild(menu);

        this.background = cc.Sprite.create('Maps/Level_One.png');
        this.background.setAnchorPoint(new cc.Point(0.0, 0.0));
        this.background.setPosition(new cc.Point(0.0, 0.0));
        this.addChild(this.background, 0);

        return true;
    },
    backCallback:function (pSender) {
        var scene = cc.Scene.create();
        scene.addChild(SysMenu.create());
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
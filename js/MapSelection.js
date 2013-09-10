var MapSelection = cc.Layer.extend({
    init:function () {
        var background = cc.Sprite.create('images/mapselection.png');
        background.setAnchorPoint(new cc.Point(0.0, 0.0));
        background.setPosition(new cc.Point(0,0));
        this.addChild(background, 0);

        var elegantmansionthumb = new cc.MenuItemImage.create('images/elegantmansionthumb.png','images/elegantmansionthumb.png', this.PlayElegantMansion, this);
        elegantmansionthumb.setPosition(new cc.Point(window.innerWidth*.2,window.innerHeight*.7));

        var elegantmansionLabel = new cc.MenuItemImage.create('images/btn_mansion.png','images/btn_pressed_mansion.png', this.PlayElegantMansion, this);
        elegantmansionLabel.setPosition(new cc.Point(window.innerWidth*.5,window.innerHeight*.7));

        var cavernsImage = new cc.MenuItemImage.create('images/crystalcavethumb.png','images/crystalcavethumb.png', this.PlayCrystalCave, this);
        cavernsImage.setPosition(new cc.Point(window.innerWidth*.2,window.innerHeight*.6));

        var cavernsLabel = new cc.MenuItemImage.create('images/btn_caverns.png','images/btn_pressed_caverns.png', this.PlayCrystalCave, this);
        cavernsLabel.setPosition(new cc.Point(window.innerWidth*.5,window.innerHeight*.6));

        var tropicalforestthumb = new cc.MenuItemImage.create('images/tropicalforestthumb.png','images/tropicalforestthumb.png', this.PlayTropicalForest, this);
        tropicalforestthumb.setPosition(new cc.Point(window.innerWidth*.2,window.innerHeight*.5));

        var back = new cc.MenuItemImage.create('images/btn_back.png','images/btn_pressed_back.png', this.Back, this);
        back.setPosition(new cc.Point(window.innerWidth*.15,window.innerHeight*.2));



        var menu = cc.Menu.create(cavernsImage,cavernsLabel,elegantmansionLabel,elegantmansionthumb,back);
        menu.setPosition(new cc.Point(0,0));

        this.addChild(menu,0);

        return true;
    },
    Back: function () {
        if(GameSettings.sound) {
            cc.AudioEngine.getInstance().playEffect('sound/menubutton.wav');
        }
        var scene = cc.Scene.create();
        var menuLayer = Menu.layer();
        scene.addChild(menuLayer);
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
    },
    PlayElegantMansion:function (pSender) {
        if(GameSettings.sound) {
            cc.AudioEngine.getInstance().playEffect('sound/menubutton.wav');
        }
        GameSettings.mapName = 'elegantmansion';
        this.StartGame();
    },
    PlayCrystalCave:function (pSender) {
        if(GameSettings.sound) {
            cc.AudioEngine.getInstance().playEffect('sound/menubutton.wav');
        }
        GameSettings.mapName = 'crystalcave';
        this.StartGame();
    },
    PlayTropicalForest:function (pSender) {
        if(GameSettings.sound) {
            cc.AudioEngine.getInstance().playEffect('sound/menubutton.wav');
        }
        GameSettings.mapName = 'tropicalforest';
        this.StartGame();
    },
    StartGame: function() {
        var scene = cc.Scene.create();
        var snakeLayer = Snake.layer();
        scene.addChild(snakeLayer);
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
    }
});

MapSelection.layer = function () {

    var sg = new MapSelection();

    if (sg && sg.init()) {
        return sg;
    }

    return null;
};
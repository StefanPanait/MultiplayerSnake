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

        var back = new cc.MenuItemImage.create('images/btn_back.png','images/btn_pressed_back.png', this.Back, this);
        back.setPosition(new cc.Point(window.innerWidth*.15,window.innerHeight*.2));



        var menu = cc.Menu.create(elegantmansionLabel,elegantmansionthumb,back);
        menu.setPosition(new cc.Point(0,0));

        this.addChild(menu,0);
        WildFeast.currentScene = this;
        return true;
    },
    Back: function () {
        if(WildFeast.sound) {
            cc.AudioEngine.getInstance().playEffect('sound/menubutton.wav');
        }
        var scene = cc.Scene.create();
        var menuLayer = Menu.layer();
        scene.addChild(menuLayer);
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
    },
    PlayElegantMansion:function (pSender) {
        if(WildFeast.sound) {
            cc.AudioEngine.getInstance().playEffect('sound/menubutton.wav');
        }
        WildFeast.mapName = 'elegantmansion';
        this.StartGame();
    },
    PlayCrystalCave:function (pSender) {
        if(WildFeast.sound) {
            cc.AudioEngine.getInstance().playEffect('sound/menubutton.wav');
        }
        WildFeast.mapName = 'crystalcave';
        this.StartGame();
    },
    PlayTropicalForest:function (pSender) {
        if(WildFeast.sound) {
            cc.AudioEngine.getInstance().playEffect('sound/menubutton.wav');
        }
        WildFeast.mapName = 'tropicalforest';
        this.StartGame();
    },
    StartGame: function() {
        cc.AudioEngine.getInstance().resumeMusic();
        cc.AudioEngine.getInstance().stopMusic();
        var target = document.getElementById('activity');
        _spinner.spin(target); 
        
        var scene = WildFeast.WildFeast();
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
        _spinner.stop();
    }
});

MapSelection.layer = function () {
    var sg = new MapSelection();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};
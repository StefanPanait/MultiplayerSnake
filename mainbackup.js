var ccApplication = cc.Application.extend({
    config:document.ccConfig,
    ctor:function (scene) {
        this._super();
        this.startScene = scene;
        cc.COCOS2D_DEBUG = this.config['COCOS2D_DEBUG'];
        cc.setup(this.config['tag']);

        /* Initialize our primary <canvas>. */
  /*        cc.setup('gameCanvas', window.innerWidth, window.innerHeight);
      document.querySelector('#Cocos2dGameContainer').style.overflow = 'hidden';
        document.querySelector('#Cocos2dGameContainer').style.position = 'fixed';
        document.querySelector('#gameCanvas').style.position = 'fixed';*/

        cc.Loader.getInstance().onloading = function () {
            cc.LoaderScene.shareLoaderScene().draw();
        };
        cc.Loader.getInstance().onload = function () {
            cc.AppController.shareAppController().didFinishLaunchingWithOptions();
        };
        cc.Loader.preload(ccb_resources, function () {
            cc.Loader.getInstance().preload([
                {type: 'tmx', src: 'Maps/Level_One.xml'},
                {type: 'image', src: 'Maps/Level_One.png'},
                {type: 'image', src: 'Maps/tmw_desert_spacing.png'}
            ]);
    },
    applicationDidFinishLaunching:function () {
        var director = cc.Director.getInstance();
        director.setDisplayStats(this.config['showFPS']);
        director.setAnimationInterval(1.0 / this.config['frameRate']);
        director.runWithScene(new this.startScene());

        return true;
    }
});
var myApp = new ccApplication(Menu.scene);







var ccApplication = cc.Application.extend({
    config:document.ccConfig,
    ctor:function (scene) {
        this._super();
        this.startScene = scene;
        cc.COCOS2D_DEBUG = this.config['COCOS2D_DEBUG'];
        cc.initDebugSetting();
        cc.setup(this.config['tag']);
        cc.AppController.shareAppController().didFinishLaunchingWithOptions();   


        cc.Loader.getInstance().onloading = function () {
            cc.LoaderScene.shareLoaderScene().draw();
        };
        cc.Loader.getInstance().onload = function () {
            cc.AppController.shareAppController().didFinishLaunchingWithOptions();
        };



    },
    applicationDidFinishLaunching:function () {
        var director = cc.Director.getInstance();
        director.setDisplayStats(this.config['showFPS']);
        director.setAnimationInterval(1.0 / this.config['frameRate']);
        director.runWithScene(new this.startScene());

        cc.LoaderScene.preload([
            {type: 'tmx', src: 'Maps/Level_Two.tmx'},
            {type: 'image', src: 'Maps/Level_Two.png'},
            {type: 'image', src: 'Maps/tmw_desert_spacing.png'}
            ], 
            function () { director.replaceScene(new this.startScene());
            }, 
            this);

        return true;
    }
});
var myApp = new ccApplication(Menu.scene);



// Needed for HTML5
var cocos2dApp = cc.Application.extend({
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
        cc.Loader.preload(ccb_resources, function () {
            cc.Director.getInstance().runWithScene(new this.startScene());
        }, this);

        return true;
    }
});
var myApp = new cocos2dApp(CCBMainScene);
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
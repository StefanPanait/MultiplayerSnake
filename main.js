var ccApplication = cc.Application.extend({
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
var tiledmap = 'Maps/Level_Two.tmx';
        //load resources
        var resources = [
            {src: 'Maps/tile17.png'},
            {src: 'Maps/Level_One.tmx'},
            {src: 'Maps/Level_Four.tmx'},
            {src: 'Maps/Level_Four.png'},
            {src: tiledmap},
            {src: 'Maps/Level_One.png'},
            {src: 'Maps/tmw_desert_spacing.png'}
            ];

        cc.Loader.preload(resources, function () {
            cc.Director.getInstance().runWithScene(new this.startScene());
        }, this);

        return true;
    }
});
var myApp = new ccApplication(Menu.scene);
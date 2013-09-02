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
        //load resources
        var resources = [
        //tiles
            {src: 'Maps/tile02.png'},
            {src: 'Maps/tile04-edited.jpg'},
            {src: 'Maps/tile12.png'},
            {src: 'Maps/tile20.png'},
            {src: 'Maps/tile29.png'},
            {src: 'Maps/tile30.png'},
            {src: 'Maps/tile31.png'},
            {src: 'Maps/tile35.png'},
            {src: 'Maps/tile06edited.png'},
            {src: 'Maps/tile06edited02.png'},
            {src: 'Maps/Untitled-1.png'},
            {src: 'Maps/tile13.png'},
            {src: 'Maps/tile21.png'},
            {src: 'Maps/tile17.png'},
            {src: 'Maps/tmw_desert_spacing.png'},
        //controls
            {src: 'images/btn_play.png'},
            {src: 'images/btn_up.png'},
            {src: 'images/btn_down.png'},
            {src: 'images/btn_left.png'},
            {src: 'images/btn_right.png'},

        //snake
            {src: 'images/snakebody.png'},

        //points
            {src: 'images/rabbit_points_01.png'},

        //main menu
            {src: 'images/btn_howtoplay.png'},
            {src: 'images/btn_highscore.png'},
            {src: 'images/menubackground.png'},

        //maps
            {src: 'Maps/Level_One.tmx'},
            {src: 'Maps/Level_One.png'},
            {src: 'Maps/Level_Four.tmx'},
            {src: 'Maps/Level_Four.png'},
            {src: 'Maps/Level_Five.tmx'},
            {src: 'Maps/Level_Five.png'},
            {src: 'Maps/Level_Two.tmx'}


            ];

        cc.Loader.preload(resources, function () {
            cc.Director.getInstance().runWithScene(new this.startScene());
        }, this);

        return true;
    }
});
var myApp = new ccApplication(Menu.scene);
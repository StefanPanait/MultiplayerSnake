var gameplay = cc.Layer.extend({
    physics: null,
    player: null,
    points: null,
    score: 0,
    timer: 0,
    label_Timer: null,
    collision_Timer: 0,
    fps: 30,
    menuLayer: null,
    menuLayerExists: false,
    schedulerSetup: false,
    spriteLocations: [],
    spriteSpawnTimer: 0,
    pointToAdd: null,
    scoreMultiplier: 1,
    collisionBuffer: 0,
    lastPointGained: null,
    bonusAvailable: null,
    speedupAvailable: null,
    init: function () {
        this._super();
        this.setKeyboardEnabled(true);
        var tmx = cc.TMXTiledMap.create('Maps/' + WildFeast.mapName + '.tmx');
        this.physics = new Worker('js/Box2dWebWorker.js');
        this.physics.addEventListener('message', physicsListener);
        this.setKeyboardEnabled(true);

        this.physics.postMessage({
            msg: 'init',
            walls: tmx.getObjectGroup('Walls').getObjects(),
            points: tmx.getObjectGroup('Points').getObjects(),
            startPoints: tmx.getObjectGroup('StartPoints').getObjects()
        });

        //refresh variables
        this.spriteLocations = [];
        this.score = 0;
        this.timer = 0;
        this.collision_Timer = 0;
        this.menuLayer = null;
        this.menuLayerExists = false;
        this.schedulerSetup = false;
        this.spriteSpawnTimer = 0;
        this.pointToAdd = null;
        this.scoreMultiplier = 1;
        this.collisionBuffer = 0;
        this.lastPointGained = null;
        this.bonusAvailable = 0;
        this.speedupAvailable = 0;

        var background = cc.Sprite.create('Maps/' + WildFeast.mapName + '.png');
        background.setAnchorPoint(new cc.Point(0.0, 0.0));
        background.setPosition(new cc.Point(0.0, 0.0));
        this.addChild(background, 0);

        var startPoints = tmx.getObjectGroup('StartPoints').getObjects();

        this.player = cc.Sprite.create('images/snakeheadtest.png');
        this.player.setPosition(new cc.Point(((startPoints[0].x + 1) + 30 / 2.0), ((startPoints[0].y + 1) + 30 / 2.0)));
        this.player.cx = ((startPoints[0].x + 1) + 30 / 2.0);
        this.player.cy = ((startPoints[0].y + 1) + 30 / 2.0);
        this.player.nx;
        this.player.ny;
        WildFeast.SetSpeed(0);
        this.player.speed = WildFeast.GetSpeed();
        this.player.newSpeed = WildFeast.GetSpeed();
        this.player.cdirection = 2;
        this.player.ndirection = 2;
        this.player.body = [];
        this.player.bodyLocations = [];
        this.addChild(this.player, 3);

        /* Load the points. */
        this.points = tmx.getObjectGroup('Points').getObjects();
        this.points.sprites = {};
        for (n = 0; n < this.points.length; n = n + 1) {
            var sprite = ChoosePoint();
            sprite.points = this.points[n].points;
            this.points.sprites[this.points[n].x + "," + this.points[n].y] = sprite;
            this.points.sprites[this.points[n].x + "," + this.points[n].y].setPosition(
                new cc.Point(
                    this.points[n].x + this.points[n].width / 2.0,
                    this.points[n].y + this.points[n].height / 2.0
                )
            );
            this.addChild(this.points.sprites[this.points[n].x + "," + this.points[n].y], 2);
        }

        WildFeast.running = true;

        switch (WildFeast.mapName) {
        case "elegantmansion":
            cc.AudioEngine.getInstance().playMusic('sound/jungle.mp3', true);
            break;
        case "crystalcave":
            cc.AudioEngine.getInstance().playMusic('sound/caverns.mp3', true);
            break;
        }
        if (WildFeast.sound === false) {
            cc.AudioEngine.getInstance().pauseMusic();
        }

        this.setScale(WildFeast.scale);
        this.setPosition(-(( WildFeast.gameplayLayer.player.cx * WildFeast.scale) - ((window.innerWidth / 2) * WildFeast.scale)), -(( WildFeast.gameplayLayer.player.cy * WildFeast.scale) - (window.innerHeight / 2) * WildFeast.scale));

        //done loading
        


        return true;
    },
    onKeyDown: function (e) {
        if (e === 37) { //left
            this.player.ndirection = 1;
        } else if (e === 39) { //right
            this.player.ndirection = 2;
        } else if (e === 38) { //up
            this.player.ndirection = 3;
        } else if (e === 40) { //down
            this.player.ndirection = 4;
        }
    },
    MoveUp: function () {
        this.player.ndirection = 3;
    },
    MoveDown: function () {
        this.player.ndirection = 4;
    },
    MoveLeft: function () {
        this.player.ndirection = 1;
    },
    MoveRight: function () {
        this.player.ndirection = 2;
    },
    SpawnPoint: function () {
        if (this.spriteLocations.length === 0) {
            return;
        }
        var index = Math.floor((Math.random() * this.spriteLocations.length));
        this.pointToAdd = this.spriteLocations[index];
        var x = parseInt(this.spriteLocations[index].split(",")[0]);
        var y = parseInt(this.spriteLocations[index].split(",")[1]);
        var sprite = ChoosePoint();
        this.points.sprites[this.spriteLocations[index]] = sprite;
        this.points.sprites[this.spriteLocations[index]].setPosition(new cc.Point((x + 16), (y + 16)));
        this.addChild(this.points.sprites[this.spriteLocations[index]], 2);
        this.spriteLocations.splice(index, 1);
    }
});
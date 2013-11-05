var Multiplayer = cc.Layer.extend({
    init:function () {
        this.gameName = null;
        this.server = null;
        this.lbl_latency = null;
        this.last_ping_time = null;


        var background = cc.Sprite.create('images/mapselection.png');
        background.setAnchorPoint(new cc.Point(0.0, 0.0));
        background.setPosition(new cc.Point(0,0));
        this.addChild(background);

        this.lbl_latency = cc.LabelTTF.create('-1',  'Times New Roman');
        this.lbl_latency.setPosition(new cc.Point(window.innerWidth*.85,window.innerHeight*.2));
        this.addChild(this.lbl_latency);

        if (!localStorage.name) {
            localStorage.name =prompt("Player Name","");
/*            var name_TF = cc.TextFieldTTF.create("NAME HERE PLEASE", "Arial", 32);
            name_TF.setPosition(new cc.Point(window.innerWidth*.2,window.innerHeight*.7));
            var number = Math.floor((Math.random()*10)+1);
            localStorage.name = "testing"+number;
            this.addChild(name_TF,1);*/
        }

        var server = io.connect('http://localhost:4000');
        setTimeout(function() {if (!WildFeast.connected) console.log("Couldn't Connect To Server!");},5000);

        server.on('onconnected', function (data) {
            console.log("connected");
            WildFeast.connected = true;
            server.emit("setName", {name: localStorage.name});
            console.log(new Date().getTime());


        }.bind(this));

        server.on('message', function (data) {
            console.log("message: ", data);
        }.bind(this));

        server.on('room_information', function (data) {
            console.log("room is: ",data);
            console.log("Room id is: " +data.id);
        }.bind(this));

        server.on('ping', function (data) {
            this.lbl_latency.setString(String(data.latency));
            server.emit("ping", {});
        }.bind(this));

        var btn_gameName = cc.MenuItemFont.create("Game Name", this.getGameName, this)
        btn_gameName.setPosition(new cc.Point(window.innerWidth*.67,window.innerHeight*.35));
        
        var btn_join = cc.MenuItemFont.create("Join", this.join, this)
        btn_join.setPosition(new cc.Point(window.innerWidth*.67,window.innerHeight*.40));

        var btn_create = cc.MenuItemFont.create("Create", this.create, this)
        btn_create.setPosition(new cc.Point(window.innerWidth*.67,window.innerHeight*.55));

        var back = new cc.MenuItemImage.create('images/btn_back.png','images/btn_pressed_back.png', this.Back, this);
        back.setPosition(new cc.Point(window.innerWidth*.15,window.innerHeight*.2));



        var menu = cc.Menu.create(back,btn_join, btn_gameName, btn_create);
        menu.setPosition(new cc.Point(0,0));
        this.addChild(menu);

        this.server = server;
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
    join: function () {
        this.server.emit('joinRoom', {gameName: this.gameName});
    },
    create: function () {
        this.server.emit('createRoom', {gameName: this.gameName});
    },
    getGameName: function () {
        this.gameName =prompt("Enter Game Name","");
    }
});

Multiplayer.layer = function () {
    var sg = new Multiplayer();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};
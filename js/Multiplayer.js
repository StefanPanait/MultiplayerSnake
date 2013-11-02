var Multiplayer = cc.Layer.extend({
    gameName: null,
    socket: null,
    init:function () {
        var background = cc.Sprite.create('images/mapselection.png');
        background.setAnchorPoint(new cc.Point(0.0, 0.0));
        background.setPosition(new cc.Point(0,0));
        this.addChild(background, 0);

        if (!localStorage.name) {
            localStorage.name =prompt("Player Name","");
/*            var name_TF = cc.TextFieldTTF.create("NAME HERE PLEASE", "Arial", 32);
            name_TF.setPosition(new cc.Point(window.innerWidth*.2,window.innerHeight*.7));
            var number = Math.floor((Math.random()*10)+1);
            localStorage.name = "testing"+number;
            this.addChild(name_TF,1);*/
        }

        socket = io.connect('http://localhost:4000');
        setTimeout(function() {if (!WildFeast.connected) console.log("Couldn't Connect To Server!");},5000);

        socket.on('onconnected', function (data) {
            console.log("connected");
            WildFeast.connected = true;
            socket.emit("setName", {name: localStorage.name});
        });

        socket.on('message', function (data) {
            console.log("message: ", data);
        });

        socket.on('room_information', function (data) {
            console.log("room is: ",data);
            console.log("Room id is: " +data.id);
        });


        this.gameName =prompt("Enter Game Name","");

        var btn_join = cc.MenuItemFont.create("Join", this.Join, this)
        btn_join.setPosition(new cc.Point(window.innerWidth*.67,window.innerHeight*.40));
        var btn_create = cc.MenuItemFont.create("Create", this.Host, this)
        btn_create.setPosition(new cc.Point(window.innerWidth*.57,window.innerHeight*.40));

        var back = new cc.MenuItemImage.create('images/btn_back.png','images/btn_pressed_back.png', this.Back, this);
        back.setPosition(new cc.Point(window.innerWidth*.15,window.innerHeight*.2));



        var menu = cc.Menu.create(cavernsImage,cavernsLabel,elegantmansionLabel,elegantmansionthumb,back);
        menu.setPosition(new cc.Point(0,0));

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
    Join: function () {
        socket.emit('joinRoom', {gameName: gameName});
    },
    Host: function () {
        socket.emit('createRoom', {gameName: gameName});
    }
});

Multiplayer.layer = function () {
    var sg = new Multiplayer();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};
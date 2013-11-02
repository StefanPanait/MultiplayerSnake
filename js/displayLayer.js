var display = cc.Layer.extend({
    label_Score: null,
    label_Speed: null,
    label_Multiplier: null,
    label_CollisionBuffer: null,
    shakeToggler: null,
    init: function () {
         /* Display Score */
        this.label_Score = cc.LabelTTF.create("Score: 0", "Arial", 35);
        this.label_Score.setPosition(new cc.Point(window.innerWidth * .12, window.innerHeight * .1));
        this.label_Score.setColor(new cc.Color3B(0, 34, 102));
        this.addChild(this.label_Score, 5);

        /* Display Timer */
        this.label_Timer = cc.LabelTTF.create("Time: 0", "Arial", 35);
        this.label_Timer.setPosition(new cc.Point(window.innerWidth * .1, window.innerHeight * .05));
        this.label_Timer.setColor(new cc.Color3B(84, 84, 84));
        this.addChild(this.label_Timer);

        /* Display Multiplier */
        this.label_Multiplier = cc.LabelTTF.create("Multiplier: 1", "Arial", 35);
        this.label_Multiplier.setPosition(new cc.Point(window.innerWidth * .5, window.innerHeight * .13));
        this.label_Multiplier.setColor(new cc.Color3B(0, 34, 102));
        this.addChild(this.label_Multiplier, 5);

        /* Display Speed */
        this.label_Speed = cc.LabelTTF.create("Speed: " + WildFeast.speedIndex, "Arial", 35);
        this.label_Speed.setPosition(new cc.Point(window.innerWidth * .5, window.innerHeight * .08));
        this.label_Speed.setColor(new cc.Color3B(0, 34, 102));
        this.addChild(this.label_Speed, 5);

        /* Display Score */
        this.label_CollisionBuffer = cc.LabelTTF.create("Collision Buffer: 0.5", "Arial", 35);
        this.label_CollisionBuffer.setPosition(new cc.Point(window.innerWidth * .5, window.innerHeight * .03));
        this.label_CollisionBuffer.setColor(new cc.Color3B(0, 34, 102));
        this.addChild(this.label_CollisionBuffer, 5);


        var btn_shake = cc.MenuItemImage.create("images/btn_shake.png");
        var btn_pressed_shake = cc.MenuItemImage.create("images/btn_pressed_shake.png");
        this.shakeToggler = new cc.MenuItemToggle.create(btn_pressed_shake);
        this.shakeToggler.addSubItem(btn_shake);
        this.shakeToggler.setTarget(this.Shake, this);
        this.shakeToggler.setPosition(new cc.Point(window.innerWidth * .80, window.innerHeight * .08));
        this.shakeToggler.setEnabled(false);

        var menu = cc.Menu.create(this.shakeToggler);
        menu.setPosition(new cc.Point(0, 0));
        this.addChild(menu, 5);
    },
    Shake: function () {
        console.log("shake");
        if (WildFeast.gameplayLayer.bonusAvailable === -1) {
            console.log("shakse");
            this.shakeToggler.setEnabled(false);
            WildFeast.gameplayLayer.score += 150 * WildFeast.gameplayLayer.scoreMultiplier;
            this.label_Score.setString("Score: " + WildFeast.gameplayLayer.score);
            if (WildFeast.sound) {
                cc.AudioEngine.getInstance().playEffect('sound/bonus.mp3');
            }
        }

    }
});
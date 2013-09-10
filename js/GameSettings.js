var GameSettings = {
	fps: 30,
	mapName: null,
	gesturesSet: false,
	endTimer: 60,
	speeds: [3.2, 4, 6.4, 8],
	speedIndex: 2,
	sound: true,
	IncrementSpeed: function() {
		if (this.speedIndex!=this.speeds.length-1) {
			this.speedIndex++;
		}
	},
	DecrementSpeed: function() {
		if (this.speedIndex!=0) {
			this.speedIndex--;
		}
	},
	GetSpeed: function() {
		return this.speeds[this.speedIndex];
	},
	SetSpeed: function(i) {
		this.speedIndex = i;
	},
    ToggleSound: function () {
    	this.sound = !this.sound;
	    if (this.sound===false) {
	        cc.AudioEngine.getInstance().pauseAllEffects();
	        cc.AudioEngine.getInstance().pauseMusic();
	    } else {
	        cc.AudioEngine.getInstance().resumeAllEffects();
	        cc.AudioEngine.getInstance().resumeMusic();
	    }
	}


}


function SetupGestures() {
	if (!GameSettings.gesturesSet) {
		console.log("gestures set");
		var canvas = document.getElementById("gameCanvas");


    	Hammer(canvas).on("swipeleft", function() {
    		alert("left");
	        $(this).find(".color").animate({left: "-=100"}, 500);
	        $("#event").text("swipe left");
    	});


/*		canvas.onswipedown = function(ev) {
			alert("swipe down");
		};
		canvas.ondoubletap = function(ev) {
			alert("tap");
		}*/
		GameSettings.gesturesSet = true;
	}
}
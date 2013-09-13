(function () {

    var canvas = document.getElementById("gameCanvas");
    canvas.style.width = window.innerWidth;
    canvas.style.height = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var d = document;
    var c = {
        COCOS2D_DEBUG:2, //0 to turn debug off, 1 for basic debug, and 2 for full debug
        box2d:false,
        showFPS:false,
        frameRate:30,
        tag:'gameCanvas', //the dom element to run cocos2d on
        engineDir:'cocos/cocos2d/',
        appFiles:[
        'js/GameSettings.js',
        'js/Snake.js',
        'js/MapSelection.js',
        'js/Menu.js',
        'js/lib/Freewill.js'
        ]
    };
    window.addEventListener('DOMContentLoaded', function () {
        //first load engine file if specified
        var s = d.createElement('script');
        s.src = c.engineDir + 'platform/jsloader.js';
        d.body.appendChild(s);
        document.ccConfig = c;
        s.id = 'cocos2d-html5';
    });
})();
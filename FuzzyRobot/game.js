
var mpx, mpy, rpx, rpy;
var alto = screen.height; // returns height of HTML document
var ancho = screen.width; // returns width of HTML document

var x_pelota = random_function(ancho - 35);
var y_pelota = random_function(alto - 100);
var x_robot = random_function(ancho - 50);
var y_robot = random_function(alto - 50);

var grados = 0;
var temp = 0;
var px = "px";
var an = Math.floor(ancho - 40) + "px";
var al = Math.floor(alto / 2) + "px";



$(document).ready(function () {

    window.requestAnimFrame = (function (callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    })();

    porteria();


    pinta();


    setTimeout(function () {
        var startTime = (new Date()).getTime();
        animacion();
    }, 1000);

});

function pinta() {

    mpx = x_pelota + px;
    mpy = y_pelota + px;

    pelota();

    rpx = x_robot + px;
    rpy = y_robot + px;

    robot();

    sleep(1000);

    if (Math.sqrt(((x_pelota - x_robot) * (x_pelota - x_robot)) + ((y_pelota - y_robot) * (y_pelota - y_robot))) < 10)
        return 1;
    else
        return 0;


}


function animacion() {

    var index = 0;

    if (temp != 1) {
        grados = getGrados();
        temp = check(grados);
    }

    requestAnimFrame(function () {
        animacion();
    });
}

function check(angle) {

    if (getNorthFuzzy(angle) != 0) {
        y_robot -= 15;
        return (pinta() == 1 ? 1 : 0);
    }
    if (getNorthEastFuzzy(angle) != 0) {
        y_robot -= 15;
        x_robot += 15;
        return (pinta() == 1 ? 1 : 0);
    }

    if (getEastFuzzy(angle) != 0) {
        x_robot += 15;
        return (pinta() == 1 ? 1 : 0);
    }

    if (getSouthEastFuzzy(angle) != 0) {
        x_robot += 15;
        y_robot += 15;
        return (pinta() == 1 ? 1 : 0);
    }
    if (getSouthFuzzy(angle) != 0) {
        y_robot += 15;
        return (pinta() == 1 ? 1 : 0);
    }
    if (getSouthWestFuzzy(angle) != 0) {
        x_robot -= 15;
        y_robot += 15;
        return (pinta() == 1 ? 1 : 0);
    }
    if (getWestFuzzy(angle) != 0) {
        x_robot -= 15;
        return (pinta() == 1 ? 1 : 0);
    }
    if (getNorthWestFuzzy(angle) != 0) {
        x_robot -= 15;
        y_robot -= 15;
        return (pinta() == 1 ? 1 : 0);
    }

}


function getGrados() {

    var x = x_pelota - x_robot;
    var y = y_pelota - y_robot;

    var theta = Math.atan2(-y, x);

    if (theta < 0)
        theta += 2 * Math.PI;

    return theta * (180 / Math.PI);
}

function robot() {

    var robot = document.getElementById("robot");

    robot.width = 35;
    robot.height = 100;
    robot.style.left = rpx;
    robot.style.top = rpy;
    robot.style.position = "absolute";

    var ctxRobot = robot.getContext("2d");
    ctxRobot.lineWidth = 3;
    ctxRobot.beginPath();
    ctxRobot.moveTo(0, 75);
    ctxRobot.lineTo(30, 15);
    ctxRobot.stroke();

}

function porteria() {

    var porteria = document.getElementById("porteria");

    porteria.width = 50;
    porteria.height = 100;
    porteria.style.left = an;
    porteria.style.top = al;
    porteria.style.position = "absolute";

    var ctxPorteria = porteria.getContext("2d");
    ctxPorteria.lineWidth = 10;
    ctxPorteria.beginPath();
    ctxPorteria.moveTo(1, 1);
    ctxPorteria.lineTo(5, 50);
    ctxPorteria.stroke();

}

function pelota(x, y) {
    var ball = document.getElementById('pelota');

    ball.width = 50;
    ball.height = 50;
    ball.style.left = mpx;
    ball.style.top = mpy;
    ball.style.position = "absolute";


    var ctxBall = ball.getContext('2d');
    var centerX = ball.width / 2;
    var centerY = ball.height / 2;
    var radius = 20;


    ctxBall.beginPath();
    ctxBall.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctxBall.fillStyle = 'blue';
    ctxBall.fill();
    ctxBall.lineWidth = 2;
    ctxBall.strokeStyle = '#003300';
    ctxBall.stroke();
}


function random_function(limite) {
    var x = Math.floor((Math.random() * limite) + 1);
    return x;
}


function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

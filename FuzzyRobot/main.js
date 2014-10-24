///<reference path="typings/jquery/jquery.d.ts" />

function f1(p) {
    var result = {
        x: (p.x * 0.85 + p.y * 0.04),
        y: (p.x * -0.04 + p.y * 0.85 + 1.6)
    };
    return result;
}

function f2(p) {
    var result = {
        x: (p.x * -0.15 + p.y * 0.28),
        y: (p.x * 0.26 + p.y * 0.24 + 0.44)
    };
    return result;
}

function f3(p) {
    var result = {
        x: (p.x * 0.2 + p.y * -0.26),
        y: (p.x * 0.23 + p.y * 0.22 + 1.6)
    };
    return result;
}

function f4(p) {
    var result = {
        x: 0,
        y: (p.y * 0.16)
    };
    return result;
}

function initializer() {
    var percentage1 = 0.85;
    var percentage2 = 0.07;
    var percentage3 = 0.07;
    var percentage4 = 0.01;

    var canvasSurface = document.getElementById("myCanvas");
    var canvasContext = canvasSurface.getContext("2d");
    canvasContext.clearRect(0.0, 0.0, canvasSurface.width, canvasSurface.height);

    canvasContext.fillStyle = "#000000";

    var X;
    var p = { x: 0, y: 0 };

    for (var i = 0; i < 10000000; ++i) {
        canvasContext.fillRect(-10 + p.x * 600, 1500 - p.y * 800, 1, 1);
        X = Math.random();
        if (X < percentage1) {
            p = f1(p);
        } else if (X < (percentage1 + percentage2)) {
            p = f2(p);
        } else if (X < (percentage1 + percentage2 + percentage3)) {
            p = f3(p);
        } else {
            p = f4(p);
        }
    }

    alert("Finalizó renderizado");
}

$(document).ready(initializer);
//# sourceMappingURL=main.js.map

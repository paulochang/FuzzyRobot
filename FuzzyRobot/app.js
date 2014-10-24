var canvasSurface;
var canvasContext;


var GameConstants = (function () {
    function GameConstants() {
    }
    Object.defineProperty(GameConstants, "BALL_RADIO", {
        get: function () {
            return 5;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameConstants, "ROBOT_RADIO", {
        get: function () {
            return 7;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameConstants, "ROBOT_RANGE", {
        get: function () {
            return 15;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameConstants, "GOAL_WIDTH", {
        get: function () {
            return 10;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameConstants, "GOAL_HEIGHT", {
        get: function () {
            return 100;
        },
        enumerable: true,
        configurable: true
    });
    return GameConstants;
})();

var FuzzyHelperLib;
(function (FuzzyHelperLib) {
    function getAscendingHeight(li, ls, x) {
        return (x - li) / (ls - li);
    }

    function getDescendingHeight(li, ls, x) {
        return 1 - (x - li) / (ls - li);
    }

    function getFuzzyValue(AscInfLimit, AscSupLimit, DescInfLimit, DescSupLimit, angle) {
        if ((angle >= AscInfLimit) && (angle <= AscSupLimit))
            return this.getAscendingHeight(AscInfLimit, AscSupLimit, angle);
        else if ((angle >= DescInfLimit) && (angle <= DescSupLimit))
            return this.getDescendingHeight(DescInfLimit, DescSupLimit, angle);
        else
            return 0;
    }

    function getEastFuzzy(angle) {
        var AscInfLimit = 315;
        var AscSupLimit = 360;
        var DescInfLimit = 0;
        var DescSupLimit = 45;

        return this.getFuzzyValue(AscInfLimit, AscSupLimit, DescInfLimit, DescSupLimit, angle);
    }

    function getNorthEastFuzzy(angle) {
        var AscInfLimit = 0;
        var AscSupLimit = 45;
        var DescInfLimit = 45;
        var DescSupLimit = 90;

        return this.getFuzzyValue(AscInfLimit, AscSupLimit, DescInfLimit, DescSupLimit, angle);
    }

    function getNorthFuzzy(angle) {
        var AscInfLimit = 45;
        var AscSupLimit = 90;
        var DescInfLimit = 90;
        var DescSupLimit = 135;

        return this.getFuzzyValue(AscInfLimit, AscSupLimit, DescInfLimit, DescSupLimit, angle);
    }

    function getNorthWestFuzzy(angle) {
        var AscInfLimit = 90;
        var AscSupLimit = 135;
        var DescInfLimit = 135;
        var DescSupLimit = 180;

        return this.getFuzzyValue(AscInfLimit, AscSupLimit, DescInfLimit, DescSupLimit, angle);
    }

    function getWestFuzzy(angle) {
        var AscInfLimit = 135;
        var AscSupLimit = 180;
        var DescInfLimit = 180;
        var DescSupLimit = 225;

        return this.getFuzzyValue(AscInfLimit, AscSupLimit, DescInfLimit, DescSupLimit, angle);
    }

    function getSouthWestFuzzy(angle) {
        var AscInfLimit = 180;
        var AscSupLimit = 225;
        var DescInfLimit = 225;
        var DescSupLimit = 270;

        return this.getFuzzyValue(AscInfLimit, AscSupLimit, DescInfLimit, DescSupLimit, angle);
    }

    function getSouthFuzzy(angle) {
        var AscInfLimit = 225;
        var AscSupLimit = 270;
        var DescInfLimit = 270;
        var DescSupLimit = 315;

        return this.getFuzzyValue(AscInfLimit, AscSupLimit, DescInfLimit, DescSupLimit, angle);
    }

    function getSouthEastFuzzy(angle) {
        var AscInfLimit = 270;
        var AscSupLimit = 315;
        var DescInfLimit = 315;
        var DescSupLimit = 360;

        return this.getFuzzyValue(AscInfLimit, AscSupLimit, DescInfLimit, DescSupLimit, angle);
    }

    function getPositionOffset(angle, distance) {
        if (getNorthEastFuzzy(angle) >= 0.5) {
            var result = {
                x: distance,
                y: -distance
            };
            return result;
        }
        if (getNorthWestFuzzy(angle) >= 0.5) {
            var result = {
                x: -distance,
                y: -distance
            };
            return result;
        }
        if (getSouthEastFuzzy(angle) >= 0.5) {
            var result = {
                x: distance,
                y: distance
            };
            return result;
        }
        if (getSouthWestFuzzy(angle) >= 0.5) {
            var result = {
                x: -distance,
                y: distance
            };
            return result;
        }
        if (getNorthFuzzy(angle) >= 0.5) {
            var result = {
                x: 0,
                y: -distance
            };
            return result;
        }
        if (getSouthFuzzy(angle) >= 0.5) {
            var result = {
                x: 0,
                y: distance
            };
            return result;
        }
        if (getEastFuzzy(angle) >= 0.5) {
            var result = {
                x: distance,
                y: 0
            };
            return result;
        }
        if (getWestFuzzy(angle) >= 0.5) {
            var result = {
                x: -distance,
                y: 0
            };
            return result;
        }
    }
    FuzzyHelperLib.getPositionOffset = getPositionOffset;
})(FuzzyHelperLib || (FuzzyHelperLib = {}));

var MiscCalculator;
(function (MiscCalculator) {
    function getAngleToBall(BallPos, RobotPos) {
        var DeltaX = BallPos.x - RobotPos.x;
        var DeltaY = RobotPos.y - BallPos.y;

        var theta = Math.atan2(DeltaY, DeltaX);

        theta = theta < 0 ? theta + 2 * Math.PI : theta;

        return theta * (180 / Math.PI);
    }
    MiscCalculator.getAngleToBall = getAngleToBall;

    function generateRandomPoint(xOffset, yOffset, xLimit, yLimit) {
        var result = {
            x: xOffset + Math.random() * (xLimit - 2 * xOffset),
            y: yOffset + Math.random() * (yLimit - 2 * yOffset)
        };

        return result;
    }
    MiscCalculator.generateRandomPoint = generateRandomPoint;
})(MiscCalculator || (MiscCalculator = {}));

var CanvasHelper;
(function (CanvasHelper) {
    function drawCircle(Pos, radius, color) {
        canvasContext.beginPath();
        canvasContext.arc(Pos.x, Pos.y, radius, 0, 2 * Math.PI, false);
        canvasContext.fillStyle = color;
        canvasContext.fill();
    }

    function drawSquare(Pos, radius, color) {
        canvasContext.fillStyle = color;
        canvasContext.fillRect(Pos.x - radius, Pos.y - radius, 2 * radius, 2 * radius);
    }

    function clearBoard() {
        canvasContext.clearRect(0.0, 0.0, canvasSurface.width, canvasSurface.height);

        canvasContext.fillStyle = "#000";
        canvasContext.fillRect(0, 0, canvasSurface.width, canvasSurface.height);

        canvasContext.fillStyle = "#f00";
        canvasContext.fillRect((canvasSurface.width - GameConstants.GOAL_WIDTH), (canvasSurface.height / 2) - (GameConstants.GOAL_HEIGHT / 2), GameConstants.GOAL_WIDTH, GameConstants.GOAL_HEIGHT);
    }
    CanvasHelper.clearBoard = clearBoard;

    function positionRobot() {
        var robotPosition;

        robotPosition = MiscCalculator.generateRandomPoint(GameConstants.ROBOT_RANGE, GameConstants.ROBOT_RANGE, canvasSurface.width, canvasSurface.height);

        drawCircle(robotPosition, GameConstants.ROBOT_RANGE, '#aaa');
        drawCircle(robotPosition, GameConstants.ROBOT_RADIO, '#111');

        return robotPosition;
    }
    CanvasHelper.positionRobot = positionRobot;

    function positionBall() {
        var ballPosition;

        ballPosition = MiscCalculator.generateRandomPoint(GameConstants.BALL_RADIO, GameConstants.BALL_RADIO, canvasSurface.width, canvasSurface.height);

        drawCircle(ballPosition, GameConstants.BALL_RADIO, 'white');

        return ballPosition;
    }
    CanvasHelper.positionBall = positionBall;
})(CanvasHelper || (CanvasHelper = {}));

function findBall(robotPosition, ballPosition) {
    var angleToBall = MiscCalculator.getAngleToBall(ballPosition, robotPosition);
}

function shootBall(ballPosition) {
}

function evaluate(ballPosition) {
    return true;
}

function play(robotPosition, ballPosition) {
    var alreadyWon = false;
    while (!alreadyWon) {
        findBall(robotPosition, ballPosition);
        shootBall(ballPosition);
        alreadyWon = evaluate(ballPosition);
    }
}

function initialize() {
    canvasSurface = document.getElementById("myCanvas");
    canvasContext = canvasSurface.getContext("2d");
    CanvasHelper.clearBoard();
    var ballPosition = CanvasHelper.positionBall();
    var robotPosition = CanvasHelper.positionRobot();
}

document.addEventListener("DOMContentLoaded", initialize, false);
//# sourceMappingURL=app.js.map

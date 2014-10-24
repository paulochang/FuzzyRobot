var canvasSurface;
var canvasContext;

var alreadyWon = false;


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
    Object.defineProperty(GameConstants, "STEP_SIZE", {
        get: function () {
            return 5;
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
            return getAscendingHeight(AscInfLimit, AscSupLimit, angle);
        else if ((angle >= DescInfLimit) && (angle <= DescSupLimit))
            return getDescendingHeight(DescInfLimit, DescSupLimit, angle);
        else
            return 0;
    }

    function getEastFuzzy(angle) {
        var AscInfLimit = 315;
        var AscSupLimit = 360;
        var DescInfLimit = 0;
        var DescSupLimit = 45;

        return getFuzzyValue(AscInfLimit, AscSupLimit, DescInfLimit, DescSupLimit, angle);
    }

    function getNorthEastFuzzy(angle) {
        var AscInfLimit = 0;
        var AscSupLimit = 45;
        var DescInfLimit = 45;
        var DescSupLimit = 90;

        return getFuzzyValue(AscInfLimit, AscSupLimit, DescInfLimit, DescSupLimit, angle);
    }

    function getNorthFuzzy(angle) {
        var AscInfLimit = 45;
        var AscSupLimit = 90;
        var DescInfLimit = 90;
        var DescSupLimit = 135;

        return getFuzzyValue(AscInfLimit, AscSupLimit, DescInfLimit, DescSupLimit, angle);
    }

    function getNorthWestFuzzy(angle) {
        var AscInfLimit = 90;
        var AscSupLimit = 135;
        var DescInfLimit = 135;
        var DescSupLimit = 180;

        return getFuzzyValue(AscInfLimit, AscSupLimit, DescInfLimit, DescSupLimit, angle);
    }

    function getWestFuzzy(angle) {
        var AscInfLimit = 135;
        var AscSupLimit = 180;
        var DescInfLimit = 180;
        var DescSupLimit = 225;

        return getFuzzyValue(AscInfLimit, AscSupLimit, DescInfLimit, DescSupLimit, angle);
    }

    function getSouthWestFuzzy(angle) {
        var AscInfLimit = 180;
        var AscSupLimit = 225;
        var DescInfLimit = 225;
        var DescSupLimit = 270;

        return getFuzzyValue(AscInfLimit, AscSupLimit, DescInfLimit, DescSupLimit, angle);
    }

    function getSouthFuzzy(angle) {
        var AscInfLimit = 225;
        var AscSupLimit = 270;
        var DescInfLimit = 270;
        var DescSupLimit = 315;

        return getFuzzyValue(AscInfLimit, AscSupLimit, DescInfLimit, DescSupLimit, angle);
    }

    function getSouthEastFuzzy(angle) {
        var AscInfLimit = 270;
        var AscSupLimit = 315;
        var DescInfLimit = 315;
        var DescSupLimit = 360;

        return getFuzzyValue(AscInfLimit, AscSupLimit, DescInfLimit, DescSupLimit, angle);
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

var PointUtilites;
(function (PointUtilites) {
    function getAngleBetweenPoints(PointA, PointB) {
        var DeltaX = PointA.x - PointB.x;
        var DeltaY = PointB.y - PointA.y;

        var theta = Math.atan2(DeltaY, DeltaX);

        theta = theta < 0 ? theta + 2 * Math.PI : theta;

        return theta * (180 / Math.PI);
    }
    PointUtilites.getAngleBetweenPoints = getAngleBetweenPoints;

    function generateRandomPoint(xOffset, yOffset, xLimit, yLimit) {
        var result = {
            x: xOffset + Math.random() * (xLimit - 2 * xOffset),
            y: yOffset + Math.random() * (yLimit - 2 * yOffset)
        };

        return result;
    }
    PointUtilites.generateRandomPoint = generateRandomPoint;

    function addPoints(PointA, PointB) {
        var result = {
            x: PointA.x + PointB.x,
            y: PointA.y + PointB.y
        };

        return result;
    }
    PointUtilites.addPoints = addPoints;

    function getDistanceBetweenPoints(PointA, PointB) {
        var XDifference = PointA.x - PointB.x;
        var YDifference = PointA.y - PointB.y;

        var squaredXDifference = XDifference * XDifference;
        var squaredYDifference = YDifference * YDifference;
        return Math.sqrt(squaredXDifference + squaredYDifference);
    }
    PointUtilites.getDistanceBetweenPoints = getDistanceBetweenPoints;

    function distanceToBorder(thePoint) {
        var distanceToTop = thePoint.y;
        var distanceToBottom = canvasSurface.height - thePoint.y;
        var distanceToLeft = thePoint.x;
        var distanceToRight = canvasSurface.width - thePoint.x;

        return Math.min(distanceToTop, distanceToBottom, distanceToLeft, distanceToRight);
    }
    PointUtilites.distanceToBorder = distanceToBorder;

    function isInCollidingRegion(pointToEvaluate, radius, inferiorPoint, superiorPoint) {
        var xCoincidente = (pointToEvaluate.x + radius >= inferiorPoint.x) && (pointToEvaluate.x - radius <= superiorPoint.x);
        var yCoincidente = (pointToEvaluate.y + radius >= inferiorPoint.y) && (pointToEvaluate.x - radius <= superiorPoint.y);
        return xCoincidente && yCoincidente;
    }
    PointUtilites.isInCollidingRegion = isInCollidingRegion;
})(PointUtilites || (PointUtilites = {}));

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
        canvasContext.fillRect((canvasSurface.width - GameConstants.GOAL_WIDTH), (canvasSurface.height - GameConstants.GOAL_HEIGHT) / 2, GameConstants.GOAL_WIDTH, GameConstants.GOAL_HEIGHT);
    }
    CanvasHelper.clearBoard = clearBoard;

    function positionRobot(robotPosition) {
        if (!robotPosition)
            robotPosition = PointUtilites.generateRandomPoint(GameConstants.ROBOT_RANGE, GameConstants.ROBOT_RANGE, canvasSurface.width, canvasSurface.height);

        drawCircle(robotPosition, GameConstants.ROBOT_RANGE, '#aaa');
        drawCircle(robotPosition, GameConstants.ROBOT_RADIO, '#111');

        return robotPosition;
    }
    CanvasHelper.positionRobot = positionRobot;

    function positionBall(ballPosition) {
        if (!ballPosition)
            ballPosition = PointUtilites.generateRandomPoint(GameConstants.BALL_RADIO, GameConstants.BALL_RADIO, canvasSurface.width, canvasSurface.height);

        drawCircle(ballPosition, GameConstants.BALL_RADIO, 'white');

        return ballPosition;
    }
    CanvasHelper.positionBall = positionBall;
})(CanvasHelper || (CanvasHelper = {}));

var ProbabilityUtilies;
(function (ProbabilityUtilies) {
    function rnd(mean, stdev) {
        return Math.round(rnd_bmt() * stdev + mean);
    }
    ProbabilityUtilies.rnd = rnd;

    /**
    * Source http://www.protonfish.com/jslib/boxmuller.shtml
    */
    function rnd_bmt() {
        var x = 0, y = 0, rds, c;

        do {
            x = Math.random() * 2 - 1;
            y = Math.random() * 2 - 1;
            rds = x * x + y * y;
        } while(rds == 0 || rds > 1);

        // This magic is the Box-Muller Transform
        c = Math.sqrt(-2 * Math.log(rds) / rds);

        return x * c;
    }
})(ProbabilityUtilies || (ProbabilityUtilies = {}));

var requestAnimFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60, new Date().getTime());
    };
})();

function findBall(robotPosition, ballPosition) {
    var RobotIsOverBall;

    RobotIsOverBall = (PointUtilites.getDistanceBetweenPoints(robotPosition, ballPosition) < GameConstants.ROBOT_RANGE);

    if (!RobotIsOverBall) {
        var angleToBall = PointUtilites.getAngleBetweenPoints(ballPosition, robotPosition);

        var robotOffset = FuzzyHelperLib.getPositionOffset(angleToBall, GameConstants.STEP_SIZE);

        robotPosition = PointUtilites.addPoints(robotPosition, robotOffset);
        CanvasHelper.clearBoard();
        CanvasHelper.positionBall(ballPosition);
        CanvasHelper.positionRobot(robotPosition);

        requestAnimFrame(function () {
            findBall(robotPosition, ballPosition);
        });
    } else {
        requestAnimFrame(function () {
            shootBall(ballPosition, robotPosition);
        });
    }
}

function moveBall(ballPosition, finalPosition, robotPosition, isFirstShot) {
    var ballIsInPosition;

    ballIsInPosition = (PointUtilites.getDistanceBetweenPoints(ballPosition, finalPosition) < GameConstants.BALL_RADIO);
    ballIsInPosition = ballIsInPosition || (PointUtilites.distanceToBorder(ballPosition) < GameConstants.BALL_RADIO * 1.5);
    ballIsInPosition = ballIsInPosition && !isFirstShot;

    if (!ballIsInPosition) {
        var angleToFinal = PointUtilites.getAngleBetweenPoints(ballPosition, finalPosition);

        var ballOffset = FuzzyHelperLib.getPositionOffset(angleToFinal, GameConstants.STEP_SIZE);

        ballPosition = PointUtilites.addPoints(ballPosition, ballOffset);
        CanvasHelper.clearBoard();
        CanvasHelper.positionBall(ballPosition);
        CanvasHelper.positionRobot(robotPosition);

        requestAnimFrame(function () {
            moveBall(ballPosition, finalPosition, robotPosition, false);
        });
    } else {
        alreadyWon = evaluate(ballPosition);
        requestAnimFrame(function () {
            play(robotPosition, ballPosition);
        });
    }
}

function shootBall(ballPosition, robotPosition) {
    var goalPosition = {
        x: (canvasSurface.width),
        y: (canvasSurface.height / 2)
    };

    var angleToGoal = PointUtilites.getAngleBetweenPoints(ballPosition, goalPosition);
    var distanceToGoal = PointUtilites.getDistanceBetweenPoints(ballPosition, goalPosition);
    var shootingDistance = ProbabilityUtilies.rnd(distanceToGoal, distanceToGoal * 0.125);
    var ballOffset = FuzzyHelperLib.getPositionOffset(angleToGoal, shootingDistance);
    var finalPosition = PointUtilites.addPoints(ballPosition, ballOffset);

    moveBall(ballPosition, finalPosition, robotPosition, true);
}

function evaluate(ballPosition) {
    var goalPosition = {
        x: (canvasSurface.width),
        y: (canvasSurface.height / 2)
    };

    var distanceToGoal = PointUtilites.getDistanceBetweenPoints(ballPosition, goalPosition);
    var isInGoal = distanceToGoal < GameConstants.BALL_RADIO;
    var inferiorPoint = {
        x: canvasSurface.width - GameConstants.GOAL_WIDTH - GameConstants.BALL_RADIO / 2,
        y: (canvasSurface.height - GameConstants.GOAL_HEIGHT) / 2 - GameConstants.BALL_RADIO / 2
    };
    var superiorPoint = {
        x: canvasSurface.width + GameConstants.BALL_RADIO / 2,
        y: (canvasSurface.height + GameConstants.GOAL_HEIGHT) / 2 + GameConstants.BALL_RADIO / 2
    };
    isInGoal = isInGoal || PointUtilites.isInCollidingRegion(ballPosition, GameConstants.BALL_RADIO, inferiorPoint, superiorPoint);

    return isInGoal;
}

function play(robotPosition, ballPosition) {
    if (!alreadyWon) {
        findBall(robotPosition, ballPosition);
    } else {
        alert('Ganó!!!');
    }
}

function initialize() {
    canvasSurface = document.getElementById("myCanvas");
    canvasContext = canvasSurface.getContext("2d");

    CanvasHelper.clearBoard();
    var ballPosition = CanvasHelper.positionBall();
    var robotPosition = CanvasHelper.positionRobot();

    play(robotPosition, ballPosition);
}

document.addEventListener("DOMContentLoaded", initialize, false);
//# sourceMappingURL=app.js.map

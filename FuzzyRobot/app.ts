var canvasSurface: HTMLCanvasElement;
var canvasContext : CanvasRenderingContext2D;

//function CalculateAngle() {
//    var ballXinput: HTMLInputElement =
//        <HTMLInputElement>document.getElementById('ballXInput');
//    var ballYinput: HTMLInputElement =
//        <HTMLInputElement>document.getElementById('ballYInput');

//    var robotXinput: HTMLInputElement =
//        <HTMLInputElement>document.getElementById('robotXInput');
//    var robotYinput: HTMLInputElement =
//        <HTMLInputElement>document.getElementById('robotYInput');

//    var ballXcoord: number = parseFloat(ballXinput.value);
//    var ballYcoord: number = parseFloat(ballYinput.value);
//    var robotXcoord: number = parseFloat(robotXinput.value);
//    var robotYcoord: number = parseFloat(robotYinput.value);

//    var angleLable: HTMLLabelElement = <HTMLLabelElement>document.getElementById('AngleLbl');
//    angleLable.textContent = getAngleToBall(ballXcoord, ballYcoord, robotXcoord, robotYcoord).toString();
//}

//function printAngle(angle: number) {
//    console.clear();
//    console.log(" N " + FuzzyHelperLib.getNorthFuzzy(angle));
//    console.log(" NE " + FuzzyHelperLib.getNorthEastFuzzy(angle));
//    console.log(" E " + FuzzyHelperLib.getEastFuzzy(angle));
//    console.log(" SE " + FuzzyHelperLib.getSouthEastFuzzy(angle));
//    console.log(" S " + FuzzyHelperLib.getSouthFuzzy(angle));
//    console.log(" SW " + FuzzyHelperLib.getSouthWestFuzzy(angle));
//    console.log(" W " + FuzzyHelperLib.getWestFuzzy(angle));
//    console.log(" NW " + FuzzyHelperLib.getNorthWestFuzzy(angle));
//}

/**
 * Represents a point object
 **/
interface Point {
    x: number;
    y: number;
}

class GameConstants {
    public static get BALL_RADIO(): number { return 5; }
    public static get ROBOT_RADIO(): number { return 7; }
    public static get ROBOT_RANGE(): number { return 15; }
    public static get GOAL_WIDTH(): number { return 10; }
    public static get GOAL_HEIGHT(): number { return 100; }
}

module FuzzyHelperLib {

    function getAscendingHeight(li: number, ls: number, x: number): number {
        return (x - li) / (ls - li)
    }

    function getDescendingHeight(li: number, ls: number, x: number): number {
        return 1 - (x - li) / (ls - li)
    }

    function getFuzzyValue(AscInfLimit: number, AscSupLimit: number, DescInfLimit: number, DescSupLimit: number, angle: number): number {
        if ((angle >= AscInfLimit) && (angle <= AscSupLimit))
            return this.getAscendingHeight(AscInfLimit, AscSupLimit, angle);
        else
            if ((angle >= DescInfLimit) && (angle <= DescSupLimit))
                return this.getDescendingHeight(DescInfLimit, DescSupLimit, angle);
            else
                return 0;
    }

    function getEastFuzzy(angle: number): number {
        var AscInfLimit: number = 315;
        var AscSupLimit: number = 360;
        var DescInfLimit: number = 0;
        var DescSupLimit: number = 45;

        return this.getFuzzyValue(AscInfLimit, AscSupLimit, DescInfLimit, DescSupLimit, angle);
    }

    function getNorthEastFuzzy(angle: number): number {
        var AscInfLimit: number = 0;
        var AscSupLimit: number = 45;
        var DescInfLimit: number = 45;
        var DescSupLimit: number = 90;

        return this.getFuzzyValue(AscInfLimit, AscSupLimit, DescInfLimit, DescSupLimit, angle);
    }

    function getNorthFuzzy(angle: number): number {
        var AscInfLimit: number = 45;
        var AscSupLimit: number = 90;
        var DescInfLimit: number = 90;
        var DescSupLimit: number = 135

        return this.getFuzzyValue(AscInfLimit, AscSupLimit, DescInfLimit, DescSupLimit, angle);

    }

    function getNorthWestFuzzy(angle: number): number {
        var AscInfLimit: number = 90;
        var AscSupLimit: number = 135;
        var DescInfLimit: number = 135;
        var DescSupLimit: number = 180;

        return this.getFuzzyValue(AscInfLimit, AscSupLimit, DescInfLimit, DescSupLimit, angle);
    }

    function getWestFuzzy(angle: number): number {
        var AscInfLimit: number = 135;
        var AscSupLimit: number = 180;
        var DescInfLimit: number = 180;
        var DescSupLimit: number = 225;

        return this.getFuzzyValue(AscInfLimit, AscSupLimit, DescInfLimit, DescSupLimit, angle);
    }

    function getSouthWestFuzzy(angle: number): number {
        var AscInfLimit: number = 180;
        var AscSupLimit: number = 225;
        var DescInfLimit: number = 225;
        var DescSupLimit: number = 270;

        return this.getFuzzyValue(AscInfLimit, AscSupLimit, DescInfLimit, DescSupLimit, angle);
    }

    function getSouthFuzzy(angle: number): number {
        var AscInfLimit: number = 225;
        var AscSupLimit: number = 270;
        var DescInfLimit: number = 270;
        var DescSupLimit: number = 315;

        return this.getFuzzyValue(AscInfLimit, AscSupLimit, DescInfLimit, DescSupLimit, angle);
    }

    function getSouthEastFuzzy(angle: number): number {
        var AscInfLimit: number = 270;
        var AscSupLimit: number = 315;
        var DescInfLimit: number = 315;
        var DescSupLimit: number = 360;

        return this.getFuzzyValue(AscInfLimit, AscSupLimit, DescInfLimit, DescSupLimit, angle);
    }

    export function getPositionOffset(angle: number, distance: number): Point {
        if (getNorthEastFuzzy(angle) >= 0.5) {
            var result: Point = {
                x: distance,
                y: -distance
            }
            return result;
        }
        if (getNorthWestFuzzy(angle) >= 0.5) {
            var result: Point = {
                x: -distance,
                y: -distance
            }
            return result;
        }
        if (getSouthEastFuzzy(angle) >= 0.5) {
            var result: Point = {
                x: distance,
                y: distance
            }
            return result;
        }
        if (getSouthWestFuzzy(angle) >= 0.5) {
            var result: Point = {
                x: -distance,
                y: distance
            }
            return result;
        }
        if (getNorthFuzzy(angle) >= 0.5) {
            var result: Point = {
                x: 0,
                y: -distance
            }
            return result;
        }
        if (getSouthFuzzy(angle) >= 0.5) {
            var result: Point = {
                x: 0,
                y: distance
            }
            return result;
        }
        if (getEastFuzzy(angle) >= 0.5) {
            var result: Point = {
                x: distance,
                y: 0
            }
            return result;
        }
        if (getWestFuzzy(angle) >= 0.5) {
            var result: Point = {
                x: -distance,
                y: 0
            }
            return result;
        }
    }

}

module MiscCalculator {
    export function getAngleToBall(BallPos: Point, RobotPos: Point) {
        var DeltaX: number = BallPos.x - RobotPos.x;
        var DeltaY: number = RobotPos.y - BallPos.y;

        var theta: number = Math.atan2(DeltaY, DeltaX);

        theta = theta < 0 ? theta + 2 * Math.PI : theta;

        return theta * (180 / Math.PI);
    }

    export function generateRandomPoint(xOffset: number, yOffset: number, xLimit: number, yLimit: number): Point {
        var result: Point = {
            x: xOffset + Math.random() * (xLimit - 2 * xOffset),
            y: yOffset + Math.random() * (yLimit - 2 * yOffset)
        };

        return result;
    }
}

module CanvasHelper {

    function drawCircle(Pos: Point, radius: number, color: any) {
        canvasContext.beginPath();
        canvasContext.arc(Pos.x, Pos.y, radius, 0, 2 * Math.PI, false);
        canvasContext.fillStyle = color;
        canvasContext.fill();
    }

    function drawSquare(Pos: Point, radius: number, color: any) {
        canvasContext.fillStyle = color;
        canvasContext.fillRect(Pos.x - radius, Pos.y - radius, 2 * radius, 2 * radius);
    }

    export function clearBoard() {
        canvasContext.clearRect(0.0, 0.0, canvasSurface.width, canvasSurface.height);

        canvasContext.fillStyle = "#000";
        canvasContext.fillRect(0, 0, canvasSurface.width, canvasSurface.height);

        canvasContext.fillStyle = "#f00";
        canvasContext.fillRect(
            (canvasSurface.width - GameConstants.GOAL_WIDTH),
            (canvasSurface.height / 2) - (GameConstants.GOAL_HEIGHT / 2),
            GameConstants.GOAL_WIDTH,
            GameConstants.GOAL_HEIGHT
            );
    }

    export function positionRobot(): Point {
        var robotPosition: Point;

        robotPosition = MiscCalculator.generateRandomPoint(
            GameConstants.ROBOT_RANGE,
            GameConstants.ROBOT_RANGE,
            canvasSurface.width,
            canvasSurface.height
            );

        drawCircle(robotPosition, GameConstants.ROBOT_RANGE, '#aaa');
        drawCircle(robotPosition, GameConstants.ROBOT_RADIO, '#111');

        return robotPosition;
    }

    export function positionBall(): Point {
        var ballPosition: Point;

        ballPosition = MiscCalculator.generateRandomPoint(
            GameConstants.BALL_RADIO,
            GameConstants.BALL_RADIO,
            canvasSurface.width,
            canvasSurface.height
            );

        drawCircle(ballPosition, GameConstants.BALL_RADIO, 'white');

        return ballPosition;
    }
}

function findBall(robotPosition: Point, ballPosition: Point)
{
    var angleToBall: number = MiscCalculator.getAngleToBall(ballPosition, robotPosition);
}

function shootBall(ballPosition: Point)
{ }

function evaluate(ballPosition: Point): boolean
{
    return true;
}

function play(robotPosition: point, ballPosition: point) {
    var alreadyWon: boolean = false;
    while (!alreadyWon) {
        findBall(robotPosition, ballPosition);
        shootBall(ballPosition);
        alreadyWon = evaluate(ballPosition);

    }
}

function initialize() {
    canvasSurface = <HTMLCanvasElement> document.getElementById("myCanvas");
    canvasContext = canvasSurface.getContext("2d");
    CanvasHelper.clearBoard();
    var ballPosition = CanvasHelper.positionBall();
    var robotPosition = CanvasHelper.positionRobot();
}

document.addEventListener("DOMContentLoaded", initialize, false)

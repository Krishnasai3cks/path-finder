let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let drawingSpeed = 10;
let blockSize = 10;
let startX, startY;
var gridSize = 4;
let showpath = false;
var grid = [];
let visited = {};
let numRows = 50;
let numCols = 50;
let canvaswidth = numRows * blockSize;
let canvasheight = numRows * blockSize;
let blockadeList = ["random", "zigzag", "customized"];
let blockadeType = 1;
let endX, endY;
let pathCoordinates;

function changeSpeed(element) {
    drawingSpeed = Number(element.value);
}
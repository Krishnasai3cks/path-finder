let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let drawingSpeed = 10;
let blockSize = 15;
let startX, startY;
var gridSize = 4;
let showpath = false;
var grid = [];
let visited = {};
let numRows = 30;
let numCols = 45;
let colours = {
    start: "rgba(255,255,255,0.8)",
    end: "yellow",
    unvisited: "rgba(255,255,255,0.4)",
    visited: "rgba(255,165,255,0.4)",
    blockade: "rgba(0,0,0,0.5)",
    path: "rgba(150,150,150,0.5)",
};
let canvaswidth = numCols * blockSize;
let canvasheight = numRows * blockSize;
let blockadeList = ["random", "zigzag", "customized"];
let blockadeType = 1;
let endX, endY;
let pathCoordinates;

function changeSpeed(element) {
    drawingSpeed = Number(element.value);
}
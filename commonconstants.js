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
createBoard();
async function createBoard() {
    if (blockadeType == 1) {
        let numberOfBlockades = (numRows * numCols) / 3;
        for (let i = 0; i < numRows; i++) {
            grid.push([]);
            for (let j = 0; j < numCols; j++) {
                grid[i][j] = ".";
            }
        }
        for (let i = 0; i < numberOfBlockades; i++) {
            let randomRowIndex = Math.floor(Math.random() * (numRows - 1));
            let randomColIndex = Math.floor(Math.random() * (numCols - 1));
            grid[randomRowIndex][randomColIndex] = "#";
        }
        startX = Math.floor(Math.random() * (numRows - 1));
        startY = Math.floor(Math.random() * (numCols - 1));
        grid[startX][startY] = "s";
        endX = Math.floor(Math.random() * (numRows - 1));
        endY = Math.floor(Math.random() * (numCols - 1));
        grid[endX][endY] = "e";
    } else if (blockadeType == 2) {
        let called = 0;
        for (let i = 0; i < numRows; i++) {
            let string;
            if (i % 2 == 0) {
                string = ".".repeat(numCols);
            } else {
                if (called % 2 == 0) {
                    string = "#".repeat(numCols - 1) + ".";
                } else {
                    string = "." + "#".repeat(numCols - 1);
                }
                called++;
            }
            grid.push(string.split(""));
        }
        startX = 0;
        startY = 0;
        grid[startX][startY] = "s";
        let lastRow = grid[grid.length - 1];

        endX = grid.length - 1;
        endY = lastRow.indexOf(".");
        grid[endX][endY] = "e";
    } else if (blockadeType == 3) {
        for (let i = 0; i < numRows; i++) {
            grid.push([]);
            for (let j = 0; j < numCols; j++) {
                grid[i][j] = ".";
            }
        }
        endX = 0;
        endY = 0;
        startX = numRows - 1;
        startY = numCols - 1;
        grid[startX][startY] = "s";
        grid[startX][endY] = "#";
        grid[endX][endY] = "e";
    }
    draw();
}
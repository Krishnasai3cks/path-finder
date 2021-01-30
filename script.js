var findShortestPath = async function(startCoordinates, grid) {
    var distanceFromTop = startCoordinates[0];
    var distanceFromLeft = startCoordinates[1];

    var location = {
        distanceFromTop: distanceFromTop,
        distanceFromLeft: distanceFromLeft,
        path: [],
        status: "Start",
    };

    var queue = [location];

    while (queue.length > 0) {
        var currentLocation = queue.shift();

        var newLocation = await exploreInDirection(currentLocation, "North", grid);
        if (newLocation.status === "Goal") {
            return newLocation.path;
        } else if (newLocation.status === "Valid") {
            queue.push(newLocation);
        }

        var newLocation = await exploreInDirection(currentLocation, "East", grid);
        if (newLocation.status === "Goal") {
            return newLocation.path;
        } else if (newLocation.status === "Valid") {
            queue.push(newLocation);
        }

        var newLocation = await exploreInDirection(currentLocation, "South", grid);
        if (newLocation.status === "Goal") {
            return newLocation.path;
        } else if (newLocation.status === "Valid") {
            queue.push(newLocation);
        }

        var newLocation = await exploreInDirection(currentLocation, "West", grid);
        if (newLocation.status === "Goal") {
            return newLocation.path;
        } else if (newLocation.status === "Valid") {
            queue.push(newLocation);
        }
    }

    return false;
};

var locationStatus = async function(location, grid) {
    var gridSize = grid.length;
    var dft = location.distanceFromTop;
    var dfl = location.distanceFromLeft;

    if (
        location.distanceFromLeft < 0 ||
        location.distanceFromLeft >= gridSize ||
        location.distanceFromTop < 0 ||
        location.distanceFromTop >= gridSize
    ) {
        return "Invalid";
    } else if (grid[dft][dfl] === "e") {
        return "Goal";
    } else if (grid[dft][dfl] !== ".") {
        return "Blocked";
    } else {
        return "Valid";
    }
};

var exploreInDirection = async function(currentLocation, direction, grid) {
    var newPath = currentLocation.path.slice();
    newPath.push(direction);

    var dft = currentLocation.distanceFromTop;
    var dfl = currentLocation.distanceFromLeft;

    if (direction === "North") {
        dft -= 1;
    } else if (direction === "East") {
        dfl += 1;
    } else if (direction === "South") {
        dft += 1;
    } else if (direction === "West") {
        dfl -= 1;
    }

    var newLocation = {
        distanceFromTop: dft,
        distanceFromLeft: dfl,
        path: newPath,
        status: "Unknown",
    };
    newLocation.status = await locationStatus(newLocation, grid);

    if (newLocation.status === "Valid") {
        grid[newLocation.distanceFromTop][newLocation.distanceFromLeft] = "Visited";
        await sleep(drawingSpeed);
        draw();
    }

    return newLocation;
};
async function startSolving() {
    let finalPath = await findShortestPath([startX, startY], grid);
    if (finalPath == false) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvaswidth, canvasheight);
        ctx.fillStyle = "black";
        ctx.font = "30px sans-serif";
        ctx.fillText("The destination cannot be reached.", 20, canvasheight / 2);
    }
    pathCoordinates = [
        [startX, startY]
    ];
    let [presentX, presentY] = [startX, startY];
    for (let direction of finalPath) {
        switch (direction) {
            case "North":
                presentX--;
                break;
            case "East":
                presentY++;
                break;
            case "West":
                presentY--;
                break;
            case "South":
                presentX++;
                break;
        }
        pathCoordinates.push([presentX, presentY]);
    }
    await drawPath();
}
draw();
async function draw() {
    if (grid) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvaswidth, canvasheight);
        for (let i = 0; i < numCols; i++) {
            for (let j = 0; j < numRows; j++) {
                let leftDis = j * blockSize;
                let topDis = i * blockSize;
                if (startX == i && startY == j) {
                    ctx.fillStyle = "blue";
                } else if (endX == i && endY == j) {
                    ctx.fillStyle = "lime";
                } else if (grid[i] && grid[i][j] == "#") {
                    ctx.fillStyle = "red";
                } else if (grid[i] && grid[i][j] == "Visited") {
                    ctx.fillStyle = "yellow";
                } else {
                    ctx.fillStyle = "cyan";
                }
                ctx.fillRect(leftDis, topDis, blockSize, blockSize);
            }
        }
    }
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function drawPath() {
    for (let i = 0; i < pathCoordinates.length; i++) {
        await sleep(drawingSpeed);
        ctx.fillStyle = "orange";
        ctx.fillRect(
            pathCoordinates[i][1] * blockSize,
            pathCoordinates[i][0] * blockSize,
            blockSize,
            blockSize
        );
    }
}

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
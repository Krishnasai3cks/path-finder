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
    console.log(pathCoordinates);
    await drawPath();
}
draw();
async function draw() {
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
            } else if (grid[i][j] == "#") {
                ctx.fillStyle = "red";
            } else if (grid[i][j] == "Visited") {
                ctx.fillStyle = "yellow";
            } else {
                ctx.fillStyle = "cyan";
            }
            ctx.fillRect(leftDis, topDis, blockSize, blockSize);
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
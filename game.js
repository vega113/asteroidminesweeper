const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 10;
const asteroidSize = 40;
let ship = { x: 200, y: 200 };
const mines = generateMines(10); // 10 mines
let clearedCells = 0;
const totalSafeCells = (gridSize * gridSize) - mines.length;

canvas.addEventListener('click', shootAsteroid);

function generateMines(count) {
    let mineArray = [];
    while (mineArray.length < count) {
        let randomX = Math.floor(Math.random() * gridSize) * asteroidSize;
        let randomY = Math.floor(Math.random() * gridSize) * asteroidSize;
        let isDuplicate = mineArray.some(mine => mine.x === randomX && mine.y === randomY);
        if (!isDuplicate) {
            mineArray.push({ x: randomX, y: randomY });
        }
    }
    return mineArray;
}

function shootAsteroid(e) {
    let x = Math.floor(e.offsetX / asteroidSize) * asteroidSize;
    let y = Math.floor(e.offsetY / asteroidSize) * asteroidSize;

    if (mines.some(mine => mine.x === x && mine.y === y)) {
        revealAllMines();
        setTimeout(showGameOverScreen, 1000); 
    } else {
        ctx.clearRect(x, y, asteroidSize, asteroidSize);
        clearedCells++; // increment the cleared cell count
        let adjacentMinesCount = countAdjacentMines(x, y);
        if (adjacentMinesCount > 0) {
            drawAdjacentMineCount(x, y, adjacentMinesCount);
        }
        if (clearedCells === totalSafeCells) { // check if all safe cells are cleared
            setTimeout(showWinScreen, 1000);
        }
    }
}



function drawAdjacentMineSign(x, y) {
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + asteroidSize, y + asteroidSize);
    ctx.moveTo(x + asteroidSize, y);
    ctx.lineTo(x, y + asteroidSize);
    ctx.stroke();
}


function shootAsteroidFromShip() {
    let x = ship.x;
    let y = ship.y;

    if (mines.some(mine => mine.x === x && mine.y === y)) {
        revealAllMines();
        setTimeout(showGameOverScreen, 1000); 
    } else {
        ctx.clearRect(x, y, asteroidSize, asteroidSize);
        let adjacentMinesCount = countAdjacentMines(x, y);
        if (adjacentMinesCount > 0) {
            drawAdjacentMineCount(x, y, adjacentMinesCount);
        }
    }
}

function revealAllMines() {
    mines.forEach(mine => {
        drawMine(mine.x, mine.y);
    });
}

function showGameOverScreen() {
    // Darken the canvas:
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)'; // semi-transparent black
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Display the game over message:
    ctx.font = '40px Arial';
    ctx.fillStyle = 'red';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);

    // Optionally: Add a smaller text below the game over message to prompt a restart:
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Click to restart', canvas.width / 2, canvas.height / 2 + 40);

    // Listen for a click event to restart the game:
    canvas.addEventListener('click', function restartGame() {
        location.reload();  // This will refresh the page to restart the game
        canvas.removeEventListener('click', restartGame);  // Remove the listener to avoid multiple bindings
    });
}

function showWinScreen() {
    // Darken the canvas:
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)'; // semi-transparent black
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Display the win message:
    ctx.font = '40px Arial';
    ctx.fillStyle = 'green';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('You Won!', canvas.width / 2, canvas.height / 2);

    // Optionally: Add a smaller text below the win message to prompt a restart:
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Click to restart', canvas.width / 2, canvas.height / 2 + 40);

    // Listen for a click event to restart the game:
    canvas.addEventListener('click', function restartGame() {
        location.reload();  // This will refresh the page to restart the game
        canvas.removeEventListener('click', restartGame);  // Remove the listener to avoid multiple bindings
    });
}



function drawAdjacentMineCount(x, y, count) {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'red';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(count, x + asteroidSize / 2, y + asteroidSize / 2);
}



function drawMine(x, y) {
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + asteroidSize, y + asteroidSize);
    ctx.moveTo(x + asteroidSize, y);
    ctx.lineTo(x, y + asteroidSize);
    ctx.stroke();
}

function countAdjacentMines(x, y) {
    let count = 0;
    for (let i = -asteroidSize; i <= asteroidSize; i += asteroidSize) {
        for (let j = -asteroidSize; j <= asteroidSize; j += asteroidSize) {
            if (i === 0 && j === 0) continue;
            if (mines.some(mine => mine.x === x + i && mine.y === y + j)) {
                count++;
            }
        }
    }
    return count;
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            ctx.fillStyle = '#555';
            ctx.fillRect(i * asteroidSize, j * asteroidSize, asteroidSize, asteroidSize);

            // Adding the outline
            ctx.strokeStyle = 'white';
            ctx.strokeRect(i * asteroidSize, j * asteroidSize, asteroidSize, asteroidSize);
        }
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(ship.x, ship.y, asteroidSize, asteroidSize);
}


document.addEventListener('keydown', function(event) {
    switch (event.keyCode) {
        case 37: // Left
            ship.x -= asteroidSize;
            break;
        case 38: // Up
            ship.y -= asteroidSize;
            break;
        case 39: // Right
            ship.x += asteroidSize;
            break;
        case 40: // Down
            ship.y += asteroidSize;
            break;
        case 32: // Space bar
            shootAsteroid({ offsetX: ship.x, offsetY: ship.y });
            break;
    }

    draw();
});

draw();

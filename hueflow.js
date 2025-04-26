document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    const gameScreen = document.getElementById('game-screen');
    const startScreen = document.getElementById('start-screen');
    const gameBoard = document.getElementById('game-board');

    const gridSize = 5; // 5x5 grid
    const colors = [
        '#FF0000', '#FF4000', '#FF8000', '#FFC000', '#FFFF00', // Red to Yellow
        '#C0FF00', '#80FF00', '#40FF00', '#00FF00', '#00FFC0', // Green to Cyan
        '#00FFFF', '#00C0FF', '#0080FF', '#0040FF', '#0000FF', // Cyan to Blue
    ];

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function createLevel() {
        gameBoard.innerHTML = ''; // Clear the board
        const shuffledColors = [...colors];
        shuffleArray(shuffledColors);

        for (let i = 0; i < gridSize * gridSize; i++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            if (i === 0 || i === gridSize - 1 || i === gridSize * (gridSize - 1) || i === gridSize * gridSize - 1) {
                // Fixed anchor tiles
                tile.style.backgroundColor = colors[i % colors.length];
                tile.classList.add('fixed');
            } else {
                // Movable tiles
                tile.style.backgroundColor = shuffledColors.pop();
                tile.draggable = true;
                tile.addEventListener('dragstart', handleDragStart);
                tile.addEventListener('dragover', handleDragOver);
                tile.addEventListener('drop', handleDrop);
            }
            gameBoard.appendChild(tile);
        }
    }

    let draggedTile = null;

    function handleDragStart(event) {
        draggedTile = event.target;
    }

    function handleDragOver(event) {
        event.preventDefault(); // Allows drop
    }

    function handleDrop(event) {
        const targetTile = event.target;

        // Swap colors between draggedTile and targetTile
        const tempColor = draggedTile.style.backgroundColor;
        draggedTile.style.backgroundColor = targetTile.style.backgroundColor;
        targetTile.style.backgroundColor = tempColor;
    }

    startButton.addEventListener('click', () => {
        startScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        createLevel();
    });

    restartButton.addEventListener('click', createLevel);
});

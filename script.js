function getURLLevel() {
  const params = new URLSearchParams(window.location.search);
  return params.get("level");
}

window.addEventListener("DOMContentLoaded", () => {
  const level = getURLLevel();
  if (!level) return;

  currentLevel = level;
  document.getElementById('landing')?.classList.add('hidden');
  document.getElementById('game')?.classList.remove('hidden');
  levelTitle.textContent = `Level ${level}`;
  solution = [...levels[level]];
  const size = Math.sqrt(solution.length);
  anchors = getAnchorIndices(size);
  updateGridSize(size);
  currentTiles = shuffleWithAnchors(solution);
  renderGrid(currentTiles);
});


const levelButtons = document.querySelectorAll('.level-btn');
    const landing = document.getElementById('landing');
    const game = document.getElementById('game');
    const levelTitle = document.getElementById('level-title');
    const grid = document.getElementById('grid');
    const backBtn = document.getElementById('back');
    const message = document.getElementById('message');
    const instruction = document.getElementById('test-instruction');

    function generateGradient(size) {
      const anchors = {
        tl: [255, 0, 0],
        tr: [255, 255, 0],
        bl: [0, 0, 255],
        br: [255, 0, 255]
      };

      const gradient = [];

      for (let row = 0; row < size; row++) {
        const y = row / (size - 1);
        for (let col = 0; col < size; col++) {
          const x = col / (size - 1);

          const top = [
            (1 - x) * anchors.tl[0] + x * anchors.tr[0],
            (1 - x) * anchors.tl[1] + x * anchors.tr[1],
            (1 - x) * anchors.tl[2] + x * anchors.tr[2]
          ];
          const bottom = [
            (1 - x) * anchors.bl[0] + x * anchors.br[0],
            (1 - x) * anchors.bl[1] + x * anchors.br[1],
            (1 - x) * anchors.bl[2] + x * anchors.br[2]
          ];
          const rgb = [
            Math.round((1 - y) * top[0] + y * bottom[0]),
            Math.round((1 - y) * top[1] + y * bottom[1]),
            Math.round((1 - y) * top[2] + y * bottom[2])
          ];

          const color = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
          const index = row * size + col;
          gradient.push({ color, label: index + 1 });
        }
      }

      return gradient;
    }

    const levels = {
      1: generateGradient(4),
      2: generateGradient(5),
      3: generateGradient(6),
      4: generateGradient(7),
      5: generateGradient(8),
      test: generateGradient(4)
    };

    let solution = [];
    let currentTiles = [];
    let anchors = [];
    let selectedIndex = null;
    let currentLevel = null;

    function getAnchorIndices(size) {
      return [0, size - 1, size * (size - 1), size * size - 1];
    }

    function updateGridSize(size) {
  grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;
}


    function shuffle(array) {
      let currentIndex = array.length, randomIndex;
      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
      }
      return array;
    }

    function shuffleWithAnchors(array) {
      let movable = array.filter((_, i) => !anchors.includes(i));
      let shuffled = shuffle([...movable]);
      return array.map((val, i) => anchors.includes(i) ? val : shuffled.shift());
    }

    function renderGrid(tiles) {
      grid.innerHTML = '';
      instruction.classList.toggle('hidden', currentLevel !== 'test');
      tiles.forEach((tileData, index) => {
        const tile = document.createElement('div');
        tile.className = 'tile';
        const color = tileData.color || tileData;
        tile.style.backgroundColor = color;

        if (anchors.includes(index)) {
          tile.classList.add('anchor');
          tile.textContent = '✿';
          tile.style.fontSize = '1.5rem';
        } else {
          tile.setAttribute('draggable', true);
          tile.addEventListener('click', () => handleTileClick(index));
          tile.addEventListener('dragstart', (e) => e.dataTransfer.setData('text/plain', index));
          tile.addEventListener('dragover', (e) => e.preventDefault());
          tile.addEventListener('drop', (e) => {
            e.preventDefault();
            const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
            handleTileSwap(fromIndex, index);
          });

          if (currentLevel === 'test') {
            tile.textContent = tileData.label;
            tile.style.color = 'white';
            tile.style.fontWeight = 'bold';
          }
        }

        grid.appendChild(tile);
      });
    }

    function handleTileClick(index) {
      if (selectedIndex === null) {
        selectedIndex = index;
        grid.children[index].classList.add('selected');
      } else {
        grid.children[selectedIndex].classList.remove('selected');
        handleTileSwap(selectedIndex, index);
        selectedIndex = null;
      }
    }

    function handleTileSwap(i, j) {
      if (!anchors.includes(i) && !anchors.includes(j)) {
        const tiles = Array.from(grid.children);
        const tileA = tiles[i];
        const tileB = tiles[j];
        const rectA = tileA.getBoundingClientRect();
        const rectB = tileB.getBoundingClientRect();
        const dx = rectB.left - rectA.left;
        const dy = rectB.top - rectA.top;
        tileA.style.transform = `translate(${dx}px, ${dy}px)`;
        tileB.style.transform = `translate(${-dx}px, ${-dy}px)`;
        tileA.style.zIndex = 1;
        tileB.style.zIndex = 1;
        setTimeout(() => {
          tileA.style.transition = 'none';
          tileB.style.transition = 'none';
          tileA.style.transform = '';
          tileB.style.transform = '';
          tileA.style.zIndex = '';
          tileB.style.zIndex = '';
          [currentTiles[i], currentTiles[j]] = [currentTiles[j], currentTiles[i]];
          renderGrid(currentTiles);
          checkWin();
        }, 300);
      }
    }

    function checkWin() {
      const won = currentTiles.every((val, i) => val.color === solution[i].color);
      message.textContent = won ? '🎉 Puzzle Solved!' : '';
    }

    levelButtons.forEach(button => {
      button.addEventListener('click', () => {
        const level = button.dataset.level;
        currentLevel = level;
        landing.classList.add('hidden');
        game.classList.remove('hidden');
        levelTitle.textContent = `Level ${level}`;
        solution = [...levels[level]];
        const size = Math.sqrt(solution.length);
        anchors = getAnchorIndices(size);
        updateGridSize(size);
        currentTiles = shuffleWithAnchors(solution);
        renderGrid(currentTiles);
      });
    });

    backBtn.addEventListener('click', () => {
      game.classList.add('hidden');
      landing.classList.remove('hidden');
      grid.innerHTML = '';
      message.textContent = '';
      selectedIndex = null;
    });
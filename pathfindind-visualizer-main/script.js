const grid = document.getElementById("grid");
const rows = 20, cols = 20;
let cells = [];
let startCell = null, endCell = null;
let selectingStart = true;

function getCell(r, c) {
  return cells.find(cell => cell.r === r && cell.c === c);
}

function resetGrid() {
  grid.innerHTML = '';
  cells = [];
  startCell = null;
  endCell = null;
  selectingStart = true;
  createGrid();
}

function createGrid() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const div = document.createElement("div");
      div.className = "cell";
      div.addEventListener("click", () => {
        if (selectingStart) {
          div.classList.add("start");
          startCell = { el: div, r, c };
          selectingStart = false;
        } else if (!endCell && div !== startCell.el) {
          div.classList.add("end");
          endCell = { el: div, r, c };
        }
      });
      grid.appendChild(div);
      cells.push({ el: div, r, c, visited: false, parent: null });
    }
  }
}

function visualize(algo) {
  if (!startCell || !endCell) return alert("Select start and end cells first!");

  for (let cell of cells) {
    cell.visited = false;
    cell.parent = null;
  }

  const start = getCell(startCell.r, startCell.c);
  const end = getCell(endCell.r, endCell.c);
  const queue = [start];
  let found = false;

  const interval = setInterval(() => {
    if (queue.length === 0 || found) {
      clearInterval(interval);
      if (found) tracePath(end);
      return;
    }

    let current = (algo === 'bfs') ? queue.shift() : queue.pop();
    if (current.visited) return;

    current.visited = true;
    if (current !== start && current !== end) {
      current.el.classList.add("visited");
    }

    if (current.r === end.r && current.c === end.c) {
      found = true;
      return;
    }

    for (let [dr, dc] of [[0,1],[1,0],[0,-1],[-1,0]]) {
      let nr = current.r + dr, nc = current.c + dc;
      let neighbor = getCell(nr, nc);
      if (neighbor && !neighbor.visited && neighbor !== start) {
        neighbor.parent = current;
        queue.push(neighbor);
      }
    }
  }, 30);
}

function tracePath(end) {
  let current = end.parent;
  while (current && current.parent) {
    current.el.classList.remove("visited");
    current.el.classList.add("path");
    current = current.parent;
  }
}

createGrid();

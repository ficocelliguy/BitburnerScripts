function generateGrid(boardSize) {
  const gridArea = [];
  for (let i = 0; i < boardSize; i++) {
    gridArea.push(Array(boardSize).fill(0));
  }
  return gridArea;
}

/* function generateMinefield(gridArea, mineCoverage) {
   const boardSize = gridArea.length;
   for (let row = 0; row < boardSize; row++) {
      gridArea[row] = gridArea[row].map(cell => Math.random() < mineCoverage ? "Mine" : 0);
   }
   return gridArea;
} */

//Nested Maps - Might not be very readable
function generateMinefield(gridArea, mineCoverage) {
  return (gridArea = gridArea.map((row) => row.map((cell) => (Math.random() < mineCoverage ? 'Mine' : 0))));
}

function getNearby3x3Area() {
  //I make it like this since I no want hardcode it
  const nearbyMatrix = [];
  const nearbyArray = [-1, 0, 1];
  for (const row of nearbyArray) {
    for (const col of nearbyArray) {
      const areaCoordinates = [row, col];
      nearbyMatrix.push([row, col]);
    }
  }
  return nearbyMatrix;
}

function countNearbyMine(gridArea, coords, nearbyMatrix) {
  const boardSize = gridArea.length;
  let numOfMines = 0;
  let [centerRow, centerCol] = coords;

  for (const cell of nearbyMatrix) {
    let [rowOffset, colOffset] = cell;
    let nearbyRow = centerRow + rowOffset;
    let nearbyCol = centerCol + colOffset;

    if (nearbyRow < 0 || nearbyCol < 0) continue;
    if (nearbyRow >= boardSize || nearbyCol >= boardSize) continue;

    if (typeof gridArea[nearbyRow][nearbyCol] == 'string') numOfMines += 1;
  }
  return numOfMines;
}

function updateCellNearby(gridArea, nearbyMatrix) {
  for (const row in gridArea) {
    //Going through each cell
    for (const col in gridArea) {
      let coords = [Number(row), Number(col)];
      let numOfMines = countNearbyMine(gridArea, coords, nearbyMatrix);
      gridArea[row][col] += numOfMines;
    }
  }
  return gridArea;
}

//get adjacent tiles for floodDiscovery
function getAdjacentTiles({ row, col, cardinalDir, boardSize }) {
  let adjacentTiles = [];
  for (const dir in cardinalDir) {
    //Used to find North, South, East, West
    let [rowOffset, colOffset] = cardinalDir[dir]; //Coordinates of each direction
    let newRow = row + rowOffset;
    let newCol = col + colOffset;
    let isBreakLoop = false;
    switch (true) {
      case newRow >= boardSize:
      case newCol >= boardSize:
      case newRow < 0:
      case newCol < 0:
        isBreakLoop = true;
        break;
      default:
    }
    if (isBreakLoop) break;
    adjacentTiles.push([newRow, newCol]);
  }
  adjacentTiles = Array.from(adjacentTiles);
  debugger;
  return adjacentTiles;
}

//Flood Discovery Mechanic
function floodDiscovery({ gridArea, controlRow, controlCol, boardSize, cardinalDir }) {
  if (gridArea[controlRow][controlCol] === 0) {
    let visitedSet = new Set();
    let queuedSet = new Set([[controlRow, controlCol]]);

    for (const queued of queuedSet.difference(visitedSet)) {
      visitedSet.add(queued);
      //not a blank tile, no need to flood more
      let [row, col] = queued;
      if (gridArea[row][col] !== 0) continue;

      //continue flooding if it is a blank tile
      let adjacentParameters = { row, col, cardinalDir, boardSize };
      let adjacentTiles = getAdjacentTiles(adjacentParameters);
      for (const tileCoords of adjacentTiles) {
        queuedSet.add(tileCoords);
      }
    }
    visitedSet = Array.from(visitedSet);
    debugger;
    return visitedSet;
  }
}

/** @param {NS} ns */
export async function main(ns) {
  //////Variables
  //Colors - Cosmetic
  const cyan = '\u001b[36m';
  const red = '\u001b[31m';
  const reset = '\u001b[0m';
  const blackFGgreyBG = '\u001b[38;5;0;48;5;7m';

  ////Important vars
  const nearbyMatrix = getNearby3x3Area();
  const visitStatus = {
    unknownValue: 0,
    knownValue: 1,
    flaggedValue: 2,
  };

  const cardinalDir = {
    north: [-1, 0],
    south: [1, 0],
    east: [0, 1],
    west: [0, -1],
  };

  //Settings
  let difficulty;
  let boardSize;
  let mineCoverage;

  //gameState
  let gridArea;
  let gridInfo;
  let isGameOver = false;

  //ascii objects
  const knownShape = `[ ]`;
  const unknownShape = `[?]`;
  const mineShape = `${red}[*]${reset}`;
  const flaggedShape = `[F]`;

  //Saving Between Moves
  const gamePort = 420;

  let isRestartGame = ns.args[0];
  let isFirstTurn = true;
  let saveState;

  if (isRestartGame === 'restart') ns.clearPort(gamePort);

  if (ns.peek(gamePort) !== 'NULL PORT DATA') {
    saveState = ns.readPort(gamePort);
    let [savedDifficulty, savedGridArea, savedGridInfo] = saveState;

    isFirstTurn = false;
    difficulty = savedDifficulty;

    gridArea = savedGridArea;
    gridInfo = savedGridInfo;

    boardSize = 5 * difficulty;
    mineCoverage = 0.08 + 0.04 * difficulty;
  }

  ////Initialization
  if (isFirstTurn) {
    //INSTRUCTIONS
    ns.tprintf(`
${cyan}HOW TO PLAY:${reset}
"run ${ns.getScriptName()} x y flag"
- x and y are coordinates
- flag = true to flag a tile (false by default)
"run ${ns.getScriptName()} restart" -> restarts Minesweeper

${cyan}DIFFICULTY:${reset}
1 => 5x5 tiles
2 => 10x10 tiles
3 => 15x15 tiles
The higher the difficulty, the more bombs spawn

${red}NOTE THIS MIGHT BE OUTDATED${reset}`);

    //Choose Difficulty
    difficulty = await ns.prompt('Choose your Difficulty', {
      type: 'select',
      choices: [1, 2, 3],
    });

    //Update variables
    boardSize = 5 * difficulty;
    mineCoverage = 0.08 + 0.04 * difficulty;

    //Generate Board
    gridArea = generateGrid(boardSize);

    //Generate Minefield
    gridArea = generateMinefield(gridArea, mineCoverage);
    gridArea = updateCellNearby(gridArea, nearbyMatrix);
    console.log(`gridArea Init: ${gridArea}`);

    //Generate Secondary Array -> Unknown Tiles & other Info
    gridInfo = generateGrid(boardSize);
    console.log(`gridInfo Init: ${gridInfo}`);
  }

  //CONTROLS
  let controlRow = ns.args[0];
  let controlCol = ns.args[1];
  let controlFlag = ns.args[2];

  let controlCoordinates = [controlRow, controlCol]; //Find a use for this sometime
  let infoRowCol = [gridInfo, controlRow, controlCol];
  const isFlagged = ([gridInfo, row, col] = infoRowCol) => gridInfo[row][col] == visitStatus.flaggedValue;
  const isUnknown = ([gridInfo, row, col] = infoRowCol) => gridInfo[row][col] == visitStatus.unknownValue;

  switch (true) {
    //Checking for VALID INPUTS
    case (controlRow || controlCol) == undefined:
    case typeof (controlRow || controlCol) == 'string':
    case controlRow >= boardSize:
    case controlCol >= boardSize:
    case controlRow < 0:
    case controlCol < 0:
      ns.tprintf(`${red}Please enter x&y coordinates between 0 and ${boardSize - 1}`);
      break;

    //Flag ON:
    case controlFlag === true && isFlagged():
      gridInfo[controlRow][controlCol] = visitStatus.unknownValue;
      break;
    case controlFlag === true && isUnknown():
      gridInfo[controlRow][controlCol] = visitStatus.flaggedValue;
      break;

    //Flag OFF:
    case gridInfo[controlRow][controlCol] === visitStatus.flaggedValue:
      ns.tprintf(`${red}SPOT IS FLAGGED, CANNOT DIG`);
      break;

    default:
      gridInfo[controlRow][controlCol] = visitStatus.knownValue;

      //Flood Mechanic
      if (gridArea[controlRow][controlCol] !== 0) break;

      let floodParameters = { gridArea, controlRow, controlCol, boardSize, cardinalDir };
      const makeKnown = floodDiscovery(floodParameters);
      for (const tile of makeKnown) {
        const [row, col] = tile;
        gridInfo[row][col] = visitStatus.knownValue;
        debugger;
      }
  }

  //The doubleclick autofill thingy with flags, you know?

  //RENDERING
  const separationLine = {
    horizontal: `${cyan}-${reset}`,
    vertical: `${cyan}-${reset}`,
  };
  //Separation Line
  ns.tprintf(separationLine.horizontal.repeat(boardSize * unknownShape.length + 2));

  for (const row in gridArea) {
    let textRender = '';
    textRender += separationLine.vertical; //Separation Line

    for (const col in gridArea) {
      switch (true) {
        case gridInfo[row][col] === visitStatus.unknownValue:
          textRender += unknownShape;
          break;
        case typeof gridArea[row][col] === 'string':
          textRender += mineShape;
          isGameOver = true;
          break;
        case gridInfo[row][col] === visitStatus.flaggedValue:
          textRender += flaggedShape;
          break;
        case gridArea[row][col] === 0:
          textRender += knownShape;
          break;
        default:
          textRender += `[${gridArea[row][col]}]`;
      }
    }
    textRender += separationLine.vertical; //Separation Line
    textRender += ` (${row})`;
    ns.tprintf(textRender);
  }
  //Separation Line
  ns.tprintf(separationLine.horizontal.repeat(boardSize * unknownShape.length + 2));

  let rowCoordRender = '';
  for (let temp = 0; temp < boardSize; temp++) {
    if (temp.toString().length >= 2) {
      rowCoordRender += `${temp} `;
      continue;
    }
    rowCoordRender += ` ${temp} `;
  }
  ns.tprintf(`|` + rowCoordRender + `|`);

  //Game Over
  if (isGameOver) {
    ns.tprintf(`${red}GAME OVER`);
    ns.clearPort(gamePort);
    return 0;
  }

  //SAVING GAME
  saveState = [difficulty, gridArea, gridInfo];
  ns.clearPort(gamePort);
  ns.writePort(gamePort, saveState);
}

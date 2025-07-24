/**Author:
 * Discord:
 * - Sphyxis
 *
 * Additional Contributers:
 * Discord:
 * - Stoneware
 * - gmcew
 */

const CHEATS = true;
const LOGTIME = false;
let STYLE = 0;
const REPEAT = true;
let currentValidMovesTurn = 0; //The turn count that the currentValidMoves is valid for
let currentValidMoves; //All valid moves for this turn
let currentValidContestedMoves; //All valid moves that occupy a contested space
let turn = 0;
let START = performance.now();
/** @param {NS} ns */
export async function main(ns) {
  ns.tail();
  ns.disableLog('go.makeMove');
  const startBoard = ns.go.getBoardState();
  let inProgress = false;
  turn = 0;
  START = performance.now();
  for (let x = 0; x < startBoard[0].length; x++) {
    for (let y = 0; y < startBoard[0].length; y++) {
      if (startBoard[x][y] === 'X') {
        inProgress = true;
        turn = 3;
        break;
      }
    }
    if (inProgress) break;
  }
  getStyle(ns);
  const currentGame = await ns.go.opponentNextTurn(false);
  checkNewGame(ns, currentGame);

  while (true) {
    turn++;
    const board = ns.go.getBoardState();
    const contested = ns.go.analysis.getControlledEmptyNodes();
    const validMove = ns.go.analysis.getValidMoves();
    const validLibMoves = ns.go.analysis.getLiberties();
    const chains = ns.go.analysis.getChains();
    const size = board[0].length;
    //Build a test board with walls
    const testBoard = [];
    let testWall = '';
    let results;
    if (size === 13) testWall = 'WWWWWWWWWWWWWWW';
    else if (size === 9) testWall = 'WWWWWWWWWWW';
    else if (size === 7) testWall = 'WWWWWWWWW';
    else if (size === 19) testWall = 'WWWWWWWWWWWWWWWWWWWWW';
    else testWall = 'WWWWWWW';
    testBoard.push(testWall);
    for (const b of board) testBoard.push('W' + b + 'W');
    testBoard.push(testWall);
    //We have our test board

    if (turn < 3)
      // || (size === 19 && turn < 4))
      results = await movePiece(
        ns,
        getOpeningMove(ns, board, validMove, validLibMoves, contested),
        board,
        validLibMoves,
        contested,
      );

    if (turn >= 3) {
      switch (STYLE) {
        case 0: //Netburners
          if (
            (results =
              (await movePiece(
                ns,
                getRandomCounterLib(ns, board, validMove, validLibMoves, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomLibAttack(ns, board, validMove, validLibMoves, contested, 88),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomLibDefend(ns, board, validMove, validLibMoves, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getAggroAttack(ns, board, validMove, validLibMoves, contested, 2, 2, 2),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                disruptEyes(ns, board, testBoard, validMove, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getDefPattern(ns, board, testBoard, validMove, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getAggroAttack(ns, board, validMove, validLibMoves, contested, 3, 3, 3, 1, 6),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomBolster(ns, board, validMove, validLibMoves, contested, chains, 2, 1),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getAggroAttack(ns, board, validMove, validLibMoves, contested, 4, 7, 3, 1, 6),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                attackGrowDragon(ns, board, validMove, validLibMoves, contested, 1),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getDefAttack(ns, board, validMove, validLibMoves, contested, 8, 20, 2),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomExpand(ns, board, validMove, validLibMoves, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomBolster(ns, board, validMove, validLibMoves, contested, chains, 2, 1, false, 1),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomLibAttack(ns, board, validMove, validLibMoves, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomStrat(ns, board, validMove, validLibMoves, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          ns.print('Turn Passed');
          results = await ns.go.passTurn();
          break;
        case 1: //The Black Hand
          if (
            (results =
              (await movePiece(
                ns,
                getRandomCounterLib(ns, board, validMove, validLibMoves, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomLibAttack(ns, board, validMove, validLibMoves, contested, 88),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomLibDefend(ns, board, validMove, validLibMoves, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getAggroAttack(ns, board, validMove, validLibMoves, contested, 2, 2, 2),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                disruptEyes(ns, board, testBoard, validMove, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getDefPattern(ns, board, testBoard, validMove, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getAggroAttack(ns, board, validMove, validLibMoves, contested, 3, 3, 3, 1, 6),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomBolster(ns, board, validMove, validLibMoves, contested, chains, 2, 1),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getAggroAttack(ns, board, validMove, validLibMoves, contested, 4, 7, 3, 1, 6),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                attackGrowDragon(ns, board, validMove, validLibMoves, contested, 1),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomExpand(ns, board, validMove, validLibMoves, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomBolster(ns, board, validMove, validLibMoves, contested, chains, 2, 1, false, 1),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomLibAttack(ns, board, validMove, validLibMoves, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomStrat(ns, board, validMove, validLibMoves, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          ns.print('Turn Passed');
          results = await ns.go.passTurn();
          break;
        case 2: //Mr. Mustacio - Slum Snakes
          if (
            (results =
              (await movePiece(
                ns,
                getRandomCounterLib(ns, board, validMove, validLibMoves, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomLibAttack(ns, board, validMove, validLibMoves, contested, 88),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomLibDefend(ns, board, validMove, validLibMoves, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getAggroAttack(ns, board, validMove, validLibMoves, contested, 2, 2, 2),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                disruptEyes(ns, board, testBoard, validMove, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getDefPattern(ns, board, testBoard, validMove, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getAggroAttack(ns, board, validMove, validLibMoves, contested, 3, 3, 3, 1, 6),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomBolster(ns, board, validMove, validLibMoves, contested, chains, 2, 1),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getDefAttack(ns, board, validMove, validLibMoves, contested, 4, 7, 3, 1, 6),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                attackGrowDragon(ns, board, validMove, validLibMoves, contested, 1),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomExpand(ns, board, validMove, validLibMoves, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomBolster(ns, board, validMove, validLibMoves, contested, chains, 2, 1, false, 1),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomLibAttack(ns, board, validMove, validLibMoves, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomStrat(ns, board, validMove, validLibMoves, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          ns.print('Turn Passed');
          results = await ns.go.passTurn();
          break;
        case 3: //Daedelus
          if (
            (results =
              (await movePiece(
                ns,
                getRandomCounterLib(ns, board, validMove, validLibMoves, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomLibAttack(ns, board, validMove, validLibMoves, contested, 88),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomLibDefend(ns, board, validMove, validLibMoves, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getAggroAttack(ns, board, validMove, validLibMoves, contested, 2, 2, 2),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                disruptEyes(ns, board, testBoard, validMove, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getDefPattern(ns, board, testBoard, validMove, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getAggroAttack(ns, board, validMove, validLibMoves, contested, 3, 4, 3, 1, 6),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomBolster(ns, board, validMove, validLibMoves, contested, chains, 2, 1),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getDefAttack(ns, board, validMove, validLibMoves, contested, 5, 7, 3, 2, 6),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                attackGrowDragon(ns, board, validMove, validLibMoves, contested, 1),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomExpand(ns, board, validMove, validLibMoves, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomBolster(ns, board, validMove, validLibMoves, contested, chains, 2, 1, false, 1),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomLibAttack(ns, board, validMove, validLibMoves, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomStrat(ns, board, validMove, validLibMoves, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          ns.print('Turn Passed');
          results = await ns.go.passTurn();
          break;
        case 4: //Tetrads
          if (
            (results =
              (await movePiece(
                ns,
                getRandomCounterLib(ns, board, validMove, validLibMoves, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomLibAttack(ns, board, validMove, validLibMoves, contested, 88),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomLibDefend(ns, board, validMove, validLibMoves, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getAggroAttack(ns, board, validMove, validLibMoves, contested, 2, 2, 2),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                disruptEyes(ns, board, testBoard, validMove, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getDefPattern(ns, board, testBoard, validMove, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getAggroAttack(ns, board, validMove, validLibMoves, contested, 3, 4, 3),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomBolster(ns, board, validMove, validLibMoves, contested, chains, 2, 1),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getAggroAttack(ns, board, validMove, validLibMoves, contested, 5, 7, 3),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                attackGrowDragon(ns, board, validMove, validLibMoves, contested, 1),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomExpand(ns, board, validMove, validLibMoves, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomBolster(ns, board, validMove, validLibMoves, contested, chains, 2, 1, false, 1),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomLibAttack(ns, board, validMove, validLibMoves, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomStrat(ns, board, validMove, validLibMoves, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          ns.print('Turn Passed');
          results = await ns.go.passTurn();
          break;
        case 5: //Illum
          if (
            (results =
              (await movePiece(
                ns,
                getRandomCounterLib(ns, board, validMove, validLibMoves, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomLibAttack(ns, board, validMove, validLibMoves, contested, 88),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomLibDefend(ns, board, validMove, validLibMoves, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getAggroAttack(ns, board, validMove, validLibMoves, contested, 2, 2, 2),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                disruptEyes(ns, board, testBoard, validMove, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getDefPattern(ns, board, testBoard, validMove, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getAggroAttack(ns, board, validMove, validLibMoves, contested, 3, 4, 3),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomBolster(ns, board, validMove, validLibMoves, contested, chains, 2, 1),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                attackGrowDragon(ns, board, validMove, validLibMoves, contested, 1),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomExpand(ns, board, validMove, validLibMoves, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomBolster(ns, board, validMove, validLibMoves, contested, chains, 2, 1, false, 1),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomLibAttack(ns, board, validMove, validLibMoves, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomStrat(ns, board, validMove, validLibMoves, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          ns.print('Turn Passed');
          results = await ns.go.passTurn();
          break;
        case 6: //??????
          if (
            (results =
              (await movePiece(
                ns,
                getRandomCounterLib(ns, board, validMove, validLibMoves, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomLibAttack(ns, board, validMove, validLibMoves, contested, 88),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomLibDefend(ns, board, validMove, validLibMoves, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getAggroAttack(ns, board, validMove, validLibMoves, contested, 2, 2, 2),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                disruptEyes(ns, board, testBoard, validMove, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getDefPattern(ns, board, testBoard, validMove, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getAggroAttack(ns, board, validMove, validLibMoves, contested, 3, 4, 3),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomBolster(ns, board, validMove, validLibMoves, contested, chains, 2, 1),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getDefAttack(ns, board, validMove, validLibMoves, contested, 5, 7, 3),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                attackGrowDragon(ns, board, validMove, validLibMoves, contested, 1),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomExpand(ns, board, validMove, validLibMoves, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomBolster(ns, board, validMove, validLibMoves, contested, chains, 2, 1, false, 1),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomLibAttack(ns, board, validMove, validLibMoves, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          if (
            (results =
              (await movePiece(
                ns,
                getRandomStrat(ns, board, validMove, validLibMoves, contested),
                board,
                validLibMoves,
                contested,
              )) !== false)
          )
            break;
          ns.print('Turn Passed');
          results = await ns.go.passTurn();
          break;
      } //End of style switch
    } // end of turn >= 3
    checkNewGame(ns, results);
  }
}

/** @param {NS} ns */
function getStyle(ns) {
  const facing = ns.go.getOpponent();
  switch (facing) {
    case 'Netburners':
      STYLE = 0;
      break;
    case 'The Black Hand':
      STYLE = 1;
      break;
    case 'Slum Snakes':
      STYLE = 2;
      break;
    case 'Daedelus':
      STYLE = 3;
      break;
    case 'Tetrads':
      STYLE = 4;
      break;
    case 'Illuminati':
      STYLE = 5;
      break;
    default:
      STYLE = 6;
  }
}
function checkNewGame(ns, gameInfo) {
  if (gameInfo?.type === 'gameOver') {
    if (!REPEAT) return;
    try {
      ns.go.resetBoardState(opponent2[Math.floor(Math.random() * opponent2.length)], 13);
    } catch {
      ns.go.resetBoardState(opponent[Math.floor(Math.random() * opponent.length)], 13);
    }
    turn = 0;
    ns.clearLog();
    getStyle(ns);
  }
}
/** @param {NS} ns */
function isPattern(ns, x, y, pattern, testBoard, validMove, contested, id) {
  //Move the pattern around with x/y loops, check if pattern matches IF a move is placed
  //We can assume that x and y are valid moves

  const size = testBoard[0].length;
  const patterns = getAllPatterns(pattern);
  const patternSize = pattern.length;

  for (const patternCheck of patterns) {
    //cx and cy - the spots of the pattern we are checking against the test board
    //For, say a 3x3 pattern, we do a grid of 0,0 -> 2, 2
    for (let cx = (patternSize - 1) * -1; cx <= 0; cx++) {
      // We've added a wall around everything, so 0 is a wall
      if (cx + x + 1 < 0 || cx + x + 1 > size - 1) continue;
      for (let cy = (patternSize - 1) * -1; cy <= 0 - 1; cy++) {
        //We now have a cycle that will check each section of the grid against the pattern
        //Safety checks: We know 0,0 is safe, we were sent it, but each other section could be bad
        if (cy + y + 1 < 0 || cy + y + 1 > size - 1) continue;
        let count = 0;
        let abort = false;
        for (let px = 0; px < patternSize && !abort; px++) {
          if (x + cx + px + 1 < 0 || x + cx + px + 1 >= size) {
            //Don't go off grid
            abort = true;
            break;
          }
          for (let py = 0; py < patternSize && !abort; py++) {
            if (y + cy + py + 1 < 0 || y + cy + py + 1 >= size) {
              //Are we off the map?
              abort = true;
              break;
            }
            if (cx + px === 0 && cy + py === 0 && !['X', '*'].includes(patternCheck[px][py])) {
              abort = true;
              break;
            }
            if (cx + px === 0 && cy + py === 0 && ['X'].includes(contested[x][y]) && patternCheck[px][py] !== '*') {
              abort = true;
              break;
            }
            //We now have a cycles for each spot in the pattern
            //0,0 -> 2,2 for a 3x3
            switch (patternCheck[px][py]) {
              case 'X':
                if (
                  testBoard[cx + x + 1 + px][cy + y + 1 + py] === 'X' ||
                  (cx + px === 0 && cy + py === 0 && testBoard[cx + x + 1 + px][cy + y + 1 + py] === '.')
                ) {
                  count++;
                } else if (cx + px === 0 && cy + py === 0) {
                  count++; // Our placement piece
                } else abort = true;
                break;
              case '*': // Special case.  We move here next or break the test
                if (testBoard[cx + x + 1 + px][cy + y + 1 + py] === '.' && cx + px === 0 && cy + py === 0) {
                  count++;
                } else abort = true;
                break;
              case 'O':
                if (testBoard[cx + x + 1 + px][cy + y + 1 + py] === 'O') count++;
                else abort = true;
                break;
              case 'x':
                if (['X', '.'].includes(testBoard[cx + x + 1 + px][cy + y + 1 + py])) count++;
                else abort = true;
                break;
              case 'o':
                if (['O', '.'].includes(testBoard[cx + x + 1 + px][cy + y + 1 + py])) count++;
                else abort = true;
                break;
              case '?':
                count++;
                break;
              case '.':
                if (testBoard[cx + x + 1 + px][cy + y + 1 + py] === '.') count++;
                else abort = true;
                break;
              case 'W':
                if (['W', '#'].includes(testBoard[cx + x + 1 + px][cy + y + 1 + py])) count++;
                else abort = true;
                break;
              case 'B':
                if (['W', '#', 'X'].includes(testBoard[cx + x + 1 + px][cy + y + 1 + py])) count++;
                else abort = true;
                break;
              case 'b':
                if (['W', '#', 'O'].includes(testBoard[cx + x + 1 + px][cy + y + 1 + py])) count++;
                else abort = true;
                break;
              case 'A':
                if (['W', '#', 'X', 'O'].includes(testBoard[cx + x + 1 + px][cy + y + 1 + py])) count++;
                else abort = true;
                break;
            }
            if (count === patternSize * patternSize) return true;
          }
        }
      }
    }
  }
  return false;
}
/** @param {NS} ns */
function getAllPatterns(pattern) {
  const rotations = [
    pattern,
    rotate90Degrees(pattern),
    rotate90Degrees(rotate90Degrees(pattern)),
    rotate90Degrees(rotate90Degrees(rotate90Degrees(pattern))),
  ];
  return [...rotations, ...rotations.map(verticalMirror)];
}

//Special thanks to @gmcew for the next 2 functions!
/** @param {NS} ns */
function rotate90Degrees(pattern) {
  return pattern.map((val, index) =>
    pattern
      .map((row) => row[index])
      .reverse()
      .join(''),
  );
}
/** @param {NS} ns */
function verticalMirror(pattern) {
  return pattern.toReversed();
}

/** @param {NS} ns */
function getSnakeEyes(ns, board, validLibMoves, contested, minKilled = 5) {
  const moveOptions = [];
  const size = board[0].length;
  let highValue = 1;

  const checked = new Set();

  for (let x = 0; x < size - 1; x++)
    for (let y = 0; y < size - 1; y++) {
      if (
        contested[x][y] === 'X' ||
        board[x][y] !== 'O' ||
        validLibMoves[x][y] !== 2 ||
        checked.has(JSON.stringify([x, y]))
      )
        continue;
      //Is it the enemy, with 2 libs (we can kill) and we have not checked this spot and the chain is large enough
      const chain = getChainValue(x, y, board, contested, 'O');
      if (chain < minKilled) continue;
      //We have a winner!  Check all it's spots and find the 2 killing blows.  Add the checked spots to the checked list so we don't recheck
      checked.add(JSON.stringify([x, y]));
      const enemySearch = new Set();
      const move1 = [];
      const move2 = [];
      enemySearch.add(JSON.stringify([x, y]));
      for (const explore of enemySearch) {
        const [fx, fy] = JSON.parse(explore);
        //Find your eyes
        if (board[fx][fy] === '.') {
          move1.length ? move2.push([fx, fy]) : move1.push([fx, fy]);
          checked.add(JSON.stringify([fx, fy]));
          continue;
        }

        //Find more of yourself to search...
        if (fx < size - 1 && ['O', '.'].includes(board[fx + 1][fy])) {
          enemySearch.add(JSON.stringify([fx + 1, fy]));
          checked.add(JSON.stringify([fx, fy]));
        }
        if (fx > 0 && ['O', '.'].includes(board[fx - 1][fy])) {
          enemySearch.add(JSON.stringify([fx - 1, fy]));
          checked.add(JSON.stringify([fx, fy]));
        }
        if (fy > 0 && ['O', '.'].includes(board[fx][fy - 1])) {
          enemySearch.add(JSON.stringify([fx, fy - 1]));
          checked.add(JSON.stringify([fx, fy]));
        }
        if (fy < size - 1 && ['O', '.'].includes(board[fx][fy + 1])) {
          enemySearch.add(JSON.stringify([fx, fy + 1]));
          checked.add(JSON.stringify([fx, fy]));
        }
      } // End of searching the enemy

      if (chain > highValue) {
        highValue = chain;
        moveOptions.length = 0;
        const mv1 = move1.pop();
        const mv2 = move2.pop();
        moveOptions.push([mv1[0], mv1[1], mv2[0], mv2[1]]);
      } else if (chain === highValue) {
        const mv1 = move1.pop();
        const mv2 = move2.pop();
        moveOptions.push([mv1[0], mv1[1], mv2[0], mv2[1]]);
      }
    } // Search whole board

  // Choose one of the found moves at random
  const randomIndex = Math.floor(Math.random() * moveOptions.length);
  return moveOptions[randomIndex]
    ? {
        coords: moveOptions[randomIndex],
        msg: 'SnakeEyes Cheat',
      }
    : [];
}

/** @param {NS} ns */
function getRandomLibAttack(ns, board, validMoves, validLibMoves, contested, minKilled = 1) {
  const moveOptions = [];
  const size = board[0].length;
  let highValue = 1;
  // Look through all the points on the board
  const moves = getAllValidMoves(board, validMoves, contested, true);
  for (const [x, y] of moves) {
    if (contested[x][y] === 'X' || validLibMoves[x][y] !== -1) continue;

    let count = 0;
    let chains = 0;

    //We are only checking up, down, left and right
    if (x > 0 && board[x - 1][y] === 'O' && validLibMoves[x - 1][y] === 1) {
      count++;
      chains += getChainValue(x - 1, y, board, contested, 'O');
    }
    if (x < size - 1 && board[x + 1][y] === 'O' && validLibMoves[x + 1][y] === 1) {
      count++;
      chains += getChainValue(x + 1, y, board, contested, 'O');
    }
    if (y > 0 && board[x][y - 1] === 'O' && validLibMoves[x][y - 1] === 1) {
      count++;
      chains += getChainValue(x, y - 1, board, contested, 'O');
    }
    if (y < size - 1 && board[x][y + 1] === 'O' && validLibMoves[x][y + 1] === 1) {
      count++;
      chains += getChainValue(x, y + 1, board, contested, 'O');
    }
    const enemyLibs = getSurroundLibs(x, y, board, validLibMoves, 'O');
    if (count === 0 || (chains < minKilled && enemyLibs <= 1)) continue;
    //const space = enemyLibs <= 2 ? 1 : enemyLibs - 1
    const result = count * chains; // * space
    if (result > highValue) {
      moveOptions.length = 0;
      moveOptions.push([x, y]);
      highValue = result;
    } else if (result === highValue) moveOptions.push([x, y]);
  }
  // Choose one of the found moves at random
  const randomIndex = Math.floor(Math.random() * moveOptions.length);
  return moveOptions[randomIndex]
    ? {
        coords: moveOptions[randomIndex],
        msg: 'Lib Attack',
      }
    : [];
}
/** @param {NS} ns */
function getRandomLibDefend(ns, board, validMoves, validLibMoves, contested, savedMin = 1) {
  const moveOptions = [];
  const size = board[0].length;
  let highValue = 0;
  // Look through all the points on the board
  const moves = getAllValidMoves(board, validMoves, contested);
  for (const [x, y] of moves) {
    const surround = getSurroundLibs(x, y, board, validLibMoves, 'X');
    const myEyes = getEyeValue(x, y, board, contested, 'X');
    if (surround + myEyes < 2) continue; //Abort.  Let it go, let it go...

    if (validLibMoves[x][y] === -1) {
      let count = 0;
      //We are only checking up, down, left and right
      if (x > 0 && validLibMoves[x - 1][y] === 1 && board[x - 1][y] === 'X')
        count += getChainValue(x - 1, y, board, contested, 'X');
      if (x < size - 1 && validLibMoves[x + 1][y] === 1 && board[x + 1][y] === 'X')
        count += getChainValue(x + 1, y, board, contested, 'X');
      if (y > 0 && validLibMoves[x][y - 1] === 1 && board[x][y - 1] === 'X')
        count += getChainValue(x, y - 1, board, contested, 'X');
      if (y < size - 1 && validLibMoves[x][y + 1] === 1 && board[x][y + 1] === 'X')
        count += getChainValue(x, y + 1, board, contested, 'X');
      if (count === 0 || count < savedMin) continue;
      //Just HOW effective will this move be?  Counter attack if we can.
      count *= surround;

      if (count > highValue) {
        moveOptions.length = 0;
        moveOptions.push([x, y]);
        highValue = count;
      } else if (count === highValue) moveOptions.push([x, y]);
    }
  }
  // Choose one of the found moves at random
  const randomIndex = Math.floor(Math.random() * moveOptions.length);
  return moveOptions[randomIndex]
    ? {
        coords: moveOptions[randomIndex],
        msg: 'Lib Defend',
      }
    : [];
}
/** @param {NS} ns */
function getRandomCounterLib(ns, board, validMoves, validLibMoves, contested) {
  //Advanced strategy
  //If we have a chain that's going to die, and a hanging lib attached to it
  //Find that hanging lib and kill it to save the chain
  const size = board[0].length;
  // Look through all the points on the board
  const moves = getAllValidMoves(board, validMoves, contested);
  const movesAvailable = new Set(); //Contains the empty squares that we are looking to see if we should take
  const friendlyToCheckForOpp = new Set();
  for (const [x, y] of moves) {
    //We are checking up, down, left and right first
    if (x > 0 && validLibMoves[x - 1][y] === 1 && board[x - 1][y] === 'X') {
      movesAvailable.add(JSON.stringify([x, y]));
      friendlyToCheckForOpp.add(JSON.stringify([x - 1, y]));
    }
    if (x < size - 1 && validLibMoves[x + 1][y] === 1 && board[x + 1][y] === 'X') {
      movesAvailable.add(JSON.stringify([x, y]));
      friendlyToCheckForOpp.add(JSON.stringify([x + 1, y]));
    }
    if (y > 0 && validLibMoves[x][y - 1] === 1 && board[x][y - 1] === 'X') {
      movesAvailable.add(JSON.stringify([x, y]));
      friendlyToCheckForOpp.add(JSON.stringify([x, y - 1]));
    }
    if (y < size - 1 && validLibMoves[x][y + 1] === 1 && board[x][y + 1] === 'X') {
      movesAvailable.add(JSON.stringify([x, y]));
      friendlyToCheckForOpp.add(JSON.stringify([x, y + 1]));
    }
  }
  //Shortcut.  While there's 1, is it THE one?
  //We know that 1 side of this is a friendly with 1 lib at risk.  Is another side the enemy?
  for (const explore of movesAvailable) {
    const [fx, fy] = JSON.parse(explore);
    if (!validMoves[fx][fy]) continue;
    if (fx < size - 1 && board[fx + 1][fy] === 'O' && validLibMoves[fx + 1][fy] === 1) {
      return {
        coords: [fx, fy],
        msg: 'Counter Lib Attack - Fist of the east',
      };
    }
    if (fx > 0 && board[fx - 1][fy] === 'O' && validLibMoves[fx - 1][fy] === 1) {
      return {
        coords: [fx, fy],
        msg: 'Counter Lib Attack - Fist of the west',
      };
    }
    if (fy > 0 && board[fx][fy - 1] === 'O' && validLibMoves[fx][fy - 1] === 1) {
      return {
        coords: [fx, fy],
        msg: 'Counter Lib Attack - Fist of the south',
      };
    }
    if (fy < size - 1 && board[fx][fy + 1] === 'O' && validLibMoves[fx][fy + 1] === 1) {
      return {
        coords: [fx, fy],
        msg: 'Counter Lib Attack - Fist of the north',
      };
    }
  }
  const enemiesToSearch = new Set();
  //We have our empty chain.  Look through him to find adjoining O's that can be killed and other friendies
  for (const explore of friendlyToCheckForOpp) {
    const [fx, fy] = JSON.parse(explore);
    if (fx < size - 1 && board[fx + 1][fy] === 'O' && validLibMoves[fx + 1][fy] === 1)
      enemiesToSearch.add(JSON.stringify([fx + 1, fy]));
    if (fx > 0 && board[fx - 1][fy] === 'O' && validLibMoves[fx - 1][fy] === 1)
      enemiesToSearch.add(JSON.stringify([fx - 1, fy]));
    if (fy > 0 && board[fx][fy - 1] === 'O' && validLibMoves[fx][fy - 1] === 1)
      enemiesToSearch.add(JSON.stringify([fx, fy - 1]));
    if (fy < size - 1 && board[fx][fy + 1] === 'O' && validLibMoves[fx][fy + 1] === 1)
      enemiesToSearch.add(JSON.stringify([fx, fy + 1]));

    if (fx < size - 1 && ['X'].includes(board[fx + 1][fy])) friendlyToCheckForOpp.add(JSON.stringify([fx + 1, fy]));
    if (fx > 0 && ['X'].includes(board[fx - 1][fy])) friendlyToCheckForOpp.add(JSON.stringify([fx - 1, fy]));
    if (fy > 0 && ['X'].includes(board[fx][fy - 1])) friendlyToCheckForOpp.add(JSON.stringify([fx, fy - 1]));
    if (fy < size - 1 && ['X'].includes(board[fx][fy + 1])) friendlyToCheckForOpp.add(JSON.stringify([fx, fy + 1]));
  }

  for (const explore of enemiesToSearch) {
    const [fx, fy] = JSON.parse(explore);
    if (fx < size - 1 && board[fx + 1][fy] === 'O') enemiesToSearch.add(JSON.stringify([fx + 1, fy]));
    if (fx > 0 && board[fx - 1][fy] === 'O') enemiesToSearch.add(JSON.stringify([fx - 1, fy]));
    if (fy > 0 && board[fx][fy - 1] === 'O') enemiesToSearch.add(JSON.stringify([fx, fy - 1]));
    if (fy < size - 1 && board[fx][fy + 1] === 'O') enemiesToSearch.add(JSON.stringify([fx, fy + 1]));

    if (fx < size - 1 && board[fx + 1][fy] === '.' && validMoves[fx + 1][fy]) {
      return {
        coords: [fx + 1, fy],
        msg: 'Counter Lib Attack - The wind blows',
      };
    }
    if (fx > 0 && board[fx - 1][fy] === '.' && validMoves[fx - 1][fy]) {
      return {
        coords: [fx - 1, fy],
        msg: 'Counter Lib Attack - The earth grows',
      };
    }
    if (fy > 0 && board[fx][fy - 1] === '.' && validMoves[fx][fy - 1]) {
      return {
        coords: [fx, fy - 1],
        msg: 'Counter Lib Attack - The fire burns',
      };
    }
    if (fy < size - 1 && board[fx][fy + 1] === '.' && validMoves[fx][fy + 1]) {
      return {
        coords: [fx, fy + 1],
        msg: 'Counter Lib Attack - The water flows',
      };
    }
  }
  return [];
}
/** @param {NS} ns */
function getRandomExpand(ns, board, validMoves, validLibMoves, contested) {
  const moveOptions = [];
  const size = board[0].length;
  let highValue = 0;
  // Look through all the points on the board
  const moves = getAllValidMoves(board, validMoves, contested, true);
  for (const [x, y] of moves) {
    const surroundLibs = getSurroundLibs(x, y, board, validLibMoves, 'X');
    const enemySurroundLibs = getSurroundLibs(x, y, board, validLibMoves, 'O');
    if (
      contested[x][y] !== '?' ||
      surroundLibs <= 2 ||
      createsLib(x, y, board, validLibMoves, 'X') ||
      enemySurroundLibs <= 1
    )
      continue;
    let count = 0;
    //We are only checking up, down, left and right.  Don't expand if you're surrounded by friendlies
    if (x > 0 && board[x - 1][y] === 'X') count++;
    if (x < size - 1 && board[x + 1][y] === 'X') count++;
    if (y > 0 && board[x][y - 1] === 'X') count++;
    if (y < size - 1 && board[x][y + 1] === 'X') count++;
    if (count >= 3 || count <= 0) continue;

    const surroundSpace = getSurroundSpaceFull(x, y, board) + 1;
    const enemySurroundChains = getChainAttack(x, y, board, contested) + 1;
    const myEyes = getEyeValueFull(x, y, board, contested, 'X') + 1;
    const enemies = getSurroundEnemiesFull(x, y, board, contested) + 1;
    const freeSpace = getFreeSpace(x, y, board, contested);
    const rank = myEyes * enemySurroundLibs * enemies * enemySurroundChains * freeSpace * surroundSpace;

    if (rank > highValue) {
      moveOptions.length = 0;
      moveOptions.push([x, y]);
      highValue = rank;
    } else if (rank === highValue) moveOptions.push([x, y]);
  }
  // Choose one of the found moves at random
  const randomIndex = Math.floor(Math.random() * moveOptions.length);
  return moveOptions[randomIndex]
    ? {
        coords: moveOptions[randomIndex],
        msg: 'Expansion',
      }
    : [];
}
/** @param {NS} ns */
function getRandomBolster(
  ns,
  board,
  validMoves,
  validLibMoves,
  contested,
  chains,
  libRequired,
  savedNodesMin,
  onlyContested = true,
  surnd = 3,
) {
  const moveOptions = [];
  const size = board[0].length;
  let highValue = 1;
  // Look through all the points on the board
  const moves = getAllValidMoves(board, validMoves, contested);
  for (const [x, y] of moves) {
    if ((onlyContested && contested[x][y] !== '?') || createsLib(x, y, board, validLibMoves, 'X')) continue;
    const surround = getSurroundLibs(x, y, board, validLibMoves, 'X');
    //if (surround < surnd) continue
    let right = 0;
    let left = 0;
    let up = 0;
    let down = 0;

    //We are only checking up, down, left and right
    //We are checking for linking chains of friendlies, filtering out those already checked
    let checkedChains = [];
    if (x < size - 1 && board[x + 1][y] === 'X' && validLibMoves[x + 1][y] === libRequired) {
      right = getChainValue(x + 1, y, board, contested, 'X');
      checkedChains.push(chains[x + 1][y]);
    }
    if (
      x > 0 &&
      board[x - 1][y] === 'X' &&
      !checkedChains.includes(chains[x - 1][y]) &&
      validLibMoves[x - 1][y] === libRequired
    ) {
      left = getChainValue(x - 1, y, board, contested, 'X');
      checkedChains.push(chains[x - 1][y]);
    }
    if (
      y < size - 1 &&
      board[x][y + 1] === 'X' &&
      !checkedChains.includes(chains[x][y + 1]) &&
      validLibMoves[x][y + 1] === libRequired
    ) {
      up = getChainValue(x, y + 1, board, contested, 'X');
      checkedChains.push(chains[x][y + 1]);
    }
    if (
      y > 0 &&
      board[x][y - 1] === 'X' &&
      !checkedChains.includes(chains[x][y - 1]) &&
      validLibMoves[x][y - 1] === libRequired
    )
      down = getChainValue(x, y - 1, board, contested, 'X');

    let count = 0;
    let total = 0;
    if (right >= savedNodesMin) {
      count++;
      total += right;
    }
    if (left >= savedNodesMin) {
      count++;
      total += left;
    }
    if (up >= savedNodesMin) {
      count++;
      total += up;
    }
    if (down >= savedNodesMin) {
      count++;
      total += down;
    }
    if (count <= 0) continue;
    const surroundMulti = getSurroundLibSpread(x, y, board, validLibMoves, 'X');
    const rank = total * count * surroundMulti; // * surroundChains
    if (rank > highValue) {
      moveOptions.length = 0;
      moveOptions.push([x, y]);
      highValue = rank;
    } else if (rank === highValue) moveOptions.push([x, y]);
  }
  // Choose one of the found moves at random
  const randomIndex = Math.floor(Math.random() * moveOptions.length);
  return moveOptions[randomIndex]
    ? {
        coords: moveOptions[randomIndex],
        msg: 'Bolster - Libs: ' + libRequired + '  Nodes: ' + savedNodesMin + '  OnlyContested: ' + onlyContested,
      }
    : [];
}

/** @param {NS} ns */
function getChainValue(checkx, checky, board, contested, player) {
  const size = board[0].length;
  const otherPlayer = player === 'X' ? 'O' : 'X';
  const explored = new Set();
  if (contested[checkx][checky] === '?' || board[checkx][checky] === otherPlayer) return 0;
  if (checkx < size - 1) explored.add(JSON.stringify([checkx + 1, checky]));
  if (checkx > 0) explored.add(JSON.stringify([checkx - 1, checky]));
  if (checky > 0) explored.add(JSON.stringify([checkx, checky - 1]));
  if (checky < size - 1) explored.add(JSON.stringify([checkx, checky + 1]));
  let count = 1;
  for (const explore of explored) {
    const [x, y] = JSON.parse(explore);
    if (contested[x][y] === '?' || contested[x][y] === '#' || board[x][y] === otherPlayer) continue;
    count++;
    if (x < size - 1) explored.add(JSON.stringify([x + 1, y]));
    if (x > 0) explored.add(JSON.stringify([x - 1, y]));
    if (y > 0) explored.add(JSON.stringify([x, y - 1]));
    if (y < size - 1) explored.add(JSON.stringify([x, y + 1]));
  }
  return count;
}

/** @param {NS} ns */
function getEyeValue(checkx, checky, board, contested, player) {
  const size = board[0].length;
  const otherPlayer = player === 'X' ? 'O' : 'X';
  const explored = new Set();
  if (checkx < size - 1) explored.add(JSON.stringify([checkx + 1, checky]));
  if (checkx > 0) explored.add(JSON.stringify([checkx - 1, checky]));
  if (checky > 0) explored.add(JSON.stringify([checkx, checky - 1]));
  if (checky < size - 1) explored.add(JSON.stringify([checkx, checky + 1]));
  let count = 0;
  for (const explore of explored) {
    const [x, y] = JSON.parse(explore);
    if (contested[x][y] === '?' || contested[x][y] === '#' || board[x][y] === otherPlayer) continue;
    if (contested[x][y] === player) count++;
    if (x < size - 1) explored.add(JSON.stringify([x + 1, y]));
    if (x > 0) explored.add(JSON.stringify([x - 1, y]));
    if (y > 0) explored.add(JSON.stringify([x, y - 1]));
    if (y < size - 1) explored.add(JSON.stringify([x, y + 1]));
  }
  return count;
}

/** @param {NS} ns */
function getFreeSpace(checkx, checky, board, contested) {
  const size = board[0].length;
  if (contested[checkx][checky] !== '?') return 0;
  const explored = new Set();
  if (checkx < size - 1) explored.add(JSON.stringify([checkx + 1, checky]));
  if (checkx > 0) explored.add(JSON.stringify([checkx - 1, checky]));
  if (checky > 0) explored.add(JSON.stringify([checkx, checky - 1]));
  if (checky < size - 1) explored.add(JSON.stringify([checkx, checky + 1]));
  let count = 1;
  for (const explore of explored) {
    const [x, y] = JSON.parse(explore);
    if (['#', 'X', 'O'].includes(contested[x][y])) continue;
    if (contested[x][y] === '?') count++;
    if (x < size - 1) explored.add(JSON.stringify([x + 1, y]));
    if (x > 0) explored.add(JSON.stringify([x - 1, y]));
    if (y > 0) explored.add(JSON.stringify([x, y - 1]));
    if (y < size - 1) explored.add(JSON.stringify([x, y + 1]));
  }
  return count;
}
/** @param {NS} ns */
function getEyeValueFull(checkx, checky, board, contested, player) {
  const size = board[0].length;
  const otherPlayer = player === 'X' ? 'O' : 'X';
  const explored = new Set();
  if (checkx < size - 1) explored.add(JSON.stringify([checkx + 1, checky]));
  if (checkx > 0) explored.add(JSON.stringify([checkx - 1, checky]));
  if (checky > 0) explored.add(JSON.stringify([checkx, checky - 1]));
  if (checky < size - 1) explored.add(JSON.stringify([checkx, checky + 1]));
  if (checkx < size - 1 && checky < size - 1) explored.add(JSON.stringify([checkx + 1, checky + 1]));
  if (checkx > 0 && checky < size - 1) explored.add(JSON.stringify([checkx - 1, checky + 1]));
  if (checkx < size - 1 && checky > 0) explored.add(JSON.stringify([checkx + 1, checky - 1]));
  if (checkx > 0 && checky > 0) explored.add(JSON.stringify([checkx - 1, checky - 1]));
  let count = 0;
  for (const explore of explored) {
    const [x, y] = JSON.parse(explore);
    if (contested[x][y] === '?' || contested[x][y] === '#' || board[x][y] === otherPlayer) continue;
    if (contested[x][y] === player) count++;
    if (x < size - 1) explored.add(JSON.stringify([x + 1, y]));
    if (x > 0) explored.add(JSON.stringify([x - 1, y]));
    if (y > 0) explored.add(JSON.stringify([x, y - 1]));
    if (y < size - 1) explored.add(JSON.stringify([x, y + 1]));
  }
  return count;
}
/** @param {NS} ns */
function getChainAttack(x, y, board, contested) {
  const size = board[0].length;
  let count = 0;
  if (x > 0 && board[x - 1][y] === 'O') count += getChainValue(x - 1, y, board, contested, 'O');
  if (x < size - 1 && board[x + 1][y] === 'O') count += getChainValue(x + 1, y, board, contested, 'O');
  if (y > 0 && board[x][y - 1] === 'O') count += getChainValue(x, y - 1, board, contested, 'O');
  if (y < size - 1 && board[x][y + 1] === 'O') count += getChainValue(x, y + 1, board, contested, 'O');

  return count;
}
/** @param {NS} ns */
function getChainAttackFull(x, y, board, contested) {
  const size = board[0].length;
  let count = 0;
  if (x < size - 1) count += getChainValue(x + 1, y, board, contested, 'O');
  if (x > 0) count += getChainValue(x - 1, y, board, contested, 'O');
  if (y > 0) count += getChainValue(x, y - 1, board, contested, 'O');
  if (y < size - 1) count += getChainValue(x, y + 1, board, contested, 'O');
  if (x < size - 1 && y < size - 1) count += getChainValue(x + 1, y + 1, board, contested, 'O');
  if (x > 0 && y < size - 1) count += getChainValue(x - 1, y + 1, board, contested, 'O');
  if (x < size - 1 && y > 0) count += getChainValue(x + 1, y - 1, board, contested, 'O');
  if (x > 0 && y > 0) count += getChainValue(x - 1, y - 1, board, contested, 'O');
  return count;
}
/** @param {NS} ns */
function getSurroundSpace(x, y, board) {
  const size = board[0].length;
  let surround = 0;
  if (x > 0 && board[x - 1][y] === '.') surround++;
  if (x < size - 1 && board[x + 1][y] === '.') surround++;
  if (y > 0 && board[x][y - 1] === '.') surround++;
  if (y < size - 1 && board[x][y + 1] === '.') surround++;
  return surround;
}

/** @param {NS} ns */
function getSurroundSpaceFull(startx, starty, board, player = 'X', depth = 1) {
  const size = board[0].length;
  let surround = 0;
  for (let x = startx - depth; x <= startx + depth; x++)
    for (let y = starty - depth; y <= starty + depth; y++)
      if (x >= 0 && x <= size - 1 && y >= 0 && y <= size - 1 && ['.', player].includes(board[x][y])) surround++;
  return surround;
}

/** @param {NS} ns */
function getHeatMap(startx, starty, board, player = 'X', depth = 2) {
  const size = board[0].length;
  let count = 1;
  for (let x = startx - depth; x <= startx + depth; x++)
    for (let y = starty - depth; y <= starty + depth; y++)
      if (x >= 0 && x <= size - 1 && y >= 0 && y <= size - 1 && ['.', player].includes(board[x][y]))
        count += board[x][y] === player ? 1.5 : board[x][y] === '.' ? 1 : 0;
  return count;
}

/** @param {NS} ns */
function getSurroundLibs(x, y, board, validLibMoves, player) {
  const size = board[0].length;
  let surround = 0;
  if (x > 0 && (board[x - 1][y] === '.' || board[x - 1][y] === player))
    surround += board[x - 1][y] === '.' ? 1 : validLibMoves[x - 1][y] - 1;
  if (x < size - 1 && (board[x + 1][y] === '.' || board[x + 1][y] === player))
    surround += board[x + 1][y] === '.' ? 1 : validLibMoves[x + 1][y] - 1;
  if (y > 0 && (board[x][y - 1] === '.' || board[x][y - 1] === player))
    surround += board[x][y - 1] === '.' ? 1 : validLibMoves[x][y - 1] - 1;
  if (y < size - 1 && (board[x][y + 1] === '.' || board[x][y + 1] === player))
    surround += board[x][y + 1] === '.' ? 1 : validLibMoves[x][y + 1] - 1;
  return surround;
}

/** @param {NS} ns */
function getSurroundLibSpread(x, y, board, validLibMoves, player) {
  const size = board[0].length;
  let surround = 0;
  const checks = new Set();
  if (board[x][y] === '.') checks.add(JSON.stringify([x, y]));
  else return 0;
  if (x > 0 && board[x - 1][y] === '.') checks.add(JSON.stringify([x - 1, y]));
  if (x < size - 1 && board[x + 1][y] === '.') checks.add(JSON.stringify([x + 1, y]));
  if (y > 0 && board[x][y - 1] === '.') checks.add(JSON.stringify([x, y - 1]));
  if (y < size - 1 && board[x][y + 1] === '.') checks.add(JSON.stringify([x, y + 1]));
  //Now, check the liberty values of all the checks
  for (const check of checks) {
    const [x, y] = JSON.parse(check);
    surround += getSurroundLibs(x, y, board, validLibMoves, player);
  }
  return surround;
}

/** @param {NS} ns */
function getSurroundEnemiesFull(x, y, board, contested) {
  const size = board[0].length;
  let surround = 0;
  if (x > 0 && board[x - 1][y] === 'O') surround += getChainValue(x - 1, y, board, contested, 'O');
  if (x < size - 1 && board[x + 1][y] === 'O') surround += getChainValue(x + 1, y, board, contested, 'O');
  if (y > 0 && board[x][y - 1] === 'O') surround += getChainValue(x, y - 1, board, contested, 'O');
  if (y < size - 1 && board[x][y + 1] === 'O') surround += getChainValue(x, y + 1, board, contested, 'O');

  if (x > 0 && y > 0 && board[x - 1][y - 1] === 'O') surround += getChainValue(x - 1, y - 1, board, contested, 'O');
  if (x < size - 1 && y > 0 && board[x + 1][y - 1] === 'O')
    surround += getChainValue(x + 1, y - 1, board, contested, 'O');
  if (y < size - 1 && x > 0 && board[x - 1][y + 1] === 'O')
    surround += getChainValue(x - 1, y - 1, board, contested, 'O');
  if (y < size - 1 && x < size - 1 && board[x + 1][y + 1] === 'O')
    surround += getChainValue(x + 1, y + 1, board, contested, 'O');

  return surround;
}

/** @param {NS} ns */
function getRandomStrat(ns, board, validMoves, validLibMoves, contested) {
  const moveOptions = [];
  const moveOptions2 = [];
  const size = board[0].length;

  // Look through all the points on the board
  let bestRank = 0;
  const moves = getAllValidMoves(board, validMoves, contested, true);
  for (const [x, y] of moves) {
    if (!['?', 'O'].includes(contested[x][y]) || createsLib(x, y, board, validLibMoves, 'X')) continue;
    let isSupport =
      (x > 0 && board[x - 1][y] === 'X' && validLibMoves[x - 1][y] >= 1) ||
      (x < size - 1 && board[x + 1][y] === 'X' && validLibMoves[x + 1][y] >= 1) ||
      (y > 0 && board[x][y - 1] === 'X' && validLibMoves[x][y - 1] >= 1) ||
      (y < size - 1 && board[x][y + 1] === 'X' && validLibMoves[x][y + 1] >= 1)
        ? true
        : false;
    let isAttack =
      (x > 0 && board[x - 1][y] === 'O' && validLibMoves[x - 1][y] >= 2) ||
      (x < size - 1 && board[x + 1][y] === 'O' && validLibMoves[x + 1][y] >= 2) ||
      (y > 0 && board[x][y - 1] === 'O' && validLibMoves[x][y - 1] >= 2) ||
      (y < size - 1 && board[x][y + 1] === 'O' && validLibMoves[x][y + 1] >= 2)
        ? true
        : false;

    const surround = getSurroundSpace(x, y, board);
    if (isSupport || isAttack) {
      if (surround > bestRank) {
        moveOptions.length = 0;
        bestRank = surround;
        moveOptions.push([x, y]);
      } else if (surround === bestRank) {
        moveOptions.push([x, y]);
      }
    } else if (validMoves[x][y]) {
      moveOptions2.push([x, y]);
    }
  }
  // Choose one of the found moves at random
  const randomIndex = Math.floor(Math.random() * moveOptions.length);
  const randomIndex2 = Math.floor(Math.random() * moveOptions2.length);
  return moveOptions[randomIndex]
    ? {
        coords: moveOptions[randomIndex],
        msg: 'Random Safe',
      }
    : moveOptions2[randomIndex2]
    ? {
        coords: moveOptions2[randomIndex2],
        msg: 'Random Unsafe',
      }
    : [];
}

/** @param {NS} ns */
function getAggroAttack(
  ns,
  board,
  validMoves,
  validLibMoves,
  contested,
  libsMin,
  libsMax,
  minSurround = 3,
  minChain = 1,
  minFreeSpace = 0,
  safe = false,
) {
  const moveOptions = [];
  const size = board[0].length;
  let highestValue = 0;
  // Look through all the points on the board
  const moves = getAllValidMoves(board, validMoves, contested, true);
  for (const [x, y] of moves) {
    if (createsLib(x, y, board, validLibMoves, 'X')) continue;
    const isAttack =
      (x > 0 && board[x - 1][y] === 'O' && validLibMoves[x - 1][y] >= libsMin && validLibMoves[x - 1][y] <= libsMax) ||
      (x < size - 1 &&
        board[x + 1][y] === 'O' &&
        validLibMoves[x + 1][y] >= libsMin &&
        validLibMoves[x + 1][y] <= libsMax) ||
      (y > 0 && board[x][y - 1] === 'O' && validLibMoves[x][y - 1] >= libsMin && validLibMoves[x][y - 1] <= libsMax) ||
      (y < size - 1 && board[x][y + 1] === 'O' && validLibMoves[x][y + 1] >= libsMin && validLibMoves <= libsMax)
        ? true
        : false;
    const surround = getSurroundLibs(x, y, board, validLibMoves, 'X');
    const freeSpace = getFreeSpace(x, y, board, contested);
    if (freeSpace < minFreeSpace) continue;
    if (!isAttack || surround < minSurround) continue;
    const chainAtk = getChainAttack(x, y, board, contested);
    if (chainAtk < minChain) continue;
    let lowestLibs = 999;
    if (x > 0 && board[x - 1][y] === 'O' && validLibMoves[x - 1][y] < lowestLibs) lowestLibs = validLibMoves[x - 1][y];
    if (x < size - 1 && board[x + 1][y] === 'O' && validLibMoves[x + 1][y] < lowestLibs)
      lowestLibs = validLibMoves[x + 1][y];
    if (y > 0 && board[x][y - 1] === 'O' && validLibMoves[x][y - 1] < lowestLibs) lowestLibs = validLibMoves[x][y - 1];
    if (y < size - 1 && board[x][y + 1] === 'O' && validLibMoves[x][y + 1] < lowestLibs)
      lowestLibs = validLibMoves[x][y + 1];

    const enemyLibs = getSurroundLibSpread(x, y, board, validLibMoves, 'O');
    const startEyeValue = getEyeValue(x, y, board, contested, 'O');
    const eyeValue = startEyeValue > 1 ? startEyeValue : 1;
    const atk = (((enemyLibs * chainAtk) / eyeValue) * getHeatMap(x, y, board, 'O')) / lowestLibs;
    if (atk > highestValue) {
      highestValue = atk;
      moveOptions.length = 0;
      moveOptions.push([x, y]);
    } else if (atk === highestValue) {
      highestValue = atk;
      moveOptions.push([x, y]);
    }
  }
  // Choose one of the found moves at random
  const randomIndex = Math.floor(Math.random() * moveOptions.length);
  return moveOptions[randomIndex]
    ? {
        coords: moveOptions[randomIndex],
        msg: 'Aggro Attack: ' + libsMin + '/' + libsMax + '  Surround: ' + minSurround,
      }
    : [];
}

/** @param {NS} ns */
function getDefAttack(
  ns,
  board,
  validMoves,
  validLibMoves,
  contested,
  libsMin,
  libsMax,
  minSurround = 3,
  minChain = 1,
  minFreeSpace = 0,
  safe = false,
) {
  const moveOptions = [];
  const size = board[0].length;
  let highestValue = 0;
  // Look through all the points on the board
  const moves = getAllValidMoves(board, validMoves, contested, true);
  for (const [x, y] of moves) {
    if (createsLib(x, y, board, validLibMoves, 'X')) continue;
    const isAttack =
      (x > 0 && board[x - 1][y] === 'O' && validLibMoves[x - 1][y] >= libsMin && validLibMoves[x - 1][y] <= libsMax) ||
      (x < size - 1 &&
        board[x + 1][y] === 'O' &&
        validLibMoves[x + 1][y] >= libsMin &&
        validLibMoves[x + 1][y] <= libsMax) ||
      (y > 0 && board[x][y - 1] === 'O' && validLibMoves[x][y - 1] >= libsMin && validLibMoves[x][y - 1] <= libsMax) ||
      (y < size - 1 && board[x][y + 1] === 'O' && validLibMoves[x][y + 1] >= libsMin && validLibMoves <= libsMax)
        ? true
        : false;
    const surround = getSurroundLibs(x, y, board, validLibMoves, 'X');
    const freeSpace = getFreeSpace(x, y, board, contested);
    if (freeSpace < minFreeSpace) continue;
    if (!isAttack || surround < minSurround) continue;
    const chainAtk = getChainAttack(x, y, board, contested);
    if (chainAtk < minChain) continue;
    let lowestLibs = 999;
    if (x > 0 && board[x - 1][y] === 'O' && validLibMoves[x - 1][y] < lowestLibs) lowestLibs = validLibMoves[x - 1][y];
    if (x < size - 1 && board[x + 1][y] === 'O' && validLibMoves[x + 1][y] < lowestLibs)
      lowestLibs = validLibMoves[x + 1][y];
    if (y > 0 && board[x][y - 1] === 'O' && validLibMoves[x][y - 1] < lowestLibs) lowestLibs = validLibMoves[x][y - 1];
    if (y < size - 1 && board[x][y + 1] === 'O' && validLibMoves[x][y + 1] < lowestLibs)
      lowestLibs = validLibMoves[x][y + 1];

    const friendlyLibs = getSurroundLibs(x, y, board, validLibMoves, 'X');
    const startEyeValue = getEyeValue(x, y, board, contested, 'O');
    const eyeValue = startEyeValue > 1 ? startEyeValue : 1;

    const atk =
      ((((friendlyLibs * chainAtk) / eyeValue) * getHeatMap(x, y, board, 'X')) / lowestLibs) *
      (getEyeValue(x, y, board, contested, 'X') + 1);

    if (atk > highestValue) {
      highestValue = atk;
      moveOptions.length = 0;
      moveOptions.push([x, y]);
    } else if (atk === highestValue) {
      highestValue = atk;
      moveOptions.push([x, y]);
    }
  }
  // Choose one of the found moves at random
  const randomIndex = Math.floor(Math.random() * moveOptions.length);
  return moveOptions[randomIndex]
    ? {
        coords: moveOptions[randomIndex],
        msg: 'Defensive Attack: ' + libsMin + '/' + libsMax + '  Surround: ' + minSurround,
      }
    : [];
}

/** @param {NS} ns */
function attackGrowDragon(ns, board, validMoves, validLibMoves, contested, requiredEyes, killLib = false) {
  const moveOptions = [];
  let highestValue = 0;
  // Look through all the points on the board
  const moves = getAllValidMoves(board, validMoves, contested, true);
  for (const [x, y] of moves) {
    if (contested[x][y] !== '?' || createsLib(x, y, board, validLibMoves, 'X')) continue;
    const surround = getSurroundEnemiesFull(x, y, board, contested);
    const myLibs = getSurroundLibs(x, y, board, validLibMoves, 'X');
    if (surround < 1 || myLibs < 3) continue;
    const enemyLibs = getSurroundLibs(x, y, board, validLibMoves, 'O');
    if (enemyLibs === 1 && !killLib) continue;
    const enemyChains = getChainAttackFull(x, y, board, contested);
    const myEyes = getEyeValueFull(x, y, board, contested, 'X');
    if (myEyes < requiredEyes) continue; // || count === 3) continue
    const result = enemyLibs * enemyChains; // surround * enemyLibs * myChains *  /*freeSpace * */ enemyEyes * enemyChains

    if (result > highestValue) {
      highestValue = result;
      moveOptions.length = 0;
      moveOptions.push([x, y]);
    } else if (result === highestValue) {
      highestValue = result;
      moveOptions.push([x, y]);
    }
  }
  // Choose one of the found moves at random
  const randomIndex = Math.floor(Math.random() * moveOptions.length);
  return moveOptions[randomIndex]
    ? {
        coords: moveOptions[randomIndex],
        msg: 'Attack/Grow Dragon: ' + requiredEyes,
      }
    : [];
}

/** @param {NS} ns */
function getDefPattern(ns, board, testBoard, validMove, contested) {
  let def = [];
  def.push(...def5);

  const moves = getAllValidMoves(board, validMove, contested);
  for (const [x, y] of moves) {
    for (const pattern of def)
      if (isPattern(ns, x, y, pattern, testBoard, validMove, contested)) {
        const msg = sprintf('Def Pattern: %s\n%s\n%s', pattern.length, pattern.join('\n'), '---------------');
        return {
          coords: [x, y],
          msg: msg,
        };
      }
  }
  return [];
}

/** @param {NS} ns */
function disruptEyes(ns, board, testBoard, validMove, contested) {
  let disrupt = [];
  disrupt.push(...disrupt4);
  disrupt.push(...disrupt5);

  const moves = getAllValidMoves(board, validMove, contested);
  for (const [x, y] of moves) {
    for (const pattern of disrupt)
      if (isPattern(ns, x, y, pattern, testBoard, validMove, contested, 'Eye Disruption: ' + pattern.length)) {
        const msg = sprintf('Eye Disruption: %s\n%s\n%s', pattern.length, pattern.join('\n'), '---------------');
        return {
          coords: [x, y],
          msg: msg,
        };
      }
  }
  return [];
}

/** @param {NS} ns */
async function movePiece(ns, attack, board, validLibMoves, contested) {
  if (attack.coords === undefined) return false;
  const [x, y] = attack.coords;
  if (x === undefined) return false;

  if (CHEATS) {
    try {
      const chance = ns.go.cheat.getCheatSuccessChance();
      if (chance >= 0) {
        //valid cheat moves.
        const snake = getSnakeEyes(ns, board, validLibMoves, contested, 5);
        const [s1x, s1y, s2x, s2y] = snake.coords;
        if (s1x !== undefined) {
          ns.printf('%s', snake.msg);
          let mid = performance.now();
          const results = await ns.go.cheat.playTwoMoves(s1x, s1y, s2x, s2y);
          ns.printf('%s', results.type);
          let END = performance.now();
          if (LOGTIME) ns.printf('Time: Me: %s  Them: %s', ns.tFormat(mid - START, true), ns.tFormat(END - mid, true));
          START = performance.now();
          if (results.type === 'gameOver') debugger;
          return results;
        } else {
          let mid = performance.now();
          ns.printf('%s', attack.msg);
          const results = await ns.go.makeMove(x, y);
          let END = performance.now();
          if (LOGTIME) ns.printf('Time: Me: %s  Them: %s', ns.tFormat(mid - START, true), ns.tFormat(END - mid, true));
          START = performance.now();
          return results;
        }
      } else {
        let mid = performance.now();
        ns.printf('%s', attack.msg);
        const results = await ns.go.makeMove(x, y);
        let END = performance.now();
        if (LOGTIME) ns.printf('Time: Me: %s  Them: %s', ns.tFormat(mid - START, true), ns.tFormat(END - mid, true));
        START = performance.now();
        return results;
      }
    } catch {
      let mid = performance.now();
      ns.printf('%s', attack.msg);
      const results = await ns.go.makeMove(x, y);
      let END = performance.now();
      if (LOGTIME) ns.printf('Time: Me: %s  Them: %s', ns.tFormat(mid - START, true), ns.tFormat(END - mid, true));
      START = performance.now();
      return results;
    }
  } else {
    let mid = performance.now();
    ns.printf('%s', attack.msg);
    const results = await ns.go.makeMove(x, y);
    let END = performance.now();
    if (LOGTIME) ns.printf('Time: Me: %s  Them: %s', ns.tFormat(mid - START, true), ns.tFormat(END - mid, true));
    START = performance.now();
    return results;
  }
}

function getAllValidMoves(board, validMove, contested, notMine = false) {
  if (currentValidMovesTurn === turn) return notMine ? currentValidContestedMoves : currentValidMoves;
  let moves = [];
  let contestedMoves = [];
  for (let x = 0; x < board[0].length; x++)
    for (let y = 0; y < board[0].length; y++) {
      if (validMove[x][y]) {
        if (['O', '?'].includes(contested[x][y])) contestedMoves.push([x, y]);
        moves.push([x, y]);
      }
    }

  //Moves contains a randomized array of x,y
  moves = moves.sort(() => Math.random() - Math.random());
  contestedMoves = contestedMoves.sort(() => Math.random() - Math.random());
  currentValidMoves = moves;
  currentValidContestedMoves = contestedMoves;
  currentValidMovesTurn = turn;
  return notMine ? currentValidContestedMoves : currentValidMoves;
}

function createsLib(x, y, board, validLibMoves, player) {
  const size = board[0].length;
  let count = 0;

  if (x > 0 && board[x - 1][y] === player && validLibMoves[x - 1][y] > 2) return false;
  if (x < size - 1 && board[x + 1][y] === player && validLibMoves[x + 1][y] > 2) return false;
  if (y > 0 && board[x][y - 1] === player && validLibMoves[x][y - 1] > 2) return false;
  if (y < size - 1 && board[x][y + 1] === player && validLibMoves[x][y + 1] > 2) return false;

  if (x > 0 && board[x - 1][y] === player && validLibMoves[x - 1][y] === 2) return true;
  if (x < size - 1 && board[x + 1][y] === player && validLibMoves[x + 1][y] === 2) return true;
  if (y > 0 && board[x][y - 1] === player && validLibMoves[x][y - 1] === 2) return true;
  if (y < size - 1 && board[x][y + 1] === player && validLibMoves[x][y + 1] === 2) return true;

  return false;
}

function getOpeningMove(ns, board, validMove, validLibMoves, contested) {
  const size = board[0].length;
  ns.print('Opening Move: ' + turn);
  switch (size) {
    case 13:
      if (getSurroundSpace(2, 2, board) === 4 && validMove[2][2]) return [2, 2];
      else if (getSurroundSpace(2, 10, board) === 4 && validMove[2][10]) return [2, 10];
      else if (getSurroundSpace(10, 10, board) === 4 && validMove[10][10]) return [10, 10];
      else if (getSurroundSpace(10, 2, board) === 4 && validMove[10][2]) return [10, 2];
      else if (getSurroundSpace(3, 3, board) === 4 && validMove[3][3]) return [3, 3];
      else if (getSurroundSpace(3, 9, board) === 4 && validMove[3][9]) return [3, 9];
      else if (getSurroundSpace(9, 9, board) === 4 && validMove[9][9]) return [9, 9];
      else if (getSurroundSpace(9, 3, board) === 4 && validMove[9][3]) return [9, 3];
      else if (getSurroundSpace(4, 4, board) === 4 && validMove[4][4]) return [4, 4];
      else if (getSurroundSpace(4, 8, board) === 4 && validMove[4][8]) return [4, 8];
      else if (getSurroundSpace(8, 8, board) === 4 && validMove[8][8]) return [8, 8];
      else if (getSurroundSpace(8, 4, board) === 4 && validMove[8][4]) return [8, 4];
      else return getRandomStrat(ns, board, validMove, validLibMoves, contested);
    case 9:
      if (getSurroundSpace(2, 2, board) === 4 && validMove[2][2]) return [2, 2];
      else if (getSurroundSpace(2, 6, board) === 4 && validMove[2][6]) return [2, 6];
      else if (getSurroundSpace(6, 6, board) === 4 && validMove[6][6]) return [6, 6];
      else if (getSurroundSpace(6, 2, board) === 4 && validMove[6][2]) return [6, 2];
      else if (getSurroundSpace(3, 3, board) === 4 && validMove[3][3]) return [3, 3];
      else if (getSurroundSpace(3, 5, board) === 4 && validMove[3][5]) return [3, 5];
      else if (getSurroundSpace(5, 5, board) === 4 && validMove[5][5]) return [5, 5];
      else if (getSurroundSpace(5, 3, board) === 4 && validMove[5][3]) return [5, 3];
      else return getRandomStrat(ns, board, validMove, validLibMoves, contested);
    case 7:
      if (getSurroundSpace(2, 2, board) === 4 && validMove[2][2]) return [2, 2];
      else if (getSurroundSpace(2, 4, board) === 4 && validMove[2][4]) return [2, 4];
      else if (getSurroundSpace(4, 4, board) === 4 && validMove[4][4]) return [4, 4];
      else if (getSurroundSpace(4, 2, board) === 4 && validMove[4][2]) return [4, 2];
      else if (getSurroundSpace(3, 3, board) === 4 && validMove[3][3]) return [3, 3];
      else if (getSurroundSpace(1, 1, board) === 4 && validMove[1][1]) return [1, 1];
      else if (getSurroundSpace(5, 1, board) === 4 && validMove[5][1]) return [5, 1];
      else if (getSurroundSpace(5, 5, board) === 4 && validMove[5][5]) return [5, 5];
      else if (getSurroundSpace(1, 5, board) === 4 && validMove[1][5]) return [1, 5];
      else return getRandomStrat(ns, board, validMove, validLibMoves, contested);
    case 5:
      if (getSurroundSpace(2, 2, board) === 4 && validMove[2][2]) return [2, 2];
      else if (getSurroundSpace(3, 3, board) === 4 && validMove[3][3]) return [3, 3];
      else if (getSurroundSpace(3, 1, board) === 4 && validMove[3][1]) return [3, 1];
      else if (getSurroundSpace(1, 3, board) === 4 && validMove[1][3]) return [1, 3];
      else if (getSurroundSpace(1, 1, board) === 4 && validMove[1][1]) return [1, 1];
      else return getRandomStrat(ns, board, validMove, validLibMoves, contested);
    case 19:
      if (getSurroundSpace(9, 9, board) === 4 && validMove[9][9]) return [9, 9];
      else if (getSurroundSpace(2, 2, board) === 4 && validMove[2][2]) return [2, 2];
      else if (getSurroundSpace(16, 2, board) === 4 && validMove[16][2]) return [16, 2];
      else if (getSurroundSpace(2, 16, board) === 4 && validMove[2][16]) return [2, 16];
      else if (getSurroundSpace(16, 16, board) === 4 && validMove[16][16]) return [16, 16];
      else if (getSurroundSpace(3, 3, board) === 4 && validMove[3][3]) return [3, 3];
      else if (getSurroundSpace(3, 15, board) === 4 && validMove[3][15]) return [3, 15];
      else if (getSurroundSpace(15, 15, board) === 4 && validMove[15][15]) return [15, 15];
      else if (getSurroundSpace(15, 3, board) === 4 && validMove[15][3]) return [15, 3];
      else if (getSurroundSpace(4, 4, board) === 4 && validMove[4][4]) return [4, 4];
      else if (getSurroundSpace(4, 14, board) === 4 && validMove[4][14]) return [4, 14];
      else if (getSurroundSpace(14, 14, board) === 4 && validMove[14][14]) return [14, 14];
      else if (getSurroundSpace(14, 4, board) === 4 && validMove[14][4]) return [14, 4];
      else return getRandomStrat(ns, board, validMove, validLibMoves, contested);
  }
}

//X,O = Me, You  x, o = Anything but the other person or a blocking, "W" space is off the board, ? is anything goes
//B is blocking(Wall or you, not empty or enemy), b is blocking but could be enemy, A is All but . (Wall, Me, You, Blank)
//* is move here next if you can - no safeties

const disrupt4 = [
  ['??b?', '?b.b', 'b.*b', '?bb?'], //Pattern# Sphyxis - buy a turn #GREAT
  ['?bb?', 'b..b', 'b*Xb', '?bb?'], //Pattern# Sphyxis - buy a turn #GREAT
  ['?bb?', 'b..b', 'b.*b', '?bb?'], //Pattern# Sphyxis - buy a turn #GREAT
  ['??b?', '?b.b', '?b*b', '??O?'], //Pattern# Sphyxis - Sacrifice to kill an eye
  ['?bbb', 'bb.b', 'W.*b', '?oO?'], //Pattern# Sphyxis - 2x2 nook breatk
  ['?bbb', 'bb.b', 'W.*b', '?Oo?'], //Pattern# Sphyxis - 2x2 nook break
  ['.bbb', 'o*.b', '.bbb', '????'], //Pattern# Sphyxis - Dangling 2 break
];
const disrupt5 = [
  ['?bbb?', 'b.*.b', '?bbb?', '?????', '?????'], //Pattern# Sphyxis - Convert to 1 eye
  ['??OO?', '?b*.b', '?b..b', '??bb?', '?????'], //Pattern# Sphyxis - Buy time
  ['?????', '??bb?', '?b*Xb', '?boob', '??bb?'], //Pattern# Sphyxis - Buy time
  ['WWW??', 'WWob?', 'Wo*b?', 'WWW??', '?????'], //Pattern# Sphyxis - 2x2 attack corner if possible
  ['??b??', '?b.b?', '?b*b?', '?b.A?', '??b??'], //Pattern# Sphyxis - Break two eyes into 1, buy a turn
  ['??b??', '?b.b?', '??*.b', '?b?b?', '?????'], //Pattern# Sphyxis - Break eyes, buy time
  ['?WWW?', 'WoOoW', 'WOO*W', 'W???W', '?????'], //Block 3x3 corner
  ['?WWW?', 'Wo*oW', 'WOOOW', 'W???W', '?????'], //Block 3x3 corner
];

const def5 = [
  ['?WW??', 'WW.X?', 'W.XX?', 'WWW??', '?????'], //Pattern# Sphyxis - Eyes in a nook
  ['WWW??', 'WW.X?', 'W.*X?', 'WWW??', '?????'], //Pattern# Sphyxis - 2x2 corner contain #GREAT
  ['BBB??', 'BB.X?', 'B..X?', 'BBB??', '?????'], //Pattern# Sphyxis - 2x2 corner contain #GREAT
  ['?WWW?', 'W.*.W', 'WXXXW', '?????', '?????'], //Take the 3x3 back corner
];

// Testing
//const opponent = ["Slum Snakes", "Tetrads", "Daedalus", "Illuminati"]
//const opponent2 = ["Slum Snakes", "Tetrads", "Daedalus", "Illuminati", "????????????"]
// Original
const opponent = ['Netburners', 'Slum Snakes', 'The Black Hand', 'Tetrads', 'Daedalus', 'Illuminati'];
const opponent2 = ['Netburners', 'Slum Snakes', 'The Black Hand', 'Tetrads', 'Daedalus', 'Illuminati', '????????????'];
//# sourceURL=home/goCheat.js

/** @param {NS} ns */
export async function main(ns) {
  ns.tprintRaw(<BoardComponent ns={ns}></BoardComponent>);

  // wait forever so that the ns instance is still alive - otherwise the script ends which breaks the ns.toast calls later
  await new Promise(() => {});
}

/**
 * The React component to display a gameboard square
 * @param {NS} ns
 */
export function BoardComponent({ ns }) {
  const [displayBoard, setDisplayBoard] = React.useState([
    ['X', 'X', 'X', 'X', 'X'],
    ['X', 'X', 'X', 'X', 'X'],
    ['X', 'X', 'X', 'X', 'X'],
    ['X', 'X', 'X', 'X', 'X'],
    ['X', 'X', 'X', 'X', 'X'],
  ]);

  // This is called when a point is clicked.
  function pointClicked(x, y) {
    ns.toast(`Point clicked: ${x},${y}`);
    displayBoard[y][x] = '!';
    setDisplayBoard(displayBoard.slice());
  }

  // display a row of squares plus a newline br
  function Row({ row, y }) {
    return (
      <>
        {row.map((square, x) => (
          <Square x={x} y={y} />
        ))}
        <br />
      </>
    );
  }

  // Display a single square
  function Square({ x, y }) {
    return <span onClick={() => pointClicked(x, y)}>[{displayBoard[y][x]}]</span>;
  }

  return (
    <>
      {displayBoard.map((row, y) => (
        <Row row={row} y={y} />
      ))}
    </>
  );
}

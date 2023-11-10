/** @param {NS} ns */
export async function main(ns) {
  let count = 0,
    miss = 0,
    move = null;

  do {
    count++;
    const max = Math.min(Math.sqrt(count * 0.7), 9);
    const x = Math.floor(Math.random() * max);
    const y = Math.floor(Math.random() * max);

    if (x % 2 || y % 2) {
      try {
        move = await ns.go.makeMove(x, y);
        miss = 0;
        await ns.sleep(500);
      } catch (e) {
        miss++;
      }
    }
    miss > 10 && (move = await ns.go.passTurn());

    await ns.sleep(100);
  } while (move?.type !== 'gameOver' && move?.type !== 'pass');

  await ns.go.passTurn();
}

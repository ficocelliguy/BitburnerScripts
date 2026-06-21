/*
  A true hacker is one who works to learn the secrets of every tool and tech they use.
  It's not about cracking security or pwning servers - it's a craftsman's mindset, the application of ingenuity.

  Whether you are doing and-dirty patchwork or elegant architecture, know your tools, understand the problem, and
  apply your craft to solve it. Don't just use someone else's script as-is or ask a rogue AI to write it for you!
  Piece it together yourself from whatever you can find, and make it your own. Break it, fix it, and understand it.

 */

/** @param {NS} ns */
export async function main(ns) {
  ns.ui.openTail();
  ns.clearLog();
  ns.disableLog('sleep');

  printAndStickToTop(ns, 'test1');

  addToOverview('test2');

  for (let i = 0; i < 40; i++) {
    ns.print('Logging real stuff...', String.fromCharCode(i + 32));
    await ns.sleep(10);
  }
}

function printAndStickToTop(ns, text) {
  ns.printRaw(<span style={{ position: 'fixed', top: '35px', width: '100%', backgroundColor: 'blue' }}>{text}</span>);
}

function addToOverview(text) {
  const doc = globalThis['document'];
  const containerNode = doc.querySelector('#overview-extra-hook-0');
  ReactDOM.render(<div>{text}</div>, containerNode);
}

const names = [''];
const bark = (ns, bark) => {
  ns.printRaw(React.createElement('h2', { style: { color: '#ffffff' } }, bark));
};
const ascii = {
  l: [
    `    ___`,
    ` __/_,  \`.  .-"""-.`,
    ` \\_,  | \\-'  /   )\`-')`,
    `  "") \`"\`    \  ((\`"\``,
    ` ___Y  ,    .'7 /|`,
    `(_,___/...-\` (_/_/         `,
  ],

  r: [
    `                 ___`,
    `      .-"""-.  .\` ,_\\__`,
    ` ('-\`(   \\  '-/ |   ,_/   `,
    `   \`"\`))       \`"\` (""`,
    `      |\\ 4'.    ,  Y___`,
    `      \\_\\_) \`-...\\___,_)`,
  ],
};
/** @param {NS} ns */
export async function main(ns) {
  const remnam = names.filter(
    (name) =>
      !ns
        .ps()
        .map((prog) => ns.getRunningScript(prog.pid).title)
        .includes(name),
  );
  let name = remnam[Math.round(Math.random() * remnam.length)],
    pets = 0;
  if (ns.args[0]) name = ns.args[0];
  ns.setTitle(name);
  const rn = Math.random;
  const win = eval('window');
  ns.disableLog('ALL');
  let pos = { x: undefined, y: undefined };
  win.addEventListener('mousemove', (event) => {
    pos = { x: event.clientX - 100, y: event.clientY - 50 };
  });
  ns.tail();
  ns.moveTail(rn() * 1000, rn() * 1000);
  let dx = 1000;
  let dy = 500;
  while (true) {
    let asciidir = ascii.r;
    let delay = 100;
    if (pos.x > dx) {
      dx += rn() * 20;
      asciidir = ascii.r;
    }
    if (pos.x < dx) {
      dx -= rn() * 20;
      asciidir = ascii.l;
    }
    if (pos.y > dy) {
      dy += rn() * 20;
    }
    if (pos.y < dy) {
      dy -= rn() * 20;
    }
    let bool = 1;
    if (rn() - 0.5 > 0) bool = -1;
    dx += 5 * rn() * bool;
    dy += 5 * rn() * bool;
    if (rn() * 100 > 95) {
      ns.clearLog();
      let barkval = '"BARK"';
      if (pos.x < dx + 50 && pos.y < dy + 50 && pos.x > dx - 50 && pos.y > dy - 50) barkval = '*LICKS\nHAND*';
      bark(ns, barkval);
      delay += 400;
    }
    if (ns.peek(ns.pid) !== 'NULL PORT DATA') {
      bark(ns, '*WAGS\nTAIL*');
      pets++;
      ns.clearPort(ns.pid), (delay += 1400);
    }
    ns.resizeTail(250, 200);
    ns.moveTail(dx, dy);
    await ns.sleep(delay);
    ns.clearLog();
    asciidir.forEach((line) => ns.print(line));
    ns.atExit((pid = ns.pid) => ns.closeTail(pid));
  }
}

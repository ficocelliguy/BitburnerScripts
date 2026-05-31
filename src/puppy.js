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
const win = globalThis['window'];
const rn = Math.random;
const tget = (ns) => ns.getRunningScript().tailProperties;
const names = ['Wickes', 'Updog', 'Mikasa', 'Snuffles', 'Boris', 'Gnasher', 'Doug', 'Chester'];
const bark = (ns, bark) => {
  ns.printRaw(React.createElement('h2', { style: { color: '#ffffff' } }, bark));
};
let zcount = 0;
let ticker = 0;
let pets = 0;

function zoomieCalc(d, val) {
  if (d > 500) val = 1.2;
  if (d > 7000) val = 0.5; // Slow down
  if (d > 15000) val = 0.2;
  if (d > 15000) val = 0; // Go to sleep
  return val ?? 2; // Excited mode!
}
/** @param {NS} ns */
function step(ns, zoomievalue, target, bool = 1, randbool = true) {
  let screenratio = win.innerHeight / win.innerWidth,
    x = tget(ns).x,
    y = tget(ns).y;
  if (target.x > x) {
    x += rn() * zoomievalue * 2 * (10 * zoomievalue);
  } else if (target.x < x) {
    x -= rn() * zoomievalue * 2 * (10 * zoomievalue);
  }
  if (rn() - 0.5 > 0) bool = -1;
  if (zoomievalue && randbool) {
    x += 3 * rn() * bool;
    y += 3 * rn() * bool * screenratio;
  }
  return { dx: x, dy: win.innerHeight - 200 };
}

async function portHandle(ns, barkval) {
  if (ns.peek(ns.pid) === 'NULL PORT DATA') return;
  let portval = ns.readPort(ns.pid);
  ns.clearPort(ns.pid);
  barkval = { bark: '*WAGS\nTAIL*', time: 1500 };
  pets++;
  return barkval;
}

/** @param {NS} ns */
export async function main(ns, prevposx, prevposy) {
  pets = 0;
  const remnam = names.filter(
    (name) =>
      !ns
        .ps()
        .map((prog) => ns.getRunningScript(prog.pid).title)
        .includes(name),
  );
  ns.ui.setTailTitle(ns.args[0] ?? remnam[Math.round(Math.random() * remnam.length - 1)]);
  ns.getRunningScript('petter.js') ?? ns.run('petter.js');
  ns.disableLog('ALL');
  let pos = { x: undefined, y: undefined };
  win.addEventListener('mousemove', (event) => {
    pos = { x: event.clientX - 100, y: event.clientY - 50 };
  });
  ns.ui.openTail();
  while (true) {
    ns.clearLog();
    let x = tget(ns).x;
    let y = tget(ns).y - 50;
    let delay = 100;
    let zoomievalue = zoomieCalc(ticker);
    let asciidir = ascii.l;
    if (pos.x > x) asciidir = ascii.r;
    let dvar = step(ns, zoomievalue, pos);
    let barkval;
    barkval = await portHandle(ns, delay);
    if (rn() * 100 > 100 - 2 * zoomievalue && !!zoomievalue) {
      barkval = { bark: '"BARK"', time: 500 };
      if (pos.x < x + 100 && pos.y < y + 100 && pos.x > x - 100 && pos.y > y - 100)
        barkval = { bark: '*LICKS\nCURSOR*', time: 700 };
      delay += 600;
    }
    if (!zoomievalue) {
      delay += 1000;
      zcount > 3 ? (zcount = 1) : zcount++;
      ns.print('z'.repeat(zcount));
    } else {
      ns.print(`Pets: ${pets}`);
    }
    barkval === undefined ? asciidir.forEach((line) => ns.print(line)) : bark(ns, barkval.bark);
    ns.ui.resizeTail(250, 200);
    ns.ui.moveTail(dvar.dx, dvar.dy);
    barkval == undefined ? await ns.sleep(delay) : await ns.sleep(barkval.time);
    barkval == undefined ? (ticker += 100) : (ticker += barkval.time);
    if (pos.x !== prevposx && pos.y !== prevposy) ticker = 0;
    (prevposx = pos.x), (prevposy = pos.y);
    ns.atExit((pid = ns.pid) => ns.ui.closeTail(pid));
  }
}
const cat = `
 /\\_/\\   _
(=^.^=)_//
  )  (  )
 (_(__)/`;

const walk = [
  ` /\\_/\\   _
(=^.^=)_//
 / ) (  )
(_(__)/`,
  ` /\\_/\\   _
(=^.^=)_//
  ) ( \\ )
   \\)(__)`,
];

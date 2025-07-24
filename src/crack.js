/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog('ALL');
  const targetNode = ns.args[0] || '';
  const delay = ns.args[1] || 0;
  const repeat = ns.args[2] || 1;
  for (let i = 0; i < repeat; i++) {
    if (delay) {
      await ns.sleep(delay);
    }
    await ns.hack(targetNode);
    await ns.sleep(100);
  }
}

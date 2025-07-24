/** @param {NS} ns */
export async function main(ns) {
  while (true) {
    await ns.dnet.phishingAttack();
    const files = ns.ls(ns.getHostname(), '.cache');
    for (const file of files) {
      ns.dnet.openCache(file);
      ns.toast(`Opened cache file: ${file}`, 'info', 3000);
    }
  }
}

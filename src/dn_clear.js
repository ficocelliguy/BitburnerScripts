/** @param {NS} ns */
export async function main(ns) {
  while (ns.dnet.getBlockedRam()) {
    await ns.dnet.memoryReallocation();
    ns.print(ns.getServer().ramUsed);
  }
}

/** @param {NS} ns */
export async function main(ns) {
  while (ns.dnet.getOwnerAllocatedRam()) {
    await ns.dnet.memoryReallocation();
    ns.print(ns.getServer().ramUsed);
  }
}

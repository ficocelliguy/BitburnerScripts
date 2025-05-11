/** @param {NS} ns */
export async function main(ns) {
  while (ns.dnet.getOwnerAllocatedRam()) {
    await ns.dnet.memoryReallocation();
    ns.print(ns.getServer().ramUsed);
  }
  ns.run('dn_cache.js');
  await ns.sleep(1000);
  ns.run('dn_phish.js');
}

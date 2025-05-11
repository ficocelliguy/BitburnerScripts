/** @param {NS} ns */
export async function main(ns) {
  while (true) {
    await ns.dnet.phishingAttack();
    //await ns.dnet.promoteStock('ECP');
    // await ns.dnet.induceServerMigration();
  }
}

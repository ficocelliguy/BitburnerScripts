/** @param {NS} ns */
export async function main(ns) {
  await ns.dnet.setStasisLink();
  while (true) {
    const direction = ['north', 'east', 'south', 'west'][Math.floor(Math.random() * 4)];
    await ns.dnet.authenticate('th3_l4byr1nth', direction);
    await ns.sleep(100);
  }
}

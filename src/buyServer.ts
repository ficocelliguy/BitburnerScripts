import { NS } from '@ns';
const MIN_MONEY = 1_000_000_000;

export async function main(ns: NS) {
  while (ns.cloud.getServerNames().length < ns.cloud.getServerLimit() && ns.getPlayer().money >= MIN_MONEY) {
    const maxServerExponent = getMaximumServerAffordable(ns);
    const maxServerSize = 2 ** maxServerExponent;

    ns.print('Size: 2**', maxServerExponent, ', cost: ', ns.format.number(ns.cloud.getServerCost(maxServerSize)));
    ns.cloud.purchaseServer('BigBoi-' + maxServerExponent, maxServerSize);
    await ns.sleep(10);
  }

  while (ns.getPlayer().money >= MIN_MONEY) {
    const serverToUpgrade = ns.cloud
      .getServerNames()
      .map((server) => ({
        ram: ns.getServerMaxRam(server),
        ip: server,
      }))
      .sort((server1, server2) => server1.ram - server2.ram)[0];

    const maxServerExponent = getMaximumServerAffordable(ns);
    if (ns.getServerMaxRam(serverToUpgrade.ip) >= 2 ** maxServerExponent) {
      return;
    }
    ns.cloud.upgradeServer(serverToUpgrade.ip, 2 ** maxServerExponent);
    await ns.sleep(10);
  }
}

/** @param {NS} ns */
const getMaximumServerAffordable = (ns: NS) => {
  let exponent = 5;
  const money = ns.getPlayer().money - MIN_MONEY;
  while (ns.cloud.getServerCost(2 ** exponent) < money && exponent <= 20) {
    exponent++;
  }

  return exponent - 1;
};

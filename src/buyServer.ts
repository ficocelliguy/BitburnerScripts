import { NS } from '@ns';
const MIN_MONEY = 1_000_000_000;

export async function main(ns: NS) {
  while (ns.getPurchasedServers().length < ns.getPurchasedServerLimit() && ns.getPlayer().money >= MIN_MONEY) {
    const maxServerExponent = getMaximumServerAffordable(ns);
    const maxServerSize = 2 ** maxServerExponent;

    ns.print('Size: 2**', maxServerExponent, ', cost: ', ns.format.number(ns.getPurchasedServerCost(maxServerSize)));
    ns.purchaseServer('BigBoi-' + maxServerExponent, maxServerSize);
    await ns.sleep(10);
  }

  while (ns.getPlayer().money >= MIN_MONEY) {
    const serverToUpgrade = ns
      .getPurchasedServers()
      .map((server) => ({
        ram: ns.getServerMaxRam(server),
        ip: server,
      }))
      .sort((server1, server2) => server1.ram - server2.ram)[0];

    const maxServerExponent = getMaximumServerAffordable(ns);
    if (ns.getServerMaxRam(serverToUpgrade.ip) >= 2 ** maxServerExponent) {
      return;
    }
    ns.upgradePurchasedServer(serverToUpgrade.ip, 2 ** maxServerExponent);
    await ns.sleep(10);
  }
}

/** @param {NS} ns */
const getMaximumServerAffordable = (ns: NS) => {
  let exponent = 5;
  const money = ns.getPlayer().money - MIN_MONEY;
  while (ns.getPurchasedServerCost(2 ** exponent) < money && exponent <= 20) {
    exponent++;
  }

  return exponent - 1;
};

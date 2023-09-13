import { NS } from '@ns';

const INFILTRATE_SCRIPT = 'infiltrate.js';

/** @param {NS} ns */
export async function main(ns: NS) {
  ns.stanek.acceptGift();

  if (ns.getPlayer().money > 200000) {
    ns.singularity.travelToCity(ns.enums.CityName.Aevum);
  }

  ns.singularity.commitCrime(ns.enums.CrimeType.homicide, false);

  ns.run(INFILTRATE_SCRIPT, 1, 'nobeep');

  while (ns.scriptRunning(INFILTRATE_SCRIPT, 'home')) {
    await ns.sleep(1000);
  }

  ns.singularity.travelToCity(ns.enums.CityName.Aevum);
  ns.singularity.purchaseTor();
  ns.singularity.purchaseProgram('BruteSSH.exe');
  ns.singularity.purchaseProgram('FTPCrack.exe');
  ns.singularity.purchaseProgram('relaySMTP.exe');
  ns.singularity.purchaseProgram('HTTPWorm.exe');
  ns.singularity.purchaseProgram('SQLInject.exe');

  while (ns.getServer('home').maxRam < 1024 && ns.singularity.upgradeHomeRam()) {
    await ns.sleep(10);
  }

  ns.stock.purchaseWseAccount();
  ns.stock.purchaseTixApi();

  ns.run('humanResources.js');
  ns.run('hackManager.js');
  //ns.run('stocks.js');
  //ns.run('buyServer.js');

  ns.run('exec.js', 1, 'charge.js');

  ns.run(INFILTRATE_SCRIPT, 1, 4, 'Slum Snakes');
  // ns.run(INFILTRATE_SCRIPT, 1, 3);

  while (ns.scriptRunning(INFILTRATE_SCRIPT, 'home')) {
    await ns.sleep(1000);
  }

  await ns.sleep(30000);
  ns.run('backdoor.js');

  await ns.sleep(120000);
  ns.run('backdoor.js');
}

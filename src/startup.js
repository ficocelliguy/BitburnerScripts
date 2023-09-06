const INFILTRATE_SCRIPT = 'infiltrate.js';

/** @param {NS} ns */
export async function main(ns) {
  if (ns.getPlayer().money > 200000) {
    ns.singularity.travelToCity(ns.enums.CityName.Aevum);
  }

  ns.run(INFILTRATE_SCRIPT);

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
    // ns.print("Upgraded ram!")
  }

  ns.run('humanResources.js');
  ns.run('hackManager.js');
  ns.run('buyServer.js');

  await ns.sleep(30000);
  ns.run('backdoor.js');

  await ns.sleep(90000);
  ns.run('backdoor.js');
}

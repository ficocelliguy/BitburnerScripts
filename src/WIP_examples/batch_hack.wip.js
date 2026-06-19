/*
 jump3r's rules for hacking that rules!

 Rule 0: Be Prepared
 The target server you want to hack should be kept at min security!
 High security greatly reduces the speed of hack, grow, and weaken.

 RULE 1: Timing is Everything
 Hack calls mess up security when they finish!
 Start your grows and weakens BEFORE the hack finishes, otherwise they'll take way longer.

 RULE 2: The Rich Get Richer
 Grow is like interest. The more money the server has, the more that grow adds!
 Make sure the server stays near max money. Don't take big chunks of money at once.

 RULE 3: The Botnet Must Grow
 RAM is everything. Get your hands on any servers' ram that you can buy or steal or upgrade.
 The more hack script threads you can bring to bear, the more you can upgrade your servers, which lets you launch more threads, and repeat!
*/

/**
 * This is a "shotgun" style batch hacking script.
 *
 * It launches a "batch" of hack, grow, and weaken scripts at the same time, with the same duration,
 * in order to return the target server to min security and max money immediately after the hack finishes.
 * This script then repeats this as many times as it can, using all the ram available on the current server.
 * This allows for very rapid, efficient hacks on the target, while always keeping the target prepped.
 *
 * @param {NS} ns
 * */
export async function main(ns) {
  ns.ui.openTail();
  const host = ns.self().server;
  const target = 'n00dles';

  while (true) {
    const hackDelay = ns.getWeakenTime(target) - ns.getHackTime(target);
    const growDelay = ns.getWeakenTime(target) - ns.getGrowTime(target);

    // TODO: calculate good thread counts for the target instead of hard-coding them
    ns.exec('hack.js', host, { threads: 1, temporary: true }, target, hackDelay);
    ns.exec('grow.js', host, { threads: 1, temporary: true }, target, growDelay);
    const weakStarted = ns.exec('weak.js', host, { threads: 1, temporary: true }, target);

    if (!weakStarted) {
      await ns.sleep(ns.getWeakenTime(target));
    }
  }
}

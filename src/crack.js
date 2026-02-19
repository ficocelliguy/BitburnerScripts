/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog('ALL');
  const targetNode = ns.args[0] || '';
  const delay = ns.args[1] || 0;
  await ns.hack(targetNode, { additionalMsec: delay });
}

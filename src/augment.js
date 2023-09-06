/** @param {NS} ns */
export async function main(ns) {
  const factions = ns.getPlayer().factions;

  factions.forEach((f) => {
    while (ns.singularity.purchaseAugmentation(f, 'NeuroFlux Governor')) {
      // ns.print("Purchasing aug...")
    }
    ns.singularity.purchaseAugmentation(f, 'The Red Pill');
    ns.singularity.purchaseAugmentation(f, 'SoA - phyzical WKS harmonizer');
  });

  ns.singularity.installAugmentations('startup.js');
}

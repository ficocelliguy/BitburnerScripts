import { NS } from '@ns';

const NUMBER_OF_SLEEVES = 7;

export async function main(ns: NS) {
  const factions = ns.getPlayer().factions;

  ns.stock.getSymbols().forEach((sym: string) => {
    ns.stock.sellStock(sym, Number.MAX_SAFE_INTEGER);
  });

  for (let i = 0; i < 3; i++) {
    factions.forEach((f) => {
      augmentsToInstall.forEach((aug) => ns.singularity.purchaseAugmentation(f, aug));

      if (i > 0) {
        while (ns.singularity.purchaseAugmentation(f, 'NeuroFlux Governor')) {
          // ns.print("Purchasing aug...")
        }

        specialAugments.forEach((aug) => ns.singularity.purchaseAugmentation(f, aug));
      }
    });
  }

  while (ns.singularity.upgradeHomeRam()) {
    // ns.print("Upgraded ram!")
  }
  while (ns.singularity.upgradeHomeCores()) {
    // ns.print("Upgraded cores!")
  }

  for (let i = 0; i < NUMBER_OF_SLEEVES; i++) {
    const sleeve = ns.sleeve.getSleeve(i);
    const augs = ns.sleeve.getSleevePurchasableAugs(i);
    if (sleeve.shock > 0) {
      continue;
    }
    if (augs.length) {
      augs.forEach((aug) => ns.sleeve.purchaseSleeveAug(i, aug.name));
    }
  }

  ns.singularity.installAugmentations('init.js');
}

const augmentsToInstall = [
  "BigD's Big ... Brain", // unobtainable
  'QLink', // Illuminati, expensive
  'Unstable Circadian Modulator', // Speakers for the Dead: 300 phys, rotates stat bonus hourly?
  'Embedded Netburner Module', // bitrunners
  'Embedded Netburner Module Core Implant', // bitrunners
  'Embedded Netburner Module Core V3 Upgrade', // ecorp, megacorp, fulcrum
  'PC Direct-Neural Interface', // ecorp, omni, blade, 4s : 75% faction rep gain
  'PC Direct-Neural Interface NeuroNet Injector', // Fulcrum: 400k rep, bd fulcrumassets
  'Embedded Netburner Module Direct Memory Access Upgrade', // Fulcrum
  'Embedded Netburner Module Analyze Engine', // bachman, nwo, clark, omni, 4s
  'ECorp HVMind Implant', // ecorp
  'SPTN-97 Gene Modification', // covenant
  'Embedded Netburner Module Core V2 Upgrade', // bitrunners
  'PC Direct-Neural Interface Optimization Submodule', // fulcrum, ecorp
  'BitRunners Neurolink', // bitrunners
  'Xanipher', // nwo
  'Artificial Bio-neural Network Implant', // bitrunners
  'Neuralstimulator', // sec-12
  'OmniTek InfoLoad', // omni
  'HyperSight Corneal Implant', // gang, blade, kuai: 3% hacking speed, 10% money
  'SmartJaw', // bachman : first one for megacorp work?
  'Cranial Signal Processors - Gen I',
  'Cranial Signal Processors - Gen II',
  'Cranial Signal Processors - Gen III',
  'Cranial Signal Processors - Gen IV',
  'Cranial Signal Processors - Gen V', // bitrunners
  'PCMatrix', // aevum
  'nextSENS Gene Modification', // clarke
  'Neural Accelerator', // bitrunners
  'Enhanced Myelin Sheathing', // bitrunners
  'Neuronal Densification', // clarke
  'FocusWire', // bachman, clarke, 4s, kuai
  'ADR-V2 Pheromone Gene', // bachman
  'The Black Hand', // black hand
  'DataJack', // bitrunners
  "The Shadow's Simulacrum", // syndicate (phys 200, Aevum)
  'Neuregen Gene Modification', /// Chong
  'Neural-Retention Enhancement',
  'CRTX42-AA Gene Modification',
  'Power Recirculation Core',
  'Neurotrainer III',
  'Artificial Synaptic Potentiation',
  'Neurotrainer II',
  'Social Negotiation Assistant (S.N.A)',
  'Nuoptimal Nootropic Injector Implant',
  'Neuroreceptor Management Implant', // Tian
  'ADR-V1 Pheromone Gene',
  'Speech Enhancement',
  'BitWire',
  'Synaptic Enhancement Implant',
  'Neurotrainer I',
  'CashRoot Starter Kit',
  'Wired Reflexes',
  'Speech Processor Implant',
];

const specialAugments = [
  "Stanek's Gift - Genesis",
  "Stanek's Gift - Awakening",
  "Stanek's Gift - Serenity",
  'SoA - phyzical WKS harmonizer',
  'SoA - Wisdom of Athena',
  'SoA - Trickery of Hermes',
  'SoA - Chaos of Dionysus',
  'SoA - Hunt of Artemis',
  'SoA - Flood of Poseidon',
  'SoA - Beauty of Aphrodite',
  'SoA - Might of Ares',
  'The Red Pill',
];

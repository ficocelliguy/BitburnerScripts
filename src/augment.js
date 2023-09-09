/** @param {NS} ns */
export async function main(ns) {
  const factions = ns.getPlayer().factions;

  ns.stock.getSymbols().forEach((sym) => {
    ns.stock.sellStock(sym, Number.MAX_SAFE_INTEGER);
  });

  for (let i = 0; i < 3; i++) {
    factions.forEach((f) => {
      augmentsToInstall.forEach((aug) => ns.singularity.purchaseAugmentation(f, aug));

      if (i > 0) {
        while (ns.singularity.purchaseAugmentation(f, 'NeuroFlux Governor')) {
          // ns.print("Purchasing aug...")
        }

        ns.singularity.purchaseAugmentation(f, 'SoA - phyzical WKS harmonizer');
        ns.singularity.purchaseAugmentation(f, 'The Red Pill');
      }
    });
  }

  ns.singularity.installAugmentations('init.js');
}

const augmentsToInstall = [
  "BigD's Big ... Brain",
  'QLink',
  'Unstable Circadian Modulator',
  'Embedded Netburner Module',
  'Embedded Netburner Module Core Implant',
  'Embedded Netburner Module Core V3 Upgrade',
  'PC Direct-Neural Interface',
  'PC Direct-Neural Interface NeuroNet Injector',
  'Embedded Netburner Module Direct Memory Access Upgrade',
  'Embedded Netburner Module Analyze Engine',
  'ECorp HVMind Implant',
  'SPTN-97 Gene Modification',
  'Embedded Netburner Module Core V2 Upgrade',
  'PC Direct-Neural Interface Optimization Submodule',
  'BitRunners Neurolink',
  'Xanipher',
  'Artificial Bio-neural Network Implant',
  'Neuralstimulator',
  'OmniTek InfoLoad',
  'HyperSight Corneal Implant',
  'SmartJaw',
  'Cranial Signal Processors - Gen I',
  'Cranial Signal Processors - Gen II',
  'Cranial Signal Processors - Gen III',
  'Cranial Signal Processors - Gen IV',
  'Cranial Signal Processors - Gen V',
  'PCMatrix',
  'nextSENS Gene Modification',
  'Neural Accelerator',
  'Enhanced Myelin Sheathing',
  'Neuronal Densification',
  'FocusWire',
  'ADR-V2 Pheromone Gene',
  'The Black Hand',
  'DataJack',
  "The Shadow's Simulacrum",
  'Neuregen Gene Modification',
  'Neural-Retention Enhancement',
  'CRTX42-AA Gene Modification',
  'Power Recirculation Core',
  'Neurotrainer III',
  'Artificial Synaptic Potentiation',
  'Neurotrainer II',
  'Social Negotiation Assistant (S.N.A)',
  'Nuoptimal Nootropic Injector Implant',
  'ADR-V1 Pheromone Gene',
  'Speech Enhancement',
  'BitWire',
  'Synaptic Enhancement Implant',
  'Neurotrainer I',
  'Wired Reflexes',
  'Speech Processor Implant',
  "Stanek's Gift - Genesis",
  "Stanek's Gift - Awakening",
  "Stanek's Gift - Serenity",
];

const NUMBER_OF_SLEEVES = 6;
const MIN_SLEEVE_SHOCK = 90;
const MIN_SLEEVE_SYNC = 95;

const MAX_UPGRADE_COST_FRACTION = 0.005;
const PEACETIME_ASCENSION_RATIO = 1.1;
const WARTIME_ASCENSION_RATIO = 1.5;
const MINIMUM_WANTED_PENALTY = 0.98;
const STRENGTH_MINIMUM_FOR_ACTION = 600;
const MAXIMUM_GANG_MEMBERS = 12;
const WARFARE_START_POWER_RATIO = 2;

export function autocomplete(data) {
  return ['--tail'];
}

/** @param {NS} ns */
export async function main(ns) {
  killDuplicates(ns);

  const CrimeType = ns.enums.CrimeType;
  const crimes = [
    CrimeType.mug,
    CrimeType.homicide,
    CrimeType.grandTheftAuto,
    CrimeType.kidnap,
    CrimeType.assassination,
    CrimeType.heist,
  ];

  while (true) {
    const costThreshold = MAX_UPGRADE_COST_FRACTION * ns.getPlayer().money;

    // Sync and train up sleeves, then reduce karma with them
    for (let i = 0; i < NUMBER_OF_SLEEVES; i++) {
      const sleeve = ns.sleeve.getSleeve(i);
      const augs = ns.sleeve.getSleevePurchasableAugs(i).filter((a) => a.cost < costThreshold);
      if (sleeve.shock > MIN_SLEEVE_SHOCK) {
        continue;
      } else if (sleeve.sync < MIN_SLEEVE_SYNC) {
        // ns.sleeve.setToSynchronize(i);
      } else if (augs.length && !sleeve.shock) {
        augs.forEach((aug) => ns.sleeve.purchaseSleeveAug(i, aug.name));
      } else if (!ns.gang.inGang() && ns.formulas.work.crimeSuccessChance(sleeve, CrimeType.homicide) > 0.8) {
        ns.sleeve.setToCommitCrime(i, CrimeType.homicide);
      } else {
        const newCrime =
          [...crimes].reverse().find((c) => ns.formulas.work.crimeSuccessChance(sleeve, c) > 0.9) || CrimeType.mug;
        ns.sleeve.setToCommitCrime(i, newCrime);
      }
    }

    // attempt to join gang until it is finally successful
    if (!ns.gang.inGang()) {
      ns.gang.createGang('Slum Snakes');
      ns.gang.inGang() && ns.print('Gang successfully created!');
    }

    if (ns.gang.inGang()) {
      manageGang(ns);
    }

    await ns.sleep(30000);
  }
}

/** @param {NS} ns */
function manageGang(ns) {
  ns.print('Checking in on gang...');

  const costThreshold = MAX_UPGRADE_COST_FRACTION * ns.getPlayer().money;

  while (ns.gang.canRecruitMember()) {
    ns.gang.recruitMember(getName());
  }

  const gangInfo = ns.gang.getGangInformation();
  const gangDudes = ns.gang.getMemberNames().map((n) => ns.gang.getMemberInformation(n));
  const equipment = ns.gang.getEquipmentNames().map((n) => ({ name: n, cost: ns.gang.getEquipmentCost(n) }));
  const repJob =
    gangInfo.territory < 1
      ? gangDudes.length >= MAXIMUM_GANG_MEMBERS
        ? Jobs.territory
        : Jobs.terrorism
      : Jobs.trafficArms;

  gangDudes.forEach(
    /** @param { GangMemberInfo } dude */
    (dude) => {
      // ascend if the new multipliers will be high enough
      const ascResult = ns.gang.getAscensionResult(dude.name)?.str;
      const ascensionThreshold = gangInfo.territory < 1 ? WARTIME_ASCENSION_RATIO : PEACETIME_ASCENSION_RATIO;
      if (ascResult > ascensionThreshold) {
        ns.gang.ascendMember(dude.name);
      }

      // buy all cheap equipment not yet owned
      equipment
        .filter(
          (e) =>
            dude.upgrades.indexOf(e.name) === -1 && dude.augmentations.indexOf(e.name) === -1 && e.cost < costThreshold,
        )
        .forEach((e) => ns.gang.purchaseEquipment(dude.name, e.name));

      if (dude.str < STRENGTH_MINIMUM_FOR_ACTION) {
        dude.task !== Jobs.train && setGangJob(ns, dude.name, Jobs.train);
      } else if (dude.task === Jobs.train) {
        setGangJob(ns, dude.name, repJob);
      }
    },
  );

  if (gangInfo.wantedPenalty < MINIMUM_WANTED_PENALTY) {
    const strongmen = gangDudes.filter((dude) => dude.task === repJob);
    const randomDude = strongmen[Math.floor(Math.random() * strongmen.length)];
    randomDude && setGangJob(ns, randomDude.name, Jobs.vigilante);
  } else {
    const strongmen = gangDudes.filter((dude) => dude.task === Jobs.vigilante);
    const randomDude = strongmen[Math.floor(Math.random() * strongmen.length)];
    randomDude && setGangJob(ns, randomDude.name, repJob);
  }

  if (
    gangDudes.length >= MAXIMUM_GANG_MEMBERS &&
    gangInfo.territory < 1 &&
    !gangDudes.find((dude) => dude.task === Jobs.territory)
  ) {
    gangDudes.filter((dude) => dude.task !== Jobs.train).forEach((dude) => setGangJob(ns, dude.name, Jobs.territory));
  }

  const otherGangInfo = Object.keys(ns.gang.getOtherGangInformation())
    .map((g) => ({
      name: g,
      ...ns.gang.getOtherGangInformation()[g],
    }))
    .filter((g) => g.name !== gangInfo.faction);

  // If no other gang is close to our power, start warfare
  if (!otherGangInfo.find((g) => g.power * WARFARE_START_POWER_RATIO > gangInfo.power) && gangInfo.territory < 1) {
    !gangInfo.territoryWarfareEngaged && ns.gang.setTerritoryWarfare(true);
  } else {
    gangInfo.territoryWarfareEngaged && ns.gang.setTerritoryWarfare(false);
  }

  if (gangInfo.territory >= 1) {
    gangDudes.forEach((dude) => setGangJob(ns, dude.name, Jobs.trafficArms));
  }
}

const Jobs = {
  territory: 'Territory Warfare',
  vigilante: 'Vigilante Justice',
  terrorism: 'Terrorism',
  trafficArms: 'Traffick Illegal Arms',
  train: 'Train Combat',
};

/** @param {NS} ns */
function setGangJob(ns, name, job) {
  if (ns.gang.getMemberInformation(name).task !== job) {
    ns.gang.setMemberTask(name, job);
  }
}

function getName() {
  return `${getNamePrefix()}${getNameFirstHalf()}${getNameSecondHalf()}${getNameSuffix()}`;
}

function getNameFirstHalf() {
  const halves = [
    'Sam',
    'Tom',
    'Bill',
    'Mike',
    'Tor',
    'Che',
    'Al',
    'Mar',
    'Nat',
    'Vin',
    'Dor',
    'Re',
    'Luk',
    'Rach',
    'Gen',
    'Sean',
    'Nick',
    'Dan',
    'Noah',
  ];

  return halves[Math.floor(Math.random() * halves.length)];
}

function getNameSecondHalf() {
  const halves = [
    'y',
    'son',
    'et',
    'ally',
    'ette',
    '-Bob',
    'vin',
    'ky',
    'han',
    '-sue',
    'cent',
    'elli',
    'smit',
    'er',
    'tasha',
  ];

  const roll = Math.random();
  return roll > 3 / 4 ? '' : halves[Math.floor(halves.length * roll * (4 / 3))];
}

function getNamePrefix() {
  const prefixes = [
    'Mr. ',
    'Mrs. ',
    'Señor ',
    'Prince ',
    "Lil' ",
    'Big ',
    'Father ',
    "Ol' ",
    'G ',
    'Gamer ',
    'Sir ',
    'Madam ',
    'Marm ',
    'Miss ',
    'Earl ',
    'Duke ',
    'Chief ',
    'Coach ',
    'Dame ',
    'Brother ',
    'St ',
    'Admiral ',
    'Nanny ',
    'Commissioner ',
    'Sheriff ',
    'Deputy ',
    'Sergent ',
  ];

  const roll = Math.random();
  return roll > 1 / 2 ? '' : prefixes[Math.floor(prefixes.length * roll * 2)];
}

function getNameSuffix() {
  const suffixes = [
    ', Jr',
    ' III',
    ' IV',
    ', esquire',
    ', MD',
    ', the legend',
    ' the OG',
    ' of vengeance',
    ' the bard',
    ' smalls',
    ' the GOAT',
    '-on-head',
    ', CEO',
    ', influencer',
    ' the boomer',
    ' the zoomer',
    '-san',
    ' the babysitter',
    ' the small',
    ', God-Emperor',
  ];

  const roll = Math.random();
  return roll > 1 / 2 ? '' : suffixes[Math.floor(suffixes.length * roll * 2)];
}

/** @param {NS} ns */
function killDuplicates(ns) {
  const scriptInfo = ns.getRunningScript();
  ns.ps()
    .filter((script) => script.filename === scriptInfo.filename && script.pid !== scriptInfo.pid)
    .forEach((script) => ns.kill(script.pid));
}

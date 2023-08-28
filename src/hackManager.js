const WEAKEN_SCRIPT = 'weaken.js';
const GROW_SCRIPT = 'grow.js';
const HACK_SCRIPT = 'crack.js';
const MAX_TARGETS = 50;
const SYNCHRONIZE_OFFSET = 40;
const TARGET_RUNTIME = 4 * 60 * 1000;
const MAX_RESOURCES_HACKED = 0.4;
const LOOP_COUNT_BEFORE_REST = 40;
const CYAN = '\u001b[36m';
const GREEN = '\u001b[32m';
const RED = '\u001b[31m';
const RESET = '\u001b[0m';
let currentExp, expTime;

export function autocomplete(data) {
  return ['--tail', 'true', 'false'];
}

/** @param {NS} ns */
export async function main(ns) {
  if (ns.args[0] !== 'false') {
    killDuplicates(ns);
  }

  disableLogging(ns);

  const potentialTargets = getTargetlist(ns);
  ns.print(potentialTargets.slice(0, MAX_TARGETS));
  currentExp = currentExp || ns.getPlayer().exp.hacking;
  expTime = expTime || Date.now();

  let index = 0;
  let currentMaxTargets = Math.min(3, potentialTargets.length);
  let serversAffected = 0;
  let loopCount = 0;

  while (true) {
    loopCount++;
    const now = Date.now();
    const targets = potentialTargets.slice(0, currentMaxTargets);
    const targetObj = targets[index];
    const target = targetObj.id;
    // ns.print(`${CYAN} --- [  Target: '${target}'  ] --- ${RESET}`);

    const dynamicWaitTime = Math.max(getMinimumWeakenTime(ns, targets, index) * 0.25, 3000);

    const currentMoney = ns.getServerMoneyAvailable(target);
    const maxMoney = ns.getServerMaxMoney(target);
    const moneyPercent = currentMoney / maxMoney;

    if (!targetObj.waitingForGrow && moneyPercent < 0.9) {
      serversAffected++;
      weakenTargetToMin(ns, target, WEAKEN_SCRIPT, HACK_SCRIPT);

      const threadsRemaining = targetObj.waitingForGrow
        ? 0
        : growTargetToMax(ns, target, GROW_SCRIPT, WEAKEN_SCRIPT, targetObj.threadsRemaining || 0);

      if (threadsRemaining) {
        targetObj.threadsRemaining = threadsRemaining;
        await waitForResources(ns, dynamicWaitTime);
        index = 0;
        serversAffected = 0;
        continue;
      } else {
        targetObj.waitingForGrow = true;
        targetObj.threadsRemaining = 0;
        targetObj.expectedCompletion =
          now + SYNCHRONIZE_OFFSET * 2 + ns.formulas.hacking.weakenTime(ns.getServer(target), ns.getPlayer());
      }
    } else if (targetObj.waitingForGrow && targetObj.expectedCompletion < now) {
      targetObj.waitingForGrow = false;
      targetObj.threadsRemaining = 0;
      targetObj.expectedCompletion = 0;
    }
    // else if (targetObj.waitingForGrow) {
    //   ns.print(`      ( Waiting for grow )`);
    // }

    if (moneyPercent >= 0.9) {
      targetObj.waitingForGrow = false;
      targetObj.threadsRemaining = 0;
      targetObj.expectedCompletion = 0;
      serversAffected++;

      const hackLaunched = await launchAttack(ns, target);

      if (!hackLaunched) {
        await waitForResources(ns, dynamicWaitTime);
        index = 0;
        serversAffected = 0;
        continue;
      }
    }

    index++;

    if (index >= currentMaxTargets) {
      if (serversAffected === 0) {
        currentMaxTargets = Math.min(currentMaxTargets + 1, MAX_TARGETS, potentialTargets.length);
        if (currentMaxTargets >= potentialTargets.length) {
          await waitForResources(ns, dynamicWaitTime, `All viable servers processing (${potentialTargets.length})`);
        }
        await ns.sleep(SYNCHRONIZE_OFFSET);
      }

      index = 0;
      serversAffected = 0;
    }

    // Very occasionally sleep to prevent the script from appearing to hang
    // when launched with a lot of free RAM
    if (loopCount > LOOP_COUNT_BEFORE_REST) {
      await ns.sleep(SYNCHRONIZE_OFFSET);
      loopCount = 0;
    }
  }
}

/** @param {NS} ns */
const waitForResources = async (ns, dynamicWaitTime, reason = 'Resources maxed') => {
  const homeRam = ns.formatNumber(ns.getServerMaxRam('home'), 0, 100000000);
  const botRam = ns.formatNumber(getMaxRam(ns, false) - ns.getServerMaxRam('home'), 0, 100000000);
  const serverCount = getAvailableRamOnServers(ns).length;
  const income = ns.formatNumber(ns.getScriptIncome() * 60, 1);
  const karma = ns.formatNumber(Math.floor(ns.heart.break()), 1);
  const player = ns.getPlayer();
  const targetXp = ns.getServer('w0r1d_d43m0n')?.requiredHackingSkill;
  const xpRemaining = ns.formulas.skills.calculateExp(targetXp, player.mults.hacking) - player.exp.hacking;

  const gainedXp = player.exp.hacking - currentExp;
  const timeSinceLastCheck = Date.now() - expTime || 0.01;
  const xpPerSec = Math.max((gainedXp / timeSinceLastCheck) * 1000, ns.getTotalScriptExpGain());

  const hoursTillEscape = ns.formatNumber(xpRemaining / (xpPerSec * 60 * 60), 2);

  ns.print(`${reason}; Sleeping for ${(dynamicWaitTime / (1000 * 60)).toFixed(2)} minutes.`);
  ns.print(
    `   --| Income: ${CYAN}${income}${RESET} /min  Home: ${homeRam}GB  Botnet: ${botRam}GB x${serverCount}  K:${karma}  T-${hoursTillEscape} |--`,
  );

  currentExp = player.exp.hacking;
  expTime = Date.now();

  await ns.sleep(dynamicWaitTime);
};

/** @param {NS} ns */
const launchAttack = async (ns, target) => {
  const f = ns.formulas.hacking;
  const currentMoney = ns.getServerMoneyAvailable(target);
  const maxMoney = ns.getServerMaxMoney(target);
  const moneyPercent = currentMoney / maxMoney;

  const ram = getAvailableRam(ns);
  const hTime = f.hackTime(ns.getServer(target), ns.getPlayer());
  const wTime = hTime * 4;
  const gTime = hTime * 3.2;
  const hPercent = f.hackPercent(ns.getServer(target), ns.getPlayer());
  const gPercent = f.growPercent(ns.getServer(target), 1, ns.getPlayer(), 1) - 1;

  const hSize = ns.getScriptRam(HACK_SCRIPT);
  const wSize = ns.getScriptRam(WEAKEN_SCRIPT);
  const gSize = ns.getScriptRam(GROW_SCRIPT);

  const hThreadsPerUnit = 20;
  const gThreadsPerUnit = ns.growthAnalyze(target, 1 + hPercent * hThreadsPerUnit);

  // Weaken decreases security by 0.05 per thread, grow raises by 0.004, and hack raises by 0.002.
  const weakenAfterHackThreadsPerUnit = Math.ceil(hThreadsPerUnit * (0.002 / 0.05));
  const weakenAfterGrowThreadsPerUnit = Math.ceil(gThreadsPerUnit * (0.004 / 0.05));
  const unitSize =
    hSize * hThreadsPerUnit +
    gSize * gThreadsPerUnit +
    wSize * (weakenAfterGrowThreadsPerUnit + weakenAfterGrowThreadsPerUnit);
  const unitsToReachMaxHackPercent = Math.ceil(MAX_RESOURCES_HACKED / (hThreadsPerUnit * hPercent));

  const unitCount = Math.floor(Math.min(ram / unitSize, unitsToReachMaxHackPercent));
  if (ram < unitSize || unitCount <= 0) {
    return false;
  }

  const attackCount = Math.min(Math.floor(ram / unitSize), 1);

  const threadCount = ns.formatNumber(
    attackCount *
      unitCount *
      (hThreadsPerUnit + weakenAfterGrowThreadsPerUnit + weakenAfterGrowThreadsPerUnit + gThreadsPerUnit),
    0,
    10000000,
  );
  ns.print(
    `  !! ${CYAN}${target}${RESET} has ${GREEN}$${ns.formatNumber(currentMoney)}${RESET} ${
      moneyPercent < 0.99 ? (100 * moneyPercent).toFixed(1) + '%' : ''
    }; ${RED}Launching attack${RESET} with ${threadCount} threads... (${Math.floor(
      attackCount * unitCount * unitSize,
    )} / ${ram}GB)`,
  );

  // We have to send out the attacks in "batches" otherwise the servers get completely drained
  // FUTURE: does this work as-is or do we need to offset the batches more?
  for (let i = 0; i < attackCount; i++) {
    // hack should complete & apply just BEFORE first weaken
    const hackOffset = wTime - hTime - SYNCHRONIZE_OFFSET;
    // grow should complete & apply just AFTER first weaken
    const growOffset = wTime - gTime + SYNCHRONIZE_OFFSET;

    const repeatCount = Math.ceil(Math.max(TARGET_RUNTIME / wTime, 1));

    deployDistributedThreads(ns, HACK_SCRIPT, target, hThreadsPerUnit * unitCount, hackOffset, repeatCount);
    deployDistributedThreads(ns, WEAKEN_SCRIPT, target, weakenAfterHackThreadsPerUnit * unitCount, 0, repeatCount);
    deployDistributedThreads(ns, GROW_SCRIPT, target, gThreadsPerUnit * unitCount, growOffset, repeatCount);
    deployDistributedThreads(
      ns,
      WEAKEN_SCRIPT,
      target,
      weakenAfterGrowThreadsPerUnit * unitCount,
      2 * SYNCHRONIZE_OFFSET,
      repeatCount,
    );
  }

  return true;
};

/** @param {NS} ns */
const weakenTargetToMin = (ns, target) => {
  const currentSecurity = ns.getServerSecurityLevel(target);
  const minSecurity = ns.getServerMinSecurityLevel(target);
  let wThreads = Math.floor((currentSecurity - minSecurity) / 0.05);

  //ns.print("Weaken threads required: " + wThreads);

  const remainingThreads = deployDistributedThreads(ns, WEAKEN_SCRIPT, target, wThreads);
  wThreads && !remainingThreads && deployDistributedThreads(ns, HACK_SCRIPT, target, 10);
  return remainingThreads;
};

/** @param {NS} ns */
const growTargetToMax = (ns, target, GROW_SCRIPT, WEAKEN_SCRIPT, priorThreads = 0) => {
  const currentMoney = Math.max(ns.getServerMoneyAvailable(target), 1);
  const maxMoney = ns.getServerMaxMoney(target);
  const priorGrowthPercent = priorThreads
    ? ns.formulas.hacking.growPercent(ns.getServer(target), priorThreads, ns.getPlayer(), 1)
    : 0;
  const gThreads = ns.growthAnalyze(target, Math.max(1 - priorGrowthPercent + (maxMoney * 1.2) / currentMoney, 1.1));

  const remainingThreads = Math.ceil(Math.max(gThreads - priorThreads, 0));
  if (remainingThreads) {
    ns.print(
      `${target} grow required, currently ${Math.round((currentMoney / maxMoney) * 100)}% of $${ns.formatNumber(
        maxMoney,
      )} : ${remainingThreads} threads needed`,
    );
  }

  const threadsRemaining = deployDistributedThreads(ns, GROW_SCRIPT, target, remainingThreads);
  !threadsRemaining && deployDistributedThreads(ns, WEAKEN_SCRIPT, target, Math.floor(remainingThreads / 125));
  return threadsRemaining;
};

/** @param {NS} ns */
const getServers = (ns) => {
  const dynamicServers = ns.scan('home');
  const hosts = [
    'n00dles',
    'foodnstuff',
    'sigma-cosmetics',
    'joesguns',
    'zer0',
    'hong-fang-tea',
    'nectar-net',
    'silver-helix',
    'the-hub',
    'computek',
    'netlink',
    'rothman-uni',
    'avmnite-02h',
    'syscore',
    'aevum-police',
    'global-pharm',
    'deltaone',
    'univ-energy',
    'taiyang-digital',
    'microdyne',
    'fulcrumtech',
    'millenium-fitness',
    'galactic-cyber',
    'snap-fitness',
    'unitalife',
    'defcomm',
    'infocomm',
    'applied-energetics',
    'stormtech',
    'kuai-gong',
    '.',
    'blade',
    'powerhouse-fitness',
    'megacorp',
    'vitalife',
    '4sigma',
    'b-and-a',
    'nwo',
    'catalyst',
    'rho-construction',
    'phantasy',
    'crush-fitness',
    'summit-uni',
    'omega-net',
    'harakiri-sushi',
    'max-hardware',
    'CSEC',
    'neo-net',
    'johnson-ortho',
    'zb-institute',
    'I.I.I.I',
    'lexo-corp',
    'aerocorp',
    'omnia',
    'icarus',
    'solaris',
    'zb-def',
    'zeus-med',
    'nova-med',
    'titan-labs',
    'helios',
    'omnitek',
    'clarkinc',
    'ecorp',
    'fulcrumassets',
    'The-Cave',
    'run4theh111z',
    'alpha-ent',
    'iron-gym',
    'w0r1d_d43m0n',
    'home',
  ];
  return dynamicServers.concat(hosts.filter((server) => dynamicServers.indexOf(server) === -1));
};

/** @param {NS} ns */
const getAvailableRamOnServers = (ns) => {
  const servers = getServers(ns);
  return servers
    .filter((server) => ns.getServer(server).hasAdminRights)
    .map((server) => {
      const freeRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
      const savedSpace = server === 'home' ? Math.min(20, freeRam / 4) : 0;
      return {
        id: server,
        ram: freeRam - savedSpace,
      };
    });
};

/** @param {NS} ns */
const getAvailableRam = (ns) => {
  const servers = getServers(ns);
  return Math.floor(
    0.95 *
      servers
        .filter((server) => ns.getServer(server).hasAdminRights)
        .reduce((sum, server) => {
          const buffer = server === 'home' ? Math.min(64, ns.getServerMaxRam(server) / 4) : 4;
          const available = ns.getServerMaxRam(server) - ns.getServerUsedRam(server) - buffer;
          return sum + Math.max(available, 0);
        }, 0),
  );
};

/** @param {NS} ns */
const getMaxRam = (ns, addBuffer = true) => {
  const servers = getServers(ns);
  return Math.floor(
    (addBuffer ? 0.95 : 1) *
      servers
        .filter((server) => ns.getServer(server).hasAdminRights)
        .reduce((sum, server) => {
          return sum + ns.getServerMaxRam(server);
        }, 0),
  );
};

/** @param {NS} ns */
const deployDistributedThreads = (ns, scriptName, target, threads, offset = 0, repeat = 1) => {
  if (!threads) {
    return 0;
  }

  let threadsRemaining = Math.floor(threads);
  const scriptSize = ns.getScriptRam(scriptName);

  const availableNodes = getAvailableRamOnServers(ns);
  availableNodes.forEach((node) => {
    const maxThreads = Math.min(threadsRemaining, Math.floor(node.ram / scriptSize));
    if (maxThreads <= 0) {
      return;
    }

    ns.scp(scriptName, node.id);
    ns.exec(scriptName, node.id, maxThreads, target, offset, repeat, `Threads: ${maxThreads}`);
    threadsRemaining -= maxThreads;
  });

  if (threadsRemaining !== Math.floor(threads)) {
    //ns.print(" > Executed " + scriptName + " against " + target + " with " + Math.floor(threads - threadsRemaining) + " threads across botnet.")
  }

  if (threadsRemaining > 0) {
    ns.print(
      threadsRemaining +
        ' threads still needed for ' +
        scriptName +
        ' (' +
        Math.floor((threadsRemaining / threads) * 100) +
        '% of request)',
    );
  }

  return threadsRemaining;
};

/** @param {NS} ns */
const getTargetlist = (ns) => {
  const servers = getServers(ns);
  const results = servers
    .filter((nodeName) => {
      const server = ns.getServer(nodeName);
      if (!server.hasAdminRights) {
        try {
          ns.brutessh(nodeName);
        } catch (e) {}
        try {
          ns.ftpcrack(nodeName);
        } catch (e) {}
        try {
          ns.relaysmtp(nodeName);
        } catch (e) {}
        try {
          ns.httpworm(nodeName);
        } catch (e) {}
        try {
          ns.sqlinject(nodeName);
        } catch (e) {}
        try {
          ns.nuke(nodeName);
        } catch (e) {}
      }

      const updatedServer = ns.getServer(nodeName);

      return (
        updatedServer.hasAdminRights &&
        updatedServer.moneyMax &&
        updatedServer.requiredHackingSkill <= ns.getPlayer().skills.hacking &&
        !updatedServer.purchasedByPlayer
      );
    })
    .map((id) => {
      const serverInfo = ns.getServer(id);
      const playerInfo = ns.getPlayer();
      const calculatedServerInfo = {
        ...serverInfo,
        hackDifficulty: serverInfo.minDifficulty,
      };

      const wTime = ns.formulas.hacking.weakenTime(calculatedServerInfo, playerInfo);
      const chance = ns.formulas.hacking.hackChance(calculatedServerInfo, ns.getPlayer());
      const percent = ns.formulas.hacking.hackPercent(calculatedServerInfo, ns.getPlayer());
      const maxMoney = ns.getServerMaxMoney(id);

      return {
        id: id,
        score: Math.round((10 / wTime) * maxMoney * chance * percent),
      };
    })
    .sort((a, b) => b.score - a.score);

  return results.length ? results : [{ id: 'foodnstuff' }];
};

const getMinimumWeakenTime = (ns, targets, index) => {
  const shortestWeak = targets
    .slice(0, index)
    .reduce(
      (minimum, node) => Math.min(minimum, ns.formulas.hacking.weakenTime(ns.getServer(node.id), ns.getPlayer())),
      ns.formulas.hacking.weakenTime(ns.getServer(targets[0].id), ns.getPlayer()),
    );
  return shortestWeak;
};

/** @param {NS} ns */
const disableLogging = (ns) => {
  ns.disableLog('scp');
  ns.disableLog('sleep');
  ns.disableLog('scan');
  ns.disableLog('exec');
  ns.disableLog('brutessh');
  ns.disableLog('ftpcrack');
  ns.disableLog('relaysmtp');
  ns.disableLog('httpworm');
  ns.disableLog('sqlinject');
  ns.disableLog('nuke');
  ns.disableLog('getServerMaxRam');
  ns.disableLog('getServerUsedRam');
  ns.disableLog('getServerMinSecurityLevel');
  ns.disableLog('getServerMaxMoney');
  ns.disableLog('getServerSecurityLevel');
  ns.disableLog('getServerMoneyAvailable');
};

/** @param {NS} ns */
function killDuplicates(ns) {
  const scriptInfo = ns.getRunningScript();
  ns.ps()
    .filter((script) => script.filename === scriptInfo.filename && script.pid !== scriptInfo.pid)
    .forEach((script) => ns.kill(script.pid));
}

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog('ALL');
  ns.clearLog();
  let port = ns.getPortHandle(10);
  port.clear();
  let config = JSON.parse(ns.read('proto/config.json'));
  const totalWorkerRam = config.workerServers.reduce((sum, { maxRam }) => sum + maxRam, 0);
  const primaryTargets = config.targets.slice(0, 1); // Get first x targets only
  const maxBatches = 50000;
  ns.print(`Total RAM available: ${totalWorkerRam}`);
  let previousBatches = null;
  const debugScript = false;

  let batchAllocation = {
    hack: null,
    hackThreads: 0,
    hackDelay: 0,
    weaken: null,
    weakenThreads: 0,
    weakenDelay: 0,
    grow: null,
    growThreads: 0,
    growDelay: 0,
    weaken2: null,
    weaken2Threads: 0,
    weaken2Delay: 0,
    finishTime: 0,
  };

  function getServerStats(target, minimal = false) {
    let targetMoney = ns.getServerMoneyAvailable(target);
    const targetMaxMoney = ns.getServerMaxMoney(target);
    const targetHack = targetMaxMoney * 0.1; // 10%
    let targetHackThreads = 0;
    if (minimal) {
      targetHackThreads = 1;
    } else {
      targetHackThreads = Math.ceil(ns.hackAnalyzeThreads(target, targetHack));
    }
    const targetHackSecurityIncrease = ns.hackAnalyzeSecurity(Math.floor(targetHackThreads));
    const targetHackTime = ns.getHackTime(target);
    const HackScriptRam = ns.getScriptRam('./hack.js', 'home');
    const targetHackRamNeeded = HackScriptRam * targetHackThreads;

    ////// Weaken 1
    let targetSec = ns.getServerSecurityLevel(target);
    const targetMinSec = ns.getServerMinSecurityLevel(target);
    const targetWeakenSingleThread = ns.weakenAnalyze(1);
    const targetWeakenThreadsRequired = Math.ceil(targetHackSecurityIncrease / targetWeakenSingleThread);
    const targetWeakenTime = ns.getWeakenTime(target);
    const WeakenScriptRam = ns.getScriptRam('./weaken.js', 'home');
    const targetWeakenRamNeeded = WeakenScriptRam * targetWeakenThreadsRequired;

    ////// Grow
    let targetGrowThreads = 0;
    if (minimal) {
      const minimalHackAmount = targetMoney * ns.hackAnalyze(target) * targetHackThreads;
      targetGrowThreads = Math.ceil(ns.growthAnalyze(target, targetMoney / (targetMoney - minimalHackAmount * 1.1)));
    } else {
      targetGrowThreads = Math.ceil(ns.growthAnalyze(target, targetMaxMoney / (targetMaxMoney - targetHack * 1.15)));
    }
    const targetGrowSecurityIncrease = ns.growthAnalyzeSecurity(targetGrowThreads);
    const targetGrowTime = ns.getGrowTime(target);
    const GrowScriptRam = ns.getScriptRam('./grow.js', 'home');
    const targetGrowRamNeeded = GrowScriptRam * targetGrowThreads;

    ////// Weaken 2
    const targetWeaken2ThreadsRequired = Math.ceil(targetGrowSecurityIncrease / targetWeakenSingleThread);
    const targetWeaken2RamNeeded = WeakenScriptRam * targetWeaken2ThreadsRequired;

    ////// Buffers/Delays
    const buffer = 200;
    const hackTimeDelay = targetWeakenTime - targetHackTime - buffer;
    const growTimeDelay = targetWeakenTime - targetGrowTime + buffer;
    const weaken2TimeDelay = buffer * 2;
    const batchTime = targetWeakenTime + buffer * 3;
    const batchRam = targetHackRamNeeded + targetWeakenRamNeeded + targetGrowRamNeeded + targetWeaken2RamNeeded;

    return {
      minimal: minimal,
      targetMoney: targetMoney,
      targetMaxMoney: targetMaxMoney,
      targetHack: targetHack,
      targetHackThreads: targetHackThreads,
      targetHackSecurityIncrease: targetHackSecurityIncrease,
      targetHackTime: targetHackTime,
      hackScriptRam: HackScriptRam,
      targetHackRamNeeded: targetHackRamNeeded,
      targetSec: targetSec,
      targetMinSec: targetMinSec,
      targetWeakenSingleThread: targetWeakenSingleThread,
      targetWeakenThreadsRequired: targetWeakenThreadsRequired,
      targetWeakenTime: targetWeakenTime,
      weakenScriptRam: WeakenScriptRam,
      targetWeakenRamNeeded: targetWeakenRamNeeded,
      targetGrowThreads: targetGrowThreads,
      targetGrowSecurityIncrease: targetGrowSecurityIncrease,
      targetGrowTime: targetGrowTime,
      growScriptRam: GrowScriptRam,
      targetGrowRamNeeded: targetGrowRamNeeded,
      targetWeaken2ThreadsRequired: targetWeaken2ThreadsRequired,
      targetWeaken2RamNeeded: targetWeaken2RamNeeded,
      buffer: buffer,
      hackTimeDelay: hackTimeDelay,
      growTimeDelay: growTimeDelay,
      weaken2TimeDelay: weaken2TimeDelay,
      batchTime: batchTime,
      batchRam: batchRam,
    };
  }

  // Prep targets
  async function prep(target) {
    config = JSON.parse(ns.read('proto/config.json'));
    const serverStats = getServerStats(target.name);
    if (serverStats.targetMinSec === serverStats.targetSec && serverStats.targetMoney === serverStats.targetMaxMoney) {
      target.prepped = true;
      return;
    }

    // Modify the values to suit prep stage
    serverStats.targetWeakenThreadsRequired = Math.ceil(
      Math.max(1, (serverStats.targetSec - serverStats.targetMinSec) / serverStats.targetWeakenSingleThread),
    );
    serverStats.targetWeakenRamNeeded = serverStats.weakenScriptRam * serverStats.targetWeakenThreadsRequired;

    const batch = await buildBatch(target, serverStats);
    const prepFinishTime = await launchBatch(batch, true);
    await ns.sleep(prepFinishTime);
  }

  async function prepCheck() {
    while (primaryTargets.some((target) => !target.prepped)) {
      if (config.workerServers.some((workServ) => !workServ.ramFullyUsed)) {
        for (const targetServ of primaryTargets) {
          if (targetServ.prepInProgress && targetServ.prepFinishTime < Date.now()) {
            targetServ.prepInProgress = false;
          }

          while (
            !targetServ.prepInProgress &&
            !targetServ.prepped &&
            config.workerServers.some((workServ) => !workServ.ramFullyUsed)
          ) {
            const prepStatus = await prep(targetServ);
            await ns.sleep(10);
          }
        }
      } else {
        for (const workServ of config.workerServers) {
          if (workServ.ramFreeAt < Date.now()) {
            workServ.ramFreeAt = null;
            workServ.ramFullyUsed = false;
          }
        }
      }

      port.clear(); // TODO - Implement ports properly somewhere - this clear stops workers from stagnating
      await ns.sleep(10); // Not everything is prepped
    }
  }

  async function buildBatch(target, targetStats) {
    config = JSON.parse(ns.read('proto/config.json'));
    config.workerServers.forEach((workerServ) => {
      workerServ.allocatedRam = 0;
      workerServ.ramFullyUsed = false;
    });

    const batches = [];
    const statsToUse = targetStats;

    for (const workerServ of config.workerServers) {
      const files = ['proto/hack.js', 'proto/weaken.js', 'proto/grow.js'];
      ns.scp(files, workerServ.name);

      let serverAvailableRam = ns.getServerMaxRam(workerServ.name) - workerServ.allocatedRam;
      if (workerServ.name == 'home') {
        serverAvailableRam -= 16;
      }

      let batchCount = Math.floor(serverAvailableRam / statsToUse.batchRam);
      if (workerServ.name == 'home') {
        batchCount--;
      }

      if (batchCount < 1) {
        workerServ.ramFullyUsed = true;
        continue;
      }

      if (
        debugScript &&
        (statsToUse.targetHackThreads == -1 ||
          statsToUse.targetWeakenThreadsRequired == -1 ||
          statsToUse.targetGrowThreads == -1 ||
          statsToUse.targetWeaken2ThreadsRequired == -1)
      ) {
        debugger;
        ns.print(`DEBUG - One or more threads were set to -1`);
        const debugOutput = {
          DebugOutputTime: new Date(Date.now()).toLocaleTimeString(),
          Target: target.name,
          TargetStatus: {
            Money: statsToUse.targetMoney,
            Security: statsToUse.targetSec,
          },
          Worker: workerServ,
          WorkerRamAvailable: serverAvailableRam,
          BatchCount: batchCount,
          Hack: {
            targetMaxMoney: statsToUse.targetMaxMoney,
            targetHack: statsToUse.targetHack,
            targetHackThreads: statsToUse.targetHackThreads,
            targetHackSecurityIncrease: statsToUse.targetHackSecurityIncrease,
            targetHackTime: statsToUse.targetHackTime,
            targetHackRamNeeded: statsToUse.targetHackRamNeeded,
          },
          Weaken: {
            targetMinSec: statsToUse.targetMinSec,
            targetWeakenSingleThread: statsToUse.targetWeakenSingleThread,
            targetWeakenThreadsRequired: statsToUse.targetWeakenThreadsRequired,
            targetWeakenTime: statsToUse.targetWeakenTime,
            targetWeakenRamNeeded: statsToUse.targetWeakenRamNeeded,
          },
          Grow: {
            targetGrowThreads: statsToUse.targetGrowThreads,
            targetGrowSecurityIncrease: statsToUse.targetGrowSecurityIncrease,
            targetGrowTime: statsToUse.targetGrowTime,
            targetGrowRamNeeded: statsToUse.targetGrowRamNeeded,
          },
          Weaken2: {
            targetWeaken2ThreadsRequired: statsToUse.targetWeaken2ThreadsRequired,
            targetWeaken2RamNeeded: statsToUse.targetWeaken2RamNeeded,
          },
          Buffers: {
            buffer: statsToUse.buffer,
            hackTimeDelay: statsToUse.hackTimeDelay,
            growTimeDelay: statsToUse.growTimeDelay,
            weaken2TimeDelay: statsToUse.weaken2TimeDelay,
            batchTime: statsToUse.batchTime,
            batchRam: statsToUse.batchRam,
          },
          Batches: batches,
          PreviousBatches: previousBatches,
        };
        ns.write('./debugOuput.json', JSON.stringify(debugOutput, null, 2), 'w');
        ns.exit();
      }

      workerServ.allocatedRam += batchCount * statsToUse.batchRam;

      batches.push({
        workerServ: workerServ.name,
        batchCount: batchCount,
        minimal: statsToUse.minimal,
        hackThreads: statsToUse.targetHackThreads, // * batchCount,
        hackDelay: statsToUse.hackTimeDelay,
        weakenThreads: statsToUse.targetWeakenThreadsRequired, // * batchCount,
        weakenDelay: statsToUse.targetWeakenTime,
        growThreads: statsToUse.targetGrowThreads, // * batchCount,
        growDelay: statsToUse.growTimeDelay,
        weaken2Threads: statsToUse.targetWeaken2ThreadsRequired,
        weaken2Delay: statsToUse.weaken2TimeDelay,
        statsToUse: statsToUse, // DEBUG - Remove this after debugging issues
      });
    }

    previousBatches = batches;

    return {
      targetServ: target.name,
      batchTime: targetStats.batchTime,
      batches: batches,
    };
  }

  async function getNextBatch(target) {
    const result = await buildBatch(target, getServerStats(target.name));
    if (!result || !result.targetServ) {
      debugger;
      ns.print('BATCH - Target not ready, retrying');
      return null;
    }
    return result;
  }

  async function launchBatch(batches, prep = false) {
    ns.print(`BATCH - Firing batch at ${batches.targetServ} across ${batches.batches.length} servers`);
    let batchesFired = 0;

    const start = performance.now();
    for (const entry of batches.batches) {
      let H1 = 5;
      let W1 = 5;
      let G1 = 5;
      let W2 = 5;

      if (!prep) {
        H1 = ns.exec(
          './hack.js',
          entry.workerServ,
          { threads: entry.hackThreads, temporary: true },
          batches.targetServ,
          entry.hackDelay,
        );
      }
      W1 = ns.exec(
        './weaken.js',
        entry.workerServ,
        { threads: entry.weakenThreads, temporary: true },
        batches.targetServ,
        0,
      );
      G1 = ns.exec(
        './grow.js',
        entry.workerServ,
        { threads: entry.growThreads, temporary: true },
        batches.targetServ,
        entry.growDelay,
      );
      W2 = ns.exec(
        './weaken.js',
        entry.workerServ,
        { threads: entry.weaken2Threads, temporary: true },
        batches.targetServ,
        entry.weaken2Delay,
      );
      batchesFired++;
      if (batchesFired >= 5) {
        break;
      } //await ns.sleep(0); batchesFired = 0; }
      if (Math.min(H1, W1, G1, W2) === 0) {
        ns.print(`\n\nDEBUG - One or more of the script executions failed`);
        ns.print(`H1: ${H1}\nW1: ${W1}\nG1: ${G1}\nW2: ${W2}`);
        ns.write('./batchDebug.json', JSON.stringify(entry, null, 2), 'w');
        ns.exit();
      }
    }
    const end = performance.now();
    ns.print(`DEBUG - launchBatch performance diff: ${end - start}ms`);

    const attackFinishTime = Date.now() + batches.batchTime + 1000;
    ns.print(`BATCH - ${batches.targetServ} batch completes at ${new Date(attackFinishTime).toLocaleTimeString()}`);
    return batches.batchTime + 1000;
  }

  ns.print(`PREP - Prepping servers`);
  await prepCheck();
  ns.print('PREP - Everything prepped, building batch array\n ');
  let cycleCounter = 0;

  while (true) {
    //debugger;
    for (const target of primaryTargets) {
      // while (port.peek() !== "NULL PORT DATA") {
      //     debugger;
      //     const msg = JSON.parse(port.read());
      //     ns.write("./portLog.json", `${JSON.stringify(msg)},\n`, "a");
      // }
      if (target.attackFinishTime < Date.now()) {
        ns.print(`DEBUG - Player hack level: ${ns.getHackingLevel()}`);
        //if (target.batch) { target.batch = await getNextBatch(target); }
        const start = performance.now();
        target.batch = await getNextBatch(target);
        const end = performance.now();
        ns.print(`DEBUG - buildBatch performance diff: ${end - start}ms`);
        //// DEBUG
        const targetMoney = ns.getServerMoneyAvailable(target.name);
        const targetMaxMoney = ns.getServerMaxMoney(target.name);
        const targetSec = ns.getServerSecurityLevel(target.name);
        const targetMinSec = ns.getServerMinSecurityLevel(target.name);
        ns.print(`DEBUG - Stats pre-attack`);
        ns.print(`DEBUG - Player hack level: ${ns.getHackingLevel()}`);
        ns.print(`DEBUG - Money: ${ns.format.number(targetMoney, 2)}/${ns.format.number(targetMaxMoney, 2)}`);
        ns.print(`DEBUG - Security: ${ns.format.number(targetSec, 2)}/${ns.format.number(targetMinSec, 2)}`);
        if (targetMoney != targetMaxMoney || targetSec != targetMinSec) {
          ns.print(`DEBUG - Target unprepped, exiting`);
          ns.exit();
        }
        //// DEBUG
        //ns.exit();
        target.attackFinishTime = (await launchBatch(target.batch)) + Date.now();
        //target.batch = await getNextBatch(target);
        cycleCounter++;
        ns.print(`DEBUG - Cycle count: ${cycleCounter}\n `);
      }

      // else {
      //     let samples = [];
      //     const windowStart = target.attackFinishTime - 3;
      //     const windowEnd = target.attackFinishTime + 3;
      //     ns.print(`DEBUG - Capturing data`);
      //     while (windowEnd > Date.now()) {
      //         if (windowStart > Date.now() ) {
      //             debugger;
      //             samples.push({
      //                 t: performance.now(),
      //                 money: ns.getServerMoneyAvailable(target.name),
      //                 sec: ns.getServerSecurityLevel(target.name),
      //                 myHackLevel: ns.getHackingLevel()
      //             });
      //         }
      //         await ns.asleep(0);
      //     }
      //     ns.write("./diag_log.txt", JSON.stringify(samples, null, 2), "w");
      //     ns.print(`DEBUG - Data captured`);
      //     //ns.exit();
      // }
    }

    await ns.sleep(1000);
  }

  ns.print('Controller stopping'); // This should never, ever, be reached
}

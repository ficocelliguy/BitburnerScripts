from utils import getAllServers

async def main(ns):
  setup(ns)
  getAllServers(ns)
  while [1]:
    await launchBatch(ns, "n00dles", 4, 1)
    
    
async def launchBatch(ns, target, hackThreads, growThreads):
  weakenThreads1 = Math.ceil(hackThreads * (0.002 / 0.05))
  weakenThreads2 = Math.ceil(growThreads * (0.004 / 0.05))
  hackScriptSize = ns.getScriptRam("batch/crack.py")
  growScriptSize = ns.getScriptRam("batch/grow.py")
  weakenScriptSize = ns.getScriptRam("batch/weaken.py")
  batchSize = hackScriptSize * hackThreads + (weakenThreads1 + weakenThreads2) * weakenScriptSize + growThreads * growScriptSize
  hackDelay = ns.getWeakenTime(target) - ns.getHackTime(target)
  growDelay = ns.getWeakenTime(target) - ns.getGrowTime(target)

  shouldLaunchHack = ns.getServerMoneyAvailable(target) / ns.getServerMaxMoney(target) > 0.95
  shouldLaunchGrow = ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target) < 5
  serverList = getAllServers(ns)
  for server in serverList:
    if !nuke(ns, server):
      continue

    freeRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server)
    batchCount = Math.floor(freeRam / batchSize)

    for i in range(batchCount):
      ns.scp(["batch/crack.py","batch/grow.py","batch/weaken.py"], server)
      if shouldLaunchHack:
        ns.exec("batch/crack.py", server, {"threads": hackThreads, "temporary": True}, target, hackDelay)
      ns.exec("batch/weaken.py", server, {"threads": weakenThreads1, "temporary": True}, target)
      if shouldLaunchGrow:
        ns.exec("batch/grow.py", server, {"threads": growThreads, "temporary": True}, target, growDelay)
      ns.exec("batch/weaken.py", server, {"threads": weakenThreads2, "temporary": True}, target)
      if i % 100 == 0:
        await ns.sleep(10)
  
  await ns.sleep(ns.getWeakenTime(target) / 2)
  
  
def nuke(ns, server):
  ns.brutessh(server)
  ns.httpworm(server)
  ns.ftpcrack(server)
  ns.relaysmtp(server)
  ns.sqlinject(server)
  return ns.nuke(server)

def setup(ns):
  ns.disableLog("scp")
  ns.disableLog("scan")
  ns.disableLog("brutessh")
  ns.disableLog("httpworm")
  ns.disableLog("ftpcrack")
  ns.disableLog("relaysmtp")
  ns.disableLog("sqlinject")
  ns.disableLog("nuke")
  ns.disableLog("getServerMaxRam")
  ns.disableLog("getServerUsedRam")


async def main(ns):
    ns.disableLog("ALL")
    target = ns.args[0]
    await ns.weaken(target)
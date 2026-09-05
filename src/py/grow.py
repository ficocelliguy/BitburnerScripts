async def main(ns):
    ns.disableLog("ALL")
    target = ns.args[0]
    delay = ns.args[1]
    await ns.grow(target, { "additionalMsec": delay })
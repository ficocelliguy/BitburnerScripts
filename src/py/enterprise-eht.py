# Over-engineered RapydScript hacking script — Python features on parade

class HackAction:
    """Enum-like action namespace."""
    WEAKEN = 'weaken'
    GROW   = 'grow'
    HACK   = 'hack'

    @staticmethod
    def all():
        return [HackAction.WEAKEN, HackAction.GROW, HackAction.HACK]


class ServerConfig:
    """Data-class-style target config with property + fluent builder."""

    def __init__(self, name, money_factor=1.0, sec_buffer=0.0):
        self._name        = name
        self.money_factor = money_factor
        self.sec_buffer   = sec_buffer
        self._tags        = {'auto', 'hack'}        # set literal

    @property
    def name(self):
        return self._name

    def __repr__(self):
        return "ServerConfig(name={}, tags={})".format(
            repr(self._name), sorted(list(self._tags))
        )

    def add_tags(self, *tags):                      # *args + fluent return
        for t in tags:
            self._tags.add(t)
        return self


def decide_action(ns, target, money_thresh, sec_thresh):
    """next() + generator expression to pick highest-priority action."""
    checks = [
        (ns.getServerSecurityLevel(target)  > sec_thresh,   HackAction.WEAKEN),
        (ns.getServerMoneyAvailable(target) < money_thresh, HackAction.GROW),
    ]
    return next((action for cond, action in checks if cond), HackAction.HACK)


async def breach(ns, target, exploits):
    """Apply available exploits via (exe, fn) tuple list, nuke, return summary."""
    # list of (exe filename, bound ns method) tuples
    exe_methods = [
        ('BruteSSH.exe',  ns.brutessh),
        ('FTPCrack.exe',  ns.ftpcrack),
        ('relaySMTP.exe', ns.relaysmtp),
    ]
    applied = [fn for exe, fn in exe_methods if ns.fileExists(exe, "home")]
    missing = [exe for exe, fn in exe_methods if not ns.fileExists(exe, "home")]

    if missing:
        ns.tprint("Missing: {}".format(', '.join(missing)))

    for fn in applied:
        fn(target)
    ns.nuke(target)

    return {'applied': len(applied), 'total': len(exploits),
            'rooted': ns.hasRootAccess(target)}


async def main(ns):
    config = ServerConfig("n00dles").add_tags('target', 'beginner')  # fluent
    ns.tprint(repr(config))                                           # __repr__

    target       = config.name                                        # @property
    money_thresh = ns.getServerMaxMoney(target)         * config.money_factor
    sec_thresh   = ns.getServerMinSecurityLevel(target) + config.sec_buffer

    def by_name_len(p):                             # named key fn (required for
        return len(p[0])                            # anonymous fns in call args)
    exploits = sorted([
        ('brutessh',  'BruteSSH.exe'),
        ('ftpcrack',  'FTPCrack.exe'),
        ('relaysmtp', 'relaySMTP.exe'),
    ], key=by_name_len)

    result = await breach(ns, target, exploits)
    ns.tprint("Breach: {applied}/{total} applied, rooted={rooted}".format(**result))
    assert result['rooted'], "Root access denied on {}!".format(target)

    dispatch = {                                    # dict literal
        'weaken': ns.weaken,
        'grow':   ns.grow,
        'hack':   ns.hack,
    }
    stats = {a: 0 for a in HackAction.all()}        # dict comprehension

    cycle = 0
    while True:
        cycle += 1
        action = decide_action(ns, target, money_thresh, sec_thresh)
        stats[action] += 1

        if cycle % 10 is 0:                         # periodic summary
            counts  = [stats[a] for a in HackAction.all()]
            summary = ', '.join(["{}: {}".format(a, v)
                                 for a, v in zip(HackAction.all(), counts)])
            ns.tprint("Cycle {} | {}  any={} all={}".format(
                cycle, summary,
                any([v > 0 for v in counts]),       # any()
                all([v > 0 for v in counts])        # all()
            ))

        await dispatch[action](target)
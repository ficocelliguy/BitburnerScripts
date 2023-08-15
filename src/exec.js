/** @param {NS} ns */
export async function main(ns) {
  const script = ns.args[0] || '';
  const target = ns.args[1] || '';
  const scriptSize = ns.getScriptRam(script);

  if (!scriptSize) {
    throw new Error('Script ' + script + ' not found');
  }

  deployDistributedThreads(ns, script, target);

  // hang around just to allow stats to be logged
  while (true) {
    await ns.sleep(99999999);
  }
}

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
const deployDistributedThreads = (ns, scriptName, target) => {
  const scriptSize = ns.getScriptRam(scriptName);

  const availableNodes = getAvailableRamOnServers(ns);
  availableNodes.forEach((node) => {
    const maxThreads = Math.floor(node.ram / scriptSize);
    if (maxThreads <= 0) {
      return;
    }

    ns.scp(scriptName, node.id);
    ns.exec(scriptName, node.id, maxThreads, target);
  });
};

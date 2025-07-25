import { AutocompleteData, NS } from '@ns';

export function autocomplete(data: AutocompleteData) {
  return [...data.scripts, '--tail'];
}

export async function main(ns: NS) {
  const script = `${ns.args[0]}`;
  const target = `${ns.args[1]}`;
  const scriptSize = ns.getScriptRam(`${script}`);

  if (!scriptSize) {
    throw new Error('Script ' + script + ' not found');
  }

  deployDistributedThreads(ns, script, target);

  // hang around just to allow stats to be logged
  while (true) {
    await ns.sleep(99999999);
  }
}

export const getServers = (ns: NS) => {
  const dynamicServers = ns.scan('home').filter((server) => server !== 'darkweb');
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

const getAvailableRamOnServers = (ns: NS) => {
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

const deployDistributedThreads = (ns: NS, scriptName: string, target: string) => {
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

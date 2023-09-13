import { NS } from '@ns';

export function autocomplete() {
  return ['--tail'];
}

/** @param {NS} ns */
export async function main(ns: NS) {
  const servers = ['CSEC', 'avmnite-02h', 'I.I.I.I', 'run4theh111z', 'w0r1d_d43m0n'];
  for (const i in servers) {
    const server = servers[i];
    const serverInfo = ns.getServer(server);
    await connect(ns, server);
    if (!serverInfo.hasAdminRights) {
      try {
        ns.brutessh(server);
      } catch (e) {}
      try {
        ns.ftpcrack(server);
      } catch (e) {}
      try {
        ns.relaysmtp(server);
      } catch (e) {}
      try {
        ns.httpworm(server);
      } catch (e) {}
      try {
        ns.sqlinject(server);
      } catch (e) {}
      try {
        ns.nuke(server);
      } catch (e) {}
    }

    try {
      !serverInfo.backdoorInstalled && (await ns.singularity.installBackdoor());
    } catch (e) {}

    ns.singularity.connect('home');
  }

  for (const i in servers) {
    const server = servers[i];
    const serverInfo = ns.getServer(server);
    ns.tprint(
      ` (${serverInfo.requiredHackingSkill}) ${server} Admin: ${serverInfo.hasAdminRights ? '✓' : 'NO'} Backdoor: ${
        serverInfo.backdoorInstalled ? '✓' : 'NO'
      }`,
    );
  }
}

interface connectionTree {
  id: string;
  connections: connectionTree[];
}

/** @param {NS} ns */
const updateTreeForNode = async (ns: NS, nodeName: string, tree: connectionTree, scannedNodes: string[]) => {
  const connections = getConnectedNodes(ns, nodeName, scannedNodes);
  for (const index in connections) {
    const node = connections[index];
    ns.print(' Scanning ' + node + ' ...');
    scannedNodes.push(node);
    const nodeObject = {
      id: node,
      connections: [],
    };
    await updateTreeForNode(ns, node, nodeObject, scannedNodes);
    tree.connections.push(nodeObject);
  }
};

/** @param {NS} ns */
const getConnectedNodes = (ns: NS, nodeName: string, scannedNodes: string[]) =>
  ns.scan(nodeName).filter((node) => !~scannedNodes.indexOf(node));

/** @param {NS} ns */
const printNodeTree = (ns: NS, nodeTree: connectionTree, fileName: string, depth = 0) => {
  if (!nodeTree) {
    return;
  }
  const { hasAdminRights, maxRam, numOpenPortsRequired, openPortCount, requiredHackingSkill } = ns.getServer(
    nodeTree.id,
  );

  //{"hostname":"big'un-0","ip":"80.6.5.9","sshPortOpen":true,"ftpPortOpen":true,"smtpPortOpen":true,"httpPortOpen":false,"sqlPortOpen":false,"hasAdminRights":true,"cpuCores":1,"isConnectedTo":false,"ramUsed":62.4,"maxRam":64,"organizationName":"","purchasedByPlayer":true,"backdoorInstalled":false,"baseDifficulty":1,"hackDifficulty":1,"minDifficulty":1,"moneyAvailable":0,"moneyMax":0,"numOpenPortsRequired":5,"openPortCount":3,"requiredHackingSkill":1,"serverGrowth":1}
  const portDetails =
    (numOpenPortsRequired ?? 0) > (openPortCount ?? 0) ? `${openPortCount}/${numOpenPortsRequired}` : '✓';
  const root = hasAdminRights ? 'YES' : 'NO';

  const infoString = `${'  '.repeat(depth)} ┣  ${
    nodeTree.id
  }    Hack: ${requiredHackingSkill}  Ports: ${portDetails}  Root: ${root}  RAM: ${maxRam}`;
  ns.print(infoString);
  ns.write(fileName, `${infoString}\r\n`);
  nodeTree.connections.forEach((nodeSubTree) => {
    printNodeTree(ns, nodeSubTree, fileName, depth + 1);
  });
};

/** @param {NS} ns */
const connect = async (ns: NS, target: string) => {
  const scannedNodes = ['home'];
  const tree: connectionTree = {
    id: 'home',
    connections: [],
  };

  await updateTreeForNode(ns, 'home', tree, scannedNodes);

  const path = getConnectionPath(ns, target, tree);
  path.forEach((node) => ns.singularity.connect(node));
};

/**
 *
 * @param {NS} ns
 * @param target
 * @param nodeTree
 * @param connectionPath
 * @return string
 */
const getConnectionPath: (ns: NS, target: string, nodeTree: connectionTree, connectionPath?: string[]) => string[] = (
  ns: NS,
  target: string,
  nodeTree: connectionTree,
  connectionPath: string[] = [],
) => {
  if (nodeTree.id === target) {
    return [target];
  }

  for (const index in nodeTree.connections) {
    const connection = getConnectionPath(ns, target, nodeTree.connections[index], connectionPath);
    if (connection.length) {
      connection.unshift(nodeTree.id);
      return connection;
    }
  }

  return [];
};

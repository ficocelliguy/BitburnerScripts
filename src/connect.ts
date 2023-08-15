import { NS } from '@ns';

interface connectionTree {
  id: string;
  connections: connectionTree[];
}

/** @param {NS} ns */
export async function main(ns: NS) {
  const targetNode = `${ns.args[0]}` || '';
  const FILE_NAME = 'nodeTree.txt';
  const scannedNodes = ['home'];
  const tree: connectionTree = {
    id: 'home',
    connections: [],
  };

  await updateTreeForNode(ns, 'home', tree, scannedNodes);

  ns.write(FILE_NAME, '', 'w');
  printNodeTree(ns, tree, FILE_NAME);

  if (targetNode) {
    const connectionString = findConnectionString(ns, targetNode, tree);
    await navigator.clipboard.writeText(connectionString);
    ns.print(connectionString);
  }
}

/** @param {NS} ns */
const updateTreeForNode = async (ns: NS, nodeName: string, tree: connectionTree, scannedNodes: string[]) => {
  await ns.sleep(10);
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
    numOpenPortsRequired && openPortCount && numOpenPortsRequired > openPortCount
      ? `${openPortCount}/${numOpenPortsRequired}`
      : '✓';
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

/**
 *
 * @param {NS} ns
 * @param target
 * @param nodeTree
 * @param connectionString
 * @return string
 */
const findConnectionString: (ns: NS, target: string, nodeTree: connectionTree, connectionString?: string) => string = (
  ns: NS,
  target: string,
  nodeTree: connectionTree,
  connectionString = '',
) => {
  if (nodeTree.id === target) {
    return `connect ${nodeTree.id}; ${connectionString}; backdoor;`;
  }

  for (const index in nodeTree.connections) {
    const connection = findConnectionString(ns, target, nodeTree.connections[index], connectionString);
    if (connection) {
      return `connect ${nodeTree.id}; ${connection} ${connectionString}`;
    }
  }

  return '';
};

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog('ALL');
  const scannedNodes = ['home'];
  const tree = {
    id: 'home',
    connections: [],
  };

  await updateTreeForNode(ns, 'home', tree, scannedNodes);
}

/** @param {NS} ns */
const updateTreeForNode = async (ns, nodeName, tree, scannedNodes) => {
  await ns.sleep(10);
  const connections = getConnectedNodes(ns, nodeName, scannedNodes);
  for (const index in connections) {
    const node = connections[index];
    //ns.print(" Scanning " + node + " ...")
    scannedNodes.push(node);
    const nodeObject = {
      id: node,
      connections: [],
    };

    const files = ns
      .ls(node)
      .filter((file) => file.indexOf('.cct') !== -1)
      .map((file) => ({
        filename: file,
        data: ns.codingcontract.getData(file, node),
        type: ns.codingcontract.getContractType(file, node),
        description: ns.codingcontract.getDescription(file, node),
      }));

    files.forEach((file) => {
      ns.print('   ---------------------   ');
      ns.print(node + ' : ' + file.filename);
      ns.print('Type: ' + file.type);
      ns.print('Description: ' + file.description);
      ns.print('Data: ' + file.data);
    });

    await updateTreeForNode(ns, node, nodeObject, scannedNodes);
    tree.connections.push(nodeObject);
  }
};

/** @param {NS} ns */
const getConnectedNodes = (ns, nodeName, scannedNodes) =>
  ns.scan(nodeName).filter((node) => !~scannedNodes.indexOf(node));

/** @param {NS} ns */
const printNodeTree = (ns, nodeTree, fileName, depth = 0) => {
  if (!nodeTree) {
    return;
  }
  const info = ns.getServer(nodeTree.id);

  //{"hostname":"big'un-0","ip":"80.6.5.9","sshPortOpen":true,"ftpPortOpen":true,"smtpPortOpen":true,"httpPortOpen":false,"sqlPortOpen":false,"hasAdminRights":true,"cpuCores":1,"isConnectedTo":false,"ramUsed":62.4,"maxRam":64,"organizationName":"","purchasedByPlayer":true,"backdoorInstalled":false,"baseDifficulty":1,"hackDifficulty":1,"minDifficulty":1,"moneyAvailable":0,"moneyMax":0,"numOpenPortsRequired":5,"openPortCount":3,"requiredHackingSkill":1,"serverGrowth":1}
  const portDetails =
    info.numOpenPortsRequired > info.openPortCount ? `${info.openPortCount}/${info.numOpenPortsRequired}` : '✓';
  const root = info.hasAdminRights ? 'YES' : 'NO';

  const infoString = `${'  '.repeat(depth)} ┣  ${nodeTree.id}    Hack: ${
    info.requiredHackingSkill
  }  Ports: ${portDetails}  Root: ${root}  RAM: ${info.maxRam}`;
  ns.print(infoString);
  ns.write(fileName, `${infoString}\r\n`);
  nodeTree.connections.forEach((nodeSubTree) => {
    printNodeTree(ns, nodeSubTree, fileName, depth + 1);
  });
};

const findConnectionString = (ns, target, nodeTree, connectionString = '') => {
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

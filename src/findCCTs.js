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

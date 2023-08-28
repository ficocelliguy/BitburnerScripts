const FILENAME = 'cctLog.txt';

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog('ALL');
  const scannedNodes = ['home'];
  const tree = {
    id: 'home',
    connections: [],
  };

  ns.write(FILENAME, '', 'w');

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

      ns.write(FILENAME, `\r\n\r\n\r\n --------------------- \r\n\r\n`);
      ns.write(FILENAME, node + ' : ' + file.filename + `\r\n`);
      ns.write(FILENAME, 'Type: ' + file.type + `\r\n`);
      ns.write(FILENAME, 'Description: ' + file.description + `\r\n`);
      ns.write(FILENAME, 'Data: ' + ('' + file.data).replaceAll('&nbsp;', ' ') + `\r\n`);

      if (file.type === 'Sanitize Parentheses in Expression') {
        solveSanitizeParens('' + file.data);
      }
    });

    await updateTreeForNode(ns, node, nodeObject, scannedNodes);
    tree.connections.push(nodeObject);
  }
};

/** @param {NS} ns */
const getConnectedNodes = (ns, nodeName, scannedNodes) =>
  ns.scan(nodeName).filter((node) => !~scannedNodes.indexOf(node));

/**
 * Description: Given the following string:
 *
 *  ))aa(()
 *
 *  remove the minimum number of invalid parentheses in order to validate the string. If there are multiple minimal ways to validate the string, provide all of the possible results. The answer should be provided as an array of strings. If it is impossible to validate the string the result should be an array with only an empty string.
 *
 *  IMPORTANT: The string may contain letters, not just parentheses. Examples:
 *  "()())()" -> ["()()()", "(())()"]
 *  "(a)())()" -> ["(a)()()", "(a())()"]
 *  ")(" -> [""]
 *
 * @param {string} data
 */
const solveSanitizeParens = (data) => {
  // TODO: make this actually work
  // TODO: use API to submit answer

  const dataArray = data.split('');

  const validate = (data) => {
    let unmatchedParenPairs = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data[i];

      if (char === '(') {
        unmatchedParenPairs++;
      } else if (char === ')') {
        unmatchedParenPairs--;
      }
      if (unmatchedParenPairs < 0) {
        return false;
      }
    }

    return unmatchedParenPairs === 0;
  };

  validate('()())()');
};
/*
  ()())()


  * Every close paren must have a preceding open paren for itself and every close paren that comes before it
    * the number of close parens before a given close paren should be less than the number of open parens before it

  * There must be an equal number of "(" and ")"

 */

console.log(solveSanitizeParens('()())()'));
console.log(solveSanitizeParens('(a)())()'));
console.log(solveSanitizeParens(')('));

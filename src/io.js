/** @param {NS} ns */
export async function main(ns) {
  if (!ns.getStdin()) {
    return ns.tprint('ERROR: No piped input given');
  }
  await onRead(ns, (data) => ns.tprint(data));
}

/** @param {NS} ns */
async function read(ns) {
  const stdIn = ns.getStdin();
  if (stdIn.empty()) {
    await stdIn.nextWrite();
  }
  return stdIn.read();
}

/**
 * Each time that data comes in through stdin, call callback with it as input, until stdin is closed
 * @param {function (string): void} callback
 * @param {NS} ns
 */
async function onRead(ns, callback) {
  let input;
  do {
    input = await read(ns);
    if (input !== null) {
      callback(input);
    }
  } while (input !== null);
}

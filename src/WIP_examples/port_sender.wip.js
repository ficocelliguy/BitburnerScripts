/*
            **  Data Transfer Protocol RFC 1149  **
                (c) 2069 Helios Labs / jump3r

           See port_receiver.wip.js for full details.
 */

import { DATA_PORT, colorText } from './port_receiver.wip.js';

/** @param {NS} ns */
export async function main(ns) {
  ns.ui.openTail();
  ns.ui.moveTail(600, 80);

  if (!receiverScriptIsRunning(ns)) {
    ns.print(colorText('Starting data receiver script...', '#8855FF'));
    ns.run('port_receiver.wip.js');
    await ns.sleep(10); // let go of the thread so the other script can actually start
  }

  const serverToAnalyze = ns.args[0] ?? 'n00dles';
  const serverData = ns.getServer(serverToAnalyze);

  ns.print(`Analyzed server ${serverToAnalyze}`);
  ns.print(colorText(`Sending server data over port ${DATA_PORT}`, '#8855FF'));
  ns.writePort(DATA_PORT, serverData);
}

/** @param {NS} ns */
function receiverScriptIsRunning(ns) {
  const runningScripts = ns.ps();
  return runningScripts.find((script) => script.filename === 'port_receiver.wip.js');
}

/** @param {NS} ns */
export async function main(ns) {
  ns.ui.openTail();
  const location = "Joe's Guns";
  ns.singularity.goToLocation(location);
  const result = ns.infiltration.startInfiltration(location);

  if (!result.success) {
    ns.tprint('Infiltration failed: ' + result.message);
    return;
  }

  while (true) {
    await waitForCountdown(ns);
    let status = ns.infiltration.getState();
    if (!status) {
      return;
    }
    await ns.infiltration.pressKey('ArrowUp');
    status = ns.infiltration.getState();
    debugger;

    await ns.sleep(1000);
  }
}

const waitForCountdown = async (ns) => {
  while (ns.infiltration.getState()?.stage === 'countdown') {
    await ns.sleep(300);
  }
};

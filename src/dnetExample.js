/** @param {NS} ns */
export async function main(ns) {
  while (true) {
    // Get a list of all darknet hostnames directly connected to the current server
    const nearbyServers = ns.dnet.probe();

    // Attempt to authenticate with each of the nearby servers, and spread this script to them
    for (const hostname of nearbyServers) {
      const authenticationSuccessful = await serverSolver(ns, hostname);
      if (!authenticationSuccessful) {
        continue; // If we failed to auth, just move on to the next server
      }

      // If we have successfully authenticated, we can now copy and run this script on the target server
      ns.scp(ns.getScriptName(), hostname);
      ns.exec(ns.getScriptName(), hostname, {
        preventDuplicates: true, // This prevents running multiple copies of this script
      });
    }

    // TODO: free up blocked ram on this server using ns.dnet.memoryReallocation

    // TODO: look for .cache files on this server and open them with ns.dnet.openCache

    // TODO: take advantage of the extra ram on darknet servers to run ns.dnet.phishingAttack calls for money

    await ns.sleep(5000);
  }
}

/** Attempts to authenticate with the specified server using the Darknet API.
 * @param {NS} ns
 * @param {string} hostname - the name of the server to attempt to authorize on
 */
export const serverSolver = async (ns, hostname) => {
  // Get key info about the server, so we know what kind it is and how to authenticate with it
  const details = ns.dnet.getServerAuthDetails(hostname);
  if (!details.isConnectedToCurrentServer || !details.isOnline) {
    // If the server isn't connected or is offline, we can't authenticate
    return false;
  }

  switch (details.modelId) {
    case 'ZeroLogon':
      return authenticateWithNoPassword(ns, hostname);

    // TODO: handle other models of darknet servers here

    default:
      ns.tprint(`Unrecognized modelId: ${details.modelId}`);
      return false;
  }
};

/** Authenticates on 'ZeroLogon' type servers, which always have an empty password.
 *  @param {NS} ns
 * @param {string} hostname - the name of the server to attempt to authorize on
 */
const authenticateWithNoPassword = async (ns, hostname) => {
  const result = await ns.dnet.authenticate(hostname, '');
  // TODO: store discovered passwords somewhere safe, in case we need them later
  return result.success;
};

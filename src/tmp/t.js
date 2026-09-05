/** @param {NS} ns */
export async function main(ns) {
  //EVIL
  const dnet = ns.dnet;
  for (let i of dnet.probe()) {
    ns.tprint(i);
    ns.tprint(dnet.getServerDetails(i));
    ns.tprint(await ns.dnet.authenticate(i, solve(dnet.getServerDetails(i))));
  }
}

/** @param {NS} ns */
function scanAll(ns) {
  let servers = ["home"];
  for (const server of servers) {
    let scans = ns.scan(server.hostname);
    for (const scan of scans) {
      let newServer = scan;
      if (!servers.includes(newServer)) {
        servers.push(newServer);
      }
    }
  }
  return servers;
}
/** @param {NS} ns */
export async function main(ns) {
  const files = ns.ls(ns.getServer().hostname, '.cache');
  for (const file of files) {
    ns.dnet.openCache(file);
    ns.toast(`Opened cache file: ${file}`, 'info', 3000);
  }
}

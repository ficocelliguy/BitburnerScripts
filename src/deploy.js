/** @param {NS} ns */
export async function main(ns) {
  ns.scp('dn_clear.js', 'darkweb');
  ns.scp('dn_core.js', 'darkweb');
  ns.scp('dn_phish.js', 'darkweb');
  ns.scp('dn_cache.js', 'darkweb');
  ns.scp('dn_stasis.js', 'darkweb');
  ns.exec('dn_core.js', 'darkweb', { temporary: true });
}

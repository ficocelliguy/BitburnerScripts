/** @param {NS} ns */
export async function main(ns) {
  ns.write('error1.js', `export async function main(ns) { ns.fakeAccessor() }`, 'w');
  ns.write('error2.js', `export async function main(ns) { ns.hack('n00dles');ns.hack('n00dles') }`, 'w');
  ns.write('error3.js', `export async function main(ns) { throw new Error("Hello World!") }`, 'w');
  ns.write('error4.js', `export async function main(ns) { ns.scan(true) }`, 'w');

  ns.run('error1.js');
  await ns.sleep(0);
  ns.run('error2.js');
  await ns.sleep(0);
  ns.run('error3.js');
  await ns.sleep(0);
  ns.run('error4.js');
  await ns.sleep(100);
  for (const server of ns.scan()) {
    ns.scp([ns.getScriptName(), 'error1.js', 'error2.js', 'error3.js', 'error4.js'], server);
    ns.exec(ns.getScriptName(), server, { preventDuplicates: true, threads: 1 });
  }
  await ns.sleep(10000);
}

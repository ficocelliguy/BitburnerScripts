export async function main(ns) {
  const fragment = ns.stanek.activeFragments().find((f) => f.limit === 1);
  ns.print(fragment);

  while (true) {
    await ns.stanek.chargeFragment(fragment.x, fragment.y);
  }
}

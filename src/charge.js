export async function main(ns) {
  const fragments = ns.stanek.activeFragments().filter((f) => f.limit === 1);
  ns.print(fragments);

  while (true) {
    for (const fragment of fragments) {
      await ns.stanek.chargeFragment(fragment.x, fragment.y);
    }
  }
}

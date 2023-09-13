import { ActiveFragment, AutocompleteData, NS } from '@ns';

export function autocomplete(data: AutocompleteData) {
  return [...data.servers, '--tail'];
}

export async function main(ns: NS) {
  const fragments = ns.stanek.activeFragments().filter(
    (f: ActiveFragment) =>
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      f.limit === 1,
  );
  ns.print(fragments);

  if (!fragments.length) {
    return;
  }

  while (true) {
    for (const fragment of fragments) {
      await ns.stanek.chargeFragment(fragment.x, fragment.y);
    }
  }
}

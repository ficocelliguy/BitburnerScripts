const TITLE_TAG = 'h4';
const SUBTITLE_TAG = 'h5';

/** @param {NS} ns */
export async function main(ns) {
  const doc = ns['document'];

  const title = getGameTitle(ns);

  if (contains(title, 'Match the symbols')) {
    playMatchSymbols(ns);
  } else if (contains(title, 'M')) {
  }
}

const playMatchSymbols = async (ns) => {
  ns.print('Match symbols detected ... ');

  const answers = Array.from(ns['document'].querySelectorAll('h5 span')).map((el) => el.innerText.trim());

  const gridItems = Array.from(
    ns['document'].querySelectorAll('* :first-child:nth-last-child(36), div :first-child:nth-last-child(36) ~ *'),
  ).map((node) => node.innerText);

  const grid = [
    gridItems.slice(0, 6),
    gridItems.slice(6, 12),
    gridItems.slice(12, 18),
    gridItems.slice(18, 24),
    gridItems.slice(24, 30),
    gridItems.slice(30, 36),
  ];

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const oddRow = !(i % 2);
      // we go right-to-left on odd rows, to limit extraneous keystrokes
      const rowIndex = oddRow ? grid[i].length - j : j;
      const item = grid[i][rowIndex];

      if (answers.indexOf(item) !== -1) {
        await sendKeyboardEvent(ns, ' ');
        await sendKeyboardEvent(ns, oddRow ? 'ArrowLeft' : 'ArrowRight');
      }
    }
    await sendKeyboardEvent(ns, 'ArrowDown');
  }
};

const sendKeyboardEvent = async (ns, key) => {
  const event = new KeyboardEvent('keydown', { key });
  ns['document'].dispatchEvent(event);
  await ns.sleep(50);
};

const contains = (string1, string2) => string1.indexOf(string2) !== -1;

const getGameTitle = (ns) =>
  Array.from(ns['document'].getElementsByTagName(TITLE_TAG))
    .map((el) => el.innerText)
    .join(' ');

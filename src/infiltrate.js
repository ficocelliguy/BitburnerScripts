/*
  This is a work-in-progress automation of the infiltration minigame.
 */

const TITLE_TAG = 'h4';
//const SUBTITLE_TAG = 'h5';
const TARGET_FACTION = 'Black Hand';

const doc = globalThis['document'];

/** @param {NS} ns */
export async function main(ns) {
  while (true) {
    // Wait for infiltration minigame to be visible
    while (!identifyInfiltration(ns)) {
      await ns.sleep(300);
    }
    ns.print('Infiltration detected!');

    wrapEventListeners();

    let title = getGameTitle(ns);
    while (title) {
      ns.print(`Minigame Detected! ${title}`);
      console.log(`Title detected: ${title}`);

      if (contains(title, 'Match the symbols')) {
        await playMatchSymbols(ns);
      } else if (contains(title, 'Enter the Code')) {
        await playEnterCode(ns);
      } else if (contains(title, 'when his guard is')) {
        await playAttackGuard(ns);
      } else if (contains(title, 'Type it backward')) {
        await playTypeBackwards(ns);
      } else if (contains(title, 'Close the brackets')) {
        await playMatchBrackets(ns);
      } else if (contains(title, 'about the guard')) {
        await playComplimentGuard(ns);
      } else if (contains(title, 'the mines')) {
        await playRememberMines(ns);
      } else if (contains(title, 'Cut the wires')) {
        await playCutWires(ns);
      } else if (contains(title, 'Infiltration successful')) {
        await handleSuccess(ns);
      } else if (contains(title, 'Get Ready')) {
        await ns.sleep(100);
      } else {
        console.log('Minigame not yet implemented');
        await ns.sleep(500);
      }

      await ns.sleep(100);
      title = getGameTitle(ns);
    }

    ns.print('no title detected, ending infiltration');

    unwrapEventListeners();
    await ns.sleep(1000);
  }
}

/** @param {NS} ns */
const handleSuccess = async (ns) => {
  ns.print('Success!');
  await ns.sleep(1000);

  // while (!doc)

  await sendKeyboardEvent(ns, 9);
  await sendKeyboardEvent(ns, 'S');
  await sendKeyboardEvent(ns, 13);
  await sendKeyboardEvent(ns, 9);
  await sendKeyboardEvent(ns, 13);
};

/** @param {NS} ns */
const playCutWires = async (ns) => {
  const instructions = Array.from(doc.querySelectorAll('div > p'))
    .map((n) => n.innerText)
    .filter((text) => text.indexOf('Cut') !== -1)
    .map((text) => text.match(/[0-9]| yellow| red| blue| white/)[0].trim());

  const wireCount = Array.from(doc.querySelectorAll('div > p')).filter((n) => n.innerText.match(/^[0-9]/)).length;

  const wireColors = Array.from(doc.querySelectorAll('div > p'))
    .filter((n) => n.innerText.match(/^\|/))
    .map((n) => n.getAttribute('style').match(/: ([redylowbuhitg]+)/)[1])
    .map((c) => (c === 'rgb' ? 'yellow' : c));

  const wireProperties = [];
  for (let j = 0; j < wireCount; j++) {
    wireProperties.push(wireColors.filter((n, i) => i % 9 === j));
  }

  for (let i = 0; i < wireProperties.length; i++) {
    const wireColors = wireProperties[i];
    const hasMatchingColor = wireColors.find((color) => contains(instructions, color));
    if (hasMatchingColor || contains(instructions, `${i + 1}`)) {
      await sendKeyboardEvent(ns, `${i + 1}`);
      await ns.sleep(50);
    }
  }
};

/** @param {NS} ns */
const playRememberMines = async (ns) => {
  ns.print('remember mines detected ... ');

  const querySelector = [16, 20, 25, 30, 36, 42, 48]
    .map((i) => `* p:first-child:nth-last-child(${i}), * p:first-child:nth-last-child(${i}) ~ p`)
    .join(', ');

  const gridItems = Array.from(doc.querySelectorAll(querySelector)).map((node) => !!node.innerHTML);
  const xSize = Math.floor(Math.sqrt(gridItems.length));
  const ySize = Math.ceil(Math.sqrt(gridItems.length));
  let grid = [];

  for (let i = 0; i < ySize; i++) {
    grid[i] = gridItems.slice(xSize * i, xSize * (i + 1));
  }

  while (getGameTitle(ns).indexOf('Mark') === -1) {
    await ns.sleep(10);
  }

  await ns.sleep(50);

  for (let i = 0; i < ySize; i++) {
    for (let j = 0; j < xSize; j++) {
      const item = grid[i][j];

      if (item) {
        await sendKeyboardEvent(ns, ' ');
      }
      await sendKeyboardEvent(ns, 'D');
    }
    await sendKeyboardEvent(ns, 'S');
  }
};

/** @param {NS} ns */
const playComplimentGuard = async (ns) => {
  const compliments = [
    'affectionate',
    'agreeable',
    'bright',
    'charming',
    'creative',
    'determined',
    'diplomatic',
    'energetic',
    'friendly',
    'funny',
    'generous',
    'polite',
    'likable',
    'diplomatic',
    'helpful',
    'giving',
    'kind',
    'hardworking',
    'patient',
    'dynamic',
    'loyal',
    'based',
    'straightforward',
  ];

  const getSuperlative = () =>
    Array.from(doc.querySelectorAll(`h4 ~ h5`))
      .map((node) => node.innerText.trim())
      .join(' ');

  let superlative = getSuperlative();

  while (!compliments.find((say) => superlative.indexOf(say) !== -1)) {
    await sendKeyboardEvent(ns, 'W');
    await ns.sleep(30);
    superlative = getSuperlative();
  }

  await sendKeyboardEvent(ns, ' ');
};
/** @param {NS} ns */
const playMatchBrackets = async (ns) => {
  const openBraces = Array.from(doc.querySelectorAll('h4 ~ p'))
    .map((el) => el.innerText.trim())
    .find((text) => text.match(/[[<({|]+/gi));

  const bracketList = openBraces.split('').reverse();

  for (let i in bracketList) {
    const bracket = bracketList[i];

    switch (bracket) {
      case '[':
        await sendKeyboardEvent(ns, ']');
        break;
      case '<':
        await sendKeyboardEvent(ns, '>');
        break;
      case '{':
        await sendKeyboardEvent(ns, '}');
        break;
      case '(':
        await sendKeyboardEvent(ns, ')');
        break;
    }

    await ns.sleep(50);
  }
};

/** @param {NS} ns */
const playAttackGuard = async (ns) => {
  let title = getGameTitle(ns);

  while (!contains(title, 'reparing')) {
    await ns.sleep(10);
    title = getGameTitle(ns);
  }

  await ns.sleep(10);
  await sendKeyboardEvent(ns, ' ');
};

/** @param {NS} ns */
const playEnterCode = async (ns) => {
  await ns.sleep(100);

  const getArrow = () =>
    Array.from(doc.querySelectorAll('h4'))
      .map((el) => el.innerText.trim())
      .find((text) => text.match(/[→↑←↓]/gi));

  let arrow = getArrow();

  while (arrow) {
    ns.print(`Arrow detected: ${arrow}`);
    switch (arrow) {
      case '→':
        await sendKeyboardEvent(ns, 'D');
        break;
      case '↑':
        await sendKeyboardEvent(ns, 'W');
        break;
      case '←':
        await sendKeyboardEvent(ns, 'A');
        break;
      case '↓':
        await sendKeyboardEvent(ns, 'S');
        break;
    }

    await ns.sleep(30);
    arrow = getArrow();
  }

  ns.print(`No arrows detected, ending Enter the Code minigame`);
};

/** @param {NS} ns */
const playTypeBackwards = async (ns) => {
  const characters = Array.from(doc.querySelectorAll(`h4 ~ p`))
    .map((node) => node.innerText.trim())
    .find((s) => s !== '|')
    .split('');

  for (let i in characters) {
    const c = characters[i];
    await sendKeyboardEvent(ns, c);
  }
};
/** @param {NS} ns */
const playMatchSymbols = async (ns) => {
  ns.print('Match symbols detected ... ');

  const answers = Array.from(doc.querySelectorAll('h5 span')).map((el) => el.innerText.trim());

  const querySelector = [16, 20, 25, 30, 36, 42, 48]
    .map((i) => `* p:first-child:nth-last-child(${i}), * p:first-child:nth-last-child(${i}) ~ p`)
    .join(', ');
  const gridItems = Array.from(doc.querySelectorAll(querySelector)).map((node) => node.innerText);

  const xSize = Math.floor(Math.sqrt(gridItems.length));
  const ySize = Math.ceil(Math.sqrt(gridItems.length));

  let grid = [];
  for (let i = 0; i < ySize; i++) {
    grid[i] = gridItems.slice(xSize * i, xSize * (i + 1));
  }

  let x = 0,
    y = 0;

  for (let k in answers) {
    const answer = answers[k];
    const index = gridItems.indexOf(answer);
    const xCoord = index % xSize;
    const yCoord = Math.floor(index / ySize);

    for (let i = 0; i < Math.abs(xCoord - x); i++) {
      await sendKeyboardEvent(ns, xCoord - x > 0 ? 'D' : 'A');
    }
    for (let i = 0; i < Math.abs(yCoord - y); i++) {
      await sendKeyboardEvent(ns, yCoord - y > 0 ? 'S' : 'W');
    }

    await sendKeyboardEvent(ns, ' ');
    x = xCoord;
    y = yCoord;
  }
};

/** @param {NS} ns */
const sendKeyboardEvent = async (ns, keyOrCode) => {
  let keyCode = 0;
  let key = '';

  if ('string' === typeof keyOrCode && keyOrCode.length > 0) {
    key = keyOrCode.toLowerCase().substr(0, 1);
    keyCode = key.charCodeAt(0);
  } else if ('number' === typeof keyOrCode) {
    keyCode = keyOrCode;
    key = String.fromCharCode(keyCode);
  }

  if (!keyCode || key.length !== 1) {
    return;
  }

  //console.log(`Sending key ${key} : ${keyCode}`);
  const keyboardEvent = new KeyboardEvent('keydown', {
    key,
    keyCode,
  });

  doc.dispatchEvent(keyboardEvent);
  await ns.sleep(50);
};

const contains = (string1, string2) => string1.indexOf(string2) !== -1;

const getGameTitle = () =>
  Array.from(doc.getElementsByTagName(TITLE_TAG))
    .map((el) => el.innerText)
    .join(' ')
    .trim();

/**
 *  Look for the cancel button to know when infiltration is ongoing
 *  */
const identifyInfiltration = () => {
  return !!Array.from(doc.getElementsByTagName('button')).find((node) => node.innerText.indexOf('Cancel In') !== -1);
};

/**
 * Wrap all event listeners with a custom function that injects
 * the "isTrusted" flag.
 *
 * This event wrapper crack is lifted from https://pastebin.com/7DuFYDpJ
 */
function wrapEventListeners() {
  if (!doc._addEventListener) {
    doc._addEventListener = doc.addEventListener;

    doc.addEventListener = function (type, callback, options) {
      if ('undefined' === typeof options) {
        options = false;
      }
      let handler = false;

      // For this script, we only want to modify "keydown" events.
      if ('keydown' === type) {
        handler = function (...args) {
          if (!args[0].isTrusted) {
            const hackedEv = {};

            for (const key in args[0]) {
              if ('isTrusted' === key) {
                hackedEv.isTrusted = true;
              } else if ('function' === typeof args[0][key]) {
                hackedEv[key] = args[0][key].bind(args[0]);
              } else {
                hackedEv[key] = args[0][key];
              }
            }

            args[0] = hackedEv;
          }

          return callback.apply(callback, args);
        };

        for (const prop in callback) {
          if ('function' === typeof callback[prop]) {
            handler[prop] = callback[prop].bind(callback);
          } else {
            handler[prop] = callback[prop];
          }
        }
      }

      if (!this.eventListeners) {
        this.eventListeners = {};
      }
      if (!this.eventListeners[type]) {
        this.eventListeners[type] = [];
      }
      this.eventListeners[type].push({
        listener: callback,
        useCapture: options,
        wrapped: handler,
      });

      return this._addEventListener(type, handler ? handler : callback, options);
    };
  }

  if (!doc._removeEventListener) {
    doc._removeEventListener = doc.removeEventListener;

    doc.removeEventListener = function (type, callback, options) {
      if ('undefined' === typeof options) {
        options = false;
      }

      if (!this.eventListeners) {
        this.eventListeners = {};
      }
      if (!this.eventListeners[type]) {
        this.eventListeners[type] = [];
      }

      for (let i = 0; i < this.eventListeners[type].length; i++) {
        if (this.eventListeners[type][i].listener === callback && this.eventListeners[type][i].useCapture === options) {
          if (this.eventListeners[type][i].wrapped) {
            callback = this.eventListeners[type][i].wrapped;
          }

          this.eventListeners[type].splice(i, 1);
          break;
        }
      }

      if (this.eventListeners[type].length == 0) {
        delete this.eventListeners[type];
      }

      return this._removeEventListener(type, callback, options);
    };
  }
}

/**
 * Revert the "wrapEventListeners" changes.
 */
function unwrapEventListeners() {
  if (doc._addEventListener) {
    doc.addEventListener = doc._addEventListener;
    delete doc._addEventListener;
  }
  if (doc._removeEventListener) {
    doc.removeEventListener = doc._removeEventListener;
    delete doc._removeEventListener;
  }
  delete doc.eventListeners;
}

/*
  This is a work-in-progress automation of the infiltration minigame.
 */

//import ReactTestUtils from 'react-dom/test-utils';

const factions = {
  Illuminati: 'Illuminati',
  Daedalus: 'Daedalus',
  TheCovenant: 'The Covenant',
  ECorp: 'ECorp',
  MegaCorp: 'MegaCorp',
  BachmanAssociates: 'Bachman & Associates',
  BladeIndustries: 'Blade Industries',
  NWO: 'NWO',
  ClarkeIncorporated: 'Clarke Incorporated',
  OmniTekIncorporated: 'OmniTek Incorporated',
  FourSigma: 'Four Sigma',
  KuaiGongInternational: 'KuaiGong International',
  FulcrumSecretTechnologies: 'Fulcrum Secret Technologies',
  BitRunners: 'BitRunners',
  TheBlackHand: 'The Black Hand',
  NiteSec: 'NiteSec',
  Aevum: 'Aevum',
  Chongqing: 'Chongqing',
  Ishima: 'Ishima',
  NewTokyo: 'New Tokyo',
  Sector12: 'Sector-12',
  Volhaven: 'Volhaven',
  SpeakersForTheDead: 'Speakers for the Dead',
  TheDarkArmy: 'The Dark Army',
  TheSyndicate: 'The Syndicate',
  Silhouette: 'Silhouette',
  Tetrads: 'Tetrads',
  SlumSnakes: 'Slum Snakes',
  Netburners: 'Netburners',
  TianDiHui: 'Tian Di Hui',
  CyberSec: 'CyberSec',
  Bladeburners: 'Bladeburners',
  ChurchOfTheMachineGod: 'Church of the Machine God',
  ShadowsOfAnarchy: 'Shadows of Anarchy',
  Money: '$',
  Money2: '$$',
  Money3: '$$$',
};

const TITLE_TAG = 'h4';

const doc = globalThis['document'];

export function autocomplete() {
  const factionList = Object.values(factions).map((f) => f.replaceAll(' ', '_'));
  return [...factionList, '--tail'];
}

/** @param {NS} ns */
export async function main(ns) {
  ns.tail();
  ns.resizeTail(420, 200);
  ns.moveTail(Math.floor(doc.body.scrollWidth * 0.8 - 200), Math.floor(document.body.scrollHeight * 0.7));

  const factionList = Object.values(factions);
  const targetFactions = ns.args
    .filter((a) => !`${a}`.match(/^[0-9]+$/) && a !== '--tail' && a !== '-t')
    .map((t) => t.replaceAll('_', ' '))
    .join(' ');
  const targetedFactionList = factionList.filter((f) => targetFactions.indexOf(f) !== -1);
  const targets = targetedFactionList.length ? targetedFactionList : ['$$$']; // Ignore faction if hacking for money
  const runs = ns.args.find((a) => `${a}`.match(/^[0-9]+$/)) || 1;
  const playBeep = !ns.args.find((a) => a === 'nobeep');

  killDuplicates(ns);
  ns.disableLog('sleep');

  for (const index in targets) {
    const targetFaction = targets[index];
    for (let i = 0; i < runs; i++) {
      await startInfiltration(ns);
      await playMinigame(ns, targetFaction);

      ns.resizeTail(420, 200);
      ns.moveTail(Math.floor(doc.body.scrollWidth * 0.8 - 200), Math.floor(document.body.scrollHeight * 0.7));
      ns.print(`Infiltrated ${i + 1} / ${runs} for faction ${targetFaction} (${+index + 1}/${targets.length})`);
    }
  }
  if (playBeep) {
    await beep();
    await ns.sleep(300);
    await beep();
  }
  ns.closeTail();
}

/** @param {NS} ns */
async function playMinigame(ns, targetFaction) {
  // Wait for infiltration minigame to be visible
  while (!identifyInfiltration(ns)) {
    await ns.sleep(300);
  }

  wrapEventListeners();

  let title = getGameTitle(ns);
  while (title) {
    //title.indexOf('Get Ready') === -1 && ns.print(`Minigame Detected! ${title}`);
    //console.log(`Title detected: ${title}`);

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
      await handleSuccess(ns, targetFaction);
    } else if (contains(title, 'Get Ready')) {
      await ns.sleep(100);
    } else {
      //console.log('Minigame not yet implemented');
      await ns.sleep(500);
    }

    await ns.sleep(100);
    title = getGameTitle(ns);
  }

  //ns.print('no title detected, ending infiltration');

  unwrapEventListeners();
  await ns.sleep(1000);
}

async function beep() {
  const snd = new Audio(
    'data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=',
  );
  await snd.play();
}

/** @param {NS} ns */
const handleSuccess = async (ns, targetFaction) => {
  await ns.sleep(400);
  await setSelectionValue(doc.querySelector('.MuiInputBase-root [role="button"] ~ input'), targetFaction);

  await ns.sleep(200);
  await click(doc.querySelector('.MuiInputBase-root ~ button'));

  await ns.sleep(200);

  // The above will do nothing if no valid faction is selected; in that case, sell what we find for money
  await click([...doc.getElementsByTagName('button')].find((b) => b.innerText.indexOf(`Sell for`) !== -1));
  await ns.sleep(500);
};

const startInfiltration = async (ns) => {
  await click([...doc.querySelectorAll('[role="button"]')].find((b) => b.innerText.indexOf('City') !== -1));
  await ns.sleep(500);
  await click(doc.querySelector('[aria-label="ECorp"], [aria-label="MegaCorp"]'));
  await ns.sleep(500);
  await click([...doc.getElementsByTagName('button')].find((b) => b.innerText.indexOf('Infiltrate') !== -1));
  await ns.sleep(500);
  await click([...doc.getElementsByTagName('button')].find((b) => b.innerText.indexOf('Start') !== -1));
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
    wireProperties.push(wireColors.filter((n, i) => i % wireCount === j));
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
  const querySelector = [9, 12, 16, 20, 25, 30, 36, 42, 48]
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
  const answers = Array.from(doc.querySelectorAll('h5 span')).map((el) => el.innerText.trim());

  const querySelector = [9, 12, 16, 20, 25, 30, 36, 42, 48]
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
  await ns.sleep(30);
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

async function click(elem) {
  if (!elem) {
    return;
  }
  const e = elem[Object.keys(elem)[1]];
  const event = e.onClick || e.onMouseDown;
  event &&
    (await event({
      isTrusted: true,
    }));
}

async function setSelectionValue(elem, newValue) {
  const e = elem[Object.keys(elem)[1]];
  const event = e.onChange;
  event &&
    (await event({
      target: { value: newValue },
    }));
}

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
      if ('keydown' === type || 'click' === type || 'mousedown' === type || 'focus' === type) {
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

/** @param {NS} ns */
function killDuplicates(ns) {
  const scriptInfo = ns.getRunningScript();
  ns.ps()
    .filter((script) => script.filename === scriptInfo.filename && script.pid !== scriptInfo.pid)
    .forEach((script) => ns.kill(script.pid));
}

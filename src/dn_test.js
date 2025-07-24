/** @param {NS} ns */
export async function main(ns) {
  // const currentPID = ns.getRunningScript().pid;
  // const scripts = ns.ps();
  // const existingScript = scripts.find((script) => script.filename === 'dn_test.js' && script.pid !== currentPID);
  // if (existingScript) {
  //   return 0;
  // }
  const serverName = ns.getHostname();
  //ns.toast(`Authenticated to ${serverName}`);

  while (true) {
    const nearbyServers = ns.dnet.probe();
    for (const server of nearbyServers) {
      const existingPassword = getExistingPassword(ns, server);
      let details = ns.dnet.getServerAuthDetails(server);
      if (!details || !details.isConnectedToCurrentServer || !details.isOnline) {
        ns.print(`Skipping ${server} - not connected or offline`);
        continue;
      }

      // const runningScript = ns.ps(server).find((script) => script.filename === ns.getScriptName());
      // if (runningScript) {
      //   ns.print(`Already running on ${server}`);
      //   continue;
      // }

      let success = (await authWrapper(ns, server, existingPassword || '')).success;

      if (!success) {
        success = await serverSolver(ns, server);
      }

      if (success) {
        details = ns.dnet.getServerAuthDetails(server);
        if (!details.isConnectedToCurrentServer || !details.isOnline) {
          continue;
        }
        try {
          ns.scp(ns.getScriptName(), server, serverName);
        } catch (e) {
          debugger;
          continue;
        }
        ns.scp('dn_clear.js', server, serverName);
        ns.scp('dn_cache.js', server, serverName);
        ns.scp('dn_phish.js', server, serverName);
        ns.exec(ns.getScriptName(), server, { preventDuplicates: true, temporary: true });
        ns.exec('dn_clear.js', server, { preventDuplicates: true, temporary: true });
      }
    }
    await ns.sleep(10000);
  }
}

const authWrapper = async (ns, server, password) => {
  const result = await ns.dnet.authenticate(server, password);
  if (result.success) {
    savePassword(ns, server, password);
  }
  return result;
};

const getPasswordFileName = (hostname) => {
  const excludedChars = ['/', '*', '?', '[', ']', '!', '\\', '~', '|', '#', '"', "'"];
  let cleanedHostname = hostname;
  for (const char of excludedChars) {
    cleanedHostname = cleanedHostname.replace(new RegExp(`\\${char}`, 'g'), '-');
  }
  return `pw/${cleanedHostname}.txt`;
};

const getExistingPassword = (ns, hostname) => {
  const currentHostname = ns.getHostname();
  const filename = getPasswordFileName(hostname);
  ns.scp(filename, currentHostname, 'darkweb');
  return ns.read(filename);
};

const savePassword = (ns, hostname, password) => {
  const filename = getPasswordFileName(hostname);
  ns.write(filename, password, 'w');
  ns.scp(filename, 'darkweb');
};

/** @param {NS} ns
 * @param {string} server
 */
export const serverSolver = async (ns, server) => {
  const details = ns.dnet.getServerAuthDetails(server);
  if (!details.isConnectedToCurrentServer || !details.isOnline) {
    return false;
  }

  switch (details.modelId) {
    case Minigames.EchoVuln:
      return echoVulnSolver(ns, server, details);
    case Minigames.SortedEchoVuln:
      return sortedEchoVulnSolver(ns, server, details);
    case undefined:
    case Minigames.NoPassword:
      return (await authWrapper(ns, server, '')).success;
    case Minigames.DefaultPassword:
      return defaultPasswordSolver(ns, server);
    case Minigames.MastermindHint:
      await mastermindSolver(ns, server, details);
      break;
    case Minigames.Captcha:
      await captchaSolver(ns, server, details);
      return false;
    // case Minigames.TimingAttack:
    //   await timingAttackSolver(ns, server, response);
    //   break;
    // case Minigames.LargestPrimeFactor:
    //   await largestPrimeFactorSolver(ns, server, response);
    //   break;
    case Minigames.RomanNumeral:
      return romanNumeralSolver(ns, server, details);
    case Minigames.DogNames:
      return dogNamesSolver(ns, server, details);
    // case Minigames.GuessNumber:
    //   await guessNumberSolver(ns, server, response);
    //   break;
    // case Minigames.CommonPasswordDictionary:
    //   await commonPasswordDictionarySolver(ns, server, response);
    //   break;
    // case Minigames.EUCountryDictionary:
    //   await euCountryDictionarySolver(ns, server, response);
    //   break;
    case Minigames.Yesn_t:
      await yesn_tSolver(ns, server, details);
      break;
    // case Minigames.Synchronize:
    //   await synchronizeSolver(ns, server, response);
    //   break;
    // case Minigames.BinaryEncodedFeedback:
    //   await binaryEncodedFeedbackSolver(ns, server, response);
    //   break;
    case Minigames.SpiceLevel:
      await spiceLevelSolver(ns, server, details);
      break;
    case Minigames.ConvertToBase10:
      return convertToBase10Solver(ns, server, details);
    // case Minigames.parsedExpression:
    //   await parsedExpressionSolver(ns, server, response);
    //   break;
    default:
      return sniff(ns, server);
  }
};

const sniff = async (ns, server) => {
  ns.print(`Attempting to sniff packets from ${server}`);
  const match = getPasswordFormatMatchRegex(ns, server);

  while (true) {
    const results = await ns.dnet.packetCapture(server);
    if (!results.success) {
      ns.print(`Failed to capture packets from ${server}: ${results.message}`);
      return false;
    }
    const matches = results.data.match(match);

    for (const match of matches || []) {
      const response = await authWrapper(ns, server, match);
      if (response.success) {
        ns.print(`Successfully authenticated to ${server} with password: ${match}`);
        return true;
      } else {
        ns.print(`Failed to authenticate to ${server} with password: ${match}`);
      }
    }

    await ns.sleep(10);
  }
};

const getPasswordFormatMatchRegex = (ns, server) => {
  const passwordFormat = ns.dnet.getServerAuthDetails(server).passwordFormat;
  const passwordLength = ns.dnet.getServerAuthDetails(server).passwordLength;

  if (passwordFormat === 'numeric') {
    return new RegExp(`\\d{${passwordLength}}`, 'g');
  }
  if (passwordFormat === 'alphabetic') {
    return new RegExp(`[a-zA-Z]{${passwordLength}}`, 'g');
  }
  if (passwordFormat === 'alphanumeric') {
    return new RegExp(`[a-zA-Z0-9]{${passwordLength}}`, 'g');
  }
};

const getServerLogs = async (ns, server) => {
  const result = await ns.dnet.heartbleed(server, { peek: true });
  if (!result.success) {
    ns.tprint(`Failed to get logs for ${server}`);
    return { data: '', passwordHint: '', success: result.success };
  }
  const resultString = result.logs.find((log) => log.includes('passwordAttempted'));
  if (resultString) {
    return JSON.parse(resultString);
  }
  console.log('No logs found');
  return { data: '', passwordHint: '', success: result.success };
};

export const captchaSolver = async (ns, server, details) => {
  const captcha = details.data;
  if (!captcha) {
    return false;
  }
  const cleanedNumbers = captcha.replace(/[^0-9]/g, '');
  const response = await authWrapper(ns, server, cleanedNumbers);
  if (response.success) {
    return true;
  }
  ns.tprint(`Captcha solve failed: ${response.message}`);
  return false;
};

export const echoVulnSolver = async (ns, server, response) => {
  const noise = ['The password is', 'The PIN is', 'Remember to use', "It's set to", 'The key is', 'The secret is'];
  let password = response.passwordHint;
  for (const n of noise) {
    password = password.replace(n, '');
  }
  password = password.trim();
  const result = await authWrapper(ns, server, password);
  const sanityCheck = await ns.dnet.connectToSession(server, password);
  return result.success ? password : false;
};

const tryAllPermutations = async (ns, server, data) => {
  const options = generateAllPermutationsOfString(data);
  for (const option of options) {
    const result = await authWrapper(ns, server, option);
    if (result.success) {
      return option;
    }
    if (!result.message.includes('401')) {
      return false;
    }
  }
  return false;
};

export const sortedEchoVulnSolver = async (ns, server, response) => {
  const data = response.data;
  await tryAllPermutations(ns, server, data);
};

export const romanNumeralSolver = async (ns, server, response) => {
  const password = parseRomanNumeral(response.data);
  const result = await authWrapper(ns, server, password.toString());
  return result.success ? password : false;
};

export const convertToBase10Solver = async (ns, server, response) => {
  const [base, number] = response.data?.split(',') || [];
  const password = parseBaseNNumberString(number, base);
  const result = await authWrapper(ns, server, password.toString());
  return result.success ? password : false;
};

export const defaultPasswordSolver = async (ns, server) => {
  const defaultSettingsDictionary = ['admin', 'password', '0000', '12345'];
  for (const password of defaultSettingsDictionary) {
    const result = await authWrapper(ns, server, password);
    if (result.success) {
      return password;
    }
  }
  return false;
};

export const dogNamesSolver = async (ns, server) => {
  const dogNameDictionary = ['fido', 'spot', 'rover', 'max'];
  for (const dogName of dogNameDictionary) {
    const result = await authWrapper(ns, server, dogName);
    if (result.success) {
      return dogName;
    }
  }
  return false;
};

export const spiceLevelSolver = async (ns, server, details) => {
  const passwordLength = details.passwordLength;
  const numbersInPassword = new Array(10).fill(0);
  for (let i = 0; i < 10; i++) {
    const passwordToAttempt = new Array(passwordLength).fill(i);
    await authWrapper(ns, server, passwordToAttempt.join(''));
    const result = await getServerLogs(ns, server);
    if (!result.success) {
      ns.print(`Failed to get logs for ${server}: ${result.message}`);
      return false;
    }
    numbersInPassword[i] = result.data?.split('').filter((char) => char && char !== '0').length;
  }
  const sortedPassword = numbersInPassword.map((n, i) => new Array(n).fill(i)).join('');
  return tryAllPermutations(ns, server, sortedPassword);
};

export const mastermindSolver = async (ns, server, details) => {
  const passwordLength = details.passwordLength;
  const numbersInPassword = new Array(10).fill(0);
  for (let i = 0; i < 10; i++) {
    const passwordToAttempt = new Array(passwordLength).fill(i);
    await authWrapper(ns, server, passwordToAttempt.join(''));
    const result = await getServerLogs(ns, server);
    if (!result.success) {
      ns.print(`Failed to get logs for ${server}: ${result.message}`);
      return false;
    }
    numbersInPassword[i] = +result.data?.split(',')[0] || 0;
  }
  const sortedPassword = numbersInPassword
    .map((n, i) => new Array(n).fill(i))
    .flat()
    .join('');
  return tryAllPermutations(ns, server, sortedPassword);
};

export const yesn_tSolver = async (ns, server, details) => {
  const passwordLength = details.passwordLength;
  let password = new Array(passwordLength).fill(0).map(() => 0);
  let response;
  do {
    response = await authWrapper(ns, server, password.join(''));
    const log = await getServerLogs(ns, server);
    if (!log.success) {
      ns.print(`Failed to get logs for ${server}: ${log.message}`);
      return false;
    }
    if (!log.data) {
      await ns.sleep(1000);
      continue;
    }
    log.data
      ?.split(',')
      ?.slice(0, passwordLength)
      .forEach((yes, i) => {
        if (yes !== 'yes') {
          password[i] = password[i] || 0;
          password[i] += 1;
        }
      });
  } while (!response?.success);
  return true;
};

export const numbers = '0123456789';
export const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const Minigames = {
  EchoVuln: 'DeskMemo_3.1',
  SortedEchoVuln: 'PHP 5.4',
  NoPassword: 'ZeroLogon',
  DefaultPassword: 'FreshInstall_1.0',
  Captcha: 'CloudBlare(tm)',
  MastermindHint: 'DeepGreen',
  TimingAttack: '2G_cellular',
  LargestPrimeFactor: 'PrimeTime 2',
  RomanNumeral: 'BellaCuore',
  DogNames: 'Laika4',
  GuessNumber: 'AccountsManager_4.2',
  CommonPasswordDictionary: 'TopPass',
  EUCountryDictionary: 'EuroZone Free',
  Yesn_t: 'NIL',
  Synchronize: '',
  BinaryEncodedFeedback: '110100100',
  SpiceLevel: 'RateMyPix.Auth',
  ConvertToBase10: 'OctantVoxel',
  parsedExpression: 'MathML',
  divisibilityTest: 'ModuloTerm',
  packetSniffer: 'OpenWebAccessPoint',
  labyrinth: '_lab_',
};

export const encodeNumberInBaseN = (decimalNumber, base) => {
  const characters = [...numbers.split(''), 'A', 'B', 'C', 'D', 'E', 'F'];
  let digits = Math.floor(Math.log(decimalNumber) / Math.log(base));
  let remaining = decimalNumber;
  let result = '';

  while (remaining >= 0.1) {
    if (digits === -1) {
      result += '.';
    }
    const place = Math.floor(remaining / base ** digits);
    result += characters[place];
    remaining -= place * base ** digits;
    digits -= 1;
  }

  return result;
};

export const parseBaseNNumberString = (numberString, base) => {
  const characters = [...numbers.split(''), 'A', 'B', 'C', 'D', 'E', 'F'];
  let result = 0;
  let index = 0;
  let digit = numberString.split('.')[0].length - 1;

  while (index < numberString.length) {
    const currentDigit = numberString[index];
    if (currentDigit === '.') {
      index += 1;
      continue;
    }
    result += characters.indexOf(currentDigit) * base ** digit;
    index += 1;
    digit -= 1;
  }

  return result;
};

// example:  4 + 5 * ( 6 + 7 ) / 2
export const parseSimpleArithmeticExpression = (expression) => {
  const tokens = expression.split('');

  // Identify parentheses
  let currentDepth = 0;
  const depth = tokens.map((token) => {
    if (token === '(') {
      currentDepth += 1;
    } else if (token === ')') {
      currentDepth -= 1;
      return currentDepth + 1;
    }
    return currentDepth;
  });
  const depth1Start = depth.indexOf(1);
  // find the last 1 before the first 0 after depth1Start
  const firstZeroAfterDepth1Start = depth.indexOf(0, depth1Start);
  const depth1End = firstZeroAfterDepth1Start === -1 ? depth.length - 1 : firstZeroAfterDepth1Start - 1;
  if (depth1Start !== -1) {
    const subExpression = tokens.slice(depth1Start + 1, depth1End).join('');
    const result = parseSimpleArithmeticExpression(subExpression);
    tokens.splice(depth1Start, depth1End - depth1Start + 1, result.toString());
    return parseSimpleArithmeticExpression(tokens.join(''));
  }

  // handle multiplication and division
  let remainingExpression = tokens.join('');

  // breakdown and explanation for this regex: https://regex101.com/r/mZhiBn/1
  const multiplicationDivisionRegex = /(-?\d*\.?\d+) *([*/]) *(-?\d*\.?\d+)/;
  let match = remainingExpression.match(multiplicationDivisionRegex);

  while (match) {
    const [__, left, operator, right] = match;
    const result = operator === '*' ? parseFloat(left) * parseFloat(right) : parseFloat(left) / parseFloat(right);
    const resultString = Math.abs(result) < 0.000001 ? result.toFixed(20) : result.toString();
    remainingExpression = remainingExpression.replace(match[0], resultString);
    match = remainingExpression.match(multiplicationDivisionRegex);
  }

  // handle addition and subtraction
  const additionSubtractionRegex = /(-?\d*\.?\d+) *([+-]) *(-?\d*\.?\d+)/;
  match = remainingExpression.match(additionSubtractionRegex);

  while (match) {
    const [__, left, operator, right] = match;
    const result = operator === '+' ? parseFloat(left) + parseFloat(right) : parseFloat(left) - parseFloat(right);
    remainingExpression = remainingExpression.replace(match[0], result.toString());
    match = remainingExpression.match(additionSubtractionRegex);
  }

  return parseFloat(remainingExpression);
};

export const parseRomanNumeral = (romanNumeral) => {
  const romanNumeralMap = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };

  const tokens = romanNumeral.split('');
  let result = 0;
  let previousValue = 0;

  for (let i = tokens.length - 1; i >= 0; i--) {
    const currentValue = romanNumeralMap[tokens[i]];
    if (currentValue < previousValue) {
      result -= currentValue;
    } else {
      result += currentValue;
    }
    previousValue = currentValue;
  }

  return result;
};

export const generateAllPermutationsOfString = (string) => {
  if (string.length > 9) {
    return [];
  }
  try {
    const result = [];
    const generate = (currentString, remainingString) => {
      if (remainingString.length === 0) {
        result.push(currentString);
        return;
      }
      for (let i = 0; i < remainingString.length; i++) {
        generate(currentString + remainingString[i], remainingString.slice(0, i) + remainingString.slice(i + 1));
      }
    };

    generate('', string);
    return result;
  } catch (e) {
    return [];
  }
};

export const generateAllNumbersOfLengthN = (n) => {
  const result = [];
  const generate = (currentNumber) => {
    if (currentNumber.length === n) {
      result.push(currentNumber);
      return;
    }
    for (let i = 0; i < 10; i++) {
      generate(currentNumber + i);
    }
  };

  generate('');
  return result;
};

export const generateAllStringsOfLengthN = (n) => {
  const result = [];
  const generate = (currentString) => {
    if (currentString.length === n) {
      result.push(currentString);
      return;
    }
    for (let i = 0; i < letters.length; i++) {
      generate(currentString + letters[i]);
    }
  };

  generate('');
  return result;
};

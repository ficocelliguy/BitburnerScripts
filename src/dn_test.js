/** @param {NS} ns */
export async function main(ns) {
  const currentPID = ns.getRunningScript().pid;
  const scripts = ns.ps();
  const existingScript = scripts.find((script) => script.filename === 'dn_test.js' && script.pid !== currentPID);
  if (existingScript) {
    return 0;
  }

  while (true) {
    const nearbyServers = ns.dn.scan();
    for (const server of nearbyServers) {
      try {
        const auth = await serverSolver(ns, server);
        if (auth !== false) {
          ns.tprint(`Authenticated to ${server}`);
          ns.dn.scp(ns.getScriptName(), server, auth);
          ns.dn.exec(ns.getScriptName(), server, auth);
        }
      } catch (e) {
        ns.print(`Error on ${server}: ${e}`);
      }
    }
    await ns.sleep(10000);
  }
}

/** @param {NS} ns
 * @param {string} server
 */
export const serverSolver = async (ns, server) => {
  const response = await ns.dn.authenticate(server, '');
  switch (response.modelId) {
    case Minigames.EchoVuln:
      return echoVulnSolver(ns, server, response);
    case Minigames.SortedEchoVuln:
      return sortedEchoVulnSolver(ns, server, response);
    case undefined:
    case Minigames.NoPassword:
      return ''; // no password needed;
    case Minigames.DefaultPassword:
      return defaultPasswordSolver(ns, server);
    // case Minigames.MastermindHint:
    //   await mastermindHintSolver(ns, server, response);
    //   break;
    // case Minigames.TimingAttack:
    //   await timingAttackSolver(ns, server, response);
    //   break;
    // case Minigames.LargestPrimeFactor:
    //   await largestPrimeFactorSolver(ns, server, response);
    //   break;
    case Minigames.RomanNumeral:
      return romanNumeralSolver(ns, server, response);
    case Minigames.DogNames:
      return dogNamesSolver(ns, server, response);
    // case Minigames.GuessNumber:
    //   await guessNumberSolver(ns, server, response);
    //   break;
    // case Minigames.CommonPasswordDictionary:
    //   await commonPasswordDictionarySolver(ns, server, response);
    //   break;
    // case Minigames.EUCountryDictionary:
    //   await euCountryDictionarySolver(ns, server, response);
    //   break;
    // case Minigames.Yesn_t:
    //   await yesn_tSolver(ns, server, response);
    //   break;
    // case Minigames.Synchronize:
    //   await synchronizeSolver(ns, server, response);
    //   break;
    // case Minigames.BinaryEncodedFeedback:
    //   await binaryEncodedFeedbackSolver(ns, server, response);
    //   break;
    // case Minigames.SpiceLevel:
    //   await spiceLevelSolver(ns, server, response);
    //   break;
    case Minigames.ConvertToBase10:
      return convertToBase10Solver(ns, server, response);
    // case Minigames.parsedExpression:
    //   await parsedExpressionSolver(ns, server, response);
    //   break;
    default:
      ns.tprint(`Unrecognized modelId: ${response.modelId}`);
      return false;
  }
};

export const echoVulnSolver = async (ns, server, response) => {
  const noise = ['The password is', 'The PIN is', 'Remember to use', "It's set to", 'The key is', 'The secret is'];
  let password = response.msg;
  for (const n of noise) {
    password = password.replace(n, '');
  }
  password = password.trim();
  const result = await ns.dn.authenticate(server, password);
  return result.status === 200 ? password : false;
};

export const sortedEchoVulnSolver = async (ns, server, response) => {
  const data = response.data;
  const options = generateAllPermutationsOfString(data);
  for (const option of options) {
    try {
      const result = await ns.dn.authenticate(server, option);
      if (result.status === 200) {
        return option;
      }
    } catch (e) {
      return false;
    }
  }
  return false;
};

export const romanNumeralSolver = async (ns, server, response) => {
  const password = parseRomanNumeral(response.data);
  const result = await ns.dn.authenticate(server, password.toString());
  return result.status === 200 ? password : false;
};

export const convertToBase10Solver = async (ns, server, response) => {
  const [base, number] = response.data.split(',');
  const password = parseBaseNNumberString(number, base);
  const result = await ns.dn.authenticate(server, password.toString());
  return result.status === 200 ? password : false;
};

export const defaultPasswordSolver = async (ns, server) => {
  const defaultSettingsDictionary = ['admin', 'password', '0000', '12345'];
  for (const password of defaultSettingsDictionary) {
    const result = await ns.dn.authenticate(server, password);
    if (result.status === 200) {
      return password;
    }
  }
  return false;
};

export const dogNamesSolver = async (ns, server) => {
  const dogNameDictionary = ['fido', 'spot', 'rover', 'max'];
  for (const dogName of dogNameDictionary) {
    try {
      const result = await ns.dn.authenticate(server, dogName);
      if (result.status === 200) {
        return dogName;
      }
    } catch (e) {
      return false;
    }
  }
  return false;
};

export const numbers = '0123456789';
export const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const Minigames = {
  EchoVuln: 0,
  SortedEchoVuln: 1,
  NoPassword: 2,
  DefaultPassword: 3,
  MastermindHint: 4,
  TimingAttack: 5,
  LargestPrimeFactor: 6,
  RomanNumeral: 7,
  DogNames: 8,
  GuessNumber: 9,
  CommonPasswordDictionary: 10,
  EUCountryDictionary: 11,
  Yesn_t: 12,
  Synchronize: 13,
  BinaryEncodedFeedback: 14,
  SpiceLevel: 15,
  ConvertToBase10: 16,
  parsedExpression: 17,
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

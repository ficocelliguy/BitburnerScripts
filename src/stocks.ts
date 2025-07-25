import { NS } from '@ns';

const POLL_RATE = 4_000;
const POLL_DATA_LENGTH = 20;

const SELL_THRESHOLD = -0;
const BUY_THRESHOLD = 0.02;
const MINIMUM_TRANSACTION = 1_000_000;
const MINIMUM_HISTORY_LENGTH = 10;
const FRACTION_OF_MONTY = 0.8;
const STOP_LOSS = -0.05;
const PROFIT_LIMIT = 0.07;

type History = {
  priceHistory: number[];
  analysis: number[];
};
type PollData = {
  [symbol: string]: History;
};

export function autocomplete() {
  return ['--tail', 'sell'];
}

export async function main(ns: NS) {
  ns.clearLog();
  const sellAll = ns.args.find((a) => `${a}`.toLowerCase().includes('sell'));

  if (sellAll) {
    sellAllStock(ns);
  } else {
    await pollDance(ns);
  }

  await ns.sleep(100000);
}

export const pollDance = async (ns: NS) => {
  const symbols = ns.stock.getSymbols();
  let counter = 0;
  let investedFunds = getPortfolioValue(ns);
  let sales = 0;

  // initialize empty polling data
  const pollingData: PollData = {};
  symbols.forEach(
    (sym) =>
      (pollingData[sym] = {
        priceHistory: [],
        analysis: [],
      }),
  );

  while (++counter) {
    updatePollingData(ns, pollingData);

    if (counter > MINIMUM_HISTORY_LENGTH) {
      sales += sellFallingStocks(ns, pollingData);

      investedFunds += buyRisingStocks(ns, pollingData, investedFunds - sales);
    }

    logPollingData(ns, pollingData);

    const portfolio = getPortfolioValue(ns);
    const portfolioGains = getPortfolioProfit(ns);
    const gains = portfolio + portfolioGains + sales - investedFunds;
    ns.print(
      ` C:${counter}  Profit: ${ns.format.number(
        investedFunds ? (gains * 100) / investedFunds : 0,
        1,
      )}%  Net: ${ns.format.number(gains, 1)}  Portfolio: ${ns.format.number(portfolio, 1)}`,
    );

    await ns.sleep(POLL_RATE);
    ns.clearLog();
  }
};

const getPortfolioValue = (ns: NS) =>
  getHeldStockSymbols(ns).reduce((sum, sym) => sum + ns.stock.getPosition(sym)[0] * ns.stock.getPosition(sym)[1], 0);

const getPortfolioProfit = (ns: NS) =>
  getHeldStockSymbols(ns).reduce((sum, sym) => {
    return sum + getProfitPerStock(ns, sym);
  }, 0);

const getProfitPerStock = (ns: NS, sym: string) => {
  const buyPrice = ns.stock.getPosition(sym)[1];
  const bidPrice = ns.stock.getBidPrice(sym);
  return buyPrice - bidPrice;
};

const sellAllStock = (ns: NS, symbol?: string) => {
  if (symbol) {
    ns.stock.sellStock(symbol, Number.MAX_SAFE_INTEGER);
    return;
  }
  ns.stock.getSymbols().forEach((sym) => {
    ns.stock.sellStock(sym, Number.MAX_SAFE_INTEGER);
  });
};

const sellFallingStocks = (ns: NS, pollingData: PollData) =>
  getHeldStockSymbols(ns).reduce((sales, sym) => {
    const trendlines = pollingData[sym].analysis;
    const latestTrendline = trendlines.slice(-1)[0] * (60_000 / POLL_RATE);
    const recentPositiveTrendlines = trendlines.slice(-1 * MINIMUM_HISTORY_LENGTH).filter((t) => t > 0).length;
    const ownedShares = ns.stock.getPosition(sym)[0];

    const profitPerStock = getProfitPerStock(ns, sym) / ns.stock.getBidPrice(sym);

    if (
      (latestTrendline < SELL_THRESHOLD && ownedShares) ||
      recentPositiveTrendlines < 2 ||
      profitPerStock < STOP_LOSS ||
      profitPerStock > PROFIT_LIMIT
    ) {
      sellAllStock(ns, sym);
      return sales + ownedShares * ns.stock.getBidPrice(sym);
    }
    return sales;
  }, 0);

const buyRisingStocks = (ns: NS, pollingData: PollData, investedFunds: number) => {
  const availableInvestmentFunds = ns.getPlayer().money * FRACTION_OF_MONTY - investedFunds;
  const sortedStocks = getSymbolsSortedByTrend(pollingData);
  let spentFunds = 0;

  for (let i = 0; i < 3; i++) {
    spentFunds += buyStockIfRising(ns, sortedStocks[i], pollingData, ((4 - i) / 9) * availableInvestmentFunds);
  }

  return spentFunds;
};

const buyStockIfRising = (ns: NS, sym: string, pollingData: PollData, availableInvestmentFunds: number) => {
  const latestTrendline = pollingData[sym].analysis.slice(-1)[0] * (60_000 / POLL_RATE);
  const stockPrice = ns.stock.getPrice(sym);
  const maxShares = ns.stock.getMaxShares(sym) * 0.5 - ns.stock.getPosition(sym)[0];
  const purchaseCount = Math.min(Math.floor(availableInvestmentFunds / stockPrice), maxShares);
  const purchaseCost = purchaseCount * stockPrice;

  if (latestTrendline > BUY_THRESHOLD && availableInvestmentFunds > 0 && purchaseCost > MINIMUM_TRANSACTION) {
    ns.stock.buyStock(sym, purchaseCount);
    return purchaseCost;
  }

  return 0;
};

const getHeldStockSymbols = (ns: NS) => ns.stock.getSymbols().filter((sym) => ns.stock.getPosition(sym)[0]);

/**
 * Adds the current price to each of the stocks' history records
 * Only keeps the last POLL_DATA_LENGTH records
 * @param ns
 * @param pollingData
 */
const updatePollingData = (ns: NS, pollingData: PollData) => {
  Object.keys(pollingData).forEach((sym) => {
    const priceHistory = pollingData[sym].priceHistory;
    priceHistory.push(ns.stock.getBidPrice(sym));

    if (priceHistory.length > POLL_DATA_LENGTH) {
      priceHistory.shift();
    }

    pollingData[sym].analysis.push(getTrendline(ns, pollingData[sym].priceHistory));
  });
};

const getSymbolsSortedByTrend = (pollingData: PollData) =>
  Object.keys(pollingData).sort((a, b) => pollingData[b].analysis.slice(-1)[0] - pollingData[a].analysis.slice(-1)[0]);

const logPollingData = (ns: NS, pollingData: PollData) => {
  // For more colors, see https://www.lihaoyi.com/post/BuildyourownCommandLinewithANSIescapecodes.html#8-colors
  const colors = [
    `\u001b[31m`, //red
    `\u001b[38;5;202m`, //orange
    `\u001b[33m`, //yellow
    `\u001b[37m`, //white
    `\u001b[38;5;121m`, // light green
    `\u001b[32m`, //green
    `\u001b[38;5;82m`, //green
    `\u001b[36m`, //cyan
    '\u001b[0m', // reset
  ];

  const log = getSymbolsSortedByTrend(pollingData).map((key) => {
    const trend = pollingData[key].analysis.slice(-1)[0] * (60_000 / POLL_RATE);
    const reset = '\u001b[0m';
    const trendIndex = Math.min(colors.length - 1, Math.max(0, Math.floor(trend / 0.01 + 3.5)));
    const color = colors[trendIndex];
    const formattedTrend = Math.round(trend * 1000) / 10;
    const leadingSpacer = ' '.repeat(8 - key.length - (formattedTrend < 0 ? 1 : 0));
    const trailingSpacer = ' '.repeat(6 - `${formattedTrend}`.length + (formattedTrend < 0 ? 1 : 0));

    const stocksOwned = ns.stock.getPosition(key)[0];
    const buyPrice = ns.stock.getPosition(key)[1];
    const bidPrice = ns.stock.getBidPrice(key);
    const profit = bidPrice - buyPrice;
    const percentProfit = profit / buyPrice || 0;
    const profitColor = colors[Math.min(colors.length - 1, Math.max(0, Math.floor(percentProfit / 0.01 + 3.5)))];
    const formattedProfit = `${profitColor}${ns.format.number(percentProfit * 100, 1)}${reset}`;
    const ownedStockStatus = stocksOwned
      ? `${formattedProfit}%  ${ns.format.number(profit * stocksOwned, 1, 1000)}  ${ns.format.number(
          buyPrice,
          1,
          1000,
        )}  ${ns.format.number(bidPrice, 1, 1000)}$ `
      : '';

    return `${key}:${leadingSpacer}${color}${formattedTrend}%${reset}${trailingSpacer}/min   ${ownedStockStatus}`;
  });
  console.log(log);
  log.forEach((item) => ns.print(item));
};

/**
 * Calculates data's the trendline, normalized as a ratio of the average value.
 * For example, a trend of rising 15% per tick will return 0.15,
 * and a trend of falling 5% per tick will return -0.05
 *
 * @param ns
 * @param data
 */
const getTrendline = (ns: NS, data: number[]) => {
  if (data.length < 2) {
    return 0;
  }
  const size = data.length;
  const sumX = size * (size + 1) * 0.5 - size;
  const sumY = data.reduce((sum, y) => sum + y, 0);
  const sumXX = data.reduce((sum, _, x) => sum + x * x, 0);
  const sumXY = data.reduce((sum, y, x) => sum + x * y, 0);

  const meanX = sumX / size;
  const meanY = sumY / size;

  const trendlineSlope = (sumXY - size * meanX * meanY) / (sumXX - size * meanX * meanX);

  return trendlineSlope / meanY;
};

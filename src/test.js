// lib/base_server.js
/** @param {NS} ns */
export default class BaseServer {
  constructor(ns, hostname) {
    this.ns = ns;
    this._id = hostname;
    this._data = CACHE.read(this.ns, PORTS.servers, this._id);
  }
  get id() {
    return this._id;
  }
  get data() {
    return structuredClone(this._data);
  }
  get money() {
    return this.data.moneyAvailable;
  }
  get money_max() {
    return this._data.moneyMax;
  }
}

/** @param {NS} ns */
export async function main(ns) {
  const r1 = await ns.dnet.authenticate('darkweb', 'leekspin');
  const r2 = await ns.dnet.connectToSession('darkweb', 'leekspin');
  console.log(r1, r2);
}

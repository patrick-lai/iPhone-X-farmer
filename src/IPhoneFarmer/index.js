const { fetch } = require('./api');
const parts = require('./parts.json');

class IPhoneFarmer {
  constructor({ interval, location, products, onResult }) {
    this.location = location;
    this.products = products;
    this.onResult = onResult;
    if (!interval) throw new Error('Interval must be specified');
    this.doFetch();
    this.timeout = setTimeout(this.doFetch, interval * 1000 * 60);
  }

  async doFetch() {
    console.log(`${new Date()} - Checking Stock`);
    const params = { location: this.location };
    this.products.forEach((product, i) => (params[`parts.${i}`] = product));
    const result = await fetch(params);
    this.onResult && this.onResult(result);
  }
}

IPhoneFarmer.parts = parts;

module.exports = IPhoneFarmer;

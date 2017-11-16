const { fetch } = require('./api');
const parts = require('./parts.json');
const countdown = require('node-countdown');

class IPhoneFarmer {
  constructor({ interval, location, products, onResult }) {
    this.location = location;
    this.products = products;
    this.onResult = onResult;
    if (!interval) throw new Error('Interval must be specified');
    this.interval = interval * 1000 * 60;

    // First time

    this.doFetch();
    countdown.start(this.interval, { suffix: '后开始 find iphone\n' }, err => {
      err ? console.log(err.message) : console.log('开始 find iphone...');
    });

    this.timeout = setInterval(() => {
      this.doFetch();
      countdown.start(
        this.interval,
        { suffix: '后开始 find iphone...\n' },
        err => {
          err ? console.log(err.message) : console.log('开始 find iphone...\n');
        }
      );
    }, this.interval);
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

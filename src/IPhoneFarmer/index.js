const { fetch } = require('./api');
const parts = require('./parts.json');

const isAvailable = availability => availability.pickupDisplay === 'available';

class IPhoneFarmer {
  constructor({ interval, location, products, onResult }) {
    this.location = location;
    this.products = products;
    this.onResult = onResult;
    if (!interval) throw new Error('Interval must be specified');
    this.interval = interval * 1000 * 60;
    // First time
    this.doFetch();
    this.timeout = setInterval(() => {
      this.doFetch();
    }, this.interval);
  }

  isPhoneFound(stores) {
    for (const store of stores) {
      const { partsAvailability } = store;
      for (const key of Object.keys(partsAvailability)) {
        const oneAvailability = partsAvailability[key];
        // Early exit
        if (isAvailable(oneAvailability)) return true;
      }
    }

    return false;
  }

  async doFetch() {
    console.log(`${new Date()} - Checking Stock`);
    const params = { location: this.location };
    this.products.forEach((product, i) => (params[`parts.${i}`] = product));
    const result = await fetch(params);
    const isFound = this.isPhoneFound(result);
    this.onResult && this.onResult(isFound, result);
  }
}

IPhoneFarmer.parts = parts;

module.exports = IPhoneFarmer;

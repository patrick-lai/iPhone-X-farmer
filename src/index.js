require('./printTitle');
const _ = require('lodash');
const inquirer = require('inquirer');
const IPhoneFarmer = require('./IPhoneFarmer');
const postcodes = require('./postcodes.json');
const notifyOS = require('./notifyOS');

const askForProduct = async () => {
  const { parts } = IPhoneFarmer;
  const keyMap = _.invert(parts);
  const { products } = await inquirer.prompt({
    type: 'checkbox',
    message: 'Which models would you like?',
    name: 'products',
    choices: Object.values(parts)
  });

  if (!products.length) {
    console.error('You must select at least one product!');
    process.exit();
  }
  return products.map(name => keyMap[name]);
};

const askForPostcode = async () => {
  const { parts } = IPhoneFarmer;
  const { city } = await inquirer.prompt({
    type: 'list',
    message: 'Which city are you in?',
    name: 'city',
    choices: Object.keys(postcodes)
  });
  return postcodes[city];
};

// Ask which iPhone

(async function() {
  const products = await askForProduct();
  const postcode = await askForPostcode();
  const farmer = new IPhoneFarmer({
    products,
    interval: process.env.INTERVAL || 5, // 5 minutes
    location: postcode,
    onResult: notifyOS.notify
  });
})();

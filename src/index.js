require('./printTitle');
const _ = require('lodash');
const inquirer = require('inquirer');
const IPhoneFarmer = require('./IPhoneFarmer');
const postcodes = require('./postcodes.json');
const notifyOS = require('./notifyOS');
const LocalStorage = require('node-localstorage').LocalStorage;

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

const localstorage = new LocalStorage('./savedata');

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

const askUseSave = async (products, postcode) => {
  const productNames = products.split(',').map(key => IPhoneFarmer.parts[key]);

  const { useSave } = await inquirer.prompt({
    type: 'confirm',
    message: `Would you like to use old save?\n Phones: ${productNames}\n Postcode: ${postcode}\n`,
    name: 'useSave',
    choices: Object.keys(postcodes)
  });

  if (!useSave) {
    localstorage.removeItem('products');
    localstorage.removeItem('postcode');
  }
};
// Starts the app

(async function() {
  let products = localstorage.getItem('products');
  let postcode = localstorage.getItem('postcode');

  if (products && postcode) await askUseSave(products, postcode);

  if (!products) {
    products = await askForProduct();
    localstorage.setItem('products', products);
  } else {
    products = products.split(',');
  }

  if (!postcode) {
    postcode = await askForPostcode();
    localstorage.setItem('postcode', postcode);
  }

  const farmer = new IPhoneFarmer({
    products,
    interval: process.env.INTERVAL || 5, // 5 minutes
    location: postcode,
    onResult: notifyOS.notify
  });
})();

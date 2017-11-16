const text = require('textbelt');
const inquirer = require('inquirer');
const IPhoneFarmer = require('./IPhoneFarmer');
const LocalStorage = require('node-localstorage').LocalStorage;

const localstorage = new LocalStorage('./savedata');

const askForMobile = async () => {
  const { parts } = IPhoneFarmer;
  const { mobile } = await inquirer.prompt({
    type: 'prompt',
    message: 'What is your mobile for sms?',
    name: 'mobile'
  });
  return mobile;
};

module.exports = {
  notify: (isFound, stores) => {
    if (!isFound) return;
    let message = '';

    stores.forEach(store => {
      const { partsAvailability } = store;
      Object.keys(partsAvailability).forEach(key => {
        const oneAvailability = partsAvailability[key];
        if (!isAvailable(oneAvailability)) return;
        // Else notify terminal
        const iPhone = IPhoneFarmer.parts[key];
        message += `\n${iPhone} found at ${store.storeName} store.`;
      });
    });

    text.send(localstorage.getItem('mobile'), message, undefined, err => {
      if (err) console.log(err);
    });
  },
  checkMobile: async () => {
    if (!localstorage.getItem('mobile')) {
      return askForMobile().then(mobile =>
        localstorage.setItem('mobile', mobile)
      );
    }
  }
};

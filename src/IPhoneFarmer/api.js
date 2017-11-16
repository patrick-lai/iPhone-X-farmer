const _ = require('lodash');
const axios = require('axios');
const qs = require('querystring');

axios.defaults.baseURL = 'http://www.apple.com/au/shop/retail';

const normalize = data => {
  const stores = data.body.stores;
  return stores.map(s =>
    _.pick(s, ['storeName', 'partsAvailability', 'reservationUrl'])
  );
};

module.exports = {
  fetch: params => {
    return axios('pickup-message', { params }).then(r => normalize(r.data));
  }
};

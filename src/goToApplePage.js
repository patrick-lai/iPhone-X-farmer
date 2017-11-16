const opn = require('opn');

module.exports = {
  notify: isFound => {
    if (!isFound) return;
    opn(
      'https://www.apple.com/au/shop/buy-iphone/iphone-x/5.8-inch-display-256gb-space-grey'
    );
  }
};

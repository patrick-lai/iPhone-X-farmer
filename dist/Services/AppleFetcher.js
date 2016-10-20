'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _config = require('../config.js');

var _config2 = _interopRequireDefault(_config);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AppleFetcher = function () {
  function AppleFetcher() {
    _classCallCheck(this, AppleFetcher);

    this.googleSheetUrl = 'https://spreadsheets.google.com/feeds/list/%KEY%/od6/public/values?alt=json';

    this.products = {
      'parts.0': 'MN4X2X/A', //Apple iPhon 7 Plus 256GB - Silver $1,569.00
      'parts.1': 'MN922X/A', //Apple iPhone 7 128GB - Black $1,229.00
      'parts.2': 'MN942X/A', //Apple iPhone 7 128GB - Gold $1,229.00
      'parts.3': 'MN962X/A', //Apple iPhone 7 128GB - Jet Black $1,229.00
      'parts.4': 'MN932X/A', //Apple iPhone 7 128GB - Silver $1,229.00
      'parts.5': 'MN972X/A', //Apple iPhone 7 256GB - Black $1,379.50
      'parts.6': 'MN992X/A', //Apple iPhone 7 256GB - Gold $1,379.50
      'parts.7': 'MN9C2X/A', //Apple iPhone 7 256GB - Jet Black $1,379.50
      'parts.8': 'MN8X2X/A', //Apple iPhone 7 32GB - Black $1,079.50
      'parts.9': 'MN902X/A', //Apple iPhone 7 32GB - Gold $1,079.50
      'parts.10': 'MN912X/A', //Apple iPhone 7 32GB - Rose Gold $1,079.50
      'parts.11': 'MN8Y2X/A', //Apple iPhone 7 32GB - Silver $1,079.50
      'parts.12': 'MN4M2X/A', //Apple iPhone 7 Plus 128GB - Black $1,419.00
      'parts.13': 'MN4Q2X/A', //Apple iPhone 7 Plus 128GB - Gold $1,419.00
      'parts.14': 'MN4P2X/A', //Apple iPhone 7 Plus 128GB - Silver $1,419.00
      'parts.15': 'MN4W2X/A', //Apple iPhone 7 Plus 256GB - Black $1,569.00
      'parts.16': 'MN4Y2X/A', //Apple iPhone 7 Plus 256GB - Gold $1,569.00
      'parts.17': 'MN512X/A', //Apple iPhone 7 Plus 256GB - Jet Black $1,569.00
      'parts.18': 'MNQP2X/A', //Apple iPhone 7 Plus 32GB - Gold $1,269.50
      'parts.19': 'MNQN2X/A', //Apple iPhone 7 Plus 32GB - Silver $1,269.50
      'parts.20': 'MNQQ2X/A' //Apple iPhone 7 Plus 32GB- Rose Gold $1,269.50
    };

    this.locations = {
      perth: 6000,
      sydney: 2000,
      melbourne: 3000,
      brisbane: 4000,
      adelaide: 5000,
      tasmania: 7000,
      darwin: '0800'
    };

    this.baseUrl = 'http://www.apple.com/au/shop/retail/pickup-message?';

    this.stores = {};

    this.tokens = [];

    this.interval = null;
  }

  _createClass(AppleFetcher, [{
    key: 'fetchAllStores',
    value: function fetchAllStores() {
      for (var location in this.locations) {
        this.singleFetch(location);
      }
    }
  }, {
    key: 'singleFetch',
    value: function singleFetch(location) {

      var parameters = _querystring2.default.stringify(_extends({}, this.products, {
        'location': location
      }));

      var options = {
        uri: this.baseUrl + parameters,
        json: true
      };

      var $this = this;

      (0, _requestPromise2.default)(options).then(function (data) {
        // Merge the data into body
        if (!data.body.stores) return;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = data.body.stores[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var store = _step.value;

            $this.stores[store.storeNumber] = store;
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }).catch(function (err) {
        console.log("ERROR", err);
      });
    }
  }, {
    key: 'fetchTokens',
    value: function fetchTokens(googleSheetKey) {

      var options = {
        uri: this.googleSheetUrl.replace("%KEY%", googleSheetKey),
        json: true
      };

      var $this = this;

      (0, _requestPromise2.default)(options).then(function (data) {
        // Merge the data into body
        if (!data.feed.entry) return;

        // Refresh our tokens
        $this.tokens = data.feed.entry.map(function (entry) {
          return entry.gsx$token.$t;
        });
      }).catch(function (err) {
        console.log("ERROR", err);
      });
    }
  }, {
    key: 'watchAppleStores',
    value: function watchAppleStores() {
      // Loop fetch
      if (this.interval == null) {
        this.interval = setInterval(function () {
          fetchAllStores();
          fetchTokens(_config2.default.googleSheetKey);
        }, _config2.default.fetchInterval);
      }
    }
  }, {
    key: 'getStores',
    value: function getStores(token) {
      // Check token
      if (this.tokens.indexOf(token) < 0) return {};
      // Else return
      return this.stores;
    }
  }]);

  return AppleFetcher;
}();

exports.default = AppleFetcher;
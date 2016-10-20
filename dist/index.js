'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _AppleFetcher = require('./Services/AppleFetcher');

var _AppleFetcher2 = _interopRequireDefault(_AppleFetcher);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var appleFetcher = new _AppleFetcher2.default();

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.use(_express2.default.static('dist/public'));

app.get('/fetch', function (req, res, next) {
  if (!req.query.token) return;
  res.json(appleFetcher.getStores(req.query.token));
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

appleFetcher.fetchAllStores();
appleFetcher.fetchTokens(_config2.default.googleSheetKey);

// appleFetcher.watchAppleStores();
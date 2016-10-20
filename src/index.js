
import express from 'express';
import AppleFetcher from './Services/AppleFetcher'
import Config from './config';

var app = express();
var appleFetcher = new AppleFetcher();

app.get('/', function (req, res) {
  res.sendFile(__dirname+'/public/index.html');
});

app.use(express.static('dist/public'));

app.get('/fetch', function(req, res, next) {
  if(!req.query.token) return;
  res.json(appleFetcher.getStores(req.query.token));
});

app.listen(80, function () {
  console.log('Example app listening on port 80!');
});

appleFetcher.fetchAllStores();
appleFetcher.fetchTokens(Config.googleSheetKey);

// appleFetcher.watchAppleStores();


import express from 'express';
import AppleFetcher from './Services/AppleFetcher'
import Config from './config';

var app = express();
var appleFetcher = new AppleFetcher();
var port = process.env.PORT || 5000;

app.get('/', function (req, res) {
  res.sendFile(__dirname+'/public/index.html');
});

app.use(express.static('dist/public'));

app.get('/fetch', function(req, res, next) {
  if(!req.query.token) return;
  res.json(appleFetcher.getStores(req.query.token));
});

app.listen(port, function () {
  console.log('Example app listening on port ' + port);
});

appleFetcher.fetchAllStores();
appleFetcher.fetchTokens(Config.googleSheetKey);

appleFetcher.watchAppleStores();

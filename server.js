var express = require('express');
var app = express();
var rp = require('request-promise');

app.get('/', function (req, res) {
  res.sendFile(__dirname+'/index.html');
});

app.get('/fetch', function(req, res, next) {

  var options = {
      uri: req.query.url,
      json: true
  };

  rp(options)
  .then(function (data) {
      res.json(data)
  })
  .catch(function (err) {
      res.json({
        success: false
      })
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

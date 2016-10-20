'use strict'

import rp from 'request-promise';
import Config from '../config.js';
import qs from 'querystring';

class AppleFetcher {
  constructor(){
    this.googleSheetUrl = 'https://spreadsheets.google.com/feeds/list/%KEY%/od6/public/values?alt=json';

    this.products = {
      'parts.0' : 'MN4X2X/A', //Apple iPhon 7 Plus 256GB - Silver $1,569.00
      'parts.1' : 'MN922X/A', //Apple iPhone 7 128GB - Black $1,229.00
      'parts.2' : 'MN942X/A', //Apple iPhone 7 128GB - Gold $1,229.00
      'parts.3' : 'MN962X/A', //Apple iPhone 7 128GB - Jet Black $1,229.00
      'parts.4' : 'MN932X/A', //Apple iPhone 7 128GB - Silver $1,229.00
      'parts.5' : 'MN972X/A', //Apple iPhone 7 256GB - Black $1,379.50
      'parts.6' : 'MN992X/A',//Apple iPhone 7 256GB - Gold $1,379.50
      'parts.7' : 'MN9C2X/A', //Apple iPhone 7 256GB - Jet Black $1,379.50
      'parts.8' : 'MN8X2X/A', //Apple iPhone 7 32GB - Black $1,079.50
      'parts.9' : 'MN902X/A', //Apple iPhone 7 32GB - Gold $1,079.50
      'parts.10' : 'MN912X/A', //Apple iPhone 7 32GB - Rose Gold $1,079.50
      'parts.11' : 'MN8Y2X/A', //Apple iPhone 7 32GB - Silver $1,079.50
      'parts.12' : 'MN4M2X/A', //Apple iPhone 7 Plus 128GB - Black $1,419.00
      'parts.13' : 'MN4Q2X/A', //Apple iPhone 7 Plus 128GB - Gold $1,419.00
      'parts.14' : 'MN4P2X/A', //Apple iPhone 7 Plus 128GB - Silver $1,419.00
      'parts.15' : 'MN4W2X/A', //Apple iPhone 7 Plus 256GB - Black $1,569.00
      'parts.16' : 'MN4Y2X/A', //Apple iPhone 7 Plus 256GB - Gold $1,569.00
      'parts.17' : 'MN512X/A', //Apple iPhone 7 Plus 256GB - Jet Black $1,569.00
      'parts.18' : 'MNQP2X/A', //Apple iPhone 7 Plus 32GB - Gold $1,269.50
      'parts.19' : 'MNQN2X/A', //Apple iPhone 7 Plus 32GB - Silver $1,269.50
      'parts.20' : 'MNQQ2X/A', //Apple iPhone 7 Plus 32GB- Rose Gold $1,269.50,
      'parts.21' : 'MN4V2X/A', //Apple iPhone 7 Plus 128GB- Jet Black $1,419.00,
      'parts.22' : 'MNQM2X/A', //Apple iPhone 7 Plus 32GB- Black
      'parts.23' : 'MN4U2X/A', // Rose Gold Plus 128GB
      'parts.24' : 'MN502X/A' // Rose Gold Plus 256GB
    }

    this.locations = {
      perth : 6000,
      sydney : 2000,
      melbourne: 3000,
      brisbane: 4000,
      adelaide: 5000,
      tasmania: 7000,
      darwin : '0800'
    }

    this.baseUrl = 'http://www.apple.com/au/shop/retail/pickup-message?';

    this.stores = {

    }

    this.tokens = [];

    this.interval = null;
  }

  fetchAllStores(){
    for ( var location in this.locations){
      this.singleFetch(location);
    }
  }

  singleFetch(location){

      var parameters = qs.stringify({
        ...this.products,
        'location' : location
      });

      var options = {
          uri: this.baseUrl+parameters,
          json: true
      };

      var $this = this;

      rp(options)
      .then(function (data) {
        // Merge the data into body
        if(!data.body.stores) return;
        for(var store of data.body.stores){
          $this.stores[store.storeNumber] = store;
        }
      })
      .catch(function (err) {
        console.log("ERROR",err);
      });
  }

  fetchTokens(googleSheetKey){

    var options = {
        uri: this.googleSheetUrl.replace("%KEY%", googleSheetKey),
        json: true
    };

    var $this = this;

    rp(options)
    .then(function (data) {
      // Merge the data into body
      if(!data.feed.entry) return;

      // Refresh our tokens
      $this.tokens = data.feed.entry.map((entry)=>{
        return entry.gsx$token.$t
      })
    })
    .catch(function (err) {
      console.log("ERROR",err);
    });
  }

  watchAppleStores(){
    // Loop fetch
    if(this.interval == null){
      this.interval = setInterval(function() {
        fetchAllStores();
        fetchTokens(Config.googleSheetKey);
      }, Config.fetchInterval);
    }
  }

  getStores(token){
    // Check token
    if(this.tokens.indexOf(token) < 0) return {};
    // Else return
    return this.stores;
  }
}

export default AppleFetcher;

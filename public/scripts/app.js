(function() {
  'use strict';

  angular.element(document).ready(function() {
    angular.bootstrap(document, ['app']);
  });

  function MainCtrl($scope, $http, $interval) {
    console.log('MainCtrl loaded!');
    $scope.token = localStorage.getItem('token');
    $scope.status;
    $scope.data;
    $scope.countDown;
    $scope.intervalTime = 120000;
    $scope.audio = new Audio('http://soundbible.com/mp3/sms-alert-3-daniel_simon.mp3');

    $scope.audio.volume = .5;

    $scope.states = ['NSW','TAS', 'SA', 'WA', 'QLD', 'VIC', 'NT'];
    $scope.phones = [
    { "partNumber": "MN8X2X/A", "storePickupProductTitle": "Black 32GB" },
    { "partNumber": "MN922X/A", "storePickupProductTitle": "Black 128GB" },
    { "partNumber": "MN972X/A", "storePickupProductTitle": "Black 256GB" },

    { "partNumber": "MNQM2X/A", "storePickupProductTitle": "Black Plus 32GB" },
    { "partNumber": "MN4M2X/A", "storePickupProductTitle": "Black Plus 128GB" },
    { "partNumber": "MN4W2X/A", "storePickupProductTitle": "Black Plus 256GB" },

    { "partNumber": "MN902X/A", "storePickupProductTitle": "Gold 32GB" },
    { "partNumber": "MN942X/A", "storePickupProductTitle": "Gold 128GB" },
    { "partNumber": "MN992X/A", "storePickupProductTitle": "Gold 256GB" },

    { "partNumber": "MNQP2X/A", "storePickupProductTitle": "Gold Plus 32GB" },
    { "partNumber": "MN4Q2X/A", "storePickupProductTitle": "Gold Plus 128GB" },
    { "partNumber": "MN4Y2X/A", "storePickupProductTitle": "Gold Plus 256GB" },

    { "partNumber": "MN912X/A", "storePickupProductTitle": "Rose Gold 32GB" },

    { "partNumber": "MNQQ2X/A", "storePickupProductTitle": "Rose Gold Plus 32GB" },
    { "partNumber": "MN4U2X/A", "storePickupProductTitle": "Rose Gold Plus 128GB" },
    { "partNumber": "MN502X/A", "storePickupProductTitle": "Rose Gold Plus 256GB" },

    { "partNumber": "MN962X/A", "storePickupProductTitle": "Jet Black 128GB" },
    { "partNumber": "MN9C2X/A", "storePickupProductTitle": "Jet Black 256GB" },

    { "partNumber": "MN4V2X/A", "storePickupProductTitle": "Jet Black Plus 128GB" },
    { "partNumber": "MN512X/A", "storePickupProductTitle": "Jet Black Plus 256GB" },

    { "partNumber": "MN8Y2X/A", "storePickupProductTitle": "Silver 32GB" },
    { "partNumber": "MN932X/A", "storePickupProductTitle": "Silver 128GB" },

    { "partNumber": "MNQN2X/A", "storePickupProductTitle": "Silver Plus 32GB" },
    { "partNumber": "MN4P2X/A", "storePickupProductTitle": "Silver Plus 128GB" },
    { "partNumber": "MN4X2X/A", "storePickupProductTitle": "Silver Plus 256GB" }
   ];

    $scope.sorted = function(){
      return _.sortBy($scope.phones, 'storePickupProductTitle');
    }

    $scope.checkedStates = {};
    $scope.checkedPhones= {};

    $scope.isStateChecked = function(state){
      return $scope.checkedStates[state] ? true : false;
    }

    $scope.isPhoneChecked = function(phone){
      return $scope.checkedPhones[phone] ? true : false;
    }

    $scope.getPhones = function(){
      if(!$scope.data) return [];
      var firstStore = _.values($scope.data);
      var phones = _.values(firstStore[0].partsAvailability);
      return _.map(phones, function(phone){
        return _.pick(phone, ['partNumber', 'storePickupProductTitle']);
      });
    }

    $scope.fetchData = function(){

      if(!$scope.token){
        $scope.status = "Please enter your token";
        return;
      }

      $http({
        method: 'GET',
        url: "/fetch?token="+$scope.token
      }).then(function(data){
        $scope.data = data.data;
        var d = new Date();
        var dateString = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        $scope.status = "Last fetched at " + dateString;
      });
    }

    $scope.notify = function(phone){
      $scope.audio.play();
      Push.create("Found iphone", {
          body: phone,
          timeout: 4000,
          onClick: function () {
              window.focus();
              this.close();
          }
      });
    }

    $scope.saveTokenAndFetch = function(){
      localStorage.setItem('token', $scope.token);
      $scope.fetchData();
      $scope.countDown = $scope.intervalTime/1000;
    }

    // Interval
    $interval(function(){
      $scope.fetchData();
      // Set the time
      $scope.countDown = $scope.intervalTime/1000;
    }, $scope.intervalTime);

    // Timer
    $interval(function(){
      $scope.countDown -= 1;
    }, 1000);
  }

  function run($rootScope) {
    console.log("App Running!");
  }

  angular.module('app', [
      'ngLodash',
    ])
    .run(run)
    .controller('MainCtrl', MainCtrl)
    .value('version', '1.1.0');
})();

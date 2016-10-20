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

    $scope.states = ['NSW','TAS', 'SA', 'WA', 'QLD', 'VIC', 'NT'];
    $scope.phones = [{"partNumber":"MNQP2X/A","storePickupProductTitle":"iPhone 7 Plus 32GB Gold"},{"partNumber":"MN4W2X/A","storePickupProductTitle":"iPhone 7 Plus 256GB Black"},{"partNumber":"MN962X/A","storePickupProductTitle":"iPhone 7 128GB Jet Black"},{"partNumber":"MN4M2X/A","storePickupProductTitle":"iPhone 7 Plus 128GB Black"},{"partNumber":"MN4Y2X/A","storePickupProductTitle":"iPhone 7 Plus 256GB Gold"},{"partNumber":"MNQN2X/A","storePickupProductTitle":"iPhone 7 Plus 32GB Silver"},{"partNumber":"MN942X/A","storePickupProductTitle":"iPhone 7 128GB Gold"},{"partNumber":"MN4P2X/A","storePickupProductTitle":"iPhone 7 Plus 128GB Silver"},{"partNumber":"MN512X/A","storePickupProductTitle":"iPhone 7 Plus 256GB Jet Black"},{"partNumber":"MN922X/A","storePickupProductTitle":"iPhone 7 128GB Black"},{"partNumber":"MN9C2X/A","storePickupProductTitle":"iPhone 7 256GB Jet Black"},{"partNumber":"MN4X2X/A","storePickupProductTitle":"iPhone 7 Plus 256GB Silver"},{"partNumber":"MN902X/A","storePickupProductTitle":"iPhone 7 32GB Gold"},{"partNumber":"MN972X/A","storePickupProductTitle":"iPhone 7 256GB Black"},{"partNumber":"MN8Y2X/A","storePickupProductTitle":"iPhone 7 32GB Silver"},{"partNumber":"MN932X/A","storePickupProductTitle":"iPhone 7 128GB Silver"},{"partNumber":"MN992X/A","storePickupProductTitle":"iPhone 7 256GB Gold"},{"partNumber":"MN8X2X/A","storePickupProductTitle":"iPhone 7 32GB Black"},{"partNumber":"MN4Q2X/A","storePickupProductTitle":"iPhone 7 Plus 128GB Gold"},{"partNumber":"MN912X/A","storePickupProductTitle":"iPhone 7 32GB Rose Gold"},{"partNumber":"MNQQ2X/A","storePickupProductTitle":"iPhone 7 Plus 32GB Rose Gold"}];

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

'use strict';

app.controller('HomeCtrl', ['$scope', '$http',
  function($scope, $http, userService) {

    $scope.state = 'California';
    $scope.city = 'San Francisco';

    $scope.yahoo = {src: "https://weather.yahoo.com/united-states/"};
    $scope.yr = {src: "http://www.yr.no/"};
    $scope.wf = {src: "http://www.weather-forecast.com/"};


    $scope.init = function() {
      let state = $scope.state.toLowerCase();
      let city = $scope.city.toLowerCase();

      $http.get('/api/weather/yh/' + state + '/' + city)
        .then(function(response) {
        console.log(response.data);
        $scope.yahoo = response.data;
      }, function(err) {
        console.error(err);
        $scope.yahoo = undefined;
      });

      $http.get('/api/weather/yr/' + state + '/' + city)
        .then(function(response) {
        console.log(response.data);
        $scope.yr = response.data;
      }, function(err) {
        console.error(err);
        $scope.yr = undefined;
      });

      $http.get('/api/weather/wf/' + state + '/' + city)
        .then(function(response) {
        console.log(response.data);
        $scope.wf = response.data;
      }, function(err) {
        console.error(err);
        $scope.wf = undefined;
      });
    }

    $scope.getData = function($event, state, city) {
      $event.preventDefault();

      $scope.init();
    }

}]);

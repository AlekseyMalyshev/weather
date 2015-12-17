'use strict';

var app = angular.module('Weather', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'templates/home.html',
      controller: 'HomeCtrl'
    })
    .state('thread', {
      url: '/thread/:headId',
      templateUrl: 'templates/thread.html',
      controller: 'ThreadCtrl'
    })
    .state('register', {
      url: '/register',
      templateUrl: 'templates/register.html',
      controller: 'RegCtrl'
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'templates/profile.html',
      controller: 'ProfileCtrl'
    });

})
.service('userService', ['$http', function($http){

  this.user = null;

  this.isAuthenticated = function() {
    var token = localStorage.getItem('token');
    if (token !== null && token !== '') {
      $http.defaults.headers.common['Authenticate'] = token;
      return true;
    }
    else {
      return false;
    }
  }

  this.register = function(user, cb) {
    $http.post('/api/users/register/', user)
      .then(function(result) {
        $('h4.error').text('Congratulations! You have successfully regidtered. Please login and participate in discussions');
        $('div#show-error').modal();
        cb();
      }, function (err) {
        if (err.status === 401) {
          $('h4.error').text('This username is already teaken.');
        }
        else {
          $('h4.error').text('We cannot register you at this time. Please try again later.');
        }
        $('div#show-error').modal();
      });
  }

  this.authenticate = function(user) {
    self = this;
    $http.post('/api/users/authenticate/', user)
      .then(function(result) {
        self.user = result.data;
        var token = result.headers('Authenticate');
        localStorage.setItem('token', token);
        if (token !== null && token !== '') {
          $http.defaults.headers.common['Authenticate'] = token;
        }
      }, function (err) {
        if (err.status === 401) {
          $('h4.error').text('Authentication data is incorrect.');
        }
        else {
          $('h4.error').text('We cannot authenticate you at this time. Please try again later.');
        }
        $('div#show-error').modal();
      });
  }

  this.logout = function(user) {
    localStorage.setItem('token', '');
    delete $http.defaults.headers.common['Authenticate'];
  }

}]);

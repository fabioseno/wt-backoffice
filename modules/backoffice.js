/*global angular*/
var wtBackoffice = angular.module('wt-backoffice', ['wt-core', 'wt-ui', 'ngRoute', 'ngTouch']);

wtBackoffice.config(['$routeProvider', function ($routeProvider) {
    'use strict';
    
    $routeProvider.when('/', {
        templateUrl: 'modules/login/login.html',
        controller: 'loginController'
    });
}]);

wtBackoffice.run(function($http) {
  $http.defaults.headers.post["Content-Type"] = "application/json";
});
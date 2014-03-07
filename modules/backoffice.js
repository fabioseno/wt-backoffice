/*global angular*/
var wtBackoffice = angular.module('wt-backoffice', ['wt-core', 'wt-ui', 'ngRoute', 'ngTouch']);

wtBackoffice.config(['$routeProvider', function ($routeProvider) {
    'use strict';
    
    $routeProvider.when('/', {
        templateUrl: 'modules/login/login.html',
        controller: 'loginController'
    }).when('/users', {
        templateUrl: 'modules/user/userList.html',
        controller: 'userListController'
    }).when('/user', {
        templateUrl: 'modules/user/userDetails.html',
        controller: 'userDetailsController'
    }).when('/user/:id', {
        templateUrl: 'modules/user/userDetails.html',
        controller: 'userDetailsController'
    }).otherwise({
        redirectTo: '/'
    });
}]);

wtBackoffice.run(function ($http) {
    'use strict';
    
    $http.defaults.headers.post["Content-Type"] = "application/json";
});
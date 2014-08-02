/*global angular*/
var app = angular.module('wt-backoffice', ['wt-core', 'wt-ui', 'ngRoute', 'ngTouch']);

app.config(['$routeProvider', function ($routeProvider) {
    'use strict';
    
    $routeProvider.when('/', {
        templateUrl: 'www/components/login/login.html',
        controller: 'loginController'
    }).when('/users', {
        templateUrl: 'www/components/user/userList.html',
        controller: 'userListController'
    }).when('/user', {
        templateUrl: 'www/components/user/userDetails.html',
        controller: 'userDetailsController'
    }).when('/user/:id', {
        templateUrl: 'www/components/user/userDetails.html',
        controller: 'userDetailsController'
    }).otherwise({
        redirectTo: '/'
    });
}]);

app.run(function ($http) {
    'use strict';
    
    $http.defaults.headers.post["Content-Type"] = "application/json";
});
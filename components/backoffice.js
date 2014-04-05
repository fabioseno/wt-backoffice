/*global angular*/
var wtBackoffice = angular.module('wt-backoffice', ['wt-core', 'wt-ui', 'ngRoute', 'ngTouch']);

wtBackoffice.config(['$routeProvider', function ($routeProvider) {
    'use strict';
    
    $routeProvider.when('/', {
        templateUrl: 'components/login/login.html',
        controller: 'loginController'
    }).when('/users', {
        templateUrl: 'components/user/userList.html',
        controller: 'userListController'
    }).when('/user', {
        templateUrl: 'components/user/userDetails.html',
        controller: 'userDetailsController'
    }).when('/user/:id', {
        templateUrl: 'components/user/userDetails.html',
        controller: 'userDetailsController'
    }).otherwise({
        redirectTo: '/'
    });
}]);

wtBackoffice.run(function ($http) {
    'use strict';
    
    $http.defaults.headers.post["Content-Type"] = "application/json";
});
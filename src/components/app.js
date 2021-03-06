/*global angular*/
angular
    .module('wt-backoffice', ['wt-core', 'wt-ui', 'ngRoute', 'ngTouch', 'angularFileUpload'])

    .config(['$routeProvider', function ($routeProvider) {
        'use strict';

        $routeProvider.when('/', {
            templateUrl: 'components/login/login.html',
            controller: 'login',
            controllerAs: 'vm'
        }).when('/users', {
            templateUrl: 'components/user/userList.html',
            controller: 'userList',
            controllerAs: 'vm'
        }).when('/user', {
            templateUrl: 'components/user/userDetails.html',
            controller: 'userDetails',
            controllerAs: 'vm'
        }).when('/user/:id', {
            templateUrl: 'components/user/userDetails.html',
            controller: 'userDetails',
            controllerAs: 'vm'
        }).when('/user/resetPassword/:id', {
            templateUrl: 'components/user/resetPassword.html',
            controller: 'resetPassword',
            controllerAs: 'vm'
        }).when('/profile', {
            templateUrl: 'components/profile/myProfile.html',
            controller: 'myProfile',
            controllerAs: 'vm'
        }).when('/profile/changePassword', {
            templateUrl: 'components/profile/changePassword.html',
            controller: 'changePassword',
            controllerAs: 'vm'
        }).when('/files/upload', {
            templateUrl: 'components/files/upload.html',
            controller: 'upload',
            controllerAs: 'vm'
        }).otherwise({
            redirectTo: '/'
        });
    }])

    .run(function ($http) {
        'use strict';

        $http.defaults.headers.post["Content-Type"] = "application/json";
    });
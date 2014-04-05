/*global wtBackoffice*/
wtBackoffice.controller('rootController', ['$scope', '$rootScope', '$window', '$location', 'eventHub', 'toastr', 'translate', function ($scope, $rootScope, $window, $location, eventHub, toastr, translate) {
    'use strict';
    
    $scope.location = $location;
    
    $scope.eventHub = eventHub;
    
    $scope.toastr = toastr;
    
    $scope.goBack = function () {
        $window.history.back();
    };
    
    $scope.goTo = function (url) {
        $location.path(url);
    };
    
    $rootScope.$on('APPLICATION_ERROR', function (event, data) {
        toastr.show(data, 'error');
    });
    
    $rootScope.$on('UNAUTHORIZED', function (event, data) {
        $scope.toastr.show(translate.getTerm('MSG_ACCESS_DENIED'), 'error');
        $location.path('/login');
    });
    
}]);
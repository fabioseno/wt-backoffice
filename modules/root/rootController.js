/*global wtBackoffice*/
wtBackoffice.controller('rootController', ['$scope', '$rootScope', '$location', 'eventHub',  'toastr', function ($scope, $rootScope, $location, eventHub, toastr) {
    'use strict';
    
    $scope.location = $location;
    
    $scope.eventHub = eventHub;
    
    $scope.toastr = toastr;
    
    $scope.goBack = function () {
        history.back();
    };
    
    $scope.goTo = function (url) {
        $location.path(url);
    };
    
    $rootScope.$on('APPLICATION_ERROR', function (event, data) {
        toastr.show(data, 'error');
    });
    
}]);
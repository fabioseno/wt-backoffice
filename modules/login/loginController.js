/*global wtBackoffice*/
wtBackoffice.controller('loginController', ['$scope', 'authentication', 'toastr', function ($scope, authentication, toastr) {
    'use strict';
    
    $scope.authenticate = function () {
        
        function onSuccess(result) {
            toastr.show('Access granted!', 'success');
        }
        
        function onError(error) {
            toastr.show(error, 'error');
        }
        
        authentication.authenticate($scope.email, $scope.password).then(onSuccess, onError);
    };
}]);
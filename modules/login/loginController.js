/*global wtBackoffice*/
wtBackoffice.controller('loginController', ['$scope', 'invoker', 'authentication', function ($scope, invoker, authentication) {
    'use strict';
    
    $scope.email = 'fabioseno@gmail.com';
    $scope.password = 'senha';
    $scope.loading = false;
    
    $scope.authenticate = function () {
        
        function onSuccess(result) {
            authentication.sessionId = result.data.sessionId;
            $scope.toastr.show('Access granted! ' + authentication.sessionId, 'success');
            $scope.location.path('/users');
        }
        
        function onError(error) {
            if (error.status === 401) {
                $scope.eventHub.fire('UNAUTHORIZED', error);
                $scope.toastr.show('Access denied!', 'error');
            }
        }
        
        function onFinally(error) {
            $scope.loading = false;
        }
        
        var data = {
            email: $scope.email,
            password: $scope.password
        };
        
        $scope.loading = true;
        
        invoker.invoke('authentication', 'authenticate', data, onSuccess, onError, onFinally);
        
    };
}]);
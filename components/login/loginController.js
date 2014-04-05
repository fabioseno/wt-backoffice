/*global wtBackoffice*/
wtBackoffice.controller('loginController', ['$scope', '$q', 'invoker', 'translate', 'authentication', 'processHandler', function ($scope, $q, invoker, translate, authentication, processHandler) {
    'use strict';
    
    var process = processHandler($scope, 'loading');
    
    $scope.email = 'fabioseno@gmail.com';
    $scope.password = 'senha';
    $scope.loading = process.loading;
    
    $scope.authenticate = function () {
        var data = {
            email: $scope.email,
            password: $scope.password
        };
        
        function onSuccess(result) {
            authentication.sessionId = result.headers('SessionId');
            $scope.toastr.show(translate.getTerm('MSG_ACCESS GRANTED', result.data.name), 'success');
            $scope.location.path('/users');
        }
        
        function onError(error) {
            $scope.toastr.show(translate.getTerm('MSG_OPERATION_FAIL'), 'error');
        }
        
        invoker.invoke('authentication', 'authenticate', data, process.onStart, onSuccess, onError, process.onFinally);
        
    };
}]);
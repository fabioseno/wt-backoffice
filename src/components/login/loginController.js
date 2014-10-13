/*global app, jsSHA*/
/*jslint newcap: true */
app.controller('loginController', ['$scope', '$q', 'invoker', 'translate', 'authentication', 'processHandler', function ($scope, $q, invoker, translate, authentication, processHandler) {
    'use strict';
    
    var process = processHandler($scope, 'loading');
    
    $scope.email = 'fabioseno@gmail.com';
    $scope.password = 'senha';
    $scope.loading = process.loading;
    
    $scope.authenticate = function () {
        var shaObj = new jsSHA($scope.password, "TEXT"),
            hash = shaObj.getHMAC($scope.email, "TEXT", "SHA-1", "B64"),
            data = {
                email: $scope.email,
                password: hash
            };
        
        function onSuccess(result) {
            authentication.sessionId = result.headers('SessionId');
            $scope.toastr.show(translate.getTerm('MSG_ACCESS GRANTED', result.data.$$data.name), 'success');
            $scope.location.path('/users');
        }
        
        function onError(error) {
            $scope.toastr.show(translate.getTerm('MSG_OPERATION_FAIL'), 'error');
        }
        
        invoker.invoke('authentication', 'authenticate', data, process.onStart, onSuccess, onError, process.onFinally);
        
    };
}]);
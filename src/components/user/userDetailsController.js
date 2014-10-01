/*global app*/
app.controller('userDetailsController', ['$scope', '$routeParams', '$window', 'invoker', 'translate', 'processHandler', function ($scope, $routeParams, $window, invoker, translate, processHandler) {
    'use strict';
    
    var process = processHandler($scope, 'loading');
    
    $scope.user = {};
    $scope.loading = process.loading;
    $scope.saveLabel = translate.getTerm('LBL_CREATE');
    $scope.isNew = true;
    
    function execute(operation) {
        function onSuccess(result) {
            $scope.toastr.show(translate.getTerm('MSG_OPERATION_SUCCESS'), 'success');
            $scope.location.path('/users');
        }

        invoker.invoke('user', operation, $scope.user, process.onStart, onSuccess, process.onError, process.onFinally);
    }
    
    $scope.save = function () {
        var operation = 'updateUser';
        
        if ($scope.isNew) {
            operation = 'createUser';
        }
        
        execute(operation);
    };
    
    $scope.remove = function () {
        if ($window.confirm(translate.getTerm('MSG_CONFIRM_OPERATION'))) {
            execute('removeUser');
        }
    };
    
    $scope.showUserDetails = function (id) {
        
        var data = {id: id};
        
        if (id) {
            $scope.isNew = false;
            $scope.saveLabel = translate.getTerm('LBL_UPDATE');
        } else {
            return;
        }
        
        function onSuccess(result) {
            $scope.user = result.data.$$data;
        }
        
        invoker.invoke('user', 'getDetails', data, process.onStart, onSuccess, process.onError, process.onFinally);
        
    };
    
    $scope.showUserDetails($routeParams.id);
    
}]);
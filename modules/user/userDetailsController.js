/*global wtBackoffice*/
wtBackoffice.controller('userDetailsController', ['$scope', '$routeParams', 'invoker', function ($scope, $routeParams, invoker) {
    'use strict';
    
    $scope.user = {};
    $scope.loading = false;
    $scope.saveLabel = 'Create';
    $scope.isNew = true;
    
    function execute (operation){
        var options = {
            loaderObject: $scope,
            loaderProperty: 'loading'
        };
        
        function onSuccess(result) {
            $scope.toastr.show('Operation completed', 'success');
            $scope.location.path('/users');
        }
        
        invoker.invoke('user', operation, $scope.user, onSuccess, null, null, options);
    }
    
    $scope.save = function () {
        var operation = 'updateUser';
        
        if ($scope.isNew) {
            operation = 'createUser';
        }
        
        execute(operation);
    };
    
    $scope.delete = function () {
        execute('deleteUser');
    };
    
    $scope.showUserDetails = function (id) {
        
        var data = {id: id},
            options = {
                loaderObject: $scope,
                loaderProperty: 'loading'
            };
        
        if (id) {
            $scope.isNew = false;
            $scope.saveLabel = 'Update';
        } else {
            return;
        }
        
        function onSuccess(result) {
            $scope.user = result.data;
        }
        
        invoker.invoke('user', 'getDetails', data, onSuccess, null, null, options);
        
    };
    
    $scope.showUserDetails($routeParams.id);
    
}]);
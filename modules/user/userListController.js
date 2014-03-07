/*global wtBackoffice*/
wtBackoffice.controller('userListController', ['$scope', 'invoker', function ($scope, invoker) {
    'use strict';
    
    $scope.users = [];
    $scope.loading = false;
    
    $scope.page = function(num) {
        $scope.showUsers(num);
    };
    
    $scope.showUsers = function (page) {
        
        var data = {
            filter: {},
            options: {
                pageSize: 2,
                currentPage: page,
                sort: {
                    name: -1
                }
            }
        },
            options = {
                loaderObject: $scope,
                loaderProperty: 'loading'
            };
        
        function onSuccess(result) {
            $scope.users = result.data;
        }
        
        invoker.invoke('user', 'getList', data, onSuccess, null, null, options);
        
    };
    
    $scope.showUsers(1);
    
}]);
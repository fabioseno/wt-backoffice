/*global app*/
app.controller('userListController', ['$scope', 'invoker', 'processHandler', function ($scope, invoker, processHandler) {
    'use strict';
    
    var process = processHandler($scope, 'loading');
    
    $scope.users = [];
    $scope.currentPage = 1;
    $scope.loading = process.loading;
    
    $scope.showUsers = function (page) {
        
        var data = {
            filter: {},
            options: {
                pageSize: 2,
                currentPage: page,
                sort: {
                    name: 1
                }
            }
        };
        
        function onSuccess(result) {
            $scope.users = result.data.list;
            $scope.totalPages = result.data.totalPages;
            $scope.currentPage = result.data.currentPage;
        }
        
        invoker.invoke('user', 'getList', data, process.onStart, onSuccess, process.onError, process.onFinally);
        
    };
    
    $scope.showUsers(1);
    
}]);
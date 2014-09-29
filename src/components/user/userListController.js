/*global app*/
app.controller('userListController', ['$scope', 'invoker', 'processHandler', function ($scope, invoker, processHandler) {
    'use strict';

    var process = processHandler($scope, 'loading');

    $scope.users = [];
    $scope.currentPage = 1;
    $scope.sortField = {
        name: 1
    };
    $scope.loading = process.loading;

    $scope.sort = function (field) {
        if (!$scope.sortField[field]) {
            $scope.sortField = {};
            $scope.sortField[field] = 1;
        } else {
            $scope.sortField[field] = $scope.sortField[field] === 1 ? -1 : 1;
        }

        $scope.showUsers($scope.currentPage);
    };

    $scope.showUsers = function (page) {

        var data = {
            filter: {},
            page: {
                pageSize: 2,
                currentPage: page
            }
        };

        if ($scope.sortField) {
            data.sort = $scope.sortField;
        }

        function onSuccess(result) {
            $scope.users = result.data.list;
            $scope.totalPages = result.data.page.totalPages;
            $scope.currentPage = result.data.page.currentPage;
        }

        invoker.invoke('user', 'getList', data, process.onStart, onSuccess, process.onError, process.onFinally);

    };

    $scope.showUsers(1);

}]);
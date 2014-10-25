/*global angular*/
(function () {
    'use strict';

    function UserList(hub) {
        
        var vm = this,
            process = hub.processHandler(vm, 'loading');

        vm.users = [];
        vm.currentPage = 1;
        vm.sortField = {
            name: 1
        };

        vm.loading = process.loading;

        vm.sort = function (field) {
            if (!vm.sortField[field]) {
                vm.sortField = {};
                vm.sortField[field] = 1;
            } else {
                vm.sortField[field] = vm.sortField[field] === 1 ? -1 : 1;
            }

            vm.showUsers(vm.currentPage);
        };

        vm.showUsers = function (page) {

            var data = {
                filter: {},
                page: {
                    pageSize: 2,
                    currentPage: page
                }
            };

            if (vm.sortField) {
                data.sort = vm.sortField;
            }

            function onSuccess(result) {
                vm.users = result.data.$$data.list;
                vm.totalPages = result.data.$$data.page.totalPages;
                vm.currentPage = result.data.$$data.page.currentPage;
            }

            hub.invoker.invoke('user', 'getList', data, process.onStart, onSuccess, process.onError, process.onFinally);

        };

        vm.showUsers(1);

    }

    UserList.$inject = ['hub'];

    angular.module('wt-backoffice').controller('userList', UserList);
    
}());
/*global angular*/
(function () {
    'use strict';

    function UserList(hub, form) {
        
        var vm = this,
            process = hub.processHandler(vm, 'loading');

        vm.users = [];
        vm.currentPage = 1;
        vm.sortField = {
            name: 1
        };

        vm.loading = process.loading;

        vm.sort = function (field) {
            form.sort(vm, field, vm.showUsers, vm.currentPage);
        };

        vm.showUsers = function (page) {

            function onSuccess(result) {
                vm.users = result.data.$$data.list;
                vm.totalPages = result.data.$$data.page.totalPages;
                vm.currentPage = result.data.$$data.page.currentPage;
            }

            hub.invoker.invoke('user', 'getList', form.getListMetadata(page, vm.sortField), process.onStart, onSuccess, process.onError, process.onFinally);

        };

        vm.showUsers(1);

    }

    UserList.$inject = ['hub', 'form'];

    angular.module('wt-backoffice').controller('userList', UserList);
    
}());
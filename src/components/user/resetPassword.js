/*global angular, jsSHA*/
(function () {
    'use strict';

    function ResetPassword(hub) {

        var vm = this,
            process = hub.processHandler(vm, 'loading');

        vm.user = {};
        vm.loading = process.loading;

        vm.save = function () {
            /*jslint newcap: true */
            var shaObj = new jsSHA(vm.user.password, "TEXT"),
                hash = shaObj.getHMAC(vm.user.email, "TEXT", "SHA-1", "B64"),
                userData;

            userData = angular.copy(vm.user);
            userData.password = hash;

            function onSuccess(result) {
                hub.toastr.show(hub.translate.getTerm('MSG_OPERATION_SUCCESS'), 'success');
                vm.goBack();
            }

            hub.invoker.invoke('user', 'resetPassword', userData, process.onStart, onSuccess, process.onError, process.onFinally);
        };

        vm.showUserDetails = function (id) {
            if (!id) {
                return;
            }

            function onSuccess(result) {
                result.data.$$data.password = '';
                vm.user = result.data.$$data;
            }

            hub.invoker.invoke('user', 'getDetails', {id: id}, process.onStart, onSuccess, process.onError, process.onFinally);

        };

        vm.goBack = function () {
            hub.$location.path('/user/' + hub.$routeParams.id);
        };

        vm.showUserDetails(hub.$routeParams.id);

    }

    ResetPassword.$inject = ['hub'];

    angular.module('wt-backoffice').controller('resetPassword', ResetPassword);

}());
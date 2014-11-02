/*global angular, jsSHA*/
(function () {
    'use strict';

    function ChangePassword(hub, authentication) {

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

            shaObj = new jsSHA(vm.user.newPassword, "TEXT");
            hash = shaObj.getHMAC(vm.user.email, "TEXT", "SHA-1", "B64");

            userData.newPassword = hash;
            
            function onSuccess(result) {
                hub.toastr.show(hub.translate.getTerm('MSG_OPERATION_SUCCESS'), 'success');
                vm.goBack();
            }

            hub.invoker.invoke('user', 'changePassword', userData, process.onStart, onSuccess, process.onError, process.onFinally);
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
            hub.$location.path('/profile');
        };

        vm.showUserDetails(authentication.getContext().id);

    }

    ChangePassword.$inject = ['hub', 'authentication'];

    angular.module('wt-backoffice').controller('changePassword', ChangePassword);

}());
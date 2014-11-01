/*global angular, jsSHA*/
(function () {
    'use strict';

    function UserDetails(hub) {

        var vm = this,
            process = hub.processHandler(vm, 'loading');

        vm.user = {};
        vm.loading = process.loading;
        vm.saveLabel = hub.translate.getTerm('LBL_CREATE');
        vm.isNew = true;

        function execute(operation) {
            /*jslint newcap: true */
            var shaObj = new jsSHA(vm.user.password, "TEXT"),
                hash = shaObj.getHMAC(vm.user.email, "TEXT", "SHA-1", "B64"),
                userData;

            function onSuccess(result) {
                hub.toastr.show(hub.translate.getTerm('MSG_OPERATION_SUCCESS'), 'success');
                vm.goBack();
            }
            
            userData = angular.copy(vm.user);

            if (operation === 'createUser') {
                userData.password = hash;
            }

            hub.invoker.invoke('user', operation, userData, process.onStart, onSuccess, process.onError, process.onFinally);
        }

        vm.save = function () {
            execute(vm.isNew === true ? 'createUser' : 'updateUser');
        };

        vm.remove = function () {
            if (hub.$window.confirm(hub.translate.getTerm('MSG_CONFIRM_OPERATION'))) {
                execute('removeUser');
            }
        };
        
        vm.resetPassword = function () {
            hub.$location.path('/user/resetPassword/' + hub.$routeParams.id);
        };

        vm.showUserDetails = function (id) {

            var data = {id: id};

            if (id) {
                vm.isNew = false;
                vm.saveLabel = hub.translate.getTerm('LBL_UPDATE');
            } else {
                return;
            }

            function onSuccess(result) {
                vm.user = result.data.$$data;
                vm.user.password = ' ';
                vm.user.passwordConfirmation = ' ';
            }

            hub.invoker.invoke('user', 'getDetails', data, process.onStart, onSuccess, process.onError, process.onFinally);

        };

        vm.goBack = function () {
            hub.$location.path('/users');
        };

        vm.showUserDetails(hub.$routeParams.id);

    }

    UserDetails.$inject = ['hub'];

    angular.module('wt-backoffice').controller('userDetails', UserDetails);

}());
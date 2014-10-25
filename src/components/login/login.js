/*global angular, jsSHA*/
(function () {
    'use strict';

    function Login(hub, authentication) {

        var vm = this,
            process = hub.processHandler(vm, 'loading');

        vm.email = 'fabioseno@gmail.com';
        vm.password = 'senha';
        vm.loading = process.loading;

        vm.authenticate = function () {
            
            /*jslint newcap: true */
            var shaObj = new jsSHA(vm.password, "TEXT"),
                hash = shaObj.getHMAC(vm.email, "TEXT", "SHA-1", "B64"),
                data = {
                    email: vm.email,
                    password: hash
                };

            function onSuccess(result) {
                authentication.sessionId = result.headers('SessionId');
                hub.toastr.show(hub.translate.getTerm('MSG_ACCESS GRANTED', result.data.$$data.name), 'success');
                hub.$location.path('/users');
            }

            function onError(error) {
                hub.toastr.show(hub.translate.getTerm('MSG_OPERATION_FAIL'), 'error');
            }

            hub.invoker.invoke('authentication', 'authenticate', data, process.onStart, onSuccess, onError, process.onFinally);

        };
    }

    Login.$inject = ['hub', 'authentication'];

    angular.module('wt-backoffice').controller('login', Login);
}());
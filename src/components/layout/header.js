/*global angular*/
(function () {
    'use strict';

    function Header(hub, authentication) {

        var vm = this,
            process = hub.processHandler(vm);

        vm.logout = function () {
            var context = authentication.getContext(),
                data = {
                    email: context.email
                };

            function onSuccess(result) {
                authentication.clearSession();
                hub.$location.path('/');
            }

            hub.invoker.invoke('authentication', 'logout', data, process.onStart, onSuccess, process.onError, process.onFinally);
        };

    }

    Header.$inject = ['hub', 'authentication'];

    angular.module('wt-backoffice').controller('header', Header);
}());
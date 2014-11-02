/*global angular, jsSHA*/
(function () {
    'use strict';

    function MyProfile(hub, authentication) {

        var vm = this,
            process = hub.processHandler(vm, 'loading');

        vm.user = {};
        vm.loading = process.loading;

        vm.changePassword = function () {
            hub.$location.path('/profile/changePassword');
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

        vm.showUserDetails(authentication.getContext().id);

    }

    MyProfile.$inject = ['hub', 'authentication'];

    angular.module('wt-backoffice').controller('myProfile', MyProfile);

}());
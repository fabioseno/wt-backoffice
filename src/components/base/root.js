/*global angular*/
(function () {
    'use strict';

    function Root($location) {
        var vm = this;
        
        vm.goTo = function (url) {
            $location.path(url);
        };
    }

    Root.$inject = ['$location'];

    angular.module('wt-backoffice').controller('root', Root);

}());
/*global angular*/
(function () {
    'use strict';

    function Hub($rootScope, $location, $q, $routeParams, $window, invoker, eventHub, translate, processHandler, toastr) {
        
        this.$location = $location;
        
        this.$q = $q;
        
        this.$routeParams = $routeParams;
        
        this.$window = $window;
        
        this.invoker = invoker;
        
        this.eventHub = eventHub;
        
        this.translate = translate;
        
        this.processHandler = processHandler;
        
        this.toastr = toastr;
        
        $rootScope.$on('APPLICATION_ERROR', function (event, data) {
            toastr.show(data, 'error');
        });

        $rootScope.$on('UNAUTHORIZED', function (event, data) {
            toastr.show(translate.getTerm('MSG_ACCESS_DENIED'), 'error');
            $location.path('/login');
        });
    }

    Hub.$inject = ['$rootScope', '$location', '$q', '$routeParams', '$window', 'invoker', 'eventHub', 'translate', 'processHandler', 'toastr'];

    angular.module('wt-backoffice').service('hub', Hub);

}());
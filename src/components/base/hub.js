/*global angular*/
(function () {
    'use strict';

    function Hub($rootScope, $location, $q, $routeParams, $window, invoker, eventHub, translate, processHandler, toastr, authentication) {
        
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
            $location.path('/login');
        });
        
        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            if ($location.url() !== '/' && $location.url() !== '/login' && !authentication.getSessionId()) {
                $location.path('/login');
            }
        });
    }

    Hub.$inject = ['$rootScope', '$location', '$q', '$routeParams', '$window', 'invoker', 'eventHub', 'translate', 'processHandler', 'toastr', 'authentication'];

    angular.module('wt-backoffice').service('hub', Hub);

}());
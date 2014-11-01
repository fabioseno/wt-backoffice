/*global angular*/
angular.module('wt-backoffice').factory('processHandler', ['toastr', 'translate', function (toastr, translate) {
    'use strict';

    return function (scope, loaderName) {

        loaderName = loaderName || '';

        var loading = false,

            onStart = function () {
                scope[loaderName] = true;
            },

            onSuccess = function (result) {
                toastr.show(translate.getTerm('MSG_OPERATION_SUCCESS'), 'success');
            },

            onError = function (error) {
                var messages = [],
                    type = 'error';

                if (error.status !== 401) {
                    messages.push(translate.getTerm('MSG_OPERATION_FAIL'));
                } else {
                    messages.push(translate.getTerm('MSG_SESSION_EXPIRED'));
                }

                if (error.data) {
                    if (error.data.messages) {
                        messages = error.data.messages;
                    }

                    if (error.data.type) {
                        type = error.data.type;
                    }
                }

                if (messages.length > 0) {
                    toastr.show(messages.join('<br />'), type);
                }
            },

            onFinally = function () {
                scope[loaderName] = false;

            };

        return {
            loading: scope[loaderName],
            onStart: onStart,
            onSuccess: onSuccess,
            onError: onError,
            onFinally: onFinally
        };
    };
}]);
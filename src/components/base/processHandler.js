/*global app*/
app.factory('processHandler', ['toastr', 'translate', function (toastr, translate) {
    'use strict';
    
    return function (scope, loaderName) {
        var loading = false,
            
            onStart = function () {
                scope[loaderName] = true;
            },
            
            onSuccess = function (result) {
                toastr.show(translate.getTerm('MSG_OPERATION_SUCCESS'), 'success');
            },
            
            onError = function (error) {
                var messages = [translate.getTerm('MSG_OPERATION_FAIL')],
                    type = 'error';
                
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
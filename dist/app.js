/*global angular*/
var app = angular.module('wt-backoffice', ['wt-core', 'wt-ui', 'ngRoute', 'ngTouch']);

app.config(['$routeProvider', function ($routeProvider) {
    'use strict';
    
    $routeProvider.when('/', {
        templateUrl: 'components/login/login.html',
        controller: 'loginController'
    }).when('/users', {
        templateUrl: 'components/user/userList.html',
        controller: 'userListController'
    }).when('/user', {
        templateUrl: 'components/user/userDetails.html',
        controller: 'userDetailsController'
    }).when('/user/:id', {
        templateUrl: 'components/user/userDetails.html',
        controller: 'userDetailsController'
    }).otherwise({
        redirectTo: '/'
    });
}]);

app.run(function ($http) {
    'use strict';
    
    $http.defaults.headers.post["Content-Type"] = "application/json";
});
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
/*global app*/
app.controller('rootController', ['$scope', '$rootScope', '$window', '$location', 'eventHub', 'toastr', 'translate', function ($scope, $rootScope, $window, $location, eventHub, toastr, translate) {
    'use strict';
    
    $scope.location = $location;
    
    $scope.eventHub = eventHub;
    
    $scope.toastr = toastr;
    
    $scope.goBack = function () {
        $window.history.back();
    };
    
    $scope.goTo = function (url) {
        $location.path(url);
    };
    
    $rootScope.$on('APPLICATION_ERROR', function (event, data) {
        toastr.show(data, 'error');
    });
    
    $rootScope.$on('UNAUTHORIZED', function (event, data) {
        $scope.toastr.show(translate.getTerm('MSG_ACCESS_DENIED'), 'error');
        $location.path('/login');
    });
    
}]);
/*global app, jsSHA*/
/*jslint newcap: true */
app.controller('loginController', ['$scope', '$q', 'invoker', 'translate', 'authentication', 'processHandler', function ($scope, $q, invoker, translate, authentication, processHandler) {
    'use strict';
    
    var process = processHandler($scope, 'loading');
    
    $scope.email = 'fabioseno@gmail.com';
    $scope.password = 'senha';
    $scope.loading = process.loading;
    
    $scope.authenticate = function () {
        var shaObj = new jsSHA($scope.password, "TEXT"),
            hash = shaObj.getHMAC($scope.email, "TEXT", "SHA-1", "B64"),
            data = {
                email: $scope.email,
                password: hash
            };
        
        function onSuccess(result) {
            authentication.sessionId = result.headers('SessionId');
            $scope.toastr.show(translate.getTerm('MSG_ACCESS GRANTED', result.data.name), 'success');
            $scope.location.path('/users');
        }
        
        function onError(error) {
            $scope.toastr.show(translate.getTerm('MSG_OPERATION_FAIL'), 'error');
        }
        
        invoker.invoke('authentication', 'authenticate', data, process.onStart, onSuccess, onError, process.onFinally);
        
    };
}]);
/*global app*/
app.controller('menuController', ['$scope', '$location', function ($scope, $location) {
    'use strict';
    
    $scope.selectedItem = {};
    
    $scope.menuItems = [
        {
            id: 'home',
            'class': 'fa fa-home fa-lg fa-fw',
            name: 'Home',
            link: '/users'
        },
        {
            id: 'users',
            'class': 'fa fa-users fa-lg fa-fw',
            name: 'Users',
            link: '',
            items: [
                {
                    id: 'userList',
                    name: 'User list',
                    link: '/users'
                },
                {
                    id: 'newUser',
                    name: 'New user',
                    link: '/user'
                }
            ]
        }
    ];
    
    $scope.selectItem = function (menuItem) {
        if (menuItem.items && menuItem.items.length > 0) {
            menuItem.selected = !!!menuItem.selected;
            
            if (menuItem.selected) {
                $scope.selectedItem = menuItem;
            }
            
        } else if (menuItem.link) {
            $scope.selectedItem = menuItem;
            $location.path(menuItem.link);
        }
    };
}]);
app.directive('', function () {
    'use strict';
    
    return {
        
    };
});
/*global app */
app.service('translate', function () {
    'use strict';
    
    var terms = {
        "MSG_ACCESS_DENIED": "Acesso negado!",
        "MSG_ACCESS GRANTED": "Acesso permitido!<br />Bem-vindo, {0}",
        "MSG_CONFIRM_OPERATION": "Confirma a operação?",
        "MSG_OPERATION_FAIL": "Ocorreu um erro durante a operação.<br />Por favor tente novamente!",
        "MSG_OPERATION_SUCCESS": "Operação realizada com sucesso!",
        "MSG_TYPE_SEARCH_TERM": "Digite um termo de busca...",
        "LBL_CANCEL": "Cancelar",
        "LBL_CREATE": "Criar",
        "LBL_DELETE": "Excluir",
        "LBL_EMAIL": "E-mail",
        "LBL_ENTER": "Entrar",
        "LBL_FILTER": "Filtrar",
        "LBL_LOGIN": "Login",
        "LBL_NAME": "Name",
        "LBL_NEW_USER": "Novo usuário",
        "LBL_PASSWORD": "Senha",
        "LBL_PASSWORD_CONFIRMATION": "Confirmação de senha",
        "LBL_STATUS": "Status",
        "LBL_UPDATE": "Alterar",
        "LBL_USER": "Usuário",
        "LBL_USERS": "Usuários"
    };
    
    this.getTerm = function (key, args) {
        var result = terms[key] || '',
            i;
        
        if (arguments.length > 1) {
            for (i = 1; i < arguments.length; i += 1) {
                result = result.replace('{' + (i - 1) + '}', arguments[i]);
            }
        }
        
        return result;
    };
    
});

app.filter('i18n', ['translate', function (translate) {
    'use strict';
    
    return function (key, args) {
        return translate.getTerm.apply(this, arguments);
        
    };
    
}]);
/*global app*/
app.controller('userDetailsController', ['$scope', '$routeParams', '$window', 'invoker', 'translate', 'processHandler', function ($scope, $routeParams, $window, invoker, translate, processHandler) {
    'use strict';
    
    var process = processHandler($scope, 'loading');
    
    $scope.user = {};
    $scope.loading = process.loading;
    $scope.saveLabel = translate.getTerm('LBL_CREATE');
    $scope.isNew = true;
    
    function execute(operation) {
        function onSuccess(result) {
            $scope.toastr.show(translate.getTerm('MSG_OPERATION_SUCCESS'), 'success');
            $scope.location.path('/users');
        }
        
        invoker.invoke('user', operation, $scope.user, process.onStart, onSuccess, process.onError, process.onFinally);
    }
    
    $scope.save = function () {
        var operation = 'updateUser';
        
        if ($scope.isNew) {
            operation = 'createUser';
        }
        
        execute(operation);
    };
    
    $scope.remove = function () {
        if ($window.confirm(translate.getTerm('MSG_CONFIRM_OPERATION'))) {
            execute('removeUser');
        }
    };
    
    $scope.showUserDetails = function (id) {
        
        var data = {id: id};
        
        if (id) {
            $scope.isNew = false;
            $scope.saveLabel = translate.getTerm('LBL_UPDATE');
        } else {
            return;
        }
        
        function onSuccess(result) {
            $scope.user = result.data;
        }
        
        invoker.invoke('user', 'getDetails', data, process.onStart, onSuccess, process.onError, process.onFinally);
        
    };
    
    $scope.showUserDetails($routeParams.id);
    
}]);
/*global app*/
app.controller('userListController', ['$scope', 'invoker', 'processHandler', function ($scope, invoker, processHandler) {
    'use strict';
    
    var process = processHandler($scope, 'loading');
    
    $scope.users = [];
    $scope.currentPage = 1;
    $scope.loading = process.loading;
    
    $scope.showUsers = function (page) {
        
        var data = {
            filter: {},
            options: {
                pageSize: 2,
                currentPage: page
//                ,
//                sort: {
//                    name: 1
//                }
            }
        };
        
        function onSuccess(result) {
            $scope.users = result.data.list;
            $scope.totalPages = result.data.page.totalPages;
            $scope.currentPage = result.data.page.currentPage;
        }
        
        invoker.invoke('user', 'getList', data, process.onStart, onSuccess, process.onError, process.onFinally);
        
    };
    
    $scope.showUsers(1);
    
}]);
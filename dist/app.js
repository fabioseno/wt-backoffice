/*global angular*/
angular
    .module('wt-backoffice', ['wt-core', 'wt-ui', 'ngRoute', 'ngTouch', 'angularFileUpload'])

    .config(['$routeProvider', function ($routeProvider) {
        'use strict';

        $routeProvider.when('/', {
            templateUrl: 'components/login/login.html',
            controller: 'login',
            controllerAs: 'vm'
        }).when('/users', {
            templateUrl: 'components/user/userList.html',
            controller: 'userList',
            controllerAs: 'vm'
        }).when('/user', {
            templateUrl: 'components/user/userDetails.html',
            controller: 'userDetails',
            controllerAs: 'vm'
        }).when('/user/:id', {
            templateUrl: 'components/user/userDetails.html',
            controller: 'userDetails',
            controllerAs: 'vm'
        }).when('/files/upload', {
            templateUrl: 'components/files/upload.html',
            controller: 'upload',
            controllerAs: 'vm'
        }).otherwise({
            redirectTo: '/'
        });
    }])

    .run(function ($http) {
        'use strict';

        $http.defaults.headers.post["Content-Type"] = "application/json";
    });
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
/*global angular*/
angular.module('wt-backoffice').factory('processHandler', ['toastr', 'translate', function (toastr, translate) {
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
/*global angular*/
angular.module('wt-backoffice').controller('upload', ['$scope', '$upload', function ($scope, $upload) {
    'use strict';

    //    $scope.onFileSelect = function ($files) {
    //        for (var i = 0; i < $files.length; i++) {
    //            var file = $files[i];
    //            $scope.upload = $upload.upload({
    //                url: '/posts/upload/',
    //                method: 'POST',                 
    //                file: file,
    //            }).progress(function(evt) {
    //                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
    //            }).success(function(data, status, headers, config) {
    //                // file is uploaded successfully
    //                console.log(data);
    //            });
    //
    //        }
    //    };

    $scope.upload = function ($files) {
        var i = 0, file;

        for (i = 0; i < $files.length; i += 1) {
            file = $files[i];

            $scope.upload = $upload.upload({
                url: '/api/files/upload/',
                method: 'POST',
                file: file
            }).progress(function (evt) {
                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function (data, status, headers, config) {
                // file is uploaded successfully
                console.log(data);
            });
        }
    };
}]);
/*global angular*/
(function () {
    'use strict';

    function Menu($location) {
        var vm = this;

        vm.selectedItem = {};
        vm.menuItems = [
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
        vm.selectItem = function (menuItem) {
            if (menuItem.items && menuItem.items.length > 0) {
                menuItem.selected = !!!menuItem.selected;

                if (menuItem.selected) {
                    vm.selectedItem = menuItem;
                }

            } else if (menuItem.link) {
                vm.selectedItem = menuItem;
                $location.path(menuItem.link);
            }
        };
    }

    Menu.$inject = ['$location'];

    angular.module('wt-backoffice').controller('menu', Menu);

}());
angular.module('wt-backoffice').directive('', function () {
    'use strict';
    
    return {
        
    };
});
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
/*global angular */
angular.module('wt-backoffice').service('translate', function () {
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

angular.module('wt-backoffice').filter('i18n', ['translate', function (translate) {
    'use strict';
    
    return function (key, args) {
        return translate.getTerm.apply(this, arguments);
        
    };
    
}]);
/*global angular*/
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
            function onSuccess(result) {
                hub.toastr.show(hub.translate.getTerm('MSG_OPERATION_SUCCESS'), 'success');
                vm.goBack();
            }

            hub.invoker.invoke('user', operation, vm.user, process.onStart, onSuccess, process.onError, process.onFinally);
        }

        vm.save = function () {
            var operation = 'updateUser';

            if (vm.isNew) {
                operation = 'createUser';
            }

            execute(operation);
        };

        vm.remove = function () {
            if (hub.$window.confirm(hub.translate.getTerm('MSG_CONFIRM_OPERATION'))) {
                execute('removeUser');
            }
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
/*global angular*/
(function () {
    'use strict';

    function UserList(hub) {
        
        var vm = this,
            process = hub.processHandler(vm, 'loading');

        vm.users = [];
        vm.currentPage = 1;
        vm.sortField = {
            name: 1
        };

        vm.loading = process.loading;

        vm.sort = function (field) {
            if (!vm.sortField[field]) {
                vm.sortField = {};
                vm.sortField[field] = 1;
            } else {
                vm.sortField[field] = vm.sortField[field] === 1 ? -1 : 1;
            }

            vm.showUsers(vm.currentPage);
        };

        vm.showUsers = function (page) {

            var data = {
                filter: {},
                page: {
                    pageSize: 2,
                    currentPage: page
                }
            };

            if (vm.sortField) {
                data.sort = vm.sortField;
            }

            function onSuccess(result) {
                vm.users = result.data.$$data.list;
                vm.totalPages = result.data.$$data.page.totalPages;
                vm.currentPage = result.data.$$data.page.currentPage;
            }

            hub.invoker.invoke('user', 'getList', data, process.onStart, onSuccess, process.onError, process.onFinally);

        };

        vm.showUsers(1);

    }

    UserList.$inject = ['hub'];

    angular.module('wt-backoffice').controller('userList', UserList);
    
}());
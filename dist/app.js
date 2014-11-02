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
        }).when('/user/resetPassword/:id', {
            templateUrl: 'components/user/resetPassword.html',
            controller: 'resetPassword',
            controllerAs: 'vm'
        }).when('/profile', {
            templateUrl: 'components/profile/myProfile.html',
            controller: 'myProfile',
            controllerAs: 'vm'
        }).when('/profile/changePassword', {
            templateUrl: 'components/profile/changePassword.html',
            controller: 'changePassword',
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

    function Form(hub) {

        this.getListMetadata = function (page, sortField) {
            var data = {
                filter: {},
                page: {
                    pageSize: 2,
                    currentPage: page
                }
            };

            if (sortField) {
                data.sort = sortField;
            }
            
            return data;
        };

        this.sort = function (sortPreferences, field, listCallback, currentPage) {
            if (!sortPreferences[field]) {
                sortPreferences = {};
                sortPreferences[field] = 1;
            } else {
                sortPreferences[field] = sortPreferences[field] === 1 ? -1 : 1;
            }

            listCallback(currentPage);
        };

    }

    Form.$inject = ['hub'];

    angular.module('wt-backoffice').service('form', Form);

}());
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

                if (error.data) {
                    if (error.data.$$messages) {
                        messages = error.data.$$messages;
                    }

                    if (error.data.type) {
                        type = error.data.type;
                    }
                } else {
                    messages.push(translate.getTerm('MSG_OPERATION_FAIL'));
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
                        name: 'Usuários',
                        link: '/users'
                    },
                    {
                        id: 'newUser',
                        name: 'Novo usuário',
                        link: '/user'
                    },
                    {
                        id: 'myProfile',
                        name: 'Meu perfil',
                        link: '/profile'
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
                authentication.setSessionId(result.headers('X-SessionId'));
                authentication.setContext(result.data.$$data);
                hub.toastr.show(hub.translate.getTerm('MSG_ACCESS GRANTED', result.data.$$data.name), 'success');
                hub.$location.path('/users');
            }

            function onError(error) {
                hub.toastr.show(hub.translate.getTerm('MSG_INVALID_USER_PASSWORD'), 'error');
            }

            hub.invoker.invoke('authentication', 'authenticate', data, process.onStart, onSuccess, onError, process.onFinally);

        };
    }

    Login.$inject = ['hub', 'authentication'];

    angular.module('wt-backoffice').controller('login', Login);
}());
/*global angular, jsSHA*/
(function () {
    'use strict';

    function ChangePassword(hub, authentication) {

        var vm = this,
            process = hub.processHandler(vm, 'loading');

        vm.user = {};
        vm.loading = process.loading;

        vm.save = function () {
            /*jslint newcap: true */
            var shaObj = new jsSHA(vm.user.password, "TEXT"),
                hash = shaObj.getHMAC(vm.user.email, "TEXT", "SHA-1", "B64"),
                userData;

            userData = angular.copy(vm.user);
            userData.password = hash;

            shaObj = new jsSHA(vm.user.newPassword, "TEXT");
            hash = shaObj.getHMAC(vm.user.email, "TEXT", "SHA-1", "B64");

            userData.newPassword = hash;
            
            function onSuccess(result) {
                hub.toastr.show(hub.translate.getTerm('MSG_OPERATION_SUCCESS'), 'success');
                vm.goBack();
            }

            hub.invoker.invoke('user', 'changePassword', userData, process.onStart, onSuccess, process.onError, process.onFinally);
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

        vm.goBack = function () {
            hub.$location.path('/profile');
        };

        vm.showUserDetails(authentication.getContext().id);

    }

    ChangePassword.$inject = ['hub', 'authentication'];

    angular.module('wt-backoffice').controller('changePassword', ChangePassword);

}());
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
/*global angular */
angular.module('wt-backoffice').service('translate', function () {
    'use strict';
    
    var terms = {
        "MSG_ACCESS GRANTED": "Acesso permitido!<br />Bem-vindo, {0}",
        "MSG_CONFIRM_OPERATION": "Confirma a operação?",
        "MSG_OPERATION_FAIL": "Ocorreu um erro durante a operação.<br />Por favor tente novamente!",
        "MSG_OPERATION_SUCCESS": "Operação realizada com sucesso!",
        "MSG_SESSION_EXPIRED": "Sua sessão expirou.<br />Favor realizar novo login!",
        "MSG_TYPE_SEARCH_TERM": "Digite um termo de busca...",
        "LBL_CANCEL": "Cancelar",
        "LBL_CHANGE_PASSWORD": "Alterar senha",
        "LBL_CREATE": "Criar",
        "LBL_DELETE": "Excluir",
        "LBL_EMAIL": "E-mail",
        "LBL_ENTER": "Entrar",
        "LBL_FILTER": "Filtrar",
        "LBL_LOGIN": "Login",
        "LBL_MY_PROFILE": "Meu perfil",
        "LBL_NAME": "Name",
        "LBL_NEW_USER": "Novo usuário",
        "LBL_NEW_PASSWORD": "Nova senha",
        "LBL_OLD_PASSWORD": "Senha atual",
        "LBL_PASSWORD": "Senha",
        "LBL_PASSWORD_CONFIRMATION": "Confirmação de senha",
        "LBL_RESET_PASSWORD": "Redefinir senha",
        "LBL_SELECT": "Selecione",
        "LBL_STATUS": "Status",
        "LBL_UPDATE": "Alterar",
        "LBL_USER": "Usuário",
        "LBL_USER_STATUS_A": "Ativo",
        "LBL_USER_STATUS_I": "Inativo",
        "LBL_USERS": "Usuários"
    },
        self = this;
    
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
    
    this.getTermsList = function (list, prefix, attribute) {
        angular.forEach(list, function (item) {
            item.$$term = self.getTerm(prefix + item[attribute]);
        });
        
        return list;
    };
    
});

angular.module('wt-backoffice').filter('i18n', ['translate', function (translate) {
    'use strict';
    
    return function (key, args) {
        return translate.getTerm.apply(this, arguments);
    };
    
}]);
/*global angular, jsSHA*/
(function () {
    'use strict';

    function ResetPassword(hub) {

        var vm = this,
            process = hub.processHandler(vm, 'loading');

        vm.user = {};
        vm.loading = process.loading;

        vm.save = function () {
            /*jslint newcap: true */
            var shaObj = new jsSHA(vm.user.password, "TEXT"),
                hash = shaObj.getHMAC(vm.user.email, "TEXT", "SHA-1", "B64"),
                userData;

            userData = angular.copy(vm.user);
            userData.password = hash;

            function onSuccess(result) {
                hub.toastr.show(hub.translate.getTerm('MSG_OPERATION_SUCCESS'), 'success');
                vm.goBack();
            }

            hub.invoker.invoke('user', 'resetPassword', userData, process.onStart, onSuccess, process.onError, process.onFinally);
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

        vm.goBack = function () {
            hub.$location.path('/user/' + hub.$routeParams.id);
        };

        vm.showUserDetails(hub.$routeParams.id);

    }

    ResetPassword.$inject = ['hub'];

    angular.module('wt-backoffice').controller('resetPassword', ResetPassword);

}());
/*global angular, jsSHA*/
(function () {
    'use strict';

    function UserDetails(hub, userModel) {

        var vm = this,
            process = hub.processHandler(vm, 'loading');

        vm.user = {};
        vm.statusList = hub.translate.getTermsList(userModel.status, 'LBL_USER_STATUS_', 'key');
        vm.loading = process.loading;
        vm.saveLabel = hub.translate.getTerm('LBL_CREATE');
        vm.isNew = true;

        function execute(operation) {
            /*jslint newcap: true */
            var shaObj = new jsSHA(vm.user.password, "TEXT"),
                hash = shaObj.getHMAC(vm.user.email, "TEXT", "SHA-1", "B64"),
                userData;

            function onSuccess(result) {
                hub.toastr.show(hub.translate.getTerm('MSG_OPERATION_SUCCESS'), 'success');
                vm.goBack();
            }
            
            userData = angular.copy(vm.user);

            if (operation === 'createUser') {
                userData.password = hash;
            }

            hub.invoker.invoke('user', operation, userData, process.onStart, onSuccess, process.onError, process.onFinally);
        }

        vm.save = function () {
            execute(vm.isNew === true ? 'createUser' : 'updateUser');
        };

        vm.remove = function () {
            if (hub.$window.confirm(hub.translate.getTerm('MSG_CONFIRM_OPERATION'))) {
                execute('removeUser');
            }
        };
        
        vm.resetPassword = function () {
            hub.$location.path('/user/resetPassword/' + hub.$routeParams.id);
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

    UserDetails.$inject = ['hub', 'userModel'];

    angular.module('wt-backoffice').controller('userDetails', UserDetails);

}());
/*global angular*/
(function () {
    'use strict';

    function UserList(hub, form) {
        
        var vm = this,
            process = hub.processHandler(vm, 'loading');

        vm.users = [];
        vm.currentPage = 1;
        vm.sortField = {
            name: 1
        };

        vm.loading = process.loading;

        vm.sort = function (field) {
            form.sort(vm.sortField, field, vm.showUsers, vm.currentPage);
        };

        vm.showUsers = function (page) {

            function onSuccess(result) {
                vm.users = result.data.$$data.list;
                vm.totalPages = result.data.$$data.page.totalPages;
                vm.currentPage = result.data.$$data.page.currentPage;
            }

            hub.invoker.invoke('user', 'getList', form.getListMetadata(page, vm.sortField), process.onStart, onSuccess, process.onError, process.onFinally);

        };

        vm.showUsers(1);

    }

    UserList.$inject = ['hub', 'form'];

    angular.module('wt-backoffice').controller('userList', UserList);
    
}());
/*global angular*/
(function () {
    'use strict';

    function UserModel() {

        this.status = [
            {
                key: 'A',
                name: 'Active'
            },
            {
                key: 'I',
                name: 'Inactive'
            }
        ];
    }

    UserModel.$inject = [];

    angular.module('wt-backoffice').service('userModel', UserModel);

}());
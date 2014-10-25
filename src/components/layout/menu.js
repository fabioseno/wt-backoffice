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
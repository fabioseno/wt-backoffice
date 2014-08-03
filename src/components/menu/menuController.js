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
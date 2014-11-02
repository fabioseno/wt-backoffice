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
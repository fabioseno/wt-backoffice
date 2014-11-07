/*global angular*/
(function () {
    'use strict';

    function Form(hub) {

        this.getListMetadata = function (page, sortField, searchTerm) {
            var data = {
                filter: {},
                page: {
                    pageSize: 2,
                    currentPage: page
                },
                searchTerm: searchTerm
            };

            if (sortField) {
                data.sort = sortField;
            }
            
            return data;
        };

        this.sort = function (vm, field, listCallback, currentPage) {
            if (!vm.sortField[field]) {
                vm.sortField = {};
                vm.sortField[field] = 1;
            } else {
                vm.sortField[field] = vm.sortField[field] === 1 ? -1 : 1;
            }

            listCallback(currentPage);
        };

    }

    Form.$inject = ['hub'];

    angular.module('wt-backoffice').service('form', Form);

}());
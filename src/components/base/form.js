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
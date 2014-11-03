/*global angular*/
(function () {
    'use strict';

    function LanguageModel() {

        this.languages = [
            {
                key: 'PT',
                name: 'Português'
            },
            {
                key: 'EN',
                name: 'Inglês'
            }
        ];
    }

    LanguageModel.$inject = [];

    angular.module('wt-backoffice').service('languageModel', LanguageModel);

}());
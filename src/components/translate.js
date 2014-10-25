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
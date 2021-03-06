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
        "MSG_UNABLE_TO_CONNECT_TO_SERVER": "Não foi possível conectar com o servidor!<br />Por favor tente novamente!",
        "LBL_CANCEL": "Cancelar",
        "LBL_CHANGE_PASSWORD": "Alterar senha",
        "LBL_CREATE": "Criar",
        "LBL_DELETE": "Excluir",
        "LBL_EMAIL": "E-mail",
        "LBL_ENTER": "Entrar",
        "LBL_FILTER": "Filtrar",
        "LBL_LANGUAGE": "Idioma",
        "LBL_LANGUAGE_PT": "Português",
        "LBL_LANGUAGE_EN": "Inglês",
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
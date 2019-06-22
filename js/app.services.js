var edServices = angular.module('AppServices', ['ngResource']);
var domainURL = "http://localhost:3000";

/*var loginStore = function () {	

	function loginOK(http, authentication) { 
		initializeHeaders(http, authentication);
	}

	function initializeHeaders(http, authentication) {
		http.defaults.headers.common['Authorization'] = authentication;
	}

	return {
		loginOK: loginOK,
		initializeHeaders: initializeHeaders
	}
}*/

edServices.factory('LoginStatus', ['$http', function(http) {
	function loginOK(authentication) {
		loginStore().loginOK(http, authentication);
	}

	return {
		loginOK: loginOK
	}
}]);

edServices.factory('edHttpInterceptor', ['$q', '$location', function (q, location) {
	return {
        request: function (config) {
            return config || $q.when(config);
        },
        requestError: function(request){
            return $q.reject(request);
        },
        response: function (response) {
            return response || $q.when(response);
        },
        responseError: function (response) {          

	        return q.reject(response);
        }
    };
}]);


edServices.factory('ListarProdutos', ['$resource', function(resource) {
	return resource(domainURL + '/listar-produtos.php', null, {
		get: { method:'GET'}
	});
}]);


edServices.factory('ListarFornecedores', ['$resource', function(resource) {
	return resource(domainURL + '/listar-fornecedores.php', null, {
		get: { method:'GET'}
	});
}]);

edServices.factory('RegistrarUsuario', ['$resource', function(resource) {
	return resource(domainURL + '/registrar-usuario', {usuario: '@usuario', email: '@email', senha: '@senha', data_criacao: '@data_criacao'}, {
		post: { method:'POST'}
	});
}]);

edServices.factory('EfetuarVenda', ['$resource', function(resource) {
	return resource(domainURL + '/efetuar-venda.php', {data: '@data'}, {
		post: { method:'POST'}
	});
}]);

edServices.factory('RegistrarProduto', ['$resource', function(resource) {
	return resource(domainURL + '/registrar-produto.php', {data: '@data'}, {
		post: { method:'POST'}
	});
}]);

edServices.factory('CadastrarFornecedor', ['$resource', function(resource) {
	return resource(domainURL + '/cadastrar-fornecedor.php', {data: '@data'}, {
		post: { method:'POST'}
	});
}]);

edServices.factory('CarregarMovimentos', ['$resource', function(resource) {
	return resource(domainURL + '/listar-movimentos.php', null, {
		get: { method:'GET'}
	});
}]);


edServices.factory('ValidarLogin', ['$resource', function(resource) {
	return resource(domainURL + '/validar-login', {usuario: '@usuario', senha: '@senha'}, {
		post: { method:'POST'}
	});
}]);

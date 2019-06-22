var appModule = angular.module('materialAdmin');

appModule

    .controller('login-controller', ['ngTableParams', '$scope', '$rootScope', '$location', '$location', 'RegistrarUsuario', 'ValidarLogin', function(ngTableParams, scope, rootScope, location, location, registrarUsuario, validarLogin) {

        window.localStorage.clear();

        //Status
        scope.login = 1;
        scope.register = 0;
        scope.forgot = 0;

        scope.doLogin = function() {
            if(!scope.user || !scope.password || scope.user.length == 0 || scope.password.length == 0) {
                swal("Usuário ou senha inválido");
                return;
            }

            validarLogin.get({usuario: scope.user, senha: scope.password}, function(data) {
                debugger;
                if(data.erro == "1") {
                    swal(data.msg);
                } else {
                    window.localStorage.setItem("usuario", scope.user);
                    window.localStorage.setItem("senha", scope.password);
                    location.path("/sales");
                }
            }, function(error) {
                swal("Não foi possível efetuar o cadastro: " + error);
            });
        }

        scope.doRegister = function() {
            if(!scope.user || !scope.password || !scope.email || scope.user.length == 0 || scope.password.length == 0 || scope.email.length == 0) {
                swal("Preencha todos os campos para prosseguir!");
                return;
            }

            if(!validarEmail(scope.email)) {
                swal("Email inválido!");
                return;
            }

            var params =  {usuario: scope.user, email: scope.email, senha: scope.password, data_criacao: new Date()};

            registrarUsuario.post(params, function(data) {
                if(data.erro == "1") {
                    swal("Não foi possível cadastrar o usuário, verifique os dados!");
                } else {
                    window.localStorage.setItem("usuario", scope.user);
                    window.localStorage.setItem("senha", scope.password);
                    location.path("/sales");
                }
            }, function(error) {
                swal("Não foi possível efetuar o cadastro: " + error);
            });
        }

    }])

    .controller('sales-controller', ['ngTableParams', '$scope', '$rootScope', '$location', 'ListarProdutos', 'EfetuarVenda', function(ngTableParams, scope, rootScope, location, listarProdutos, efetuarVenda) {

        if(window.localStorage.getItem("usuario") == null) {
            location.path("/login");
            return;
        }

        scope.tableDataList = [];
        scope.valorTotal = 0;

        var carregarProdutos = function() {
            listarProdutos.get(null, function(data){
                if(data.erro == '1') {
                    swal("Não foi possível carregar a lista de produtos!");
                } else {

                    scope.dataList = [];
                    angular.forEach(data.msg, function(produto) {
                        var novoProduto = {
                            cod: produto["COD"],
                            nome: produto["NOME"],
                            fornecedor: produto["FORNECEDOR"],
                            valor: produto["VALOR_VENDA"]
                        }
                        scope.dataList.push(novoProduto);
                    });   
                }
            }, function(response){
                swal("Não foi possível carregar a lista de produtos!");
            });
        }


        var calcularValorTotal = function() {
            scope.valorTotal = 0;
            angular.forEach(scope.tableDataList, function(produto) {
                scope.valorTotal = scope.valorTotal +  Number(produto.valor);
            });
        }

        scope.adicionarProduto = function() {

            var i;
            for(i = 0; i < scope.tableDataList.length; i++) {
                if(scope.tableDataList[i].cod == scope.produtoAdicionar.cod) {
                    return; //Já adicionado
                }
            }

            if(scope.produtoAdicionar) {
                scope.tableDataList.push(scope.produtoAdicionar);
            }
            calcularValorTotal();
        }

        scope.removerProduto = function() {
            if(!scope.selected) {
                swal("Selecione um produto para remover!");
            }

            var i;
            for(i = 0; i < scope.tableDataList.length; i++) {
                if(scope.tableDataList[i].cod == scope.selected.cod) {
                    break;
                }
            }

            scope.tableDataList.splice(i, 1);
            calcularValorTotal();
        }

        scope.concluirVenda = function() {
            swal("Confirmar venda?");
            swal({
                title: "Atenção",
                text: "Confirmar venda?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: 'Sim',
                cancelButtonText: "Não"
             },
             function(isConfirm){
                if (isConfirm){
                    var params = {
                        'valor': scope.valorTotal,
                        'produtos': scope.tableDataList
                    }

                    efetuarVenda.post({data: JSON.stringify(params)}, null, function(data) {
                        setTimeout(function() {
                            if(data.erro == '1') {
                                swal("Não foi possível efetuar a venda! " + (data.msg ? data.msg : ""));
                            } else {
                                swal(data.msg);
                                scope.tableDataList = [];
                                scope.valorTotal = 0;
                            }
                            
                        }, 100);
                    }, function(response){
                        setTimeout(function() {
                            swal("Não foi possível concluir a venda!");
                        }, 100);
                    });
                }
            });
        }

        carregarProdutos();

        scope.selected = null;

        scope.setSelected = function(selected) {
            scope.selected = selected;
        };

        var clearTableDataList = function() {
            scope.tableDataList = [];
        }

        scope.removeProduct = function(selected) {
            waitModal.hide();
            refreshDataList();
            swal("Removido com sucesso!");
        }

        scope.openDialogCreateNew = function(){
            scope.isNewContractDefinition = true;
            cleanDialogCreateFields();
            modalDialog.show('dialogCreateNew');
        }

        var cleanDialogCreateFields = function() {
            console.log("Implementar cleanDialogCreateFields");
        }
    }])

    .controller('providers-controller', ['ngTableParams', '$scope', '$rootScope', '$location', 'ListarFornecedores', 'CadastrarFornecedor', function(ngTableParams, scope, rootScope, location, listarFornecedores, cadastrarFornecedor) {

        if(window.localStorage.getItem("usuario") == null) {
            location.path("/login");
            return;
        }

        scope.selected = null;
        scope.novoFornecedor = {};

        var carregarFornecedores = function() { 
            listarFornecedores.get(null, function(data) {
                if(data.erro == '1') {
                    swal("Não foi possível carregar a lista de produtos!");
                } else {
                    scope.dataList = [];
                    angular.forEach(data.msg, function(produto) {
                        var novo = {
                            cod: produto["COD"],
                            name: produto["NOME"],
                            dueValue: produto["TOTAL"]
                        }
                        scope.dataList.push(novo);
                    });
                }
            }, function(request, error) {
                swal("Um erro ocorreu: " + error);
            });
        }

        carregarFornecedores();

        scope.closeDialogModal = function(id){
            modalDialog.hide(id);
        }

        scope.removeProduct = function(selected) {
            waitModal.hide();
            refreshDataList();
            swal("Removido com sucesso!");
        }

        scope.openDialogCreateNew = function(){
            scope.isNewContractDefinition = true;
            cleanDialogCreateFields();
            modalDialog.show('dialogCreateNew');
        }

        var cleanDialogCreateFields = function() {
            console.log("Implementar cleanDialogCreateFields");
        }

        scope.cadastrarFornecedor = function() {

            if(!validarCPF(scope.novoFornecedor.cpf)) {
                swal("CPF Inválido!");
                return;
            }

            if(!validarTelefone(scope.novoFornecedor.telefone)) {
                swal("Telefone Inválido!");
                return;
            }

            var params = scope.novoFornecedor;

            cadastrarFornecedor.post({data: JSON.stringify(params)}, null, function(data) {
                setTimeout(function() {
                    if(data.erro == '1') {
                        swal("Não foi possível cadastrar o fornecedor! " + (data.msg ? data.msg : ""));
                    } else {
                        swal(data.msg);
                        scope.closeDialogModal('dialogCreateNew');
                        carregarFornecedores();
                    }
                    
                }, 100);
            }, function(response){
                setTimeout(function() {
                    swal("Não foi possível cadastrar o fornecedor, verifique os dados!");
                }, 100);
            });
        }

    }])

    .controller('products-controller', ['ngTableParams', '$scope', '$rootScope', '$location', 'ListarProdutos', 'RegistrarProduto', function(ngTableParams, scope, rootScope, location, listarProdutos, registrarProduto) {

        if(window.localStorage.getItem("usuario") == null) {
            location.path("/login");
            return;
        }

        scope.selected = null;
        scope.novoProduto = {};

        var carregarProdutos = function() {
            listarProdutos.get(null, function(data){
                if(data.erro == '1') {
                    swal("Não foi possível carregar a lista de produtos!");
                } else {

                    scope.dataList = [];
                    angular.forEach(data.msg, function(produto) {
                        var novoProduto = {
                            cod: produto["COD"],
                            nome: produto["NOME"],
                            fornecedor: produto["FORNECEDOR"],
                            valor: produto["VALOR_VENDA"]
                        }
                        scope.dataList.push(novoProduto);
                    });   
                }
            }, function(response){
                swal("Não foi possível carregar a lista de produtos!");
            });
        }

        scope.openDialogCreateNew = function(){
            scope.isNewContractDefinition = true;
            cleanDialogCreateFields();
            modalDialog.show('dialogCreateNew');
        }

        var cleanDialogCreateFields = function() {
            novoProduto = {};
        } 

        scope.closeDialogModal = function(id){
            modalDialog.hide(id);
        }

        scope.registrarProduto = function() {
            var params = scope.novoProduto;

            registrarProduto.post({data: JSON.stringify(params)}, null, function(data) {
                setTimeout(function() {
                    if(data.erro == '1') {
                        swal("Não foi possível registrar o produto! " + (data.msg ? data.msg : ""));
                    } else {
                        scope.closeDialogModal('dialogCreateNew');
                        swal(data.msg);
                        carregarProdutos();
                    }
                    
                }, 100);
            }, function(response){
                setTimeout(function() {
                    swal("Não foi possível registrar o produto, verifique os dados!");
                }, 100);
            });
        }

        carregarProdutos();

    }])

    .controller('cash-controller', ['ngTableParams', '$scope', '$rootScope', '$location', 'CarregarMovimentos', function(ngTableParams, scope, rootScope, location, carregarMovimentos) {

        if(window.localStorage.getItem("usuario") == null) {
            location.path("/login");
            return;
        }

        scope.valorTotal = 0;

        var carregarMovimentacoes = function() {
            carregarMovimentos.get(null, function(data){
                if(data.erro == '1') {
                    swal("Não foi possível carregar a lista de movimentos!");
                } else {

                    scope.dataList = [];
                    angular.forEach(data.msg, function(produto) {
                        var novoProduto = {
                            cod: produto["COD"],
                            data: produto["DATA"],
                            tipo: produto["TIPO"],
                            valor: produto["VALOR_TOTAL"]
                        }
                        scope.dataList.push(novoProduto);
                    });  

                    criarTabela();
                    calcularValorTotal();
                }
            }, function(response){
                swal("Não foi possível carregar a lista de movimentos!");
            });
        }

        carregarMovimentacoes();

        var criarTabela = function () {
            scope.listPage = scope.dataList;
            scope.table = new ngTableParams({
                page: 1,            // show first page
                count: 10           // count per page
            }, {
                total: scope.listPage.length, // length of data
                getData: function($defer, params) {
                    scope.listPage = data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));

                    var countSelected = 0;
                    
                    setTimeout(function(){
                        for(var i=0; i < scope.listPage.length; i++){
                            var index = selectedCashList.indexOf(scope.listPage[i].alpuid);
                            if(index > -1){
                                countSelected++;
                                document.getElementById('checkbox('+scope.listPage[i].alpuid+')').checked = true;
                            }
                        }

                        if(scope.listPage.length != countSelected){
                            document.getElementById('checkboxSelectAllCash').checked = false;
                        }else{
                            document.getElementById('checkboxSelectAllCash').checked = true;                                        
                        }

                    }, 10);
                }
            });
        }

        var calcularValorTotal = function() {
            scope.valorTotal = 0;
            angular.forEach(scope.dataList, function(movimento) {
                scope.valorTotal = scope.valorTotal +  Number(movimento.valor);
            });
        }

        scope.openDialogCreateNew = function(){
            scope.isNewContractDefinition = true;
            cleanDialogCreateFields();
            modalDialog.show('dialogCreateNew');
        }

        var cleanDialogCreateFields = function() {
            console.log("Implementar cleanDialogCreateFields");
        }    

    }])

    .controller('provider-payment-controller', ['ngTableParams', '$scope', '$rootScope', '$location', function(ngTableParams, scope, rootScope, location) {

        if(window.localStorage.getItem("usuario") == null) {
            location.path("/login");
            return;
        }

        scope.selected = null;
        scope.pagamentoFornecedor = {};

        scope.dataList = [
            {cod: 1, name: "Ronaldo", dueValue: 30},
            {cod: 2, name: "Vitória", dueValue: 0}
        ];

        scope.closeDialogModal = function(id){
            modalDialog.hide(id);
        }

        scope.openDialogCreateNew = function(){
            scope.isNewContractDefinition = true;
            cleanDialogCreateFields();
            modalDialog.show('dialogCreateNew');
        }

        var cleanDialogCreateFields = function() {
            scope.pagamentoFornecedor = {};
        } 

    }])


var edDirectives = angular.module('AppDirectives', ['AppServices']);

    edDirectives.directive('dropCard', function(){
        return {
            restrict: 'C',
            link: function(scope, element) {

                var dropTableChildren = element.children();
                var dropTableHeader = null;
                var dropTableBody = null;

                //Procura pelo header e pelo body da Tabela.
                for(var i = 0; i < dropTableChildren.size(); i++){
                    var element = dropTableChildren[i];

                    if((new RegExp("drop-card-header")).test(element.className)){                        
                        dropTableHeader = element;

                        dropTableHeader.style.cursor = 'pointer';
                    }

                    if((new RegExp("drop-card-body")).test(element.className)){
                        dropTableBody = element;
                    }
                };

                //Ao clicar no header, esconde o body da tabela.
                if(dropTableHeader && dropTableBody){
                    dropTableBody.style.display = 'block';

                    dropTableHeader.onclick = function(){
                        if(dropTableBody.style.display == 'none'){
                            dropTableBody.style.display = 'block';
                        }else{
                            dropTableBody.style.display = 'none';
                        }
                    }
                }
            }
        }        
    })

    edDirectives.directive('selectableTable', function(){
        return {
            restrict: 'C',
            link: function(scope, element) {

                element.on('click', function(event){

                    table = event.target.closest("table"),
                    tbody = table.getElementsByTagName('tbody')[0],
                    rows = tbody.getElementsByTagName('tr'),
                    isInBody = false;

                    if(tbody){

                        var clickedRow = event.target.closest('tr');
                        var selected = false;

                        //Verifica se a linha da tabela já está selecionado.
                        if(((new RegExp("selected-table-item")).test(clickedRow.className))){
                            selected = true;
                        }

                        //Remove seleção anterior.
                        for(var i = 0; i < rows.length; i++){
                            var row = rows[i];
                            row.className = row.className.replace('selected-table-item', '');

                            //Vai comparar as linhas do body da tabela e verifica se a linha clicada está contida no body.
                            if(row == clickedRow){
                                isInBody = true;
                            }
                        }

                        //Seleciona se a linha pertencer ao body da tabela e já não estiver selecionado
                        if(!selected && isInBody){
                            clickedRow.className += ' selected-table-item';
                        }else{
                            //Se já estiver selecionado, tira a seleção.
                            clickedRow.className = row.className.replace('selected-table-item', '');
                        }
                    }
                });
            }
        }
    })

    //Filtra o input, permitindo apenas o formato dd/MM/yyyy no preenchimento e ao colar.
    edDirectives.directive('dateFilter', function(){
        return {
            restrict: 'C',
            link: function(scope, element) {    

                //Filtra paste
                element.on('paste', function(event){
                    var clipboardData = event.clipboardData || event.originalEvent.clipboardData || window.clipboardData;
                    var inputValue = clipboardData.getData("text");

                    inputValue = (element.val() + inputValue).match(/^[0-9]{2}\/[0-9]{2}\/[0-9]{0,4}|[0-9]{2}\/[0-9]{2}\/|[0-9]{2}\/[0-9]{0,2}|[0-9]{2}\/|[0-9]{0,2}/g)[0];

                    setTimeout(function(){
                        scope.$apply(function(){
                            element.val(inputValue);
                        });
                    },50);
                });

                element.on('input', function(event){
                    var inputValue = element.val();
                    var transformedInput;
                    if(inputValue.substring(inputValue.length-1) != "/"){
                        inputValue = inputValue.replace(/[^0-9]/g, ""); //Remove todos caracteres inválidos

                        transformedInput = inputValue.match(/^[0-9]{0,2}/g);
                        if(inputValue.length > 2){
                            transformedInput += "/" + inputValue.substring(2).match(/^[0-9]{0,2}/g);
                        }if(inputValue.length > 4){
                            transformedInput += "/" + inputValue.substring(4).match(/^[0-9]{0,4}/g); 
                        }
                    }else{
                        transformedInput = inputValue.match(/^[0-9]{2}\/[0-9]{2}\/[0-9]{0,4}|[0-9]{2}\/[0-9]{2}\/|[0-9]{2}\/[0-9]{0,2}|[0-9]{2}\/|[0-9]{0,2}/g)[0];
                    }

                    scope.$apply(function(){
                        element.val(transformedInput);
                    });
                });
            }
        }
    })

    edDirectives.directive('cellphone', function() {
        return {
            restrict: 'C',
            require: 'ngModel',
            link: function(scope, elem, attrs, controller){

                // adicionando filtro durante digitação
                var format = function(event){

                    var inputValue = elem.val();
                    var transformedInput = elem.val();
                    var limit = 12;

                    var dddVal = transformedInput.substring(0,2);

                    transformedInput = inputValue.replace(/[^0-9]/g, '');
                    if(inputValue.length>=limit){
                        transformedInput = transformedInput.substring(0,limit-1);
                    }

                    if(inputValue != transformedInput){
                        setValue(transformedInput);
                        event.preventDefault();
                    }
                };


                //O evento 'input' funciona melhor em navegadores, então será utilizado quando não estiver rodando em webview
                elem.on('input', function(event){                    
                    format(event);
                });

                var setValue = function(value){
                    scope.$apply(function(){
                        controller.$setViewValue(value);
                        elem.val(value);
                    });
                }

                // anulando eventos de paste
                elem.on('paste', function(event){
                    scope.$apply(function () {
                        event.preventDefault();
                    });
                });
            }
        }
    })
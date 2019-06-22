var modalDialog = {
    show: function(id) {
        $('#'+id).css({'opacity': 1, 'pointer-events': 'auto', 'z-index': 1101});
    },
    hide: function(id) {
        $('#'+id).css({'opacity': 0, 'z-index': -10});
    }
}

var waitModal = {

    modalContainer: null,
    correctCall: false,
    create : function()
    {
        if(!this.correctCall)
            throw new ModalException('Método create() chamado indevidamente. Tente usar show() ou hide();');

        if($('.waitModal'))
            $('.waitModal').remove();

        $('body').append('<div class="waitModal"><div class="maskModel"></div><div class="waitBox"></div></div>');
        this.modalContainer = $('.waitModal');
        $(this.modalContainer).css({'display':'none','position':'fixed', 'top':0, 'left':0, 'zIndex': 2000});
        $(this.modalContainer).find('.maskModel').css({'height': '4000px','width': '4000px', 'background':'RGBA(0,0,0,0.7)'});
        $(this.modalContainer).find('.waitBox').css({'margin':'-50px 0 0 -50px','position':'fixed', 'fontSize':'0.8em', 'padding':'50px 10px 10px', 'color': '#333', 'background':'#fff url(./img/loading.gif) no-repeat center 10px','backgroundSize':'32px 32px', 'borderRadius':'5px', 'top':'50%', 'left':'50%'});
        this.recalculateSizes();
        $(window).bind('resize', function(){
            $('.waitModal').height($('document').height());
        });
    },
    recalculateSizes : function()
    {
        if(!this.correctCall)
            throw new ModalException('Método recalculateSizes() chamado indevidamente. Tente usar show() ou hide();');

        $(this.modalContainer).height($(document).height());
        $(this.modalContainer).width($(document).width());
    },
    show : function()
    {
        this.correctCall = true;
        if(this.modalContainer === null || this.modalContainer === undefined){
            this.create();
        }

        $(this.modalContainer).find('.waitBox').html('Aguarde...');
        $(this.modalContainer).show();
        this.correctCall = false;
    },
    hide : function()
    {
        this.correctCall = true;
        if(this.modalContainer === null || this.modalContainer === undefined){
            if($('.waitModal').length > 0){
                if($('.waitModal').is(':visible')){
                    this.modalContainer = $('.waitModal');  
                    $(this.modalContainer).hide();
                }else{
                    console.log("Não é possível executar waitModal.hide() sem executar waitModal.show() antes.")
                }
            }else{
                console.log("Não é possível executar waitModal.hide() sem executar waitModal.show() antes.")
            }
        }else{
            $('.waitModal').hide();
        }

        this.correctCall = false;
    }
}

var defaultError = function(response){
    waitModal.hide();
    var problems;
    if(response.problems && response.problems.length > 0){
        problems = response.problems;
    }else if(response.data && response.data.problems && response.data.problems.length > 0){
        problems = response.data.problems;
    }else{
        swal("Ocorreu um erro, tente novamente mais tarde!");
        return;
    }

    for(var i = 0; i < problems.length;i++){
        swal(problems[i].description);
    }        
}

/*var requisitarServidor = function(scope, method, service, data, callbackSuccess, callbackError) {
    $.ajax({
      type: method,
      url: 'http://localhost/' + service,
      dataType: "json",
      data: data ? data : {},
      crossDomain: true,
      //dataType: 'text',
      contentType: 'application/json',
      success: function(data) {
        try {
            if(data) {
                var objData = data.msg ? data.msg : data;
                try {
                    objData = JSON.parse(objData);
                } catch(error) {
                    //Não faz nada, não era um JSON
                }
                callbackSuccess(objData);
            } else {
                callbackError(null, "Sem dados!");
            }
        } catch(error)  {
            callbackError(null, error);
        }
      },
      error: function (request, error) {
        callbackError(request, error);
      }
    });

}*/



var validarEmail = function(email) {
    // verificação de campo vazio
    if(email && email.length > 0){

        // expressão regular para validação de e-mail
        regex = /^[a-zA-Z0-9-_.]{1,}@[a-zA-Z0-9-_.]{1,}\.[a-zA-Z0-9-_.]{0,}/;

        // verifica se o conteúdo do campo casa com a expressão
        if(!regex.exec(email)){
            return false;
        }else{
            return true;
        }
    } else {
        return false;
    }
}


var validarCPF = function(cpf) {
    var soma;
    var resto;
    soma = 0;
    if (!cpf || cpf == "00000000000") {
        return false;
    }

    for (i = 1; i <= 9; i++) {
        soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = soma % 11;

    if (resto == 10 || resto == 11 || resto < 2) {
        resto = 0;
    } else {
        resto = 11 - resto;
    }

    if (resto != parseInt(cpf.substring(9, 10))) {
        return false;
    }

    soma = 0;

    for (i = 1; i <= 10; i++) {
        soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = soma % 11;

    if (resto == 10 || resto == 11 || resto < 2) {
        resto = 0;
    } else {
        resto = 11 - resto;
    }

    if (resto != parseInt(cpf.substring(10, 11))) {
        return false;
    }

    return true;
}


var validarTelefone = function(telefone) {
    if(telefone && telefone.length == 10 || telefone.length == 11) {
        return true;
    }

    return false;
}
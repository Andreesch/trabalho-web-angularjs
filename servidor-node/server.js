 var express = require('express');
 var app = express();
 var bodyParser = require('body-parser');
 var mysql = require('mysql');
 var cors = require('cors');

 app.use(cors());
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({
     extended: true
 }));

 // default route
 app.get('/', function (req, res) {
     return res.send({ error: true, message: 'hello' })
 });
 // set port
 app.listen(3000, function () {
     console.log('Node app is running on port 3000');
 });
 
 module.exports = app;

 // connection configurations
 var dbConn = mysql.createConnection({
     host: 'localhost',
     user: 'root',
     password: 'master',
     port: 3308,
     database: 'web'
 });

 // connect to database
 dbConn.connect();  

 // Adiciona usuário
 app.post('/registrar-usuario', function (req, res) {
     let user = req.body;

     console.log(user);

     if (!user) {
       return res.status(400).send({ error:true, message: 'Please provide user' });
     }

    dbConn.query("INSERT INTO USUARIO SET ? ", user, function (error, results, fields) {
       if (error) throw error;
         return res.send({ error: false, data: results, message: 'New user has been created successfully.' });
         });
 });

  // Validar usuário  
 app.post('/validar-login', function (req, res) {
     let user = req.body;
     let usuario = user.usuario;
     let senha = user.senha;

     if (!user) {
       return res.status(400).send({ error:true, message: 'Por favor, informe os dados de login!' });
     }

    dbConn.query("SELECT u.COD FROM USUARIO u WHERE u.USUARIO = ? AND u.SENHA = ? ", [usuario, senha], function (error, results, fields) {
       if (error){
          throw error;
       } 

       console.log(results);

       let successMessage = 'Usuário encontrado com sucesso';
       let notFoundMessage = 'Usuário não encontrado. Verifique suas credenciais e tente novamente';
         
        return res.send({ error: false, data: results, msg: results.length > 0 ? successMessage : notFoundMessage});
      });
 });

 // Retrieve all users 
 app.get('/produtos', function (req, res) {
     dbConn.query('SELECT p.*, e.QTD FROM PRODUTO p LEFT JOIN ESTOQUE e ON e.COD_PRODUTO = p.COD', function (error, results, fields) {
         if (error) throw error;
         return res.send({ error: false, data: results, message: 'users list.' });
     });
 });


 // Add a new user  
 app.post('/produto', function (req, res) {
     let product = JSON.parse(req.body.data);

     if (!product) {
       return res.status(400).send({ error:true, message: 'Please provide user' });
     }

    var param = {};
    param["NOME"] = product.nome;
    param["FORNECEDOR"] = product.codFornecedor;
    param["VALOR_AQUISICAO"] = product.valorFornecedor;
    param["VALOR_VENDA"] = product.valorVenda;

    dbConn.query("INSERT INTO PRODUTO SET ? ", param, function (error, results, fields) {
      if (error) throw error;
        return res.send({ error: false, data: results, message: 'New user has been created successfully.' });
      });
 });


 // Retrieve all users 
 app.get('/fornecedores', function (req, res) {
     dbConn.query('SELECT * FROM FORNECEDOR', function (error, results, fields) {
         if (error) throw error;
         return res.send({ error: false, data: results, message: 'lista de fornecedores' });
     });
 });


 // Add a new user  
 app.post('/fornecedor', function (req, res) {
     let fornecedor = JSON.parse(req.body.data);

     if (!fornecedor) {
       return res.status(400).send({ error:true, message: 'Please provide user' });
     }

    dbConn.query("INSERT INTO FORNECEDOR SET ? ", fornecedor, function (error, results, fields) {
      if (error) throw error;
        return res.send({ error: false, data: results, message: 'New user has been created successfully.' });
      });
 });

 app.get('/verificar-estoque', function (req, res) {
    let produto = req.query.produto;
    console.log(produto);
    dbConn.query("SELECT QTD FROM ESTOQUE WHERE COD_PRODUTO = ?", produto, function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, data: results, message: 'New user has been created successfully.' });
    });
 });

 // Add a new user  
 app.post('/efetuar-venda', function (req, res) {
     let requestParams = JSON.parse(req.body.data);

     if (!requestParams) {
       return res.status(400).send({ error:true, message: 'Please provide user' });
     }

     var movimento = {};
     movimento["DESCRICAO"] = "Venda de produtos";
     movimento["VALOR_TOTAL"] = requestParams.valor;
     movimento["DATA"] = new Date();
     movimento["TIPO"] = 0;

    dbConn.query("INSERT INTO MOVIMENTO SET ? ", movimento, function (error, results, fields) {
      if (error) throw error;
    });

    if(requestParams.produtos) {
      for(var i = 0; i < requestParams.produtos.length; i++) { 
        dbConn.query("UPDATE ESTOQUE set QTD = (QTD - ?) WHERE COD_PRODUTO = ?", [requestParams.qtd, requestParams.produtos[i].cod], function (error, results, fields) {
          if (error) throw error;
        });
      }
    }

    return res.send({ error: false, data: {}, message: 'New user has been created successfully.' });
 });

 app.get('/listar-movimentos', function (req, res) {
     dbConn.query('SELECT * FROM MOVIMENTO m', function (error, results, fields) {
         if (error) throw error;
         return res.send({ error: false, data: results, message: 'users list.' });
     });
 });

 app.post('/movimento', function (req, res) {
     let movimento = JSON.parse(req.body.data);

     if (!movimento) {
       return res.status(400).send({ error:true, message: 'Please provide user' });
     }

    var param = {};
    param["VALOR_TOTAL"] = movimento.valor;
    param["DATA"] = new Date();
    param["TIPO"] = movimento.tipo;
    param["DESCRICAO"] = movimento.descricao;

    dbConn.query("INSERT INTO MOVIMENTO SET ? ", param, function (error, results, fields) {
      if (error) throw error;
        return res.send({ error: false, data: results, message: 'New user has been created successfully.' });
      });
 });

 // Recuperar todo o estoque 
 app.get('/estoque', function (req, res) {
     dbConn.query('SELECT e.*, p.NOME FROM ESTOQUE e JOIN PRODUTO p ON e.COD_PRODUTO = p.COD ORDER BY e.COD ASC ', function (error, results, fields) {
         if (error) throw error;
         return res.send({ error: false, data: results, message: 'users list.' });
     });
 });

app.post('/registrar-estoque', function (req, res) {
   let estoque = JSON.parse(req.body.data);

   console.log(estoque);

   if (!estoque) {
     return res.status(400).send({ error:true, message: 'Informe um estoque!' });
   }

  let param = {};
  param["COD_PRODUTO"] = estoque.cod;
  param["QTD"] = estoque.qtd;
  param["ATUALIZACAO"] = estoque.atualizacao;

  dbConn.query("INSERT INTO ESTOQUE SET ? ", param, function (error, results, fields) {
    if (error) throw error;
      return res.send({ error: false, data: results, msg: 'Estoque cadastrado com sucesso!' });
    });
});

 // Remoção de estoque
 app.post('/remover-estoque', function (req, res) {
  let stock_id = req.body.stock;
 
  if (!stock_id) {
     return res.status(400).send({ error: true, message: 'Fornecer um id de estoque.' }); 
  }

  dbConn.query('DELETE FROM ESTOQUE WHERE cod = ?', [stock_id], function (error, results, fields) {
     if (error) throw error;
     return res.send({ error: false, data: results, msg: 'Estoque deletado com sucesso.' });
    });
  });

  // Inativação de fornecedor
 app.post('/atualizar-fornecedor', function (req, res) {
  console.log(req.body.provider);
  let provider_id = req.body.provider.cod;
  let provider_status = req.body.provider.status;
 
  if (!provider_id) {
     return res.status(400).send({ error: true, message: 'Fornecer um id de fornecedor.' }); 
  }

  dbConn.query('UPDATE FORNECEDOR SET ATIVO = ? WHERE cod = ?', [provider_status,provider_id], function (error, results, fields) {
     if (error) throw error;
     return res.send({ error: false, data: results, msg: 'Fornecedor inativado com sucesso.' });
    });
  });
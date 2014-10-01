// para poder tener acceso a la informacion que nos envia un cliente en express, usamos un modulo que server
// llama body-parser, nos ayuda a evaluar el cuerpo de una solicitud y nos extrae la informacion

/**
* Dependencies
*/
var express = require('express');
var bodyParser = require('body-parser');

/**
* Local Variables
*/
var server = express();
var db = {};
/**
* Middleware
*/
server.use(bodyParser.json('application/json'));
/**
* Routes
*/
server.post('/notas', function(req, res){
	console.log('POST', req.body.nota);
	var notaNueva = req.body.nota;
	notaNueva.id = Date.now();//Date.now retorna una fecha en cadena, esto para asegurarnos que sea unico el id
	
	db[notaNueva.id] = notaNueva;

	res
		.status(201)
		.json({
			nota: notaNueva
		});
});


server.get('/notas/:id', function(req, res){
	console.log('GET /notas/%s', req.params.id); // ver propiedades de request en Doc de express
	var id = req.params.id; // guardamos id
	var nota = db[id]; // buscando la nota
	
	res		
		.json({
			notas: nota
		});
});

/**
* Expose or star server
*/

// si queremos saber si alguien nos esta usando a nosotros como un modulo o si somos 
// el modulo que esta siendo usado

if (!module.parent) { // si tengo a un padre es porque me estan usando como modulo
	server.listen(3000, function(){
		console.log('hola estoy escuchando en el url http: ....3000');
	});
}else{
	module.exports = server;
}



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

/**
* Middleware
*/
server.use(bodyParser.json('application/json'));
/**
* Routes
*/
var notas = (require('./lib/notas'));
server.use(notas);
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



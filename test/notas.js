var request = require('supertest');
var api = require('../server.js');
var host = process.env.API_TEST_HOST || api; // para poder correr las pruebas con diferentes host
var async = require('async');

request = request(host); //vamos a iniciar nuestra libreria con el servidor

describe('recurso /notas', function(){
	describe('POST', function(){
		it('debera crear una nota nueva', function(done){
			// throw new Error('tengo hambre');
			// return true;
			var data = {
				"nota":{
					"title": "Mejorando.la #node-pro",
					"description": "Introduccion a clase",
					"type": "js",
					"body": "soy el cuerpo de json"
				}
			};

			request // request a un servidor
				.post('/notas') // que haga un post al recurso notas
				.set('Accept', 'application/json')  //decimos que queremos recibir json
				.send(data)  // enviando datos
				.expect(201) //config nuestras espectativas
				.expect('Content-Type', /application\/json/)  
				//hasta aqui ya hicimos la solicitud
				.end(function(err, res){   // pasandole un callback a nuestro request

					//examinando nuestra nota
					var body = res.body; // el cuerpo de ls respuesta, lo llamamos cuerpo
					expect(body).to.have.property('nota'); // esperamos que el halla una propiedad nota
					var nota = body.nota;

					expect(nota).to.have.property('title', 'Mejorando.la #node-pro'); 
					expect(nota).to.have.property('description', 'Introduccion a clase'); 
					expect(nota).to.have.property('type', 'js'); 
					expect(nota).to.have.property('body', 'soy el cuerpo de json'); 
					expect(nota).to.have.property('id'); //esperamos que tenga un id
					done();
				});
		});
	});

	describe('GET', function(){
		it('deberia obtener una nota existente', function(done){
			var data =
			{
				"nota":{
					"title": "Mejorando.la #node-pro",
					"description": "Introduccion a clase",
					"type": "js",
					"body": "soy el cuerpo de json"
				}
			};

			var id;

			async.waterfall([
				function createNote(cb){
					request
						.post('/notas')
						.set('Accept', 'application/json')
						.send(data)			
						.expect(201)												
						.end(cb)
				},
				function getNote(res, cb){
					id = res.body.nota.id; //guardamos el id porque vamos a uerer solicitar la misma nota que acabamos de crear

					request
						.get('/notas/' + id)
						.expect(200)
						.expect('Content-Type', /application\/json/)
						.end(cb)
				},
				function assertions(res, cb){
					var nota = res.body.notas;

					expect(nota).to.have.property('title', 'Mejorando.la #node-pro');
					expect(nota).to.have.property('description', 'Introduccion a clase');
					expect(nota).to.have.property('type', 'js');
					expect(nota).to.have.property('body', 'soy el cuerpo de json');
					expect(nota).to.have.property('id', id); // esperamos que el id sea igual al id de la nota que creamos anteriormente
					cb();
				}
			], done)			
		});
	});
});
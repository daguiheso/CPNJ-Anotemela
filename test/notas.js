var request = require('supertest-as-promised');
var api = require('../server.js');
var host = process.env.API_TEST_HOST || api; // para poder correr las pruebas con diferentes host



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

			// Crear nota nueva		
			request
				.post('/notas')
				.set('Accept', 'application/json')
				.send(data)			
				.expect(201)
				.expect('Content-Type', /application\/json/)

				.then(function getNote(res){  // then recibe dos parametros, el segundo argumento se ejecutara si hay un Error
					var id = res.body.nota.id; //guardamos el id porque vamos a uerer solicitar la misma nota que acabamos de crear

					return request
						.get('/notas/' + id)
						.expect(200)
						.expect('Content-Type', /application\/json/)			
				}, done)
				.then(function assertionsNote(res){  // hasta aqui va la solicitud y pasamos el resultado
					var nota;
					var body = res.body;

					// Nota existe
					expect(body).to.have.property('notas');
					nota = res.body.notas;

					//Porpiedades
					expect(nota).to.have.property('title', 'Mejorando.la #node-pro');
					expect(nota).to.have.property('description', 'Introduccion a clase');
					expect(nota).to.have.property('type', 'js');
					expect(nota).to.have.property('body', 'soy el cuerpo de json');
					//esperamos que el id sea igual al id de la nota que creamos anteriormente
					expect(nota).to.have.property('id', id);  
					done();
				}, done); // done es el segundo param, para saber si tuve un error				
		});
	});

	describe('PUT', function() {
	    it('deberia actualizar una nota existente', function(done) {
	      var id;
	      var data = {
	        "nota": {
	          "title": "Mejorando.la #node-pro",
	          "description": "Introduccion a clase",
	          "type": "js",
	          "body": "soy el cuerpo de json"
	        }
	      };

	      request
	        .post('/notas')
	        .set('Accept', 'application/json')
	        .send(data)
	        .expect(201)
	        .expect('Content-Type', /application\/json/)
	      .then(function getNota(res) {
	        var update = {
	          "nota": {
	            "title": "Mejorando.la #node-pro",
	            "description": "Introduccion a clase",
	            "type": "ruby",
	            "body": "soy el cuerpo de ruby"
	          }
	        };

	        id = res.body.nota.id;

	        return request.put('/notas/' + id)
	          .set('Accept', 'application/json')
	          .send(update)
	          .expect(200)
	          .expect('Content-Type', /application\/json/)
	      }, done)
	      .then(function assertions(res) {
	        var nota;
	        var body = res.body;

	        // Nota existe
	        expect(body).to.have.property('nota');
	        expect(body.nota).to.be.an('array')
	          .and.to.have.length(1);
	        nota = body.nota[0];

	        // Propiedades
	        expect(nota).to.have.property('id', id);
	        expect(nota).to.have.property('title', 'Mejorando.la #node-pro');
	        expect(nota).to.have.property('description', 'Introduccion a clase');
	        expect(nota).to.have.property('type', 'ruby');
	        expect(nota).to.have.property('body', 'soy el cuerpo de ruby');
	        done();
	      }, done);

	    });
	  });
	// describe('PUT', function(){
	// 	it('deberia actualizar una nota existente', function(done){
			
	// 		var data =
	// 		{
	// 			"nota":{
	// 				"title": "Mejorando.la #node-pro",
	// 				"description": "Introduccion a clase",
	// 				"type": "js",
	// 				"body": "soy el cuerpo de json"
	// 			}
	// 		};

	// 		var id;

	// 		// crear una nota (POST)		
	// 		request
	// 			.post('/notas')
	// 			.set('Accept', 'application/json')
	// 			.send(data)		
				

	// 		// obtener nota creada (GET)
	// 			.then(function getNote(res){  // then recibe dos parametros, el segundo argumento se ejecutara si hay un Error
	// 				// var update = {
	// 				// 	"nota":{
	// 				// 		"title": "Juan Pablo no sabe escribir ejecicion",
	// 				// 		"description": "Introduccion a clase",
	// 				// 		"type": "js",
	// 				// 		"body": "soy el cuerpo de json"
	// 				// 	}
	// 				// };	
	// 				id = res.body.nota.id; //guardamos el id porque vamos a uerer solicitar la misma nota que acabamos de crear

	// 				return request
	// 					.get('/notas/' + id)
	// 					.set('Accept', 'application/json')						
	// 					.send()									
	// 			}, done)


	// 		// modificar la nota 
	// 			.then(function updateNote(res){  // hasta aqui va la solicitud y pasamos el resultado
									
	// 				var body = res.body;					
	// 				expect(body).to.have.property('notas'); //Nota existe
	// 				var notaActualizada = res.body.nota;	

	// 				notaActualizada.title = "Juan Pablo no sabe escribir ejecicion";



	// 		// enviar nota actualizada (PUT)
	// 				return request
	// 					.put('/notas/' + id)
	// 					.send(notaActualizada)	
	// 					.expect(200)			
	// 					.expect('Content-Type', /application\/json/)
	// 			}, done) // done es el segundo param, para saber si tuve un error


	// 		// evaluar que la nota se haya actualizado correctamente
	// 			.then(function assertions(res){

	// 				var nota = res.body.nota;
	// 				//Porpiedades
	// 				expect(nota).to.have.property('title', 'Juan Pablo no sabe escribir ejecicion');
	// 				expect(nota).to.have.property('description', 'Introduccion a clase');
	// 				expect(nota).to.have.property('type', 'js');
	// 				expect(nota).to.have.property('body', 'soy el cuerpo de json');
	// 				//esperamos que el id sea igual al id de la nota que creamos anteriormente
	// 				expect(nota).to.have.property('id', id);  
	// 				done();
	// 			}, done);				
	// 	});
	// });

	describe('DELETE', function(){
		it('deberia eliminar una nota existente', function(done){
			// Crear nota nueva
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

			// Crear nota nueva		
			request
				.post('/notas')
				.set('Accept', 'application/json')
				.send(data)			
				.expect(201)
				.expect('Content-Type', /application\/json/)

				// Eliminamos nota existente
				.then(function deleteNote(res){  // then recibe dos parametros, el segundo argumento se ejecutara si hay un Error
					var id = res.body.nota.id; //guardamos el id porque vamos a uerer solicitar la misma nota que acabamos de crear

					return request
						.delete('/notas/' + id)
						.expect(204)								
				}, done)

				// Confirmar que la nota no existe
				.then(function assertNoteDestroyed(res){
					return request
						.get('/notas/' + id)
						.expect(400);						
				}, done)
				.then(function(){
					done();
				});			
		});
	});
});
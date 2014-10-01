var app = require('express')();
var db = {};


/**
* Routes
*/
app.post('/notas', function(req, res){
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


app.get('/notas/:id', function(req, res){
	console.log('GET /notas/%s', req.params.id); // ver propiedades de request en Doc de express
	var id = req.params.id; // guardamos id
	var nota = db[id]; // buscando la nota
	
	res		
		.json({
			notas: nota
		});
});

module.exports = app;
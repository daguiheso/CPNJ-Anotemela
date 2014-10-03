var app = require('express')();
var db = {};


/**
* Routes
*/
app.route('/notas/:id?')
	.all(function(req, res, next){ // en todas las rutas queremos que corra este middleware
		console.log(req.method, req.path, req.body); // 1-param => metodo del req 2-param => ruta del req 3-param => que nos enviaron
		res.set('Content-Type', 'application/json');// configurando el tipo de contenido, queremos todas las res en json
		next(); // como este midleware no esta enviando una res al servidor le decimos next(), que siga con la next function que hemos incluido
	})

//POST
.post(function(req, res){	
	var notaNueva = req.body.nota;
	notaNueva.id = Date.now();//Date.now retorna una fecha en cadena, esto para asegurarnos que sea unico el id
	
	db[notaNueva.id] = notaNueva;

	res
		.status(201)
		.json({
			nota: notaNueva
		});
})

//GET
.get(function(req, res){	
	var id = req.params.id; // guardamos id
	var nota = db[id]; // buscando la nota
	
	res		
		.json({
			notas: nota
		});
})


//PUT
.put(function(req, res){
	var id = req.params.id;
	var notaActualizada = req.body.nota;
	notaActualizada.id = parseInt(id, 10);
	db[id] = notaActualizada;

	res
		//.status(201)
		.json({
			nota: [db[id]]
		});
});

module.exports = app;
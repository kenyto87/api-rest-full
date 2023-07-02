// Cargar las variables de entorno del archivo .env
require("dotenv").config();

// Importar el módulo Express
const express = require("express");
const app = express();

// Importar las funciones del gestor de frutas
const { leerFrutas, guardarFrutas } = require("./src/frutasManager");

// Configurar el número de puerto para el servidor
const PORT = process.env.PORT || 3000;

// Crear un arreglo vacío para almacenar los datos de las frutas
let BD = [];

// Configurar el middleware para analizar el cuerpo de las solicitudes como JSON
app.use(express.json());

// Middleware para leer los datos de las frutas antes de cada solicitud
app.use((req, res, next) => {
	BD = leerFrutas(); // Leer los datos de las frutas desde el archivo
	next(); // Pasar al siguiente middleware o ruta
});

// Ruta principal que devuelve los datos de las frutas
app.get("/", (req, res) => {
	res.send(BD);
});

// Ruta para agregar una nueva fruta al arreglo y guardar los cambios
app.post("/", (req, res) => {
	const nuevaFruta = req.body;
	BD.push(nuevaFruta); // Agregar la nueva fruta al arreglo
	guardarFrutas(BD); // Guardar los cambios en el archivo
	res.status(201).send("Fruta agregada!"); // Enviar una respuesta exitosa
});
// Ruta para editar-actualizar una fruta al arreglo y guardar los cambios
app.put("/frutas/:id", (req, res) => {
	const frutas = leerFrutas(); //almacenamos las frutas en una variable

	const idFruta = parseInt(req.params.id); //Parseamos aentero el ID

	const actualizarFruta = req.body; //Obtenemos los nuevos datos de la fruta

	// Busca la fruta en el arreglo frutas por su ID
	const frutaIndex = frutas.findIndex((f) => f.id === idFruta);

	// Si la fruta no existe, retornar un mensaje de error
	if (frutaIndex === -1) {
		return res
			.status(404)
			.json({ mensaje: "La fruta no existe, ingrese un id valido" });
	}

	// Actualizar los datos de la fruta
	frutas[frutaIndex] = {
		...frutas[frutaIndex],
		...actualizarFruta,
	};
	guardarFrutas(frutas); // Guardar los cambios en el archivo

	res.status(200).send("Fruta actualizada!"); // Retorna una respuesta exitosa
});
// Ruta para eliminar una fruta al arreglo y guardar los cambios
app.delete("/frutas/:id", (req, res) => {
	const frutas = leerFrutas(); //almacenamos las frutas en una variable

	const idFruta = parseInt(req.params.id); //Parseamos aentero el ID

	// Busca la fruta en el arreglo frutas por su ID
	const frutaIndex = frutas.findIndex((f) => f.id === idFruta);

	// Si la fruta no existe, retornar un mensaje de error
	if (frutaIndex === -1) {
		return res
			.status(404)
			.json({ mensaje: "La fruta no existe, ingrese un id valido" });
	}

	// Eliminar la fruta del arreglo
	frutas.splice(frutaIndex, 1);

	guardarFrutas(frutas); // Guardar los cambios en el archivo

	res.status(200).send("Fruta eliminada!"); // Retorna una respuesta exitosa
});
// Ruta para ver una fruta segun su ID
app.get("/frutas/:id", (req, res) => {
	const frutas = leerFrutas();
	const idFruta = parseInt(req.params.id);

	// Buscar la fruta por su ID
	const fruta = frutas.find((f) => f.id === idFruta);

	// Si la fruta no se encuentra, devolver un error 404
	if (!fruta) {
		return res
			.status(404)
			.json({ mensaje: "La fruta no existe, ingrese un id valido" });
	}

	res.json(fruta);
});
// Ruta para manejar las solicitudes a rutas no existentes
app.get("*", (req, res) => {
	res.status(404).send("Lo sentimos, la página que buscas no existe.");
});

// Iniciar el servidor y escuchar en el puerto especificado
app.listen(PORT, () => {
	console.log(`Servidor escuchando en el puerto ${PORT}`);
});

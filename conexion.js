const mysql = require('mysql');
const express = require('express');
const app = express();
const port = 3001;

// Configurar Pug como motor de plantillas
app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Configuración de la conexión a MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'laboratorio15yeff'
});

// Conexión a la base de datos
connection.connect((error) => {
  if (error) {
    console.error('Error al conectar a MySQL: ', error);
    return;
  }
  console.log('Conexión exitosa a MySQL');
});

// Mostrar todos los datos
app.get('/', (req, res) => {
  connection.query('SELECT * FROM yeffprueba', (error, resultados) => {
    if (error) {
      console.error('Error al obtener los datos: ', error);
      return;
    }
    res.render('index', { datos: resultados });
  });
});

// Mostrar formulario para agregar nuevo dato
app.get('/agregar', (req, res) => {
  res.render('agregar');
});

// Agregar un nuevo dato
app.post('/', (req, res) => {
  const nuevoDato = req.body;
  const consulta = 'INSERT INTO yeffprueba (columna1, columna2, columna3) VALUES (?, ?, ?)';

  // Verificar que los campos requeridos no estén vacíos
  if (!nuevoDato.columna1 || !nuevoDato.columna2 || !nuevoDato.columna3) {
    res.render('agregar', { error: 'Todos los campos son requeridos' });
    return;
  }
  if (!Number.isInteger(Number(nuevoDato.columna2))) {
    res.render('agregar', { error: 'La columna2 debe ser un número entero válido' });
    return;
  }

  connection.query(consulta, [nuevoDato.columna1, nuevoDato.columna2, nuevoDato.columna3], (error, results) => {
    if (error) {
      console.error('Error al insertar datos: ', error);
      return;
    }
    console.log('Dato insertado exitosamente');
    res.redirect('/');
  });
});

// Mostrar formulario para editar un dato existente
app.get('/editar/:id', (req, res) => {
  const id = req.params.id;
  const consulta = 'SELECT * FROM yeffprueba WHERE id = ?';

  connection.query(consulta, [id], (error, resultados) => {
    if (error) {
      console.error('Error al obtener los datos: ', error);
      return;
    }
    if (resultados.length === 0) {
      res.redirect('/');
      return;
    }
    res.render('editar', { dato: resultados[0], error: null });
  });
});

// Actualizar un dato existente
app.post('/editar/:id', (req, res) => {
  const id = req.params.id;
  const datos = req.body;
  const consulta = 'UPDATE yeffprueba SET columna1 = ?, columna2 = ?, columna3 = ? WHERE id = ?';

  if (!datos.columna1 || !datos.columna2 || !datos.columna3) {
    res.render('editar', { error: 'Todos los campos son requeridos' });
    return;
  }

  connection.query(consulta, [datos.columna1, datos.columna2, datos.columna3, id], (error, results) => {
    if (error) {
      console.error('Error al actualizar datos: ', error);
      return;
    }
    console.log('Dato actualizado exitosamente');
    res.redirect('/');
  });
});

// Eliminar un dato
app.get('/eliminar/:id', (req, res) => {
  const id = req.params.id;
  const consulta = 'DELETE FROM yeffprueba WHERE id = ?';

  connection.query(consulta, [id], (error, results) => {
    if (error) {
      console.error('Error al eliminar el dato: ', error);
      return;
    }
    console.log('Dato eliminado exitosamente');
    res.redirect('/');
  });
});

// Consulta con JOIN entre dos tablas
app.get('/consulta', (req, res) => {
  const consulta = 'SELECT yeffprueba.columna1 AS nombre, yeffprueba.columna2 AS edad, tablaEjemplo.nombre AS nombre_otraTabla, tablaEjemplo.edad AS edad_otraTabla FROM yeffprueba JOIN tablaEjemplo ON yeffprueba.id = tablaEjemplo.id';

  connection.query(consulta, (error, resultados) => {
    if (error) {
      console.error('Error al obtener los datos: ', error);
      return;
    }
    res.render('consulta', { datos: resultados });
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});

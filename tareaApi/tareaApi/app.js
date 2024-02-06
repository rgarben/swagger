const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const YAML = require('yamljs');

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());


app.use(bodyParser.json());

// Ruta principal
app.get('/', (req, res) => {
  res.send('Bienvenidos a la lista de tareas API');
});

// Ruta para la documentación Swagger UI
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Datos simulados para las Tareas (solo para fines de ejemplo)
let tareaData = [
  { id: 1, name: 'Arreglar pc', type: 'Informatica' },
  { id: 2, name: 'Limpiar mesa', type: 'Limpieza' }
];

// Ruta para obtener todas las Tareas
app.get('/tareas', (req, res) => {
  res.json(tareaData);
});

// Ruta para agregar una nueva Tarea
app.post('/tareas', (req, res) => {
  const { name, type } = req.body;
  const newTarea = { id: tareaData.length + 1, name, type };
  tareaData.push(newTarea);
  res.status(201).json({ message: 'Tarea agregada exitosamente', tarea: newTarea });
});

// Ruta para editar una tarea
app.put('/tareas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, type } = req.body;
  const index = tareaData.findIndex(tarea => tarea.id === id);
  if (index !== -1) {
    tareaData[index] = { ...tareaData[index], name, type };
    res.json({ message: 'Tarea actualizada exitosamente', tarea: tareaData[index] });
  } else {
    res.status(404).json({ message: 'Tarea no encontrada' });
  }
});

// Ruta para borrar una tarea
app.delete('/tareas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tareaData.findIndex(tarea => tarea.id === id);
  if (index !== -1) {
    const deletedTarea = tareaData.splice(index, 1)[0];
    res.json({ message: 'Tarea eliminada exitosamente', tarea: deletedTarea });
  } else {
    res.status(404).json({ message: 'Tarea na encontrada' });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

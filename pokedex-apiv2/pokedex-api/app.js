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
  res.send('Bienvenido a la Pokédex API');
});

// Ruta para la documentación Swagger UI
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Datos simulados para la Pokédex (solo para fines de ejemplo)
let pokemonData = [
  { id: 1, name: 'Bulbasaur', type: 'Grass' },
  { id: 2, name: 'Charmander', type: 'Fire' }
];

// Ruta para obtener todos los Pokémon
app.get('/pokemon', (req, res) => {
  res.json(pokemonData);
});

// Ruta para agregar un nuevo Pokémon
app.post('/pokemon', (req, res) => {
  const { name, type } = req.body;
  const newPokemon = { id: pokemonData.length + 1, name, type };
  pokemonData.push(newPokemon);
  res.status(201).json({ message: 'Pokémon agregado exitosamente', pokemon: newPokemon });
});

// Ruta para editar un Pokémon
app.put('/pokemon/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, type } = req.body;
  const index = pokemonData.findIndex(pokemon => pokemon.id === id);
  if (index !== -1) {
    pokemonData[index] = { ...pokemonData[index], name, type };
    res.json({ message: 'Pokémon actualizado exitosamente', pokemon: pokemonData[index] });
  } else {
    res.status(404).json({ message: 'Pokémon no encontrado' });
  }
});

// Ruta para borrar un Pokémon
app.delete('/pokemon/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = pokemonData.findIndex(pokemon => pokemon.id === id);
  if (index !== -1) {
    const deletedPokemon = pokemonData.splice(index, 1)[0];
    res.json({ message: 'Pokémon eliminado exitosamente', pokemon: deletedPokemon });
  } else {
    res.status(404).json({ message: 'Pokémon no encontrado' });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

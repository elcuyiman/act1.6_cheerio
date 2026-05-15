const express = require('express');
const scrapeRoutes = require('./routes/scrape.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));
app.use('/api', scrapeRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: 'Servidor corriendo ✅', endpoints: ['GET /api/scrape/local', 'GET /api/scrape?url=https://...'] });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor', detalle: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});

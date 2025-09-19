// === Import dan Inisialisasi ===
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3200;

// === Middleware ===
app.use(cors());
app.use(express.json());

// === Data Movies (Bab 2) ===
let movies = [
  { id: 1, title: 'Parasite', director: 'Bong Joon-ho', year: 2019 },
  { id: 2, title: 'The Dark Knight', director: 'Christopher Nolan', year: 2008 },
];
let movieIdSeq = 3;

// === Data Directors (Bab 3) ===
let directors = [
  { id: 1, name: 'Bong Joon-ho', birthYear: 1969 },
  { id: 2, name: 'Christopher Nolan', birthYear: 1970 },
];
let directorIdSeq = 3;

// === ROUTES ===

// Health check
app.get('/status', (req, res) => {
  res.json({
    ok: true,
    service: 'film-api',
    time: new Date().toISOString()
  });
});

// ---------------- MOVIES CRUD ----------------

// GET all movies
app.get('/movies', (req, res) => {
  res.json(movies);
});

// GET movie by ID
app.get('/movies/:id', (req, res) => {
  const id = Number(req.params.id);
  const movie = movies.find(m => m.id === id);
  if (!movie) return res.status(404).json({ error: 'Movie tidak ditemukan' });
  res.json(movie);
});

// POST new movie
app.post('/movies', (req, res) => {
  const { title, director, year } = req.body || {};
  if (!title || !director || !year) {
    return res.status(400).json({ error: 'title, director, year wajib diisi' });
  }
  const newMovie = { id: movieIdSeq++, title, director, year };
  movies.push(newMovie);
  res.status(201).json(newMovie);
});

// PUT update movie
app.put('/movies/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = movies.findIndex(m => m.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Movie tidak ditemukan' });

  const { title, director, year } = req.body || {};
  const updatedMovie = { id, title, director, year };
  movies[idx] = updatedMovie;
  res.json(updatedMovie);
});

// DELETE movie
app.delete('/movies/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = movies.findIndex(m => m.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Movie tidak ditemukan' });

  movies.splice(idx, 1);
  res.status(204).send();
});

// ---------------- DIRECTORS CRUD ----------------

// GET all directors
app.get('/directors', (req, res) => {
  res.json(directors);
});

// GET director by ID
app.get('/directors/:id', (req, res) => {
  const id = Number(req.params.id);
  const director = directors.find(d => d.id === id);
  if (!director) return res.status(404).json({ error: 'Director tidak ditemukan' });
  res.json(director);
});

// POST new director
app.post('/directors', (req, res) => {
  const { name, birthYear } = req.body || {};
  if (!name || !birthYear) {
    return res.status(400).json({ error: 'name dan birthYear wajib diisi' });
  }
  const newDirector = { id: directorIdSeq++, name, birthYear };
  directors.push(newDirector);
  res.status(201).json(newDirector);
});

// PUT update director
app.put('/directors/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = directors.findIndex(d => d.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Director tidak ditemukan' });

  const { name, birthYear } = req.body || {};
  const updatedDirector = { id, name, birthYear };
  directors[idx] = updatedDirector;
  res.json(updatedDirector);
});

// DELETE director
app.delete('/directors/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = directors.findIndex(d => d.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Director tidak ditemukan' });

  directors.splice(idx, 1);
  res.status(204).send();
});

// === Middleware Fallback 404 ===
app.use((req, res) => {
  res.status(404).json({ error: 'Rute tidak ditemukan' });
});

// === Error Handler ===
app.use((err, req, res, _next) => {
  console.error('[ERROR]', err);
  res.status(500).json({ error: 'Terjadi kesalahan pada server' });
});

// === Start Server ===
app.listen(PORT, () => {
  console.log(`Server aktif di http://localhost:${PORT}`);
});

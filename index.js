import http from 'http';
import express from 'express';
import fs from 'fs/promises';
import dotenv from 'dotenv';
import routerAPI from './routes/index.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static('public'));

// // Acesso a API
// app.get('/', (req, res) => {
//     res.send('<h1> Bienvenido a la API de Cute Rescue... </h1>');
// });

routerAPI(app);

// Porta de entrada da web
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
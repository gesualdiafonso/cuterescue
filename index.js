import http from 'http';
import express from 'express';
import fs from 'fs/promises';
import dotenv from 'dotenv';
import routerAPI from './routes/index.js';
import cors from 'cors'; 
import path from 'path';

dotenv.config();

const app = express();

app.use(cors({
    origin: '*', // Permitir todas as origens
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Permitir métodos específicos
    allowedHeaders: ['Content-Type', 'Authorization'], // Permitir cabeçalhos específicos
}));

app.use(express.json());
app.use('/uploads', express.static(path.resolve('uploads')));

routerAPI(app);

// Porta de entrada da web
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
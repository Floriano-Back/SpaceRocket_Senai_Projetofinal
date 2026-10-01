import 'dotenv/config'
import express from "express";
import cors from 'cors';
import pool from '../src/configs/database.js';
import usersRouters from '../src/routes/usersRouters.js';
import usersAuthRouters from '../src/routes/usersAuthRouters.js';
import errorMiddlewares from '../src/middlewares/errorMiddlewares.js';
import voosRouters from "../src/routes/voosRouters.js";
import passageiroRoutes from '../src/routes/passageiroRoutes.js';
import agendamentosRouters from '../src/routes/agendamentoRouters.js';
import avaliacaoRouters from '../src/routes/avaliacaoRouters.js';

const app = express();
const port = process.env.PORT || process.env.SERVER_PORT;

const corsOptions = {
    // remove a barra final, se existir
    origin: (process.env.FRONTEND_URL || 'https://spacerocket-senai-projetofinal.onrender.com').replace(/\/$/, ''),
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.static('src/public'));
app.use(express.json());

app.get('/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.status(200).json({ api: 'online', database: 'connected' });
    } catch (error) {
        res.status(503).json({ api: 'online', database: 'disconnected' });
    }
});

app.use('/users', usersRouters);
app.use('/auth', usersAuthRouters);
app.use("/voos", voosRouters);
app.use('/passageiros', passageiroRoutes);
app.use('/agendamentos', agendamentosRouters);
app.use('/avaliacoes', avaliacaoRouters);

app.use(errorMiddlewares);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)});
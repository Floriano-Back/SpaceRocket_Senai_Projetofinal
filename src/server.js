import 'dotenv/config'
import express from "express";
import usersRouters from '../src/routes/usersRouters.js';
import usersAuthRouters from '../src/routes/usersAuthRouters.js';
import errorMiddlewares from '../src/middlewares/errorMiddlewares.js';
import voosRouters from "../src/routes/voosRouters.js";
import passageiroRoutes from '../src/routes/passageiroRoutes.js';
import agendamentosRouters from '../src/routes/agendamentoRouters.js';
import avaliacaoRouters from '../src/routes/avaliacaoRouters.js';
import cors from 'cors'; 

const app = express();
const port = process.env.PORT || process.env.SERVER_PORT || 3000;
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'https://api-gestao-biblioteca.onrender.com/', 
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.static('public'));
app.use(express.json());
app.use('/users', usersRouters);
app.use('/auth', usersAuthRouters);
app.use("/voos", voosRouters);
app.use('/passageiros', passageiroRoutes);
app.use('/agendamentos', agendamentosRouters);
app.use('/avaliacoes', avaliacaoRouters);

app.use(errorMiddlewares);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)});
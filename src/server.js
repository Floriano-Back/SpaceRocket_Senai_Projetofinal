import 'dotenv/config'
import express from "express";
import usersRouters from '../src/routes/usersRouters.js';
import usersAuthRouters from '../src/routes/usersAuthRouters.js';
import errorMiddlewares from '../src/middlewares/errorMiddlewares.js';
import voosRouters from "../src/routes/voosRouters.js";
import passageiroRoutes from './routes/passageiroRoutes.js';
import agendamentosRouter from '../src/router/agendamentoRouter.js';

const app = express();
const port = process.env.SERVER_PORT;

app.use(express.json());
app.use('/users', usersRouters);
app.use('/auth', usersAuthRouters);
app.use("/voos", voosRouters);
app.use('/passageiros', passageiroRoutes);

app.use(errorMiddlewares);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
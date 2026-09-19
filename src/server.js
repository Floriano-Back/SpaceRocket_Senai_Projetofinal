import 'dotenv/config'
import express from "express";
import usersRouters from '../src/routes/usersRouters.js';
import usersAuthRouters from '../src/routes/usersAuthRouters.js';

const app = express();
const port = process.env.SERVER_PORT;

app.use(express.json());
app.use('/users', usersRouters);
app.use('/auth', usersAuthRouters);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
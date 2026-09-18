import 'dotenv/config'
import express from "express";
import usersRouters from '../src/routes/usersRouters.js';

const app = express();
const port = process.env.SERVER_PORT;

app.use(express.json());
app.use('/users', usersRouters);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
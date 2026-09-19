import 'dotenv/config';
import express from 'express';
import passageiroRoutes from './routes/passageiroRoutes.js';
//import authRoutes from './routes/authRoutes.js';

const app = express();
const port = process.env.SERVER_PORT;

app.use(express.json());
app.use('/passageiros', passageiroRoutes);
//app.use('/auth', authRoutes);

app.listen(port, ()=> {
    console.log("Servidor rodando na porta" + port);
});
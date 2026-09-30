import { Router } from 'express';
import agendamentoController from '../controllers/agendamentoController.js';

const agendamentoRouters = Router();

agendamentoRouters.get("/", agendamentoController.listar);
agendamentoRouters.post("/", agendamentoController.criar);

export default agendamentoRouters;
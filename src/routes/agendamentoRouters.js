import { Router } from 'express';
import agendamentoController from '../controllers/agendamentoController.js';

const agendamentoRouters = Router();

agendamentoRouters.get("/", agendamentoController.listar);
agendamentoRouters.put("/", agendamentoController.criar);

export default agendamentoRouters;
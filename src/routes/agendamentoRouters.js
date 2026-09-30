import { Router } from 'express';
import agendamentoController from '../controllers/agendamentoController.js';

const agendamentoRouters = Router();

agendamentoRouters.get("/", agendamentoController.listar);
agendamentoRouters.post("/", agendamentoController.criar);
agendamentoRouters.delete("/:id", agendamentoController.deletar);
agendamentoRouters.put("/:id", agendamentoController.atualizar);

export default agendamentoRouters;
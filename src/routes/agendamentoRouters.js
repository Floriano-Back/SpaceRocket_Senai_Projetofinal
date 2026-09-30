import { Router } from 'express';
import agendamentoController from '../controllers/agendamentoController.js';
import authMiddlewares from '../middlewares/authMiddlewares.js';
 
const agendamentoRouters = Router();
 
agendamentoRouters.get("/", authMiddlewares, agendamentoController.listar);
agendamentoRouters.post("/", authMiddlewares, agendamentoController.criar);
agendamentoRouters.delete("/:id", authMiddlewares, agendamentoController.deletar);
 
export default agendamentoRouters;
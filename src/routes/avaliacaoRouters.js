import { Router } from 'express';
import avaliacaoController from '../controllers/avaliacaoController.js';
import authMiddlewares from '../middlewares/authMiddlewares.js';
import authAdminMiddlewares from '../middlewares/authAdminMiddlewares.js';

const avaliacaoRouters = Router();

// Admin: vê todas. Passageiro: vê só as suas
avaliacaoRouters.get("/", authMiddlewares, avaliacaoController.listar);
avaliacaoRouters.get("/:id", authMiddlewares, avaliacaoController.buscarPorId);

// Somente admin registra, altera e exclui
avaliacaoRouters.post("/", authMiddlewares, authAdminMiddlewares, avaliacaoController.criar);
avaliacaoRouters.put("/:id", authMiddlewares, authAdminMiddlewares, avaliacaoController.atualizar);
avaliacaoRouters.delete("/:id", authMiddlewares, authAdminMiddlewares, avaliacaoController.deletar);

export default avaliacaoRouters;

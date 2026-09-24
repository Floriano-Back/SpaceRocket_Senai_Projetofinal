import express from 'express';
import passageiroController from '../controllers/passageiroController.js';

const router = express.Router();

router.post('/', passageiroController.cadastrar);
router.get('/', passageiroController.listarTodos);
router.get('/:id', passageiroController.obterPorId);
router.put('/:id', passageiroController.atualizar);
router.delete('/:id', passageiroController.deletar);

export default router;
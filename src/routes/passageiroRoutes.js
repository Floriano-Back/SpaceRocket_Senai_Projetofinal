import express from 'express'; 
const router = express.Router();
import * as passageiroController from '../controllers/passageiroController.js';



// Mapeamento das rotas para as funções do controller
router.post('/passageiros', passageiroController.cadastrar);
router.get('/passageiros', passageiroController.listarTodos);
router.get('/passageiros/:id', passageiroController.obterPorId);
router.put('/passageiros/:id', passageiroController.atualizar);
router.delete('/passageiros/:id', passageiroController.deletar);

module.exports = router;

export default router;
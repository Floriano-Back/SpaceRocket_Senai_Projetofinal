import avaliacaoService from '../services/avaliacaoService.js';

// Repassa erros de funções async para o errorMiddlewares
const h = (fn) => (req, res, next) => fn(req, res, next).catch(next);

const avaliacaoController = {
    listar: h(async (req, res) => {
        const result = await avaliacaoService.listar(req.user);
        return res.status(200).json({ msg: "Avaliações físicas recuperadas!", result });
    }),

    buscarPorId: h(async (req, res) => {
        const result = await avaliacaoService.buscarPorId(req.user, Number(req.params.id));
        return res.status(200).json({ msg: "Avaliação encontrada!", result });
    }),

    criar: h(async (req, res) => {
        const result = await avaliacaoService.criar(req.body);
        return res.status(201).json({ msg: "Avaliação física registrada!", result });
    }),

    atualizar: h(async (req, res) => {
        const result = await avaliacaoService.atualizar(Number(req.params.id), req.body);
        return res.status(200).json({ msg: "Avaliação física atualizada!", result });
    }),

    deletar: h(async (req, res) => {
        await avaliacaoService.deletar(Number(req.params.id));
        return res.status(200).json({ msg: "Avaliação física excluída!" });
    })
};

export default avaliacaoController;

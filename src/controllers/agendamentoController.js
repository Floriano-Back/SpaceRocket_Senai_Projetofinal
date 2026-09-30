import agendamentoService from "../services/agendamentoService.js";
const h = (fn) => (req, res, next) => fn(req, res, next).catch(next);
 
const agendamentoController = {
    listar: h(async (req, res) => {
        const result = await agendamentoService.listar(req.user);
        return res.status(200).json({ msg: "Agendamentos recuperados!", result });
    }),
 
    criar: h(async (req, res) => {
        const result = await agendamentoService.criar(req.user, req.body);
        return res.status(201).json({ msg: "Agendamento criado com sucesso!", id_agendamento: result.insertId });
    }),
 
    deletar: h(async (req, res) => {
        await agendamentoService.deletar(req.user, Number(req.params.id));
        return res.status(200).json({ msg: "Agendamento cancelado!" });
    })
};
 
export default agendamentoController;
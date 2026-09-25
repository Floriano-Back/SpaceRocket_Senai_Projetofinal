import agendamentoService from "../services/agendamentoService.js";

const agendamentoController = {
    criar: async (req, res) => {
        const {id_passageiro, id_voo, data_agendamento, agendamentoStatus} = req.body;
        const result = await agendamentoService.criar(id_passageiro, id_voo, data_agendamento, agendamentoStatus);

        res.status(200).json({msg: "Agendamento criado com sucesso!", result});
    }
}


export default agendamentoController;
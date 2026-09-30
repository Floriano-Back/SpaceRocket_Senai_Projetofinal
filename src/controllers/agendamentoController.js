import agendamentoService from "../services/agendamentoService.js";
import appError from '../errors/appError.js';

const agendamentoController = {
    listar: async (req,res) =>{
        const result = await agendamentoService.listarTudo();
        return res.status(200).json({msg: "Segue todos os agedamentos criados", result});
    },    
    criar: async (req, res,next) => {
        const {id_passageiro, id_voo, data_agendamento, agendamentoStatus} = req.body;

        const assentosOcupados = await agendamentoRepository.verificarAssento(id_voo);

        const capacidadeMaxima = 11; 
        
        if (assentosOcupados >= capacidadeMaxima) {
            throw new Error('Não há vagas disponíveis para este voo.');
        }

        const result = await agendamentoService.criar(id_passageiro, id_voo, data_agendamento, agendamentoStatus);
        if(!id_passageiro && !id_voo && !data_agendamento){
        throw new appError("Necessario o envio de todas as informações solitiada para realizar o agendamento!")};

        res.status(200).json({msg: "Agendamento criado com sucesso!", result});
    },
    deletar: async (req,res) =>{
        const {id_agendamento} = req.params;

        const result = await agendamentoController.deletar(id_agendamento);
        
        return res.status(200).json({msg: "Agendaento cancelado"});
    },
    atualizar: async (req,res) =>{
        const {id_agendamento} = req.params;
        const {id_passageiro, id_voo, data_agendamento, agendamentoStatus} = req.body;

        const result = await agendamentoService.atualizar(id_agendamento, id_passageiro, id_voo, data_agendamento, agendamentoStatus);
        return res.status(200).json({msg: "Agendamento atualizado com sucesso!", result});
    }
}
export default agendamentoController;
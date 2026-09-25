import { Connection } from 'mysql2';
import agendamentoRepository from '../repositories/agendamentoRepository.js';
import { verificarVagas } from '../utils/verificarVagas.js';

const agendamentoService = {
    criar: async (id_passageiro, id_voo, data_agendamento, agendamentoStatus) => {
        const result = await agendamentoRepository.criar(id_passageiro, id_voo, data_agendamento, agendamentoStatus);
        const assentos = await verificarVagas(Connection, id_voo);
        if (assentos > 0) {
            throw new Error('Não há vagas disponíveis para este voo.');
        }
        return result;
    },
    listarTudo: async () => {
        const result = await agendamentoRepository.listarTudo();
        return result;
    },
    listarId: async (id_agendamento) => {
        const result = await agendamentoRepository.listarId(id_agendamento);
        return result;
    },
    listarData: async (data_agendamento) => {
        const result = await agendamentoRepository.listarData(data_agendamento);
        return result;
    },
    listarStatus: async (agendamentoStatus) => {
        const result = await agendamentoRepository.listarStatus(agendamentoStatus);
        return result;
    },
    atualizar: async (id_agendamento, id_passageiro, id_voo, data_agendamento, agendamentoStatus) => {
        const result = await agendamentoRepository.atualizar(id_agendamento, id_passageiro, id_voo, data_agendamento, agendamentoStatus);
        return result;
    },
}

export default agendamentoService;
import agendamentoRepository from '../repositories/agendamentoRepository.js';
import appError from '../errors/appError.js';
 
const agora = () => new Date().toISOString().slice(0, 19).replace('T', ' ');
 
const agendamentoService = {
    listar: async (user) => {
        return user.tipo_usuario === 'ADMIN'
            ? await agendamentoRepository.listarTudo()
            : await agendamentoRepository.listarPorUsuario(user.id_usuario);
    },
 
    criar: async (user, { id_passageiro, id_voo }) => {
        if (!id_voo) throw new appError("Informe o voo para realizar o agendamento!");
 
        // Passageiro só agenda para si mesmo; admin escolhe o passageiro
        const idFinal = user.tipo_usuario === 'ADMIN'
            ? id_passageiro
            : await agendamentoRepository.passageiroDoUsuario(user.id_usuario);
 
        if (!idFinal) throw new appError("Passageiro não informado ou usuário sem cadastro de passageiro.");
 
        return await agendamentoRepository.criarComVaga(idFinal, id_voo, agora());
    },
 
    deletar: async (user, id_agendamento) => {
        const idUsuario = user.tipo_usuario === 'ADMIN' ? null : user.id_usuario;
        const ok = await agendamentoRepository.deletarComVaga(id_agendamento, idUsuario);
        if (!ok) throw new appError("Agendamento não encontrado!", 404);
    }
};
 
export default agendamentoService;
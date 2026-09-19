import passageiroRepository from "../repositories/passageiroRepository.js";
import bcrypt from 'bcrypt';

const passageiroService = {
    recuperrarPassageiro: async () => {
        const resultado = await passageiroRepository.selecionar();
        return resultado;
    },
    recuperrarPassageiroPorId: async (id_passageiro) => {
        const resultado = await passageiroRepository.selecionarPorId(id_passageiro);
        return resultado;      
    },
    recuperrarPassageiroPorEmail: async (email) => {
        const resultado = await passageiroRepository.selecionarPorEmail(email);
        return resultado;      
    },
    deletarPassageiro: async (id_passageiro) => {
        const resultado = await passageiroRepository.deletar(id_passageiro);
        return resultado;      
    },
    criarPassageiro: async (user) => {
        const resultado = await passageiroRepository.criar(user.nome, user.email, user.senha, user.tipo_usuario);
        return resultado;
    },
    atualizarPassageiro: async (user) => {
        const resultado = await passageiroRepository.atualizar(user.nome, user.email, user.senha, user.id_passageiro);
        return resultado;
    },
    hashSenha: async (senha) => {
        const  hashedSenha = await bcrypt.hash(senha, 10);
        return hashedSenha;
    }
};


export default passageiroService;
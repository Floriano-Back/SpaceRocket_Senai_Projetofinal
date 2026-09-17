import usersRepository from "../repositories/usersRepository";
import bcrypt from 'bcrypt';

const usersServices = {
    criarUsuario: async (user) =>{
        const result = await usersRepository.criar(user.name, user.email, user.senha_hash, user.tipo_usuario);
        return result;
    },
    atualizarUsuario: async (user) =>{
        const result = await usersRepository.atualizar(user.id, user.name, user.email, user.senha_hash, user.tipo_usuario);
        return result;
    },

    hashSenha: async (senha_hash) =>{
        const hashedSenha = await bcrypt.hash(senha_hash, 10);
        return hashedSenha;
    },
    usuarioPorEmail: async (email) =>{
        const result = await usersRepository.encontrarPorEmail(email);
        return result;
    }
};

export default usersServices;
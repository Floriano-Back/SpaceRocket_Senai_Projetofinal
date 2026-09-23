import usersRepository from "../repositories/usersRepository.js";
import bcrypt from 'bcrypt';
import appError from '../errors/appError.js';

const usersServices = {
    criarUsuario: async (user) =>{
        console.log(user.nome, user.email, user.senha_hash, user.tipo_usuario);
        const result = await usersRepository.criar(user.nome, user.email, user.senha_hash, user.tipo_usuario);

        return result;
    },
    atualizarUsuario: async (user) =>{
        const result = await usersRepository.atualizar(user.nome, user.email, user.senha_hash, user.id_usuario);
        return result;
    },
    verUsuario: async () =>{
        const result = await usersRepository.encontrar();
        return result;
    },

    hashSenha: async (senha_hash) =>{
        const hashedSenha = await bcrypt.hash(senha_hash, 10);
        return hashedSenha;
    },
    usuarioPorEmail: async (email) =>{
        const result = await usersRepository.encontrarPorEmail(email);
        return result;
    },
    apagarUsuario: async (id_usuario) =>{
        const result = await usersRepository.apagar(id_usuario);
        if (result.affectedRows === 0) {
            throw new appError('Usuário não encontrado!', 404)};

        return result;
    }
};

export default usersServices;
import usersRepository from "../repositories/usersRepository";
import bcrypt from 'bcrypt';

const usersServices = {
    criarUsuario: async (user) => {
        const result = await usersRepository.criar(user.name, user.email, user.senha_hash, user.tipo_usuario);
        return result;
    }
};

export default usersServices;
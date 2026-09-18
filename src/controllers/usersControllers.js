import usersServices from '../services/usersServices.js';
import Users from '../models/Users.js';

const userControllers ={
    selecionar: async (req,res, next) =>{
        try{
            const result = await usersServices.verUsuario();
            res.status(200).json({msg: "Usuários recuperados!", result})

        }catch(error){
            console.log(error)}
    },

    cadastrar: async (req,res,next) =>{
        try{
            const {nome, email, senha_hash, tipo_usuario} = req.body;
            const hashedSenha = await usersServices.hashSenha(senha_hash);
            const user = new Users(null, nome, email, senha_hash, tipo_usuario);
            const result = await usersServices.criarUsuario(user);

            return res.status(200).json({msg: "Usuario criado com sucesso"});   

        }catch(error){
            res.status(500).json({msg: "Erros ao criar usuarios",
                data: error.message})};
    }
}

export default userControllers;
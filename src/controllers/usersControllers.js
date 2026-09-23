import usersServices from '../services/usersServices.js';
import Users from '../models/Users.js';
import appError from '../errors/appError.js';

const userControllers ={
    selecionar: async (req,res, next) =>{
            const result = await usersServices.verUsuario();
            return res.status(200).json({msg: "Usuários recuperados!", result})
    },
    cadastrar: async (req,res,next) =>{
            const {nome, email, senha_hash, tipo_usuario} = req.body;

            if(!nome && !email && !senha_hash && !tipo_usuario){
                throw new appError("Necessario o envio de todas as informações solitiada para o cadastro!")};

            const hashedSenha = await usersServices.hashSenha(senha_hash);
            const usuario = new Users(nome, email, hashedSenha, tipo_usuario);
            const result = await usersServices.criarUsuario(usuario);        

            return res.status(200).json({msg: "Usuario criado com sucesso"});
    },
    atualizar: async (req,res,next)=>{
            const {id_usuario} = req.params;
            const {nome, email, senha_hash} = req.body;

            if(!nome && !email && !senha_hash){
                throw new appError("Necessario o envio de pelo menos alguma informação para ser atualizada!")};
            
            const hashedSenha = await usersServices.hashSenha(senha_hash);
            const usuario = new Users(nome, email, hashedSenha, null,id_usuario);
            const result = await usersServices.atualizarUsuario(usuario);

            return res.status(200).json({msg: "Cadastro atualizado com sucesso!"});
        },                     
    deletar: async (req,res)=>{
            const {id_usuario} = req.params;

            await usersServices.apagarUsuario(id_usuario);

            return res.status(200).json({msg: "Usuário deletado com suecesso!"});
    }   
}

export default userControllers;
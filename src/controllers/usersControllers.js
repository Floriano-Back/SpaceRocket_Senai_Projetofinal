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
            const usuario = new Users(nome, email, hashedSenha, tipo_usuario);
            const result = await usersServices.criarUsuario(usuario);

            return res.status(200).json({msg: "Usuario criado com sucesso"});   

        }catch(error){
            console.error(error)
            res.status(500).json({msg: "Erros ao criar usuarios",
                data: error.message})};
    },
    atualizar: async (req,res,next)=>{
        try{
            const {id_usuario} = req.params;
            const {nome, email, senha_hash} = req.body;

            if(!nome && !email && !senha_hash){
                return res.status(400).json({msg: "Necessario o envio de pelo menos alguma informação para ser atualizada!"})};
            
            const hashedSenha = await usersServices.hashSenha(senha_hash);
            const usuario = new Users(nome, email, hashedSenha, null,id_usuario);
            const result = await usersServices.atualizarUsuario(usuario);

            return res.status(200).json({msg: "Cadastro atualizado com sucesso!"});

        }catch(error){
            console.error(error)
            res.status(500).json({msg: "Erros ao criar usuarios",
                data: error.message})
        };                     
    }    
}

export default userControllers;
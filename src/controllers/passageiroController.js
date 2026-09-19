import passageiro from "../models/passageiro.js"
import passageiroService from "../services/passageiroService.js";

const passageiroController = {
    selecionar: async (req, res) => {
        try{
            const resultado = await passageiroService.recuperrarPassageiro();

            res.status(200).json({
                message: "passageiro recuperados com sucesso!",
                data: resultado
            });
        }
        catch (error){
            res.status(500).json({
                message: "Erro ao recuperar passageiro!",
                data: error.message               
            });
        }
    },
    criar: async (req, res) => {
        try{
            const {nome, email, senha, tipo_Passageiro } = req.body;

            const  hashedSenha = await passageiroService.hashsenha(senha);

            const passageiro = new passageiro(nome, email, hashedSenha, tipo_Passageiro,  null);

            const resultado = await passageiroService.criarPassageiro(passageiro);

            return res.status(201).json({
                message: "passageiro criado com sucesso!",
                 data: resultado });
        }
        catch (error){
            console.error(error);
            return res.status(500).json({
                message: "Erro ao criar passageiro!",
                 data: error.message });
        }
    },
    apagar: async (req, res) => {
        try{
            const {id_passageiro} = req.params;
            const resultado = await passageiroService.deletarPassageiro(id_passageiro);

            res.status(200).json({
                message: "passageiro deletado com sucesso!",
                 data: resultado });
        }
        catch (error){
            res.status(500).json({
                message: "Erro ao deletar passageiro!",
                 data: error.message });
        }
    },
    atualizar: async (req, res) => {
        try {
            const { id_passageiro } = req.params; 
            const { nome, email, senha } = req.body; 
            
          
            const dadosAtualizados = new passageiro(nome, email, senha, id_passageiro); 

           
            const resultado = await passageiroService.atualizarPassageiro(dadosAtualizados); 
            
            res.status(200).json({ message: "passageiro atualizado com sucesso!",
                 data: resultado });
        }catch (error) {
            res.status(500).json({ message: "Erro ao atualizar passageiro!",
                 data: error.message });
        }
    },
}

export default passageiroController;
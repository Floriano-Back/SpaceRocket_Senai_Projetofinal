import passageiroService from '../services/passageiroService.js';


class passageiroController {

    // 1. POST /passageiros (Criar um novo passageiro)
    async cadastrar(req, res) {
        try {
            // Pega os dados enviados no corpo da requisição (JSON)
            const dadosPassageiro = req.body;

            // Envia para o Service processar as validações e salvar
            const resultado = await passageiroService.cadastrar(dadosPassageiro);

            // Retorna Status 201 (Created) se tudo der certo
            return res.status(201).json(resultado);
        } catch (error) {
            // Retorna Status 400 (Bad Request) se houver erro de validação (ex: CPF duplicado)
            return res.status(400).json({ erro: error.message });
        }
    }

    // 2. GET /passageiros/:id (Buscar perfil por ID)
    async obterPorId(req, res) {
        try {
            // Pega o ID enviado na URL da rota
            const { id } = req.params;

            const passageiro = await passageiroService.obterPorId(id);
            return res.status(200).json(passageiro);
        } catch (error) {
            // Retorna 404 se o passageiro não existir, ou 400 para outros erros
            const status = error.message.includes("não encontrado") ? 404 : 400;
            return res.status(status).json({ erro: error.message });
        }
    }

    // 3. GET /passageiros (Listar todos os clientes da agência)
    async listarTodos(req, res) {
        try {
            const passageiros = await passageiroService.listarTodos();
            return res.status(200).json(passageiros);
        } catch (error) {
            return res.status(500).json({ erro: "Erro interno ao buscar passageiros." });
        }
    }

    // 4. PUT /passageiros/:id (Atualizar dados cadastrais)
    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const dadosNovos = req.body;

            const resultado = await passageiroService.atualizar(id, dadosNovos);
            return res.status(200).json(resultado);
        } catch (error) {
            return res.status(400).json({ erro: error.message });
        }
    }

    // 5. DELETE /passageiros/:id (Remover passageiro da agência)
    async deletar(req, res) {
        try {
            const { id } = req.params;

            const resultado = await passageiroService.deletar(id);
            return res.status(200).json(resultado);
        } catch (error) {
            return res.status(400).json({ erro: error.message });
        }
    }
}

// Exporta uma instância da classe para ser usada no arquivo de rotas
module.exports = new passageiroController();





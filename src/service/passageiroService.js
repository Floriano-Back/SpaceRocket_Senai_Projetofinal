import bcrypt from 'bcrypt';
import passageiroRepository from '../repositories/passageiroRepository.js';

class PassageiroService {

    // 1. REGRA: Cadastrar um passageiro na agência
    async cadastrar(dadosPassageiro) {
        // Validações de negócio antes de tocar o banco de dados
        if (!dadosPassageiro.nome || !dadosPassageiro.email || !dadosPassageiro.cpf) {
            throw new Error("Nome, E-mail e CPF são obrigatórios para o cadastro.");
        }

        // Criptografa a senha para salvar com segurança na tabela 'usuarios'
        const saltRounds = 10;
        dadosPassageiro.senha_hash = await bcrypt.hash(dadosPassageiro.senha, saltRounds);

        try {
            // Chama o repositório para salvar (Usuário + Passageiro + Endereço)
            const novoPassageiro = await passageiroRepository.cadastrarCompleto(dadosPassageiro);
            
            return {
                mensagem: "Passageiro cadastrado com sucesso na agência!",
                id_passageiro: novoPassageiro.id_passageiro
            };
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error("Este e-mail ou CPF já está cadastrado.");
            }
            throw new Error("Erro interno ao processar o cadastro.");
        }
    }

    // 2. REGRA: Buscar perfil do passageiro
    async obterPorId(id_passageiro) {
        const passageiro = await passageiroRepository.buscarPorId(id_passageiro);
        if (!passageiro) {
            throw new Error("Passageiro não encontrado.");
        }
        return passageiro;
    }

    // 3. REGRA: Listar clientes da agência
    async listarTodos() {
        return await passageiroRepository.listarTodos();
    }

    // 4. REGRA: Atualizar cadastro (Telefone, peso, altura)
    async atualizar(id_passageiro, dadosNovos) {
        // Garante que o passageiro existe antes de atualizar
        await this.obterPorId(id_passageiro);

        if (!dadosNovos.nome) {
            throw new Error("O nome do passageiro não pode ficar vazio.");
        }

        await passageiroRepository.atualizar(id_passageiro, dadosNovos);
        return { mensagem: "Cadastro de passageiro atualizado com sucesso." };
    }

    // 5. REGRA: Excluir/Desativar conta do passageiro
    async deletar(id_passageiro) {
        // Garante que o passageiro existe
        await this.obterPorId(id_passageiro);

        // O repositório deleta o Usuário e o ON DELETE CASCADE limpa as tabelas filhas
        await passageiroRepository.excluir(id_passageiro);
        return { mensagem: "Passageiro removido do sistema da agência." };
    }
}

export default new PassageiroService();
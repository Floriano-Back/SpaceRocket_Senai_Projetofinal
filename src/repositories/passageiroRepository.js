//const db = require('../config/db'); // Suas configurações de conexão com o banco
import 'dotenv/config';
class passageiroRepository {
    
    // 1. Cadastrar Passageiro Completo (Usa Transação para garantir consistência)
    async cadastrarCompleto(dadosPassageiro) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Insere na tabela pai (usuarios)
            const queryUsuario = `
                INSERT INTO usuarios (nome, email, senha_hash, tipo_usuario) 
                VALUES (?, ?, ?, 'PASSAGEIRO')
            `;
            const [resUsuario] = await connection.query(queryUsuario, [
                dadosPassageiro.nome, 
                dadosPassageiro.email, 
                dadosPassageiro.senha_hash
            ]);
            const idUsuarioGerado = resUsuario.insertId;

            // Insere na tabela filha (passageiros) usando o ID gerado acima
            const queryPassageiro = `
                INSERT INTO passageiros (id_usuario, cpf, data_nascimento, telefone, peso, altura) 
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            const [resPassageiro] = await connection.query(queryPassageiro, [
                idUsuarioGerado,
                dadosPassageiro.cpf,
                dadosPassageiro.data_nascimento,
                dadosPassageiro.telefone,
                dadosPassageiro.peso,
                dadosPassageiro.altura
            ]);
            const idPassageiroGerado = resPassageiro.insertId;

            // Se houver endereço, já insere vinculado ao passageiro
            if (dadosPassageiro.endereco) {
                const queryEndereco = `
                    INSERT INTO enderecos (id_passageiro, cep, rua, cidade, estado) 
                    VALUES (?, ?, ?, ?, ?)
                `;
                await connection.query(queryEndereco, [
                    idPassageiroGerado,
                    dadosPassageiro.endereco.cep,
                    dadosPassageiro.endereco.rua,
                    dadosPassageiro.endereco.cidade,
                    dadosPassageiro.endereco.estado
                ]);
            }

            await connection.commit();
            return { id_passageiro: idPassageiroGerado, id_usuario: idUsuarioGerado };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // 2. Buscar Passageiro por ID com dados de Usuário e Endereço inclusos
    async buscarPorId(id_passageiro) {
        const query = `
            SELECT 
                p.id_passageiro, p.cpf, p.data_nascimento, p.telefone, p.peso, p.altura,
                u.id_usuario, u.nome, u.email, u.data_cadastro,
                e.cep, e.rua, e.cidade, e.estado
            FROM passageiros p
            INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
            LEFT JOIN enderecos e ON p.id_passageiro = e.id_passageiro
            WHERE p.id_passageiro = ?
        `;
        const [rows] = await db.query(query, [id_passageiro]);
        return rows[0] || null;
    }

    // 3. Listar todos os passageiros da Agência de Viagens
    async listarTodos() {
        const query = `
            SELECT p.id_passageiro, u.nome, u.email, p.cpf, p.telefone 
            FROM passageiros p
            INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
            ORDER BY u.nome ASC
        `;
        const [rows] = await db.query(query);
        return rows;
    }

    // 4. Atualizar dados do Passageiro e do Usuário
    async atualizar(id_passageiro, dadosNovos) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Atualiza dados na tabela passageiros
            const queryPassageiro = `
                UPDATE passageiros 
                SET telefone = ?, peso = ?, altura = ? 
                WHERE id_passageiro = ?
            `;
            await connection.query(queryPassageiro, [
                dadosNovos.telefone, 
                dadosNovos.peso, 
                dadosNovos.altura, 
                id_passageiro
            ]);

            // Atualiza nome na tabela usuarios (buscando pelo id_usuario vinculado)
            const queryUsuario = `
                UPDATE usuarios u
                INNER JOIN passageiros p ON u.id_usuario = p.id_usuario
                SET u.nome = ?
                WHERE p.id_passageiro = ?
            `;
            await connection.query(queryUsuario, [dadosNovos.nome, id_passageiro]);

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // 5. Excluir Passageiro (A tabela usa ON DELETE CASCADE, deletar o usuário limpa o resto)
    async excluir(id_passageiro) {
        const query = `
            DELETE u FROM usuarios u
            INNER JOIN passageiros p ON u.id_usuario = p.id_usuario
            WHERE p.id_passageiro = ?
        `;
        const [result] = await db.query(query, [id_passageiro]);
        return result.affectedRows > 0;
    }
}

module.exports = new passageiroRepository();

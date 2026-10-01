import pool from '../configs/database.js';

// Consulta base: traz também o nome do passageiro e o id_usuario (para checar de quem é a avaliação)
const BASE = `SELECT av.*, u.nome AS nome_passageiro, p.id_usuario
              FROM avaliacoes_fisicas av
              INNER JOIN passageiros p ON p.id_passageiro = av.id_passageiro
              INNER JOIN usuarios u ON u.id_usuario = p.id_usuario`;
const ORDEM = " ORDER BY av.data_avaliacao DESC, av.id_avaliacao DESC";

const avaliacaoRepository = {
    criar: async (av) => {
        const sql = `INSERT INTO avaliacoes_fisicas (id_passageiro, peso, altura, imc, condicao_fisica, observacao)
                     VALUES (?, ?, ?, ?, ?, ?);`;
        const [result] = await pool.execute(sql, [av.id_passageiro, av.peso, av.altura, av.imc, av.condicao_fisica, av.observacao]);
        return result;
    },
    listarTodos: async () => {
        const [rows] = await pool.execute(BASE + ORDEM);
        return rows;
    },
    listarPorUsuario: async (id_usuario) => {
        const [rows] = await pool.execute(BASE + " WHERE p.id_usuario = ?" + ORDEM, [id_usuario]);
        return rows;
    },
    buscarPorId: async (id_avaliacao) => {
        const [rows] = await pool.execute(BASE + " WHERE av.id_avaliacao = ?", [id_avaliacao]);
        return rows[0] || null;
    },
    // Avaliação mais recente do passageiro (usada para liberar ou bloquear o agendamento)
    ultimaPorPassageiro: async (id_passageiro) => {
        const [rows] = await pool.execute(BASE + " WHERE av.id_passageiro = ?" + ORDEM + " LIMIT 1", [id_passageiro]);
        return rows[0] || null;
    },
    passageiroExiste: async (id_passageiro) => {
        const [rows] = await pool.execute("SELECT 1 FROM passageiros WHERE id_passageiro = ?;", [id_passageiro]);
        return rows.length > 0;
    },
    atualizar: async (id_avaliacao, av) => {
        const sql = `UPDATE avaliacoes_fisicas
                     SET peso = ?, altura = ?, imc = ?, condicao_fisica = ?, observacao = ?
                     WHERE id_avaliacao = ?;`;
        const [result] = await pool.execute(sql, [av.peso, av.altura, av.imc, av.condicao_fisica, av.observacao, id_avaliacao]);
        return result;
    },
    deletar: async (id_avaliacao) => {
        const [result] = await pool.execute("DELETE FROM avaliacoes_fisicas WHERE id_avaliacao = ?;", [id_avaliacao]);
        return result;
    }
};

export default avaliacaoRepository;

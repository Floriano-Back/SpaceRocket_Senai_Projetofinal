import pool from '../configs/database.js';
import appError from '../errors/appError.js';
 
const agendamentoRepository = {
    listarTudo: async () => {
        const [rows] = await pool.execute("SELECT * FROM agendamentos ORDER BY id_agendamento DESC;");
        return rows;
    },
 
    // Agendamentos apenas do usuário logado (passageiro)
    listarPorUsuario: async (id_usuario) => {
        const sql = `SELECT a.* FROM agendamentos a
                     INNER JOIN passageiros p ON p.id_passageiro = a.id_passageiro
                     WHERE p.id_usuario = ? ORDER BY a.id_agendamento DESC;`;
        const [rows] = await pool.execute(sql, [id_usuario]);
        return rows;
    },
 
    passageiroDoUsuario: async (id_usuario) => {
        const [rows] = await pool.execute("SELECT id_passageiro FROM passageiros WHERE id_usuario = ?;", [id_usuario]);
        return rows[0] ? rows[0].id_passageiro : null;
    },
 
    // Cria o agendamento e baixa uma vaga do voo na mesma transação
    criarComVaga: async (id_passageiro, id_voo, data_agendamento) => {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();
 
            const [voos] = await conn.execute(
                "SELECT vagas_disponiveis, vooStatus FROM voos WHERE id_voo = ? FOR UPDATE;", [id_voo]);
            if (voos.length === 0) throw new appError("Voo não encontrado.", 404);
            if (voos[0].vooStatus !== 'AGENDADO') throw new appError("Este voo não está aberto para agendamentos.", 409);
            if (voos[0].vagas_disponiveis <= 0) throw new appError("Não há vagas disponíveis para este voo.", 409);
 
            const [result] = await conn.execute(
                "INSERT INTO agendamentos (id_passageiro, id_voo, data_agendamento, agendamentosStatus) VALUES (?, ?, ?, 'CONFIRMADO');",
                [id_passageiro, id_voo, data_agendamento]);
            await conn.execute("UPDATE voos SET vagas_disponiveis = vagas_disponiveis - 1 WHERE id_voo = ?;", [id_voo]);
 
            await conn.commit();
            return result;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },
 
    // Remove o agendamento e devolve a vaga (se id_usuario for informado, só remove se for dele)
    deletarComVaga: async (id_agendamento, id_usuario = null) => {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();
 
            const [rows] = await conn.execute(
                `SELECT a.id_voo, a.agendamentosStatus, p.id_usuario
                 FROM agendamentos a INNER JOIN passageiros p ON p.id_passageiro = a.id_passageiro
                 WHERE a.id_agendamento = ? FOR UPDATE;`, [id_agendamento]);
            if (rows.length === 0 || (id_usuario && rows[0].id_usuario !== id_usuario)) {
                await conn.rollback();
                return false;
            }
 
            await conn.execute("DELETE FROM agendamentos WHERE id_agendamento = ?;", [id_agendamento]);
            if (rows[0].agendamentosStatus === 'CONFIRMADO') {
                await conn.execute("UPDATE voos SET vagas_disponiveis = vagas_disponiveis + 1 WHERE id_voo = ?;", [rows[0].id_voo]);
            }
 
            await conn.commit();
            return true;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }
};
 
export default agendamentoRepository;
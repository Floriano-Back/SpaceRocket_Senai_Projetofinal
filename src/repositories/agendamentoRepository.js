import pool from '../configs/database.js';

const agendamentoRepository = {
    criar: async (id_passageiro, id_voo, data_agendamento) =>{
        const sql = `INSERT INTO agendamentos (id_passageiro, id_voo, data_agendamento, agendamentoStatus) VALUES (?,?,?,"PENDENTE");`;
        const [result] = await pool.execute(sql, [id_passageiro, id_voo, data_agendamento]);
        return result;
    },
    listarTudo: async () =>{
        const sql = "SELECT * FROM agendamentos;";
        const [result] = await pool.execute(sql);
        return result;
    },
    listarId: async (id_agendamento) => {
        const sql = "SELECT FROM agendamentos WHERE id_agendamento = ?;";
        const [result] = await pool.execute(sql, [id_agendamento]);
        return result;
    },
    listarData: async (data_agendamento) =>{
        const sql = "SELECT FROM agendamentos WHERE data_agendamento = ?;";
        const [result] = await pool.execute(sql, [data_agendamento]);
        return result;
    },
    listarStatus: async (agendamentoStatus) => {
        const sql = "SELECT FROM agendamentos WHERE agendamentoStatus = ?;";
        const [result] = await pool.execute(sql, [agendamentoStatus]);
        return result;
    },
    atualizar: async (id_passageiro, id_voo, data_agendamento, agendamentoStatus, id_agendamento) =>{
        const sql = "UPDATE agendamentos SET id_passageiro = ?, id_voo = ?, data_agendamento = ?, agendamentoStatus = ? WHERE = id_agendamento;";
        const [result] = await pool.execute(sql, [id_passageiro, id_voo, data_agendamento, agendamentoStatus, id_agendamento]);
        return result;
    },
    deletar: async (id_agendamento) =>{
        const sql = "DELETE FROM agendamentos WHERE id_agendamento =?;";
        const [result] = await pool.execute(sql, [id_agendamento]);
        return result;
    },
    verificarAssento: async (id_voo) => {
        const sql = "SELECT COUNT(*) AS vagas_ocupadas FROM agendamentos WHERE id_voo = ? AND agendamentoStatus = 'CONFIRMADO';";
        const [result] = await pool.execute(sql, [id_voo]);
        return result[0].vagas_ocupadas;
    },
    ocuparAssento: async (id_agendamento) => {
        const sql = "UPDATE agendamentos SET agendamentoStatus = 'CONFIRMADO' WHERE id_agendamento = ?;";
        const [result] = await pool.execute(sql, [id_agendamento]);
        return result;
    }
}

export default agendamentoRepository;
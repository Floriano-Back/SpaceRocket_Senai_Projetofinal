import pool from '../configs/database.js';

const agendamentoRepository = {
    criar: async (id_passageiro, id_voo, data_agendamento, agendamentoStatus) =>{
        const sql = "INSERT INTO agendamentos (id_passageiro, id_voo, data_agendamento, agendamentoStatus)VALUES (?,?,?,?);";
        const [result] = await pool.execute(sql, [id_passageiro, id_voo, data_agendamento, agendamentoStatus]);
        return result;
    },
    listarTudo: async () =>{
        const sql = "SELECT * FROM agendamentos;";
        const [result] = await pool.execute(sql);
        return result;
    },
    listarId: async (id_agendamento) => {
        const sql = "SELECT FROM agendamentos WHERE id_passageiro = ?;";
        const [result] = await pool.execute(sql, [id_agendamento]);
        return result;
    },
    

}

export default agendamentoRepository;
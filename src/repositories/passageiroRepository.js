import pool from "../configs/database.js";


const passageiroRepository = {
    selecionar: async () =>{ 'SELECT * FROM passageiros';
        const [rows] = await pool.execute(sql);
        return rows;
    },
    selecionarPorId: async (id_passageiro) => {
        const sql = 'SELECT * FROM passageiros WHERE id_passageiro = ?;';
        const [rows] = await pool.execute(sql, [id_passageiro]);
        return rows;
    },
    selecionarPorEmail: async (email) => {
        const [rows] = await pool.execute(sql,[email]);
        return rows;
    },
    deletar: async (id_passageiro) => {
        const sql = 'DELETE FROM passageiros WHERE id_passageiro = ?;';
        const [rows] = await pool.execute(sql, [id_passageiro]);
        return rows
    },
    criar: async (nome, email, senha, tipo_usuario) => {
        const sql = 'INSERT INTO passageiros values(null, ?, ?, ?, ?, ?);';
        const [rows] = await pool.execute(sql,[nome, email, senha, tipo_usuario]);
        return rows;
    },
    atualizar: async (nome, email, senha, id_passageiro) => {
        const sql = 'UPDATE passageiros SET nome = ?, senha = ? WHERE id_passageiro = ?;';
        const [rows] = await pool.execute(sql, [nome, email, senha, id_passageiro]);
        return rows;
    }
    };
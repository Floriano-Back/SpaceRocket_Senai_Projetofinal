import pool from '../configs/database.js';

const usersRepository = {
    criar: async (nome, email, senha_hash, tipo_usuario) =>{
        const sql = "INSERT INTO usuarios (nome, email, senha_hash, tipo_usuario) VALUES (?, ?, ?, ?);";
        const [result] = await pool.execute(sql, [nome, email, senha_hash, tipo_usuario]);
        return result;
    },
    encontrar: async () =>{
        const sql = "SELECT * FROM usuarios;";
        const [result] = await pool.execute(sql);
        return result;
    },
    encontrarPorId: async (id) =>{
        const sql = "SELECT * FROM usarios WHERE id = ?;";
        const [result] = await pool.execute(sql, [id]);
        return result;
    },
    atualizar: async (nome, email, senha_hash, id_usuario) =>{
        const sql = "UPDATE usuarios SET nome = ?, email = ?, senha_hash = ? WHERE id_usuario = ?";
        const [result] = await pool.execute(sql, [nome, email, senha_hash,id_usuario]);
        return result;
    },
    encontrarPorEmail: async (email) =>{
        const sql = "SELECT * FROM usuarios WHERE email = ?;";
        const [result] = await pool.execute(sql, [email]);
        return result;
    },
    apagar: async(id_usuario) =>{
        const sql = "DELETE FROM usuarios WHERE id_usuario = ?;";
        const [result] = await pool.execute(sql,[id_usuario]);
    }
};

export default usersRepository;
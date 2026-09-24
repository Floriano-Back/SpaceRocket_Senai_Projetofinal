import pool from "../configs/database.js";

const voosRepository = {
  encontrarDisponiveis: async () => {
    const sql = `
      SELECT *
      FROM voos
      WHERE vooStatus = 'AGENDADO'
        AND vagas_disponiveis > 0
        AND data_voo >= CURDATE()
      ORDER BY data_voo, horario_voo;
    `;

    const [voos] = await pool.execute(sql);
    return voos;
  },

  criar: async (voo) => {
    const sql = `
      INSERT INTO voos (
        codigo_voo,
        origem,
        destino,
        data_voo,
        horario_voo,
        capacidade,
        vagas_disponiveis,
        valor,
        vooStatus
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const [resultado] = await pool.execute(sql, [
      voo.codigo_voo,
      voo.origem,
      voo.destino,
      voo.data_voo,
      voo.horario_voo,
      voo.capacidade,
      voo.capacidade,
      voo.valor,
      "AGENDADO",
    ]);

    return resultado;
  },

  encontrarPorId: async (id) => {
  const [voos] = await pool.execute(
    "SELECT * FROM voos WHERE id_voo = ?",
    [id]
  );

  return voos[0] ?? null;
},
atualizarDados: async (id, voo) => {
  const [resultado] = await pool.execute(
    `UPDATE voos
     SET origem = ?,
         destino = ?,
         data_voo = ?,
         horario_voo = ?,
         valor = ?,
         vooStatus = ?
     WHERE id_voo = ?`,
    [
      voo.origem,
      voo.destino,
      voo.data_voo,
      voo.horario_voo,
      voo.valor,
      voo.vooStatus,
      id,
    ]
  );

  return resultado;
},
deletar: async (id) => {
  const [resultado] = await pool.execute(
    "DELETE FROM voos WHERE id_voo = ?",
    [id]
  );

  return resultado;
},

};

export default voosRepository;
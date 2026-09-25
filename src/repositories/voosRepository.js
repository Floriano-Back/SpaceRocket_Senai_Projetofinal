import pool from "../configs/database.js";
import Voos from "../models/Voos.js";

const transformarEmVoo = (registro) => new Voos(
  registro.codigo_voo,
  registro.origem,
  registro.destino,
  registro.data_voo,
  registro.horario_voo,
  registro.capacidade,
  registro.valor,
  registro.vooStatus,
  registro.id_voo,
  registro.vagas_disponiveis
);

const voosRepository = {
  listarTodos: async () => {
    const sql = `
      SELECT *
      FROM voos
      ORDER BY data_voo, horario_voo;
    `;

    const [voos] = await pool.execute(sql);
    return voos.map(transformarEmVoo);
  },
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
    return voos.map(transformarEmVoo);
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

  return voos[0] ? transformarEmVoo(voos[0]) : null;
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

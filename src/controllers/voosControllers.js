import voosServices from "../services/voosServices.js";

const voosControllers = {
  listarDisponiveis: async (req, res) => {
    try {
      const voos = await voosServices.listarDisponiveis();

      return res.status(200).json({
        msg: "Voos disponíveis recuperados!",
        result: voos,
      });
    } catch (error) {
      console.error(" Ocorreu um erro no Controller:");
      
      // Se for um AggregateError, vamos expor a lista de erros reais internos
      if (error instanceof AggregateError) {
        console.error("Detalhes do AggregateError:", error.errors);
      } else {
        console.error(error.message || error);
      }

      // Evita que a requisição do usuário fique "pendurada" e responde com 500
      return res.status(500).json({
        msg: "Erro interno do servidor ao listar voos.",
        error: error.message
      });
    }
  },
  
  cadastrar: async (req, res) => {
  const {
    codigo_voo,
    origem,
    destino,
    data_voo,
    horario_voo,
    capacidade,
    valor,
  } = req.body;

  if (
    !codigo_voo ||
    !origem ||
    !destino ||
    !data_voo ||
    !horario_voo ||
    capacidade == null ||
    valor == null
  ) {
    return res.status(400).json({
      msg: "Envie todos os dados obrigatórios do voo.",
    });
  }

  if (
    !Number.isInteger(Number(capacidade)) ||
    Number(capacidade) <= 0 ||
    !Number.isFinite(Number(valor)) ||
    Number(valor) < 0
  ) {
    return res.status(400).json({
      msg: "A capacidade deve ser positiva e o valor não pode ser negativo.",
    });
  }

  const resultado = await voosServices.criarVoo({
    codigo_voo,
    origem,
    destino,
    data_voo,
    horario_voo,
    capacidade: Number(capacidade),
    valor: Number(valor),
  });

  return res.status(201).json({
    msg: "Voo cadastrado com sucesso!",
    id_voo: resultado.insertId,
  });
},

buscarPorId: async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ msg: "O ID deve ser um inteiro positivo." });
  }

  try {
    const voo = await voosServices.buscarPorId(id);

    if (!voo) {
      return res.status(404).json({ msg: "Voo não encontrado." });
    }

    return res.status(200).json({
      msg: "Voo encontrado!",
      result: voo,
    });
  } catch (error) {
    console.error("Erro ao buscar voo:", error);
    return res.status(500).json({ msg: "Erro interno ao buscar voo." });
  }
},

atualizar: async (req, res) => {
  const id = Number(req.params.id);
  const { origem, destino, data_voo, horario_voo, valor, vooStatus } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ msg: "O ID deve ser um inteiro positivo." });
  }

  if (!origem || !destino || !data_voo || !horario_voo || valor == null || !vooStatus) {
    return res.status(400).json({ msg: "Envie todos os dados do voo para atualizar." });
  }

  const statusPermitidos = ["AGENDADO", "EMBARQUE", "FINALIZADO", "PENDENTE", "CANCELADO"];

  if (!Number.isFinite(Number(valor)) || Number(valor) < 0 || !statusPermitidos.includes(vooStatus)) {
    return res.status(400).json({ msg: "Valor ou status do voo inválido." });
  }

  try {
    const vooExistente = await voosServices.buscarPorId(id);

    if (!vooExistente) {
      return res.status(404).json({ msg: "Voo não encontrado." });
    }

    await voosServices.atualizarDados(id, {
      origem,
      destino,
      data_voo,
      horario_voo,
      valor: Number(valor),
      vooStatus,
    });

    const vooAtualizado = await voosServices.buscarPorId(id);

    return res.status(200).json({
      msg: "Voo atualizado!",
      result: vooAtualizado,
    });
  } catch (error) {
    console.error("Erro ao atualizar voo:", error);
    return res.status(500).json({ msg: "Erro interno ao atualizar voo." });
  }
},
deletar: async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ msg: "O ID deve ser um inteiro positivo." });
  }

  try {
    const resultado = await voosServices.deletar(id);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ msg: "Voo não encontrado." });
    }

    return res.status(200).json({
      msg: "Voo excluído com sucesso.",
    });

  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        msg: "Voo possui agendamentos e não pode ser excluído. Cancele o voo.",
      });
    }

    console.error("Erro ao excluir voo:", error);
    return res.status(500).json({ msg: "Erro interno ao excluir voo." });
  }
},

};

export default voosControllers;

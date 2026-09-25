import voosRepository from "../repositories/voosRepository.js";

const voosServices = {
  listarDisponiveis: async () => {
    return await voosRepository.encontrarDisponiveis();
  },

  listarTodos: async () => {
    return await voosRepository.listarTodos();
  },

  criarVoo: async (voo) => {
    return await voosRepository.criar(voo);
  },
  buscarPorId: async (id) => {
    return await voosRepository.encontrarPorId(id);
  },
  atualizarDados: async (id, voo) => {
    return await voosRepository.atualizarDados(id, voo);
  },
  deletar: async (id) => {
    return await voosRepository.deletar(id);
  },
};

export default voosServices;
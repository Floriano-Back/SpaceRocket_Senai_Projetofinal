import avaliacaoRepository from '../repositories/avaliacaoRepository.js';
import AvaliacaoFisica from '../models/AvaliacaoFisica.js';
import appError from '../errors/appError.js';

// ---------- Regras de negócio ----------
const arredondar = (n) => Math.round(n * 100) / 100;
const calcularImc = (peso, altura) => arredondar(peso / (altura * altura));

const classificarImc = (imc) => {
    if (imc < 18.5) return 'Abaixo do peso';
    if (imc < 25) return 'Peso normal';
    if (imc < 30) return 'Sobrepeso';
    if (imc < 35) return 'Obesidade Grau I';
    if (imc < 40) return 'Obesidade Grau II';
    return 'Obesidade Grau III';
};

// APTO: IMC de 18,5 até 29,9 (abaixo de 30). Qualquer outro valor: INAPTO
const definirCondicao = (imc) => (imc >= 18.5 && imc < 30 ? 'APTO' : 'INAPTO');

const validar = (peso, altura) => {
    peso = arredondar(Number(peso));
    altura = arredondar(Number(altura));
    if (!Number.isFinite(peso) || peso < 20 || peso > 300) {
        throw new appError("Peso inválido (use kg, entre 20 e 300).");
    }
    if (!Number.isFinite(altura) || altura < 0.5 || altura > 2.5) {
        throw new appError("Altura inválida (use metros, ex.: 1.75, entre 0.5 e 2.5).");
    }
    return { peso, altura };
};

const enriquecer = (a) => ({ ...a, imc: Number(a.imc), classificacao: classificarImc(Number(a.imc)) });

// ---------- Service ----------
const avaliacaoService = {
    criar: async ({ id_passageiro, peso, altura, observacao }) => {
        if (!id_passageiro) throw new appError("Informe o passageiro da avaliação!");
        const v = validar(peso, altura);

        if (!(await avaliacaoRepository.passageiroExiste(id_passageiro))) {
            throw new appError("Passageiro não encontrado!", 404);
        }

        const imc = calcularImc(v.peso, v.altura);
        const condicao = definirCondicao(imc);
        const av = new AvaliacaoFisica(id_passageiro, v.peso, v.altura, imc, condicao, observacao || null);
        const result = await avaliacaoRepository.criar(av);

        return { id_avaliacao: result.insertId, imc, condicao_fisica: condicao, classificacao: classificarImc(imc) };
    },

    listar: async (user) => {
        const rows = user.tipo_usuario === 'ADMIN'
            ? await avaliacaoRepository.listarTodos()
            : await avaliacaoRepository.listarPorUsuario(user.id_usuario);
        return rows.map(enriquecer);
    },

    buscarPorId: async (user, id_avaliacao) => {
        const av = await avaliacaoRepository.buscarPorId(id_avaliacao);
        // Passageiro só enxerga a própria avaliação
        if (!av || (user.tipo_usuario !== 'ADMIN' && av.id_usuario !== user.id_usuario)) {
            throw new appError("Avaliação não encontrada!", 404);
        }
        return enriquecer(av);
    },

    atualizar: async (id_avaliacao, { peso, altura, observacao }) => {
        const existente = await avaliacaoRepository.buscarPorId(id_avaliacao);
        if (!existente) throw new appError("Avaliação não encontrada!", 404);

        const v = validar(peso, altura);
        const imc = calcularImc(v.peso, v.altura);
        const av = new AvaliacaoFisica(existente.id_passageiro, v.peso, v.altura, imc,
            definirCondicao(imc), observacao ?? existente.observacao);
        await avaliacaoRepository.atualizar(id_avaliacao, av);

        return { imc, condicao_fisica: av.condicao_fisica, classificacao: classificarImc(imc) };
    },

    deletar: async (id_avaliacao) => {
        const result = await avaliacaoRepository.deletar(id_avaliacao);
        if (result.affectedRows === 0) throw new appError("Avaliação não encontrada!", 404);
    }
};

export default avaliacaoService;

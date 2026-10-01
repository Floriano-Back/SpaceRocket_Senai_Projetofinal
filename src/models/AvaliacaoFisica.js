class AvaliacaoFisica {
    constructor(id_passageiro, peso, altura, imc, condicao_fisica = 'PENDENTE', observacao = null, id_avaliacao = null) {
        this.id_avaliacao = id_avaliacao;
        this.id_passageiro = id_passageiro;
        this.peso = peso;
        this.altura = altura;
        this.imc = imc;
        this.condicao_fisica = condicao_fisica;
        this.observacao = observacao;
    }
}

export default AvaliacaoFisica;

class Passageiro {
    constructor({
        id_passageiro = null,
        nome = '',
        email = '',
        senha = '',
        cpf = '',
        data_nascimento = null,
        telefone = '',
        peso = null,
        altura = null,
        endereco = null
    } = {}) {
        this.id_passageiro = id_passageiro;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.cpf = cpf;
        this.data_nascimento = data_nascimento;
        this.telefone = telefone;
        this.peso = peso;
        this.altura = altura;
        this.endereco = endereco;
    }
}

export default Passageiro;
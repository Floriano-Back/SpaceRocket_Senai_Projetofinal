class Agendamentos {
    #id_agendamento;
    #id_passageiro;
    #id_voo;
    #data_agendamento;
    #agendamentoStatus;

    constructor(id_agendamento, id_passageiro, id_voo, data_agendamento, agendamentoStatus = "PENDENTE") {
        this.#id_agendamento = id_agendamento;
        this.#id_passageiro = id_passageiro;
        this.#id_voo = id_voo;
        this.#data_agendamento = data_agendamento;
        this.#agendamentoStatus = agendamentoStatus;
    }

    get id_agendamento() {
        return this.#id_agendamento;
    }

    get id_passageiro() {
        return this.#id_passageiro;
    }

    get id_voo() {
        return this.#id_voo;
    }

    get data_agendamento() {
        return this.#data_agendamento;
    }

    get agendamentoStatus() {
        return this.#agendamentoStatus;
    }

    set id_agendamento(value) {
        this.#id_agendamento = value;
    }

    set id_passageiro(value) {
        this.#id_passageiro = value;
    }

    set id_voo(value) {
        this.#id_voo = value;
    }

    set data_agendamento(value) {
        this.#data_agendamento = value;
    }

    set agendamentoStatus(value) {
        this.#agendamentoStatus = value;
    }

    toJSON() {
        return {
            id_agendamento: this.#id_agendamento,
            id_passageiro: this.#id_passageiro,
            id_voo: this.#id_voo,
            data_agendamento: this.#data_agendamento,
            agendamentoStatus: this.#agendamentoStatus
        };
    }
}

export default Agendamentos;

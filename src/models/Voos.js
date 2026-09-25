class Voos {
  #id_voo;
  #codigo_voo;
  #origem;
  #destino;
  #data_voo;
  #horario_voo;
  #capacidade;
  #valor;
  #vooStatus;
  #vagas_disponiveis;

  constructor(
    codigo_voo,
    origem,
    destino,
    data_voo,
    horario_voo,
    capacidade,
    valor,
    vooStatus = "PENDENTE",
    id_voo = null,
    vagas_disponiveis = null
  ) {
    this.#id_voo = id_voo;
    this.#codigo_voo = codigo_voo;
    this.#origem = origem;
    this.#destino = destino;
    this.#data_voo = data_voo;
    this.#horario_voo = horario_voo;
    this.#capacidade = capacidade;
    this.#valor = valor;
    this.#vooStatus = vooStatus;
    this.#vagas_disponiveis = vagas_disponiveis;
  }

  get id_voo() { return this.#id_voo; }

  get codigo_voo() { return this.#codigo_voo; }
  set codigo_voo(value) { this.#codigo_voo = value; }

  get origem() { return this.#origem; }
  set origem(value) { this.#origem = value; }

  get destino() { return this.#destino; }
  set destino(value) { this.#destino = value; }

  get data_voo() { return this.#data_voo; }
  set data_voo(value) { this.#data_voo = value; }

  get horario_voo() { return this.#horario_voo; }
  set horario_voo(value) { this.#horario_voo = value; }

  get capacidade() { return this.#capacidade; }
  set capacidade(value) { this.#capacidade = value; }

  get valor() { return this.#valor; }
  set valor(value) { this.#valor = value; }

  get vooStatus() { return this.#vooStatus; }
  set vooStatus(value) { this.#vooStatus = value; }

  get vagas_disponiveis() { return this.#vagas_disponiveis; }
  set vagas_disponiveis(value) { this.#vagas_disponiveis = value; }

  toJSON() {
    return {
      id_voo: this.#id_voo,
      codigo_voo: this.#codigo_voo,
      origem: this.#origem,
      destino: this.#destino,
      data_voo: this.#data_voo,
      horario_voo: this.#horario_voo,
      capacidade: this.#capacidade,
      vagas_disponiveis: this.#vagas_disponiveis,
      valor: this.#valor,
      vooStatus: this.#vooStatus,
    };
  }
}

export default Voos;

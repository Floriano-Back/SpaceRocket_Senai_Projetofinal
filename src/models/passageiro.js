class passageiro {
    #id_passageiro;
    #nome;
    #email;
    #senha;
    #tipo_usuario;

    constructor(nome, email, senha, tipo_usuario, id_passageiro = null){
        this.#nome = nome;
        this.#email = email;
        this.#senha = senha;
        this.#tipo_usuario = tipo_usuario;
        this.#id_passageiro = id_passageiro;

    }

    get id_passageiro() {
        return this.#id_passageiro;
    }

    get nome() {
        return this.#nome;
    }

    set nome(value) {
        this.#nome = value;
    }

    
    get email() {
        return this.#email;
    }


    set email(value) {
        this.#email = value;
    }

    
    get senha() {
        return this.#senha;
    }


    set senha(value) {
        this.#senha = value;
    }

    //tipo_usuario
    get tipo_usuario(){
        return this.#tipo_usuario;
    }

    set tipo_usuario(value){
        this.#tipo_usuario = value;
    }
}



    
export default passageiro;
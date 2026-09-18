class Users {
    #id_usuario;
    #nome;
    #email;
    #senha_hash;
    #tipo_usuario;

    constructor(nome, email, senha_hash, tipo_usuario, id_usuario = null){
            this.#id_usuario = id_usuario;
            this.#nome = nome;
            this.#email = email;
            this.#senha_hash = senha_hash;
            this.#tipo_usuario = tipo_usuario;
    }

    get id_usuario(){
        return this.#id_usuario;
    }

    get nome(){
        return this.#nome;
    }

    set nome(value){
        this.#nome = value;
    }

    get email(){
        return this.#email;
    }

    set email(value){
        this.#email = value;
    }

    get senha_hash(){
        return this.#senha_hash;
    }

    set senha_hash(value){
        this.#senha_hash = value;
    }

    get tipo_usuario(){
        return this.#tipo_usuario;
    }

    set tipo_usuario(value){
        this.#tipo_usuario = value;
    }
}

export default Users;
class Users {
    #id;
    #nome;
    #email;
    #senha_hash;
    #tipo_usuario;

    constructor(id, nome, email, senha_hash, tipo_usuario){
            this.#id = id;
            this.#nome = nome;
            this.#email = email;
            this.#senha_hash = senha_hash;
            this.#tipo_usuario = tipo_usuario;
    }

    get id(){
        return this.#id;
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
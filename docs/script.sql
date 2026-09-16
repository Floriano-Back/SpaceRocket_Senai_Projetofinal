CREATE DATABASE IF NOT EXISTS spacerocket;

USE spacerocket;

-- ===============================
--  SPACE ROCKET - BANCO DE DADOS
-- ===============================


-- 1. USUÁRIOS forma pai dos passageiros e administradores, contendo informações básicas como nome, email, senha e tipo de usuário
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,

    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,

    tipo_usuario VARCHAR(20) NOT NULL
        CHECK (tipo_usuario IN ('ADMIN', 'PASSAGEIRO')),

    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 2. PASSAGEIROS recebe informações adicionais do usuário, como CPF, data de nascimento, telefone, peso e altura
CREATE TABLE passageiros (
    id_passageiro SERIAL PRIMARY KEY,

    id_usuario INT UNIQUE NOT NULL,

    cpf VARCHAR(14) UNIQUE NOT NULL,
    data_nascimento DATE NOT NULL,
    telefone VARCHAR(20),

    peso DECIMAL(5,2),
    altura DECIMAL(3,2),

    FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
);


-- 3. AVALIAÇÕES FÍSICAS guarda as informações de peso, altura, IMC e condição física do passageiro
CREATE TABLE avaliacoes_fisicas (
    id_avaliacao SERIAL PRIMARY KEY,

    id_passageiro INT NOT NULL,

    peso DECIMAL(5,2) NOT NULL,
    altura DECIMAL(3,2) NOT NULL,
    imc DECIMAL(5,2) NOT NULL,

    condicao_fisica VARCHAR(20) NOT NULL
        CHECK (condicao_fisica IN (
            'APTO',
            'INAPTO',
            'PENDENTE'
        )),

    observacao TEXT,

    data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_passageiro)
        REFERENCES passageiros(id_passageiro)
        ON DELETE CASCADE
);


-- 4. Voos disponíveis para agendamento  
CREATE TABLE voos (
    id_voo SERIAL PRIMARY KEY,

    codigo_voo VARCHAR(20) UNIQUE NOT NULL,

    origem VARCHAR(100) NOT NULL,
    destino VARCHAR(100) NOT NULL,

    data_voo DATE NOT NULL,
    horario_voo TIME NOT NULL,

    capacidade INT NOT NULL,
    vagas_disponiveis INT NOT NULL,

    valor DECIMAL(10,2) NOT NULL,

    status VARCHAR(20) NOT NULL
        CHECK (status IN (
            'AGENDADO',
            'EMBARQUE',
            'FINALIZADO',
            'CANCELADO'
        ))
);


-- 5. AGENDAMENTOS relaciona passageiros aos voos

CREATE TABLE agendamentos (
    id_agendamento SERIAL PRIMARY KEY,

    id_passageiro INT NOT NULL,
    id_voo INT NOT NULL,

    data_agendamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    status VARCHAR(20) NOT NULL
        CHECK (status IN (
            'PENDENTE',
            'CONFIRMADO',
            'CANCELADO',
            'CONCLUIDO'
        )),

    FOREIGN KEY (id_passageiro)
        REFERENCES passageiros(id_passageiro)
        ON DELETE CASCADE,

    FOREIGN KEY (id_voo)
        REFERENCES voos(id_voo)

    UNIQUE (id_passageiro, id_voo)
);


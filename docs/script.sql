CREATE DATABASE IF NOT EXISTS spacerocket;

--DROP DATABASE spacerocket;

USE spacerocket;

-- ===============================
--  SPACE ROCKET - BANCO DE DADOS
-- ===============================

-- 1. USUÁRIOS forma pai dos passageiros e administradores, contendo informações básicas como nome, email, senha e tipo de usuário
CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(300) NOT NULL,
    tipo_usuario ENUM ('ADMIN', 'PASSAGEIRO') NOT NULL DEFAULT('PASSAGEIRO'),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 2. PASSAGEIROS recebe informações adicionais do usuário, como CPF, data de nascimento, telefone, peso e altura
CREATE TABLE passageiros (
    id_passageiro INT AUTO_INCREMENT PRIMARY KEY,
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
    id_avaliacao INT AUTO_INCREMENT PRIMARY KEY,
    id_passageiro INT NOT NULL,
    peso DECIMAL(5,2) NOT NULL,
    altura DECIMAL(3,2) NOT NULL,
    imc DECIMAL(5,2) NOT NULL,
    condicao_fisica ENUM('APTO', 'INAPTO','PENDENTE') NOT NULL DEFAULT('PENDENTE'),
    observacao TEXT,
    data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_passageiro)
        REFERENCES passageiros(id_passageiro)
        ON DELETE CASCADE
);


-- 4. Voos disponíveis para agendamento  
CREATE TABLE voos (
    id_voo INT PRIMARY KEY AUTO_INCREMENT,
    codigo_voo VARCHAR(20) UNIQUE NOT NULL,
    origem VARCHAR(100) NOT NULL,
    destino VARCHAR(100) NOT NULL,
    data_voo DATE NOT NULL,
    horario_voo TIME NOT NULL,
    capacidade INT NOT NULL,
    vagas_disponiveis INT NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    vooStatus ENUM('AGENDADO', 'EMBARQUE', 'FINALIZADO', 'PENDENTE', 'CANCELADO') NOT NULL DEFAULT('PENDENTE')
);


-- 5. AGENDAMENTOS relaciona passageiros aos voos

CREATE TABLE agendamentos (
    id_agendamento INT AUTO_INCREMENT PRIMARY KEY,
    id_passageiro INT NOT NULL,
    id_voo INT NOT NULL,
    data_agendamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    agendamentosStatus ENUM('PENDENTE', 'CONFIRMADO', 'CANCELADO', 'CONCLUIDO') NOT NULL DEFAULT('PENDENTE'),

    FOREIGN KEY (id_passageiro)
        REFERENCES passageiros(id_passageiro)
        ON DELETE CASCADE,

    FOREIGN KEY (id_voo)
        REFERENCES voos(id_voo),

    UNIQUE (id_passageiro, id_voo)
);
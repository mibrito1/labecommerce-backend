-- Active: 1689011139004@@127.0.0.1@3306

-- Criação da tabela de pessoas usuárias

CREATE TABLE
    usuarios(
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT NOT NULL
    );

--comando para procurar usuarios na tabela

SELECT * FROM usuarios;

--Populando a tabela de pessoas usuárias

INSERT INTO
    usuarios(
        id,
        name,
        email,
        password,
        created_at
    )
VALUES (
        "u001",
        "Fulano",
        "fulano@email.com",
        "fulano123",
        datetime('now')
    ), (
        "u002",
        "Beltrana",
        "beltrana@email.com",
        "beltrana00",
        datetime('now')
    ), (
        "u003",
        "Ciclana",
        "ciclana@email.com",
        "cici00",
        datetime('now')
    );

--comando para apagar tabela

DROP TABLE usuarios;

CREATE TABLE
    produtos(
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT NOT NULL
    );

SELECT name, price FROM produtos;

INSERT INTO
    produtos (
        id,
        name,
        price,
        description,
        image_url
    )
VALUES (
        "prod001",
        "Mouse gamer",
        250,
        "Melhor mouse do mercado!",
        "https://picsum.photos/seed/Mouse%20gamer/400"
    ), (
        "prod002",
        "Monitor",
        900,
        "Monitor LED Full HD 24 polegadas",
        "https://picsum.photos/seed/Monitor/400"
    ), (
        "prod003",
        "Monitor power black",
        900,
        "Monitor HD 17 polegadas",
        "https://amazon.com.br/Monitor/900"
    ), (
        "prod004",
        "pc gamer",
        5500,
        "MD Ryzen 7 5700G, 16GB DDR4,",
        "https://amazon.com.br/Gamer-Mancer-Ryzen"
    ), (
        "prod005",
        "computador gamer",
        9000,
        " GEFORCE RTX 3050 8GB, 16GB DDR4, SSD 480GB",
        'https://pichau.com.br/computador-pichau-gamer-intel'
    );

SELECT * FROM usuarios ;

SELECT * FROM produtos;

--procurando uma coisa especifica

SELECT * FROM produtos WHERE name LIKE '%mouse%';

-- criando outro usuario

INSERT INTO
    usuarios(
        id,
        name,
        email,
        password,
        created_at
    )
VALUES (
        "u004",
        "Marlene",
        "marlene@gmail.com",
        "mar1234",
        datetime('now')
    );

INSERT INTO
    produtos (
        id,
        name,
        price,
        description,
        image_url
    )
VALUES (
        "prod006",
        "Placa de video",
        580,
        "RX580 Gaming Graphics Card 8GB",
        "https://amazon.com.br/Graphics-Computer"
    );

--deletar um item

DELETE FROM usuarios WHERE id = "u004";

DELETE FROM produtos WHERE id = "prod004";

UPDATE produtos
SET
    description = "RX580 Gaming Graphics Card 4GB"
WHERE id = 'prod006';

UPDATE produtos
SET
    description = "Melhor mouse do mercado!"
WHERE id = 'prod001';

UPDATE produtos
SET
    name = "Monitor full hd",
    price = 999,
    description = "Monitor LED 24 polegadas",
    image_url = "https://picsum.photos/seed/Monitor"
WHERE id = 'prod002';

--purchases é pedido, entao essa e´a tabela de pedidos

-- relaçao de 1/m com FK

CREATE TABLE
    purchases (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        buyer TEXT NOT NULL,
        total_price REAL NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (buyer) REFERENCES usuarios(id)
    );

SELECT * FROM purchases;

INSERT INTO
    purchases (
        id,
        buyer,
        total_price,
        created_at
    )
VALUES (
        'p001',
        'u001',
        1000,
        datetime('now')
    ), (
        'p002',
        'u002',
        890,
        datetime('now')
    );

-- editando elementos da tabela purchase

UPDATE purchases SET total_price = 1400 WHERE id = 'p001';

SELECT
    purchases.id,
    purchases.buyer,
    usuarios.name,
    usuarios.email,
    purchases.total_price,
    purchases.created_at
FROM usuarios
    INNER JOIN purchases ON purchases.buyer = usuarios.id;
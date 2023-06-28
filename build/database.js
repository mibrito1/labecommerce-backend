"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.procurarProdutoPorNome = exports.produtos = exports.usuarios = exports.createProducts = exports.createUser = exports.getAllProducts = exports.getAllUsers = void 0;
const getAllUsers = () => {
    return exports.usuarios;
};
exports.getAllUsers = getAllUsers;
const getAllProducts = () => {
    return exports.produtos;
};
exports.getAllProducts = getAllProducts;
const createUser = (id, name, email, password) => {
    const novoUsuario = {
        id,
        name,
        email,
        password,
        createdAt: new Date().toISOString()
    };
    exports.usuarios.push(novoUsuario);
    console.log("Adicionado novo usuario!");
};
exports.createUser = createUser;
const createProducts = (id, name, price, description, imageUrl) => {
    const novoProduto = {
        id,
        name,
        price,
        description,
        imageUrl,
    };
    exports.produtos.push(novoProduto);
    console.log("Adicionado novo produto!");
};
exports.createProducts = createProducts;
exports.usuarios = [
    {
        id: "u001",
        name: "Fulano",
        email: "fulano@email.com",
        password: "fulano123",
        createdAt: new Date().toISOString(),
    },
    {
        id: "u002",
        name: "Beltrana",
        email: "beltrana@email.com",
        password: "beltrana00",
        createdAt: new Date().toISOString(),
    },
];
exports.produtos = [
    {
        id: "prod001",
        name: "Mouse gamer",
        price: 250,
        description: "Melhor mouse do mercado!",
        imageUrl: "https://picsum.photos/seed/Mouse%20gamer/400",
    },
    {
        id: "prod002",
        name: "Monitor",
        price: 900,
        description: "Monitor LED Full HD 24 polegadas",
        imageUrl: "https://picsum.photos/seed/Monitor/400",
    },
];
const procurarProdutoPorNome = (name) => {
    const result = exports.produtos.filter(produto => {
        return produto.name.includes(name);
    });
    return result;
};
exports.procurarProdutoPorNome = procurarProdutoPorNome;
//# sourceMappingURL=database.js.map
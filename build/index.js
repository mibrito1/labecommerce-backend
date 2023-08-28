"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
const database_2 = require("./database");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const knex_1 = require("./database/knex");
(0, database_1.createUser)("u003", "Ciquilana", "ciquilana@gmail.com", "cici1234");
(0, database_1.createProducts)("prod003", "mouse pad", 55, "mouse pad com apoio ergonomico preto", "https://fotos.oceanob2b.com/High/042195.jpg?ims=150x");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003");
});
app.get("/ping", (req, res) => {
    res.send("Pong!");
});
app.get("/usuarios", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send(database_1.usuarios);
    try {
        const resultUsuarios = yield (0, knex_1.db)("usuarios");
        res.status(200).send(resultUsuarios);
    }
    catch (error) {
        console.log(error);
    }
}));
app.get("/produtos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resultProdutos = yield (0, knex_1.db)("produtos");
        res.status(200).send(resultProdutos);
    }
    catch (error) {
        console.log(error);
    }
}));
app.get("/produtos/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const name = req.query.name;
        if (name) {
            if (name.length < 2) {
                res.status(400);
                throw new Error("Digite mais de 2 caracteres");
            }
            const result = yield knex_1.db.raw(`
                SELECT * FROM produtos
                WHERE name LIKE '%${name}%'`);
            if (result.length === 0) {
                res.status(404);
                throw new Error("Produto não existe na lista!");
            }
            res.status(200).send(result);
        }
    }
    catch (error) {
        console.log(error);
        res.send(error.message);
    }
}));
app.post("/usuarios", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.body.id;
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        if (typeof id !== "string") {
            res.status(400);
            throw new Error("'id' precisa ser uma string");
        }
        if (typeof name !== "string") {
            res.status(400);
            throw new Error("'name' precisa ser uma string");
        }
        if (typeof email !== "string") {
            res.status(400);
            throw new Error("'email' precisa ser uma string");
        }
        if (typeof password !== "string") {
            res.status(400);
            throw new Error("'password' precisa ser uma string");
        }
        const [userExist] = yield knex_1.db.raw(`
      SELECT * FROM usuarios
      WHERE id = '${id}'

      `);
        if (userExist) {
            res.status(404);
            throw new Error('"id" ja existe');
        }
        const [emailExist] = yield knex_1.db.raw(`
      SELECT * FROM usuarios
      WHERE email = '${email}'
      `);
        if (emailExist) {
            res.status(404);
            throw new Error('"email" ja existe');
        }
        yield knex_1.db.raw(`
             INSERT INTO usuarios(id, name, email, password, created_at)
      VALUES('${id}', '${name}', '${email}', '${password}', '${new Date().toISOString()}')
        `);
        res.status(200).send("Cadastro realizado com sucesso");
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error.message);
    }
}));
app.post("/produtos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.body.id;
        const name = req.body.name;
        const price = req.body.price;
        const description = req.body.description;
        const imageUrl = req.body.imageUrl;
        if (typeof id !== "string") {
            res.status(400);
            throw new Error("'id' precisa ser uma string");
        }
        if (typeof name !== "string") {
            res.status(400);
            throw new Error("'name' precisa ser uma string");
        }
        if (typeof price !== "number") {
            res.status(400);
            throw new Error("'number' precisa ser um numero");
        }
        if (typeof imageUrl !== "string") {
            res.status(400);
            throw new Error("'imageUrl' precisa ser uma string");
        }
        const [productExist] = yield knex_1.db.raw(`
      
      SELECT * FROM produtos
      WHERE id = '${id}'
      `);
        if (productExist) {
            res.status(404);
            throw new Error('"id" ja existe');
        }
        yield knex_1.db.raw(`
       INSERT INTO produtos(id, name, price,description, image_url)
      VALUES ('${id}', '${name}',${price},'${description}','${imageUrl}')
      `);
        res.status(200).send("Cadastro realizado com sucesso");
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error.message);
    }
}));
app.delete("/usuarios/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idToDelete = req.params.id;
        const userIndex = database_1.usuarios.findIndex((user) => user.id === idToDelete);
        if (userIndex < 0) {
            res.status(404);
            throw new Error("Usuario não encontrado");
        }
        database_1.usuarios.splice(userIndex, 1);
        res.status(200).send("Usuario apagado com sucesso");
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error.message);
    }
}));
app.delete("/produtos/:id", (req, res) => {
    try {
        const idToDelete = req.params.id;
        const productIndex = database_2.produtos.findIndex((product) => product.id === idToDelete);
        if (productIndex < 0) {
            res.status(404);
            throw new Error("produto nao encontrado!");
        }
        database_2.produtos.splice(productIndex, 1);
        res.status(200).send("produto apagado com sucesso");
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error.message);
    }
});
app.put("/produtos/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idToModify = req.params.id;
        const newId = req.body.id;
        const newName = req.body.name;
        const newPrice = req.body.price;
        const newDescription = req.body.description;
        const newImageUrl = req.body.imageUrl;
        const [produtos] = yield knex_1.db.raw(`
        SELECT * FROM produtos
        WHERE id = '${idToModify}';
      `);
        if (produtos) {
            yield knex_1.db.raw(`
         UPDATE produtos
        SET 
            id = "${newId || produtos.id}",
            name = "${newName || produtos.name}",
            price = "${newPrice || produtos.price}",
            description = "${newDescription || produtos.description}",
            image_url = "${newImageUrl || produtos.image_url}"
        WHERE 
            id = "${idToModify}"
        `);
        }
        else {
            res.status(404);
            throw new Error("Produto não encontrado, por isso não foi atualizado.");
        }
        res.status(200).send("Produto atualizado com sucesso!");
    }
    catch (error) {
        if (res.statusCode === 200) {
            res.status(500);
        }
        console.log(error);
        res.send(error.message);
    }
}));
app.get("/purchases", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resultPurchases = yield (0, knex_1.db)("purchases");
        res.status(200).send(resultPurchases);
    }
    catch (error) {
        console.log(error);
    }
}));
app.delete("/purchases/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletePurchase = req.params.id;
        const [purchase] = yield knex_1.db.raw(`
         SELECT * FROM purchases
       WHERE id = "${deletePurchase}";
      `);
        if (!purchase) {
            res.status(404);
            throw new Error(" pedido' não encontrado");
        }
        yield knex_1.db.raw(`
       DELETE FROM purchases
      WHERE id = "${deletePurchase}";
      `);
        res.status(200).send("Pedido foi deletado com sucesso");
    }
    catch (error) {
        if (res.statusCode === 200) {
            res.status(500);
        }
        console.log(error);
        res.send(error.message);
    }
}));
//# sourceMappingURL=index.js.map
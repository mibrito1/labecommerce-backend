"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
console.table((0, database_1.getAllUsers)());
console.table((0, database_1.getAllProducts)());
(0, database_1.createUser)("u003", "Ciquilana", "ciquilana@gmail.com", "cici1234");
(0, database_1.createProducts)("prod003", "mouse pad", 55, "mouse pad com apoio ergonomico preto", "https://fotos.oceanob2b.com/High/042195.jpg?ims=150x");
console.table((0, database_1.getAllUsers)());
console.table((0, database_1.getAllProducts)());
console.table((0, database_1.procurarProdutoPorNome)("mouse"));
//# sourceMappingURL=index.js.map
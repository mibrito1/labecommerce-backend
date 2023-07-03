
import { createProducts, createUser, getAllProducts, getAllUsers, procurarProdutoPorNome, usuarios } from "./database";
import { produtos } from "./database";
import express, { Request, Response } from "express";
import cors from "cors";
import { TProdutos, TUsuarios } from "./types";

console.table(getAllUsers())
console.table(getAllProducts())

createUser("u003", "Ciquilana", "ciquilana@gmail.com", "cici1234")
createProducts("prod003", "mouse pad", 55, "mouse pad com apoio ergonomico preto", "https://fotos.oceanob2b.com/High/042195.jpg?ims=150x")

console.table(getAllUsers())
console.table(getAllProducts())

console.table(procurarProdutoPorNome("mouse"))

const app = express();

app.use(express.json());
app.use(cors());

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003");
});

app.get("/ping", (req: Request, res: Response) => {
    res.send("Pong!");
});

app.get("/usuarios", (req: Request, res: Response) => {
    res.status(200).send(usuarios);
})
app.get("/produtos", (req: Request, res: Response) => {
    res.status(200).send(produtos);
})
app.get("/produtos/search", (req: Request, res: Response) => {
    const name = req.query.name as string;
    const resultado = produtos.filter((produtos) => produtos.name.toLowerCase().includes(name.toLowerCase()));
    res.status(200).send(resultado);
});

app.post("/usuarios", (req: Request, res: Response) => {
    const id = req.body.id as string;
    const name = req.body.name as string;
    const email = req.body.email as string;
    const password = req.body.password as string;

    const novoUsuario: TUsuarios = {
        id,
        name,
        email,
        password,
        createdAt: new Date().toISOString(),
    };

    usuarios.push(novoUsuario);

    res.status(201).send("Cadastro realizado com sucesso!")

})

app.post("/produtos", (req: Request, res: Response) => {
    const id = req.body.id as string;
    const name = req.body.name as string;
    let price = req.body.price as number;
    const description = req.body.description as string;
    const imageUrl = req.body.imageUrl as string;

    const novoProduto: TProdutos = {
        id,
        name,
        price,
        description,
        imageUrl,
    };

    produtos.push(novoProduto);

    res.status(201).send("Produto cadastrado com sucesso!")

})
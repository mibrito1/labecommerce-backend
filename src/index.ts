
import { createProducts, createUser, getAllProducts, getAllUsers, procurarProdutoPorNome, usuarios } from "./database";
import { produtos } from "./database";
import express, { Request, Response } from "express";
import cors from "cors";
import { TProdutos, TUsuarios } from "./types";

// console.table(getAllUsers())
// console.table(getAllProducts())

createUser("u003", "Ciquilana", "ciquilana@gmail.com", "cici1234")
createProducts("prod003", "mouse pad", 55, "mouse pad com apoio ergonomico preto", "https://fotos.oceanob2b.com/High/042195.jpg?ims=150x")

// console.table(getAllUsers())
// console.table(getAllProducts())

// console.table(procurarProdutoPorNome("mouse"))

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
    try {
        const name = req.query.name as string;
        const result = produtos.find((produtos) => produtos.name.toLowerCase().includes(name.toLowerCase())
        );
        if (name.length < 2) {
            res.status(400);
            throw new Error("'name' deve ter ao menos 2 caracteres");
        }

        if (!result) {
            res.status(404);
            throw new Error("Produto não encontrado");
        }
        res.status(200).send(result);
    }
    catch (error: any) {
        console.log(error)

        // se chegar ainda valendo 200 sabemos que foi um erro inesperado
        if (res.statusCode === 200) {
            res.status(500) // definimos 500 porque é algo que o servidor não previu
        }

        res.send(error.message)
    }

});

app.post("/usuarios", (req: Request, res: Response) => {
    try {
        const id = req.body.id as string;
        const name = req.body.name as string;
        const email = req.body.email as string;
        const password = req.body.password as string;

        if (typeof id !== "string") {
            res.status(400)
            throw new Error("'id' precisa ser uma string")

        }
        if (typeof name !== "string") {
            res.status(400)
            throw new Error("'name' precisa ser uma string")

        }
        if (typeof email !== "string") {
            res.status(400)
            throw new Error("'email' precisa ser uma string!")

        }
        if (typeof password !== "string") {
            res.status(400)
            throw new Error("'password' precisa ser uma string!")

        }

        const idUserExiste = usuarios.find((user) => user.id === id)
        if (idUserExiste) {
            res.status(400)
            throw new Error("'id' ja existe!")
        }
        const emailUserExiste = usuarios.find((user) => user.email === email)
        if (emailUserExiste) {
            res.status(400)
            throw new Error("'email' ja existe!")
        }

        const novoUsuario: TUsuarios = {
            id,
            name,
            email,
            password,
            createdAt: new Date().toISOString(),
        };

        usuarios.push(novoUsuario);

        res.status(201).send("Cadastro realizado com sucesso!")

    } catch (error: any) {
        console.log(error)

        // se chegar ainda valendo 200 sabemos que foi um erro inesperado
        if (res.statusCode === 200) {
            res.status(500) // definimos 500 porque é algo que o servidor não previu
        }

        res.send(error.message)

    }

})

app.post("/produtos", (req: Request, res: Response) => {
    try {
        const id = req.body.id as string;
        const name = req.body.name as string;
        let price = req.body.price as number;
        const description = req.body.description as string;
        const imageUrl = req.body.imageUrl as string;

        if (typeof id !== "string") {
            res.status(400)
            throw new Error("'id' precisa ser uma string")

        }
        if (typeof name !== "string") {
            res.status(400)
            throw new Error("'name' precisa ser uma string")

        }
        if (typeof price !== "number") {
            res.status(400)
            throw new Error("'price' precisa ser um number")

        }
        if (typeof description !== "string") {
            res.status(400)
            throw new Error("'description' precisa ser uma string")

        }
        if (typeof imageUrl !== "string") {
            res.status(400)
            throw new Error("'imageUrl' precisa ser uma string")

        }
        const idProdExiste = produtos.find((prod) => prod.id === id)
        if (idProdExiste) {
            res.status(400)
            throw new Error("'id' ja existe!")
        }


        const novoProduto: TProdutos = {
            id,
            name,
            price,
            description,
            imageUrl,
        };

        produtos.push(novoProduto);
        res.status(201).send("Produto cadastrado com sucesso!")
    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

app.delete("/usuarios/:id", (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id;
        const userIndex = usuarios.findIndex((user) => user.id === idToDelete);

        if (userIndex < 0) {
            res.status(404)
            throw new Error("usuario nao encontrado!")
        }
        usuarios.splice(userIndex, 1);
        res.status(200).send("user apagado com sucesso")
    }
    catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }

});

app.delete("/produtos/:id", (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id;
        const productIndex = produtos.findIndex((product) => product.id === idToDelete);
        if (productIndex < 0) {
            res.status(404)
            throw new Error("produto nao encontrado!")
        }
        produtos.splice(productIndex, 1);
        res.status(200).send("produto apagado com sucesso")
    }

    catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }

        res.send(error.message)
    }

});

app.put("/produtos/:id", (req: Request, res: Response) => {
    try {
        const idToFind = req.params.id
        const validarProdutExistente = produtos.find((produto) => {
            return produto.id === idToFind
        })
        if (!validarProdutExistente) {
            res.status(404)
            throw new Error("produto nao existe")
        }

        const newId = req.body.newId as string | undefined
        const newName = req.body.newName as string | undefined
        const newPrice = req.body.newPrice as number | undefined
        const newDescription = req.body.newDescription as string | undefined
        const newImage = req.body.newImage as string | undefined


        if (newId !== undefined) {
            if (typeof newId !== "string")
                throw new Error(" 'ID' deve ser uma string")
            if (newId.length < 2) {
                throw new Error("O  id produto deve possuir no minimo 2 caracter");
            }
        }
        if (newName !== undefined) {
            if (typeof newName !== "string")
                throw new Error(" 'Name' deve ser uma string")
            if (newName.length < 2) {
                throw new Error("O  nome do produto deve possuir no minimo 2 caracter");
            }
        }

        if (newDescription !== undefined) {
            if (typeof newDescription !== "string")
                throw new Error("'Name'deve ser uma string")
            if (newDescription.length < 2) {
                throw new Error("a descriçao produto deve possuir no minimo 2 caracter");
            }
        }

        if (newImage !== undefined) {
            if (typeof newImage !== "string")
                throw new Error("'Name'deve ser uma string")
            if (newImage.length < 2) {
                throw new Error("a Url do  produto deve possuir no minimo 2 caracter");

            }

        }
        if (newPrice !== undefined) {
            if (typeof newPrice !== "number")
                throw new Error("'Price' deve ser um numero")
            if (newPrice <= 0) {
                throw new Error("O  valor do produto deve ser maior que zero");
            }

        }

        if (newId || newName || newPrice || newDescription || newImage) {
            validarProdutExistente.id = newId || validarProdutExistente.id,
                validarProdutExistente.name = newName || validarProdutExistente.name,
                validarProdutExistente.price = isNaN(Number(newPrice)) ? validarProdutExistente.price : newPrice as number,
                validarProdutExistente.description = newDescription || validarProdutExistente.description,
                validarProdutExistente.imageUrl = newImage || validarProdutExistente.imageUrl
        }
        res.status(200).send("Produto atualizado com sucesso!")
    } catch (error: any) {
        res.send(error.message);
        console.log(error)
    }
})

//validar os dados opcionais do body se eles forem recebidos









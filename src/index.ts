
import { createProducts, createUser, getAllProducts, getAllUsers, procurarProdutoPorNome, usuarios } from "./database";
import { produtos } from "./database";
import express, { Request, Response } from "express";
import cors from "cors";
import { TProdutos, TUsuarios } from "./types";
import { db } from "./database/knex";

// console.table(getAllUsers())
// console.table(getAllProducts())

createUser("u003", "Ciquilana", "ciquilana@gmail.com", "cici1234")
createProducts("prod003", "mouse pad", 55, "mouse pad com apoio ergonomico preto", "https://fotos.oceanob2b.com/High/042195.jpg?ims=150x")

const app = express();

app.use(express.json());
app.use(cors());

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003");
});

app.get("/ping", (req: Request, res: Response) => {
    res.send("Pong!");
});

app.get("/usuarios", async (req: Request, res: Response) => {
    res.status(200).send(usuarios);
    try {

        //---->QUERY BUILDER<----

        const resultUsuarios = await db("usuarios");
        res.status(200).send(resultUsuarios);
    } catch (error: any) {
        console.log(error);
    }
});

app.get("/produtos", async (req: Request, res: Response) => {
    try {
        const resultProdutos = await db("produtos");
        res.status(200).send(resultProdutos);
    } catch (error: any) {
        console.log(error);
    }
});


app.get("/produtos/search", async (req: Request, res: Response) => {
    try {
        const name = req.query.name as string;

        if (name) {

            if (name.length < 2) {
                res.status(400)
                throw new Error("Digite mais de 2 caracteres")
            }
            const result = await db.raw(`
                SELECT * FROM produtos
                WHERE name LIKE '%${name}%'`
            );

            if (result.length === 0) {
                res.status(404)
                throw new Error("Produto não existe na lista!")
            }
            res.status(200).send(result);
        }

    } catch (error: any) {
        console.log(error);

        res.send(error.message)
    }
});

app.post("/usuarios", async (req: Request, res: Response) => {
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

        const [userExist] = await db.raw(`
      SELECT * FROM usuarios
      WHERE id = '${id}'

      ` );
        if (userExist) {
            res.status(404);
            throw new Error('"id" ja existe');
        }

        const [emailExist] = await db.raw(`
      SELECT * FROM usuarios
      WHERE email = '${email}'
      `

        );
        if (emailExist) {
            res.status(404);
            throw new Error('"email" ja existe');
        }

        await db.raw(`
             INSERT INTO usuarios(id, name, email, password, created_at)
      VALUES('${id}', '${name}', '${email}', '${password}', '${new Date().toISOString()}')
        `);

        res.status(200).send("Cadastro realizado com sucesso");
    } catch (error: any) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error.message);
    }
});

app.post("/produtos", async (req: Request, res: Response) => {
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

        const [productExist] = await db.raw(`
      
      SELECT * FROM produtos
      WHERE id = '${id}'
      `

        );
        if (productExist) {
            res.status(404);
            throw new Error('"id" ja existe');
        }

        await db.raw(`
       INSERT INTO produtos(id, name, price,description, image_url)
      VALUES ('${id}', '${name}',${price},'${description}','${imageUrl}')
      `);

        res.status(200).send("Cadastro realizado com sucesso");
    } catch (error: any) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error.message);
    }
});


//Delete user by id
app.delete("/usuarios/:id", async (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id;
        const userIndex = usuarios.findIndex((user) => user.id === idToDelete);

        if (userIndex < 0) {
            res.status(404);
            throw new Error("Usuario não encontrado");
        }
        usuarios.splice(userIndex, 1);
        res.status(200).send("Usuario apagado com sucesso");
    } catch (error: any) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error.message);
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

app.put("/produtos/:id", async (req: Request, res: Response) => {
    try {
        const idToModify = req.params.id;

        const newId = req.body.id as string | undefined;
        const newName = req.body.name as string | undefined;
        const newPrice = req.body.price as number | undefined;
        const newDescription = req.body.description as string | undefined;
        const newImageUrl = req.body.imageUrl as string | undefined;

        const [produtos] = await db.raw(`
        SELECT * FROM produtos
        WHERE id = '${idToModify}';
      `

        );
        if (produtos) {
            await db.raw(`
         UPDATE produtos
        SET 
            id = "${newId || produtos.id}",
            name = "${newName || produtos.name}",
            price = "${newPrice || produtos.price}",
            description = "${newDescription || produtos.description}",
            image_url = "${newImageUrl || produtos.image_url}"
        WHERE 
            id = "${idToModify}"
        `

            );
        } else {
            res.status(404);
            throw new Error("Produto não encontrado, por isso não foi atualizado.");
        }
        res.status(200).send("Produto atualizado com sucesso!");
    } catch (error: any) {
        if (res.statusCode === 200) {
            res.status(500);
        }
        console.log(error);
        res.send(error.message);
    }
});

app.get("/purchases", async (req: Request, res: Response) => {
    try {

        const resultPurchases = await db("purchases");
        res.status(200).send(resultPurchases);
    } catch (error: any) {
        console.log(error);
    }
});

app.delete("/purchases/:id", async (req: Request, res: Response) => {
    try {
        const deletePurchase = req.params.id;

        const [purchase] = await db.raw(`
         SELECT * FROM purchases
       WHERE id = "${deletePurchase}";
      ` );

        if (!purchase) {
            res.status(404);
            throw new Error(" pedido' não encontrado");
        }
        await db.raw(`
       DELETE FROM purchases
      WHERE id = "${deletePurchase}";
      ` );

        res.status(200).send("Pedido foi deletado com sucesso");
    } catch (error: any) {
        if (res.statusCode === 200) {
            res.status(500);
        }
        console.log(error);
        res.send(error.message);
    }
});







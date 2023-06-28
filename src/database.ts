
import { TUsuarios, TProdutos } from "./types"

export const getAllUsers = (): TUsuarios[] => {

    return usuarios
}

export const getAllProducts = (): TProdutos[] => {
    return produtos
}



export const createUser = (
    id: string,
    name: string,
    email: string,
    password: string,
): void => {
    //void significa que a funçao nao retorna nada

    const novoUsuario: TUsuarios = {
        id,
        name,
        email,
        password,
        createdAt: new Date().toISOString()
    }
    usuarios.push(novoUsuario)
    console.log("Adicionado novo usuario!")
}

export const createProducts = (
    id: string,
    name: string,
    price: number,
    description: string,
    imageUrl: string,): void => {
    const novoProduto: TProdutos = {
        id,
        name,
        price,
        description,
        imageUrl,
    }
    produtos.push(novoProduto)
    console.log("Adicionado novo produto!")
}

export const usuarios: TUsuarios[] = [
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
]
export const produtos: TProdutos[] = [
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

]

export const procurarProdutoPorNome = (name: string): TProdutos[] => {

    const result = produtos.filter(produto => {
        return produto.name.includes(name)
    })
    return result

}
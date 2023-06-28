
import { createProducts, createUser, getAllProducts, getAllUsers, procurarProdutoPorNome, usuarios } from "./database";
import { produtos } from "./database";

console.table(getAllUsers())
console.table(getAllProducts())

createUser("u003", "Ciquilana", "ciquilana@gmail.com", "cici1234")
createProducts("prod003", "mouse pad", 55, "mouse pad com apoio ergonomico preto", "https://fotos.oceanob2b.com/High/042195.jpg?ims=150x")

console.table(getAllUsers())
console.table(getAllProducts())
console.table(procurarProdutoPorNome("mouse"))



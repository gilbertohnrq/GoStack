//Importando o express
const express = require("express");
//Instanciando o express
const server = express();
//Dizendo pro express entender JSON
server.use(express.json());

// Query params = ?teste=1
// Route params = /users/1
// Request body = { "name": "Diego"}

// CRUD - Create, Read, Update, Delete

const users = ["Diego", "Robson", "Victor"];

//Middleware global
server.use((req, res, next) => {
  //Calcula tempo de uma instrução (quanto tempo demora p/ executar)
  console.time("Request");
  console.log(`Método: ${req.method}; URL:${req.url}; `);
  //3° parametro e serve pra não travar o fluxo
  next();

  console.timeEnd("Request");
});

//Middleware de verificação, vendo se existe o nome no req.body
function checkUserExists(req, res, next) {
  //se não existir retorna o erro
  if (!req.body.name) {
    return res.status(400).json({ error: "User not found on request body" });
  }
  //se existir passa pro próximo middleware
  return next();
}

//Verifica existencia do usuário no array pelo index
function checkUserInArray(req, res, next) {
  const user = users[req.params.index];
  //se não existir retorn o erro
  if (!user) {
    return res.status(400).json({ error: "User does not exist" });
  }
  //se existir salva o user numa variável que vai ser utilizada pelo middleware de GET
  req.user = user;
  //passa pro proximo middleware
  return next();
}

//middleware get pra mostrar todos usuários
server.get("/users", (req, res) => {
  return res.json(users);
});

//middleware que recebe index pra mostrar 1 usuário só
server.get("/users/:index", checkUserInArray, (req, res) => {
  //  const { index } = req.params;
  //devido a alteração no middleware de verificação de index fica menor a sintaxe do return
  return res.json(req.user);
  //return res.json(users[index]);
});

//middleware post pra inserir um usuário no final do array
server.post("/users", checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

//middleware put para editar um nome do usuário em deternimado index
server.put("/users/:index", checkUserExists, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

//middleware delete que deleta um usuário num index(1 significa que vai ser 1 usuário só)
server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.send();
});

//servidor ouvir a porta 3000 (http://localhost:3000/)
server.listen(3000);

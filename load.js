const { default: mongoose } = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { User } = require("./schema/user");

(async () => {
  // Conectar ao MongoDB
  mongoose.connect(process.env.MONGODB_URI);

  const users = [];

  // Gerar 20 administradores
  for (let i = 0; i < 20; i++) {
    users.push({
      name: `Admin ${i}`,
      email: `admin${i}@example.com`,
      isAdmin: true,
      idOtherApplication: uuidv4(),
    });
  }

  // Gerar 980 usuários comuns ativos
  for (let i = 0; i < 980; i++) {
    users.push({
      name: `Usuário ${i}`,
      email: `user${i}@example.com`,
      idOtherApplication: uuidv4(),
    });
  }

  // Gerar 100 usuários inativos
  for (let i = 0; i < 100; i++) {
    users.push({
      name: `Inativo ${i}`,
      email: `inativo${i}@example.com`,
      status: "inativo",
      idOtherApplication: uuidv4(),
    });
  }

  // Salvar usuários no banco
  await User.insertMany(users);

  console.log("Usuários gerados com sucesso!");

  mongoose.disconnect();
})();

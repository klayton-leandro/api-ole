"use strict";

const User = use("App/Models/User");
const Database = use("Database");

class UserController {
  async store({ request, response }) {
    const { email, username, cpf } = request.all();

    const data = request.only([
      "username",
      "email",
      "password",
      "name",
      "phone",
      "cpf"
    ]);

    const emailExists = await User.findBy("email", email);

    if (emailExists) {
      return response
        .status(400)
        .send({ error: { message: "Esse email já possui conta" } });
    }

    const cpfExists = await User.findBy("cpf", cpf);

    if (cpfExists) {
      return response
        .status(400)
        .send({ error: { message: "Esse CPF já possui conta" } });
    }

    const usernameExists = await User.findBy("username", username);

    if (usernameExists) {
      return response
        .status(400)
        .send({ error: { message: "Esse usuário já possui conta" } });
    }

    const files = [
      {
        description: "documento 1"
      },
      {
        description: "documento 2"
      }
    ];

    const trx = await Database.beginTransaction();

    const user = await User.create(data);

    await user.files().createMany(files, trx);

    await trx.commit();

    return user;
  }
}

module.exports = UserController;

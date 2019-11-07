"use strict";

const User = use("App/Models/User");
const Database = use("Database");

class UserController {
  async index({ request }) {
    const query = request.get();

    const cpf = query.cpf || "";

    const { page } = request.get();
    const users = await User.query()
      .where("admin", false)
      .where("cpf", "LIKE", "%" + cpf + "%")
      .paginate(page);

    return users;
  }

  async show({ request, auth }) {
    const currentUser = await auth.getUser();
    const user = await User.find(currentUser.id);

    return user;
  }

  async store({ request, response }) {
    const adminExists = await Database.from("users")
      .where("admin", true)
      .count();

    console.log(adminExists[0]["count"]);

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

    const trx = await Database.beginTransaction();

    const user = await User.create(data);

    const files = [
      {
        description: "Foto do rosta da frente",
        icon: "smile"
      },
      {
        description: "Documento com foto (RG apenas frete ou CNH aberto)",
        icon: "rg_frente"
      },
      {
        description: "Foto RG verso(não obrigatório em caso de envio da CNH)",
        icon: "rg_verso"
      },
      {
        description: "Comprovante de residência",
        icon: "home"
      },
      {
        description: "Comprovante de renda",
        icon: "dollar-sign"
      }
    ];

    await user.files().createMany(files, trx);

    await trx.commit();

    return user;
  }

  async admin({ request, response }) {
    const adminExists = await Database.from("users")
      .where("admin", true)
      .count();

    if (adminExists[0]["count"] == 0) {
      const data = request.only([
        "username",
        "email",
        "password",
        "name",
        "phone",
        "cpf"
      ]);

      const user = await User.create({ ...data, admin: true });

      return user;
    } else {
      return response
        .status(400)
        .send({ error: { message: "Usuário admin já cadastrado" } });
    }
  }

  async update({ request, response, auth }) {
    const currentUser = await auth.getUser();

    try {
      const user = await User.findOrFail(currentUser.id);
      const data = await request.only(["name", "password", "phone", "email"]);

      if (data.password) {
        user.merge(data);
      } else {
        const { name, phone, email } = data;
        user.merge({ name, phone, email });
      }

      await user.save();

      return user;
    } catch (error) {
      return response
        .status(error.status)
        .send({ error: { message: "Usuário nao encontrado" } });
    }
  }
}

module.exports = UserController;

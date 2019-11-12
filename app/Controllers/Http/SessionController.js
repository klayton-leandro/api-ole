"use strict";

const User = use("App/Models/User");

class SessionController {
  async store({ request, auth }) {
    const { cpf, password } = request.all();

    const token = await auth.attempt(cpf, password);

    const user = await User.findBy("cpf", cpf);

    const data = {
      user: {
        admin: user.admin,
        name: user.name,
        collaborator: user.collaborator,
      },
      ...token
    }
    
    return data;
  }
}

module.exports = SessionController;

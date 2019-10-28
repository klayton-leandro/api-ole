"use strict";

const File = use("App/Models/File");
const Helpers = use("Helpers");

class FileController {
  async store({ request, response }) {
    await File.create({
      description: description
    });
  }

  async show({ params, response }) {}
}

module.exports = FileController;

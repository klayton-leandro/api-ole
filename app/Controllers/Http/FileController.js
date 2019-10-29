"use strict";

const File = use("App/Models/File");

class FileController {
  async show({ params }) {
    const files = await File.query()
      .where("user_id", params.id)
      .fetch();

    return files;
  }
}

module.exports = FileController;

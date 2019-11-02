"use strict";

const File = use("App/Models/File");
const Helpers = use("Helpers");

class FileController {
  async index({ params, auth }) {
    const user = await auth.getUser();
    const files = await File.query()
      .orderBy("id", "asc")
      .where("user_id", params.id || user.id)
      .fetch();
    return files;
  }

  async update({ response, request, params }) {
    try {
      // 1 - verifica a existência de uma arquivo file

      if (!request.file("file")) return;

      // define configurações do arquivo
      const upload = request.file("file", { size: "5mb" });

      // define nome do arquivo
      const fileName = `${Date.now()}.${upload.subtype}`;

      // move o arquivo para uma pasta
      await upload.move(Helpers.tmpPath("uploads"), {
        name: fileName
      });

      if (!upload.moved()) {
        return upload.error();
      }

      const data = {
        file: fileName,
        name: upload.clientName,
        type: upload.type,
        subtype: upload.subtype
      };

      const file = await File.find(params.id);

      file.merge(data);

      await file.save();

      return file;
    } catch (error) {
      return response
        .status(error.status)
        .send({ error: { message: "Erro no upload de arquivo" } });
    }
  }

  async show({ params, response }) {
    try {
      const file = await File.findOrFail(params.id);

      if (file.file) {
        return response.download(Helpers.tmpPath(`uploads/${file.file}`));
      }
    } catch (error) {
      return response
        .status(error.status)
        .send({ error: { message: "Arquivo não existe" } });
    }
  }
}

module.exports = FileController;

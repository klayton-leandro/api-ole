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

  async status({ request, params }) {
    try {
      const data = request.only(["checked"]);

      const file = await File.findOrFail(params.id);

      file.merge(data);

      await file.save();
    } catch (error) {
      return response.status(error.status).send({
        error: {
          message: "Arquivo não existe"
        }
      });
    }
  }

  async update({ response, request, params, auth }) {

    const user = await auth.getUser();

    // 1 - verifica a existência de uma arquivo file

    if (!request.file("file")) {
      try {
        const data = request.only(["message"]);

        const file = await File.findOrFail(params.id);

        file.merge(data);

        await file.save();
      } catch (error) {
        return response.status(error.status).send({
          error: {
            message: "Arquivo não existe"
          }
        });
      }
    } else {
      try {
        // define configurações do arquivo
        const upload = request.file("file", {
          size: "5mb"
        });

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
     

        if(file.file) {
        const oldFiles = await user.fileOlds().createMany([
            {
              file: file.file,
              name: file.name,
              type: file.type,
              subtype: file.subtype,
              description: file.description,
              checked: file.checked,
              icon: file.icon,
              message: file.message
            }
          ])
        }

        file.merge(data);

        await file.save();

        return file;
      } catch (error) {
        return response.status(error.status).send({
          error: {
            message: "Erro no upload de arquivo"
          }
        });
      }
    }
  }

  async show({ params, response }) {
    try {
      const file = await File.findOrFail(params.id);

      if (file.file) {
        return response.download(Helpers.tmpPath(`uploads/${file.file}`));
      }
    } catch (error) {
      return response.status(error.status).send({
        error: {
          message: "Arquivo não existe"
        }
      });
    }
  }
}

module.exports = FileController;

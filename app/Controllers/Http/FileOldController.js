'use strict'

const FileOld = use("App/Models/FileOld");

const Helpers = use("Helpers");
class FileOldController {
 
  async index({ params, auth }) {
    const user = await auth.getUser();
    const oldFiles = await FileOld.query()
      .orderBy("id", "asc")
      .where("user_id", params.id || user.id)
      .fetch();
    return oldFiles;
  }

  async show({ params, response }) {
    try {
      const file = await FileOld.findOrFail(params.id);

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

module.exports = FileOldController
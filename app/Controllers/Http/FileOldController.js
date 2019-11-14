'use strict'

const FileOld = use("App/Models/FileOld");


class FileOldController {
 
  async index({ params, auth }) {
    const user = await auth.getUser();
    const oldFiles = await FileOld.query()
      .orderBy("id", "asc")
      .where("user_id", params.id || user.id)
      .fetch();
    return oldFiles;
  }

}

module.exports = FileOldController

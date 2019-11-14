'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FileOldSchema extends Schema {
  up () {
    this.create('file_olds', (table) => {
      table.increments()
      table.string("file");
      table.string("name");
      table.string("type", 20);
      table.string("subtype", 20);
      table.string("description", 200);
      table.boolean("checked");
      table.string("icon");
      table.string("message", 200);
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users");
      table.timestamps()
    })
  }

  down () {
    this.drop('file_olds')
  }
}

module.exports = FileOldSchema

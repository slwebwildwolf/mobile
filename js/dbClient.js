
const Realm = require('realm');
const NoteSchema = {
  name: 'Note',
  primaryKey: 'id',
  properties: {
    id: 'int',
    content: 'string',
    created: {type: 'date', default: new Date()},
    updated: {type: 'date', default: new Date()}
  }
};

let realm = new Realm({schema: [NoteSchema], schemaVersion: 2});

module.exports = realm;

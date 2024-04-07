const db = require('../utils/database');

module.exports = class Artist {


  static fetchAll() {
    return db.execute('SELECT * FROM user WHERE role = "artist"');
  }

};

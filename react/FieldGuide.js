var Parse = require('parse').Parse;
var parseKeys = require('./parsekeys.js');
Parse.initialize(parseKeys.appId, parseKeys.jsKey);


var Book = Parse.Object.extend('fieldguide');



class FieldGuide {
  constructor(parseObject) {
    this.parseObject = parseObject;
    this.transferParse();
  }

  transferParse() {
    if (!this.parseObject) {
      return;
    }


  }

  static fetch(id, cb) {
    var query = new Parse.Query(Book);
    query.equalTo('objectId', id);
    query.find().then(results => {
      if (results) {
        cb(new FieldGuide(results[0]));
      }
      cb(null);
    });
  }
};

module.exports = FieldGuide;

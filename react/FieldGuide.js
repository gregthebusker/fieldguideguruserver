var Parse = require('parse').Parse;
var parseKeys = require('./parsekeys.js');
Parse.initialize(parseKeys.appId, parseKeys.jsKey);

var Book = Parse.Object.extend('fieldguide');

class FieldGuide {
  constructor(parseObject) {
    this.parseObject = parseObject;
    this.transferParse();
    this.editMode = false;
  }

  transferParse() {
    if (!this.parseObject) {
      return;
    }

    var attributes = this.parseObject.attributes;
    for (var key in attributes) {
      if (attributes[key] instanceof Parse.Object) {
        attributes[key].fetch();
      }
    }
  }

  set(key, value) {
    this.parseObject.set(key, value)
  }

  save(cb=(()=>{})) {
    if (this.editMode) {
      var dirtyKeys = this.parseObject.dirtyKeys();
      if (dirtyKeys.length > 0) {
        var edit = new Parse.Object.extend('edit');
        dirtyKeys.forEach(key => {
          edit.set(
            key,
            this.parseObject.get(key)
          );
        });
        edit.save(cb);
      }
    } else {
      this.parseObject.save();
    }
  }

  setEditMode(mode) {
    this.editMode = mode;
  }

  static fetch(id, cb) {
    var query = new Parse.Query(Book);
    query.equalTo('objectId', id);
    query.include('worldcat');
    query.include('googlebook');
    query.include('locations');
    query.find().then(results => {
      if (results) {
        cb(new FieldGuide(results[0]));
      }
      cb(null);
    });
  }
};

module.exports = FieldGuide;

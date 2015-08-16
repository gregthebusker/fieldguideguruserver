var Parse = require('parse').Parse;
var parseKeys = require('./parsekeys.js');
Parse.initialize(parseKeys.appId, parseKeys.jsKey);

var Book = Parse.Object.extend('fieldguide');

class FieldGuide {
  constructor(parseObject) {
    this.parseObject = parseObject;
    this.editMode = false;
    if (parseObject) {
      this.id = parseObject.id;
      this.googleBook = parseObject.get('googlebook');
      this.worldCat = parseObject.get('worldcat');
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

  getThumbnail() {
    var thumb = this.parseObject && this.parseObject.get('fgg_thumbnail');
    if (!thumb) {
      thumb = this.googleBook && this.googleBook.get('fgg_thumbnail');
    }
    if (!thumb) {
      thumb = this.worldCat && this.worldCat.get('fgg_thumbnail');
    }

    return thumb;
  }

  get(key) {
    var capKey = key.charAt(0).toUpperCase() + key.slice(1);
    if (this[`get${capKey}`]) {
      return this[`get${capKey}`](); 
    }
    return this.parseObject.get(key);
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
        return;
      }
      cb(null);
    });
  }
};

module.exports = FieldGuide;

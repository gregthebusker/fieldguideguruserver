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

  saveNew(cb=(()=>{})) {
    var book = new Book();
    this.googleBook.save().then(gb => {
      book.set({
        googlebook: gb,
        ISBN: gb.get(''),
        approved: false,
      });
      return book.save()
    }).then(() => {
        cb(book);
    });
  }

  setEditMode(mode) {
    this.editMode = mode;
  }

  getThumbnail() {
    return this.getProp('fgg_thumbnail', 'fgg_thumbnail', 'fgg_thumbnail');
  }

  getProp(key, googleKey, worldCatKey) {
    var prop = this.parseObject && this.parseObject.get(key);
    if (!prop) {
      prop = this.googleBook && this.googleBook.get(googleKey);
    }
    if (!prop) {
      prop = this.worldCat && this.worldCat.get(worldCatKey);
    }

    return prop;
  }

  getThumbUrl() {
    var thumb = this.getThumbnail();
    if (thumb) {
      return thumb.url();
    }

    return this.getProp('fgg_imagehref', 'fgg_imagehref', 'fgg_imagehref');
  }

  getDescription() {
    return this.getProp('description', 'volumeInfo_description');
  }

  getTitle() {
    var title = this.parseObject && this.parseObject.get('title');
    if (!title) {
      title = this.googleBook && this.googleBook.get('volumeInfo_title');
    }

    return title;
  }

  getId() {
    return (this.parseObject && this.parseObject.id) || (this.googleBook && this.googleBook.get('googleBookId')) || Math.random();
  }

  get(key) {
    var result = this.parseObject && this.parseObject.get(key);
    if (result) {
      return result;
    }

    var capKey = key.charAt(0).toUpperCase() + key.slice(1);
    if (this[`get${capKey}`]) {
      return this[`get${capKey}`](); 
    }

    return;
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

var flattenObject = require('./utility.js').flattenObject;
var Parse = require('parse').Parse;
var GoogleBook = Parse.Object.extend('googlebook');

module.exports = {
  // More details at https://developers.google.com/books/docs/v1/reference/volumes#resource
  googleToParse: (book) => {
    var data = flattenObject(book);
    if (book.volumeInfo.imageLinks) {
      data['fgg_imagehref'] = book.volumeInfo.imageLinks.thumbnail;
    }
    data.googleBookId = data.id;
    delete data.id;
    var goog = new GoogleBook();
    goog.set(data);
    return goog;
  },
};

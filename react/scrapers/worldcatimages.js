var callOnEach = require('./utility.js').callOnEach;
var saveImage = require('./utility.js').saveImage;
var parseKeys = require('./parsekeys.js');
var Parse = require('parse').Parse;

Parse.initialize(parseKeys.appId, parseKeys.jsKey, parseKeys.masterKey);

function main() {
  var WorldCat = Parse.Object.extend("worldcat");

  var query = new Parse.Query(WorldCat);
  query.exists("fgg_imagehref");
  query.doesNotExist("fgg_thumbnail");
  callOnEach(query, function(obj, cb) {
    saveImage(obj, obj.get('fgg_imagehref'), cb);
  }, true, false);
}

main();

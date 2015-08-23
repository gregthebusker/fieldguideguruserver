var Parse = require('parse').Parse;
var parseKeys = require('./parsekeys.js');
Parse.initialize(parseKeys.appId, parseKeys.jsKey);

module.exports = Parse;

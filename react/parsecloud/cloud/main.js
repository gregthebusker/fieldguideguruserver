var autoCompleteLocation = require('cloud/autoloc.js');

Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

Parse.Cloud.define("autoCompleteLocation", autoCompleteLocation);

var ScrapedEmail = Parse.Object.extend("scrapedemail");

Parse.Cloud.beforeSave("scrapedemail", function(request, response) {
  if (!request.object.get("email")) {
    response.error('Must have email.');
  } else {
    var query = new Parse.Query(ScrapedEmail);
    query.equalTo("email", request.object.get("email"));
    query.first({
      success: function(object) {
        if (object) {
          response.error("Already exists.");
        } else {
          response.success();
        }
      },
      error: function(error) {
        response.error("Error.");
      }
    });
  }
});

var LIMIT = 5;

var search = function(str, className) {
  var Obj = Parse.Object.extend(className);
  var query = new Parse.Query(Obj);
  query.contains('searchable_text', str);
  query.include('location');
  query.descending('clicks');
  query.limit(LIMIT);
  return query.find();
};

var searchCountry = function(str) {
  return search(str, 'country');
};


var searchState = function(str) {
  return search(str, 'state');
};

var autoCompleteLocation = function(request, response) {
  var text = request.params.text;

  var p = Parse.Promise.when(
    searchCountry(text),
    searchState(text)
  );

  p.then(function(results1, results2) {
    var getMapFunction = function(name) {
      return function(v, i) {
        var n = v.get(name);
        if (v.className == 'state') {
          n += ', ' + v.get('COUNTRY_CODE');
        }

        return {
          index: i,
          obj: v,
          className: v.className,
          name: n
        };
      };
    };

    var a = {
      items: results1.map(getMapFunction('COUNTRY_NAME')),
      title: 'Countries'
    };
    var b = {
      items: results2.map(getMapFunction('SUBNATIONAL1_NAME')),
      title: 'States'
    };
    response.success([a, b]);
  }, function(error) {
    response.error(error);
  });
};


module.exports = autoCompleteLocation;

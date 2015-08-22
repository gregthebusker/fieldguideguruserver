var Parse = require('parse').Parse;

var Entities = {
  Country: {
    parse: Parse.Object.extend('country'),
    key: 'country',
    getLabel: function(obj) {
      return obj.get('COUNTRY_NAME');
    }
  },
  State: {
    parse: Parse.Object.extend('state'),
    key: 'state',
    getLabel: function(obj) {
      var state = obj.get('SUBNATIONAL1_NAME');
      var country = obj.get('COUNTRY_CODE');
      return [state, country].join(', ');
    }
  },
  County : {
    parse: Parse.Object.extend('county'),
    key: 'county',
    getLabel: function(obj) {
      var county = obj.get('SUBNATIONAL2_NAME');
      var state = obj.get('SUBNATIONAL1_CODE');
      return [county, state].join(', ');
    }
  },
};

var ByArray = [
  Entities.Country,
  Entities.State,
  Entities.County
];

var getByParse = function(obj) {
  for (var key in Entities) {
    var entity = Entities[key];
    if (obj instanceof entity.parse) {
      return entity;
    }
  }
};

module.exports = {
  Entities: Entities,
  ByArray: ByArray,
  getByParse: getByParse
};

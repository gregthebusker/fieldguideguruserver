var Parse = require('parse').Parse;

var Entities = {
  Country: {
    parse: Parse.Object.extend('country'),
    key: 'country',
    getLabel(obj) {
      return obj.get('COUNTRY_NAME');
    }
  },
  State: {
    parse: Parse.Object.extend('state'),
    key: 'state',
    getLabel(obj) {
      var state = obj.get('SUBNATIONAL1_NAME');
      var country = obj.get('COUNTRY_CODE');
      return [state, country].join(', ');
    }
  },
  County : {
    parse: Parse.Object.extend('county'),
    key: 'county',
    getLabel(obj) {
      var county = obj.get('SUBNATIONAL2_NAME');
      var state = obj.get('SUBNATIONAL1_CODE');
      return [county, state].join(', ');
    }
  },
};

var getByParse = (obj) => {
  for (var entity of Entities) {
    if (obj instanceof entity.parse) {
      return entity;
    }
  }
};

module.exports = {
  getByParse: getByParse,
  Entities: Entities,
};

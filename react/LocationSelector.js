var React = require('react');
var LocationEntities = require('LocationEntities');
var Select = require('react-select');
var Parse = require('./Parse.js');

var LocationSelector = React.createClass({

  componentDidMount() {
    this.props.fieldguide.on('change', this.forceUpdate.bind(this));
  },

  componentDidUnmount() {
    this.props.fieldguide.removeListener('change', this.forceUpdate.bind(this));
  },

  makeOption(r) {
    return {
      value: r.id,
      label: r.get('label'),
      obj: r,
    };
  },

  getObjects() {
    var locations = this.props.fieldguide.parseObject.get('locations');
    return locations.filter(loc => {
      return loc.get('type') == this.props.location.key;
    });
  },

  onLocationChange(newValue, options) {
    var current = this.getObjects();
    var nextSet = options.map(o => o.obj) || [];

    var toRemove = current.filter(o => {
      return nextSet.indexOf(o) == -1;
    });
    var toAdd = nextSet.filter(o => {
      return current.indexOf(o) == -1;
    });

    this.props.fieldguide.addLocations(toAdd);
    this.props.fieldguide.removeLocations(toRemove);

    if (this.props.autoSave) {
      this.props.fieldguide.save();
    }
  },

  getLocations(input, callback) {
    var query = new Parse.Query(this.props.location.parse);
    query.contains('searchable_text', input.toLowerCase());
    query.include('location');
    query.find({
      success: (results) => {
        var selected = this.getObjects();
        var options = selected.map(this.makeOption);
        var ids = options.map(o => o.value);
        var moreOptions = results.filter(r => {
          return ids.indexOf(r.get('location').id) == -1;
        });

        options = options.concat(moreOptions.map(r => {
          return this.makeOption(r.get('location'));
        }));

        callback(null, {
          options: options,
        });
      },
      error: e => {
        console.log(e);
      },
    });
  },

  render() {
    var location = this.props.location;
    var values = this.getObjects().map(obj => obj.id);
    var options = this.getObjects().map(this.makeOption);
    return (
      <div>
        <h3>{location.key}</h3>
        <Select
          className="country-select"
          delimiter=","
          multi={true}
          value={values.join(',')}
          onChange={this.onLocationChange}
          options={options}
          asyncOptions={this.getLocations} 
        />
      </div>
    );
  },
});

module.exports = LocationSelector;

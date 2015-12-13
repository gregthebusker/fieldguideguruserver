var React = require('react');
var Paper = require('material-ui').Paper;
var Toolbar = require('material-ui').Toolbar;
var ToolbarGroup = require('material-ui').ToolbarGroup;
var DropDownMenu = require('material-ui').DropDownMenu;
var RaisedButton = require('material-ui').RaisedButton;
var FlatButton = require('material-ui').FlatButton;
var Dialog = require('material-ui').Dialog;
var TextField = require('material-ui').TextField;
var Snackbar = require('material-ui').Snackbar;
var Parse = require('parse').Parse;
var parseKeys = require('./parsekeys.js');
var ParseList = require('./parselist.js');
var Router = require('react-router');
var History = Router.History;
var LocationTypeahead = require('locationTypeahead');
var FieldGuide = require('./FieldGuide.js');

var PureRenderMixin = require('react-addons-pure-render-mixin');

Parse.initialize(parseKeys.appId, parseKeys.jsKey);


var Tile = React.createClass({
  mixins: [History],

  getInitialState() {
    return {
      hover: false,
    };
  },
  onClick() {
    this.history.push({
        pathname: `book-id/${this.props.item.id}`,
    });
  },

  onMouseOver() {
    this.setState({
      hover: true,
    });
  },

  onMouseOut() {
    this.setState({
      hover: false,
    });
  },

  render() {
    var item = this.props.item;
    var thumb = item.get('thumbnail');
    var image;
    if (thumb) {
      var style = {
        backgroundImage: 'url(' + thumb.url() + ')',
      };
      image = <div className="search-result-image" style={style} />;
    }

    return (
      <Paper
        zDepth={this.state.hover ? 3 : 1}
        className="search-result-card"
        key={item.get('ISBN')}
        onClick={this.onClick}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}>
          <div className="search-result-image-container">
            {image}
            <div className="search-result-overlay" />
          </div>
          <div
            className="search-result-content"
            title={item.get('title')}>
            {item.get('title')}
          </div>
      </Paper>
    );
  }
});

var ResultList = React.createClass({
  mixins: [History, PureRenderMixin],

  onAdd() {
    this.history.push({
        pathname: 'add',
    });
  },

  addMore() {
    console.log('adding more');
    return (
      <Paper
        zDepth={1}
        className="search-result-card add-more"
        key="addMore">
        <h6>
          Know a book we're missing?
        </h6>
        <RaisedButton onClick={this.onAdd} label="Add a book" primary={true} />
        <h6>
          Wished there was a book for something?
        </h6>
        <RaisedButton onClick={this.showWishModal} label="Tell us your wish" secondary={true} />
      </Paper>
    );
  },

  showWishModal() {
    this.refs.wishModal.show();
  },

  closeWishModal() {
    this.refs.location.clearSelection();
    this.refs.email.clearValue();
    this.refs.text.clearValue();
    this.refs.wishModal.dismiss();
  },

  onAddWish() {
    var text = this.refs.text.getValue();
    if (text) {
      var Wish = Parse.Object.extend('wish');
      var wish = new Wish();
      wish.set({
        text: text,
        email: this.refs.email.getValue(),
        location: this.refs.location.getSelection(),
      });
      wish.save(null, {
        success: (o) => {
          this.refs.text.clearValue();
          this.refs.snackbar.show();
        },
      });
    }
    this.closeWishModal();
  },

  render() {
    var actions = [
      <FlatButton
        label="Cancel"
        key="cancel"
        onTouchTap={this.closeWishModal}
      />,
      <FlatButton
        label="Add wish"
        key="add"
        primary={true}
        onTouchTap={this.onAddWish}
      />
    ];
    return (
      <div className="search-results">
        <h3 className="search-result-heading">{this.props.title}</h3>
        <ParseList
          query={this.props.query}
          renderFunction={(item) => {
            var fg = new FieldGuide(item);
            return <Tile key={item.id} item={fg} />;
          }}
          addMoreFunction={this.addMore}
        />
        <Dialog
          autoScrollBodyContent={true}
          ref="wishModal"
          title="What book would you like to see?"
          modal={true}
          actions={actions}>
          <div style={{
            height: '220px',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}>
            <TextField
              hintText="Tell us the title or the topic"
              ref="text"
              fullWidth={true}
              multiLine={true}
            />
            <LocationTypeahead
              ref="location"
            />
            <TextField
              hintText="email"
              ref="email"
              type="email"
            />
          </div>
        </Dialog>
        <Snackbar
          ref="snackbar"
          autoHideDuration={2000}
          message="Your wish has been made!"
        />
      </div>
    );
  }
});

var FilterBar = React.createClass({
  render() {
    var filterOptions = this.props.categories.map(v => {
      return {
        text: v.get('text'),
        id: v,
      };
    });

    filterOptions.splice(0, 0, {
      text: 'All',
    });

    return (
      <div className="toolbar">
        <Toolbar>
          <ToolbarGroup key={0} float="left">
            <DropDownMenu
              menuItems={filterOptions}
              onChange={this.props.onFilterChange}
            />
          </ToolbarGroup>
        </Toolbar>
      </div>
    );
  }
});

var i = 0;

var Search = React.createClass({
  componentWillMount() {
    mixpanel.track('Search Results');

    var Subject = Parse.Object.extend('subject');
    var query = new Parse.Query(Subject);
    query.ascending('text');
    query.find({
      success: (results) => {
        this.setState({
          subjects: results,
        });
      }
    });

    var Location = Parse.Object.extend('location');
    var subQuery = new Parse.Query(Location);
    subQuery.equalTo('objectId', this.props.params.locationId);

    var level = 4;
    var a = new Array(level);
    var include = a.join('.parents.location');
    subQuery.include('parents.location' + include);

    subQuery.first({
      success: (loc) => {
        var locations = [loc];

        var getParents = (loc) => {
          var parents = loc.get('parents') || [];
          locations = locations.concat(parents);
          parents.forEach(function(loc) {
            var subParents = getParents(loc);
            if (subParents) {
              locations = locations.concat(subParents);
            }
          });
        };
        getParents(loc);

        this.setState({
          parents: locations,
        });
      }
    });
  },

  getInitialState() {
    return {
      filter: undefined,
      subjects: [],
      parents: null,
    };
  },

  onFilterChange(e, selectedIndex, menuItem) {
    this.setState({
      filter: menuItem.id,
    });
  },

  render() {
    if (!this.state.parents) {
      return <div/>;
    }

    var FieldGuide = Parse.Object.extend('fieldguide');
    var query = new Parse.Query(FieldGuide);
    query.include('googlebook');
    query.include('worldcat');

    query.containedIn('locations', this.state.parents);

    if (this.state.filter) {
      query.equalTo('category_subject', this.state.filter);
    }


    var filterBar;
    if (this.state.subjects.length) {
      filterBar = (
        <FilterBar
          categories={this.state.subjects}
          onFilterChange={this.onFilterChange}
        />
      );
    }

    return (
      <div>
        {filterBar}
        <ResultList
          key={i++}
          title="Books"
          query={query}
        />
      </div>
    );
  }
});

module.exports = Search;

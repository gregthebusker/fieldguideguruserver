var React = require('react');
var Paper = require('material-ui').Paper;
var TextField = require('material-ui').TextField;
var RaisedButton = require('material-ui').RaisedButton;
var FieldGuide = require('FieldGuide');
var FieldGuideCard = require('FieldGuideCard');
var googleutils = require('scrapers/googleutils.js');

var AddEntityPage = React.createClass({
  componentWillMount() {
    mixpanel.track('Add entity page');
  },

  getInitialState() {
    return {
      noResults: false,
      fieldGuides: null,
    };
  },

  search() {
    this.setState({
      noResults: false,
      fieldGuides: null,
    });

    var q = this.refs.input.getValue();
    var books = gapi.client.books;
    books.volumes.list({
      q: q
    }).then((results) => {
      console.log('search results', results);
      var result = results.result;
      if (!result.totalItems) {
        this.setState({
          noResults: true,
        });
        return;
      }

      var googleBooks = result.items.map(googleutils.googleToParse);
      var guides = googleBooks.map(gb => {
        var guide = new FieldGuide();
        guide.googleBook = gb;
        return guide;
      });

      this.setState({
        fieldGuides: guides,
      });
    }.bind(this));
  },

  onAccept(fieldguide) {
    console.log(fieldguide);
    this.setState({
      toSave: fieldguide,
    });
  },

  render() {
    if (this.state.toSave) {
      return (
          <div>
            Saving...
          </div>
      );
    }


    var results;
    if (this.state.fieldGuides) {
      var results = this.state.fieldGuides.map(fg => {
        return (
          <FieldGuideCard
            key={fg.get('id')}
            guide={fg}
            onAccept={this.onAccept.bind(this, fg)}
          />
        );
      });
    }

    if (this.state.noResults) {
      results = "No Results";
    }
    return (
      <div>
        <Paper className="main-content" zDepth={1}>
          <div style={{
            overflow: 'hidden',
            marginBottom: '25px',
          }}>
            <TextField
              hintText="ISBN or Book Title"
              fullWidth={true}
              ref="input"
              floatingLabelText="ISBN or Book Title"
            />
            <RaisedButton
              style={{
                float: 'right',
              }}
              label="Search"
              primary={true}
              onClick={this.search}
            />
          </div>
          {results}
        </Paper>
      </div>
    );
  },
});

module.exports = AddEntityPage;

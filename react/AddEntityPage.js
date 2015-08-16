var React = require('react');
var Paper = require('material-ui').Paper;
var TextField = require('material-ui').TextField;
var RaisedButton = require('material-ui').RaisedButton;
var FieldGuide = require('FieldGuide');

var AddEntityPage = React.createClass({
  componentWillMount() {
    mixpanel.track('Add entity page');
  },

  getInitialState() {
    return {
      noResults: false,
    };
  },

  search() {
    var q = this.refs.input.getValue();
    var books = gapi.client.books;
    books.volumes.list({
      q: q
    }).then((results) => {
      var result = results.result;
      if (!result.totalItems) {
        this.setState({
          noResults: true,
        });
        return;
      }
      var googleBooks = results.items.map(googleutils.googToParse);
      var guides = googleBooks.map(gb => {
        var guide = new FieldGuide();
        guide.googleBook = googleBooks;
      });
      
      this.setState({
        fieldGuides: guides,
      });
    }.bind(this));
  },

  render() {
    var warnings;
    if (this.state.noResults) {
      warnings = "No Results";
    }
    return (
      <div>
        <Paper className="main-content" zDepth={1}>
          {warnings}
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
        </Paper>
      </div>
    );
  },
});

module.exports = AddEntityPage;

var React = require('react');
var Paper = require('material-ui').Paper;
var TextField = require('material-ui').TextField;
var RaisedButton = require('material-ui').RaisedButton;
var FieldGuide = require('FieldGuide');
var FieldGuideCard = require('FieldGuideCard');
var googleutils = require('scrapers/googleutils.js');
var Dialog = require('material-ui').Dialog;
var Loader = require('./Loader.js');
var Router = require('react-router');

var AddEntityPage = React.createClass({
  mixins: [Router.Navigation],

  componentWillMount() {
    mixpanel.track('Add entity page');
  },

  getInitialState() {
    return {
      noResults: false,
      fieldGuides: null,
      saving: false,
      selected: null,
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
    this.setState({
      saving: true,
    });

    fieldguide.saveNew(() => {
      this.setState({
        selected: fieldguide,
        saving: false,
      });
    });
  },

  addAnother() {
    this.setState(this.getInitialState());
  },

  goToStart() {
    this.transitionTo('start');
  },

  render() {
    var modal;
    if (this.state.saving) {
      modal = (
          <Dialog
            title="Saving Field Guide"
            modal={true}
            openImmediately={true}>
            <div style={{
              position: 'relative',
              width: '100%',
              height: '150px',
            }}>
              <Loader />
            </div>
          </Dialog>
      );
    } else if (this.state.selected) {
      var actions = [
        { text: 'Add Another', onTouchTap: this.addAnother},
        { text: 'Go Back', onTouchTap: this.goToStart}
      ];
      modal = (
          <Dialog
            title="What location is this book for?"
            actions={actions}
            modal={true}
            openImmediately={true}>
          </Dialog>
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
              onEnterKeyDown={this.search}
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
          {modal}
        </Paper>
      </div>
    );
  },
});

module.exports = AddEntityPage;

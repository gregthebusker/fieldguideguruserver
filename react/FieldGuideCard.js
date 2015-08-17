var React = require('react');
var FlatButton = require('material-ui').FlatButton;

var FieldGuideCard = React.createClass({
  render() {
    var fg = this.props.guide;
    return (
      <div className="fgg-card">
        <div className="fgg-card-image">
          <img src={fg.getThumbUrl()} />
        </div>
        <div className="fgg-card-details">
          <h3>
            {fg.get('title')}
          </h3>
          <p>
            {fg.get('description')}
          </p>
          <FlatButton
            primary={true}
            label="Add This Field Guide"
            onClick={this.props.onAccept}
          />
        </div>
      </div>
    );
  },
});

module.exports = FieldGuideCard;

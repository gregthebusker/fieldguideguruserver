var React = require('react');


var Footer = React.createClass({
  render() {
    return (
      <div className="mdl-mini-footer">
        <div className="mdl-mini-footer__left-section">
          <div className="mdl-logo">Field Guide Guru</div>
          <ul className="mdl-mini-footer__link-list">
            <li>About</li>
            <li>Blog</li>
          </ul>
        </div>
      </div>
    );
  },
});

module.exports = Footer;

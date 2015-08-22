var React = require('react');
var SvgIcon = require('material-ui').SvgIcon;
var ThemeManager = require('material-ui').Styles.ThemeManager();

var Binoculars = React.createClass({
  render: function() {
    return (
      <SvgIcon {...this.props}>
        <svg viewBox="0 0 1024 1024">
          <path d="M64 0h384v64h-384zM576 0h384v64h-384zM952 320h-56v-256h-256v256h-256v-256h-256v256h-56c-39.6 0-72 32.4-72 72v560c0 39.6 32.4 72 72 72h304c39.6 0 72-32.4 72-72v-376h128v376c0 39.6 32.4 72 72 72h304c39.6 0 72-32.4 72-72v-560c0-39.6-32.4-72-72-72zM348 960h-248c-19.8 0-36-14.4-36-32s16.2-32 36-32h248c19.8 0 36 14.4 36 32s-16.2 32-36 32zM544 512h-64c-17.6 0-32-14.4-32-32s14.4-32 32-32h64c17.6 0 32 14.4 32 32s-14.4 32-32 32zM924 960h-248c-19.8 0-36-14.4-36-32s16.2-32 36-32h248c19.8 0 36 14.4 36 32s-16.2 32-36 32z"></path>
        </svg>
      </SvgIcon>
    );
  }
});

var MainIcon = React.createClass({
  render: function() {
    var fill = ThemeManager.getCurrentTheme()
      .component.appBar.textColor;
    return (
      <Binoculars color={fill} style={{
        marginRight: '5px'
      }}/>
    );
  }
});

module.exports = MainIcon;

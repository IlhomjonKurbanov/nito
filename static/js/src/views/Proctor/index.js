var React = require('react');
var ACL = require('../../lib/ACL.js');
var Router = require('react-router');
var { RouteHandler, Link } = Router;

var Header = require('../Header.js');
var GridView = require('./GridView.js');

var index = React.createClass({
  mixins: [ ACL('proctor') ],
  render: function () {
    return (
      <div style={this.styles.container}>
        <Header title="Proctor Station" />
        <div style={this.styles.main}>
          <RouteHandler />
        </div>
      </div>);
  },

  styles: {
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexFlow: 'column',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    main: {
      order: 2,
      flexGrow: 1,
      display: 'flex',
      width: '100%'
    }
  }
});

index.Home = require('./Home.js');
index.A = require('./A.js');
index.B = require('./B.js');

module.exports = index;

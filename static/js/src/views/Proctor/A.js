var React = require('react');
var Router = require('react-router');
var { Link } = Router;

var GridView = require('./GridView.js');

module.exports = React.createClass({
  render: function () {
    return <GridView cols={3} />;
  },

  styles: {
  }
});

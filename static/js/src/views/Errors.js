var React = require('react');

module.exports = {};

module.exports.http404 = React.createClass({
  render: function () {
    return <h1>404 Not Found</h1>;
  }
});

module.exports.http403 = React.createClass({
  render: function () {
    return <h1>Forbidden</h1>;
  }
});

var React = require('react');
var Authentication = require('../../lib/ACL.js');

module.exports = React.createClass({
  mixins: [ Authentication('proctor') ],

  render: function () {
    return <h1>Proctors only page</h1>;
  }
});

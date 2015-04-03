var React = require('react');
var Authentication = require('../../lib/ACL.js');

module.exports = React.createClass({
  mixins: [ Authentication('student') ],

  render: function () {
    return <h1>Students only page</h1>;
  }
});

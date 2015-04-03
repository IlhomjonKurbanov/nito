var React = require('react');
var ACL = require('../../lib/ACL.js');

module.exports = React.createClass({
  mixins: [ ACL('student') ],

  render: function () {
    return <h1>Students only page</h1>;
  }
});

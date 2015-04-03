var React = require('react');
var ACL = require('../../lib/ACL.js');

module.exports = React.createClass({
  mixins: [ ACL('proctor') ],

  render: function () {
    return <h1>Proctors only page</h1>;
  }
});

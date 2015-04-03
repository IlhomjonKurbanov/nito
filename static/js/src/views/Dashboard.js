var React = require('react');
var Authentication = require('../lib/ACL.js');

module.exports = React.createClass({
  mixins: [ Authentication() ],

  render: function () {
    var token = auth.getToken();
    return (
      <div>
        <h1>Dashboard</h1>
        <p>You made it!</p>
        <p>{token}</p>
      </div>
    );
  }
});

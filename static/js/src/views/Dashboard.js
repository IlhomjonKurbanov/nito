var React = require('react');
var ACL = require('../lib/ACL.js');
var auth = require('../lib/Auth.js')

module.exports = React.createClass({
  mixins: [ ACL() ],

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

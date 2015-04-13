var React = require('react');
var Router = require('react-router');
var { Link } = Router;

module.exports = React.createClass({
  render: function () {
    return (
      <div style={this.styles.container}>
        <Link to="proctor-a" className="round-btn">Proctor A</Link>
        <Link to="proctor-b" className="round-btn">Proctor B</Link>
      </div>);
  },

  styles: {
    container: {
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center'
    }
  }
});

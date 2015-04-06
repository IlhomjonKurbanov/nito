var React = require('react');
var ACL = require('../../lib/ACL.js');
var Router = require('react-router');
var { Link } = Router;

var GridView = require('./GridView.js');

module.exports = React.createClass({
  mixins: [ ACL('proctor') ],

  render: function () {
    return (
      <div style={this.styles.container}>
        <header style={this.styles.header}>
          <div>
            <img src="/images/logo_white.png" className="valign-middle" height="20" />
            <span className="valign-middle" style={this.styles.subtitle}>Proctor Station A</span>
            </div>
          <div className="headerbar-dropdown">
            <div style={this.styles.avatar} className="valign-middle"></div>
            <span style={this.styles.username} className="valign-middle">Angela Warner</span><span className="valign-middle"><i className="fa fa-caret-down"></i></span>
            <div className="dropdown-menu">
              <ul>
                <li><Link to="dashboard">Dashboard</Link></li>
                <li><Link to="signout">Sign out</Link></li>
              </ul>
            </div>
          </div>
        </header>
        <div style={this.styles.main}>
          <GridView />
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
    header: {
      order: 1,
      height: 40,
      width: '100%',
      backgroundColor: '#3b3b3b',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 10px 0 20px',
      color: '#aaa',
      fontWeight: 200,
      fontSize: 12
    },
    subtitle: {
      textTransform: 'uppercase',
      marginLeft: 10
    },
    avatar: {
      background: 'url(/images/angela_avatar.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'inline-block',
      width: 25,
      height: 25,
      borderRadius: '50%'
    },
    username: {
      margin: '0 10px',
    },
    main: {
      order: 2,
      flexGrow: 1,
      display: 'flex',
      width: '100%'
    }
  }
});

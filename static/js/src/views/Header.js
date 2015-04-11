var React = require('react');
var Router = require('react-router');
var { Link } = Router;

module.exports = React.createClass({
  getInitialProps: function() {
    return {
      title: ''
    }
  },
  render: function() {
    return (
      <header style={this.styles.header}>
        <div>
          <img src="/images/logo_white.png" className="valign-middle" height="20" />
          <span className="valign-middle" style={this.styles.subtitle}>{this.props.title}</span>
          </div>
        <div className="headerbar-dropdown">
          <div style={this.styles.avatar} className="valign-middle"></div>
          <span style={this.styles.username} className="valign-middle">Angela Warner</span><span className="valign-middle"><i className="fa fa-caret-down"></i></span>
          <div className="dropdown-menu">
            <ul>
              <li><Link to="proctor">Proctor Menu</Link></li>
              <li><Link to="dashboard">Dashboard</Link></li>
              <li><Link to="signout">Sign out</Link></li>
            </ul>
          </div>
        </div>
      </header>
    );
  },
  styles: {
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
    }
  }
});

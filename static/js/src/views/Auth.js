var React = require('react');
var auth = require('../lib/Auth.js');

module.exports = {};

module.exports.Signin = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      error: false
    };
  },

  handleSubmit: function (event) {
    event.preventDefault();
    var { router } = this.context;
    var nextPath = router.getCurrentQuery().r;
    var email = this.refs.email.getDOMNode().value;
    var pass = this.refs.pass.getDOMNode().value;
    auth.signin(email, pass, function (signedIn) {
      if (!signedIn) {
        this.refs.pass.getDOMNode().value = ''; // clear pw field as per convention
        return this.setState({ error: true });
      }

      if (nextPath) {
        router.replaceWith(nextPath);
      } else {
        router.replaceWith('/dashboard');
      }
    }.bind(this));
  },

  render: function () {
    var errors = this.state.error ? <p className="error">The email or password you entered was incorrect.</p> : '';
    return (
      <div style={this.styles.container}>
        <div className="card" style={this.styles.card}>
          <h1 style={this.styles.title}>Sign In</h1>
          {errors}
          <form style={this.styles.form} onSubmit={this.handleSubmit}>
            <div>
              <input ref="email" type="email" placeholder="Email" />
            </div>
            <div>
              <input ref="pass" type="password" placeholder="Password is pw" />
            </div>
            <button style={this.styles.signinBtn} type="submit">Sign In</button>
            {/*
            <div>
              <label><input type="checkbox" /> Remember Me</label>
            </div>
            <div>
              <a>Sign Up</a>
              <a>Forgot password?</a>
            </div>
            */}
          </form>
        </div>
      </div>
    );
  },

  styles: {
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    card: {
      width: 320,
      margin: '30px auto'
    },
    title: {
      marginBottom: 20
    },
    form: {
      paddingTop: 20
    },
    signinBtn: {
      width: '100%',
      marginTop: 20
    }
  }
});

module.exports.Signout = React.createClass({
  componentDidMount: function () {
    auth.signout();
  },

  render: function () {
    return <p>You are now signed out</p>;
  }
});

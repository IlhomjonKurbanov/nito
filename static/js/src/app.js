var React = require('react');
var Router = require('react-router');
var auth = require('./lib/Auth.js');
var { Route, RouteHandler, Link } = Router;

var Authentication = require('./lib/ACL.js');

var App = React.createClass({
  getInitialState: function () {
    return {
      signedIn: auth.signedIn()
    };
  },

  setStateOnAuth: function (signedIn) {
    this.setState({
      signedIn: signedIn
    });
  },

  componentWillMount: function () {
    auth.onChange = this.setStateOnAuth;
    auth.signin();
  },

  render: function () {
    var signInOrOut = this.state.signedIn ?
      <Link to="signout">Sign out</Link> :
      <Link to="signin">Sign in</Link>;
    return (
      <div>
        <ul>
          <li>{signInOrOut}</li>
          <li><Link to="dashboard">Dashboard (everyone)</Link></li>
          <li><Link to="students">Students only</Link></li>
          <li><Link to="proctors">Proctors only</Link></li>
        </ul>
        <RouteHandler/>
      </div>
    );
  }
});

var Signin = React.createClass({

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
      if (!signedIn)
        return this.setState({ error: true });

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
              <input ref="email" placeholder="Email" />
            </div>
            <div>
              <input ref="pass" placeholder="Password is pw" />
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

var Error = React.createClass({
  render: function () {
    return <h1>There was an error</h1>;
  }
});

var Signout = React.createClass({
  componentDidMount: function () {
    auth.signout();
  },

  render: function () {
    return <p>You are now signed out</p>;
  }
});

var Views = {
  Dashboard: require('./views/Dashboard.js'),
  Student: require('./views/Student/Home.js'),
  Proctor: require('./views/Proctor/Home.js')
};

var routes = (
  <Route handler={App}>
    <Route name="signin" handler={Signin}/>
    <Route name="signout" handler={Signout}/>
    <Route name="dashboard" handler={Views.Dashboard}/>
    <Route name="students" handler={Views.Student}/>
    <Route name="proctors" handler={Views.Proctor}/>
    <Route name="error" handler={Error}/>
  </Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler) {
  React.render(<Handler/>, document.getElementById('main'));
});

var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, Link } = Router;

var App = React.createClass({
  getInitialState: function () {
    return {
      loggedIn: auth.loggedIn()
    };
  },

  setStateOnAuth: function (loggedIn) {
    this.setState({
      loggedIn: loggedIn
    });
  },

  componentWillMount: function () {
    auth.onChange = this.setStateOnAuth;
    auth.login();
  },

  render: function () {
    var loginOrOut = this.state.loggedIn ?
      <Link to="logout">Log out</Link> :
      <Link to="login">Sign in</Link>;
    return (
      <div>
        <ul>
          <li>{loginOrOut}</li>
          <li><Link to="dashboard">Dashboard (everyone)</Link></li>
          <li><Link to="students">Students only</Link></li>
          <li><Link to="proctors">Proctors only</Link></li>
        </ul>
        <RouteHandler/>
      </div>
    );
  }
});

var Authentication = function(acl) {
  return {
    statics: {
      willTransitionTo: function (transition) {
        var nextPath = transition.path;
        if (!auth.loggedIn()) {
          transition.redirect('/login',{},
            { 'r' : nextPath });
        } else if (acl && auth.acl() !== acl) {
          transition.redirect('/error');
        }
      }
    }
  };
};

var Login = React.createClass({

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
    auth.login(email, pass, function (loggedIn) {
      if (!loggedIn)
        return this.setState({ error: true });

      if (nextPath) {
        router.replaceWith(nextPath);
      } else {
        router.replaceWith('/dashboard');
      }
    }.bind(this));
  },

  render: function () {
    var errors = this.state.error ? <p>Bad login information</p> : '';
    return (
      <form onSubmit={this.handleSubmit}>
        <label><input ref="email" placeholder="email" /></label>
        <label><input ref="pass" placeholder="password" /></label> (hint: password1)<br/>
        <button type="submit">login</button>
        {errors}
      </form>
    );
  }
});

var Dashboard = React.createClass({
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

var Students = React.createClass({
  mixins: [ Authentication('student') ],

  render: function () {
    return <h1>Students only page</h1>;
  }
});

var Proctors = React.createClass({
  mixins: [ Authentication('proctor') ],

  render: function () {
    return <h1>Proctors only page</h1>;
  }
});

var Error = React.createClass({
  render: function () {
    return <h1>There was an error</h1>;
  }
});

var Logout = React.createClass({
  componentDidMount: function () {
    auth.logout();
  },

  render: function () {
    return <p>You are now logged out</p>;
  }
});


// Fake authentication lib

var auth = {
  login: function (email, pass, cb) {
    cb = arguments[arguments.length - 1];
    if (localStorage.token) {
      if (cb) cb(true);
      this.onChange(true);
      return;
    }
    pretendRequest(email, pass, function (res) {
      if (res.authenticated) {
        localStorage.token = res.token;
        localStorage.acl = res.acl;
        if (cb) cb(true);
        this.onChange(true);
      } else {
        if (cb) cb(false);
        this.onChange(false);
      }
    }.bind(this));
  },

  getToken: function () {
    return localStorage.token;
  },

  logout: function (cb) {
    delete localStorage.token;
    if (cb) cb();
    this.onChange(false);
  },

  loggedIn: function () {
    return !!localStorage.token;
  },

  acl: function() {
    return localStorage.acl;
  },

  onChange: function () {}
};

function pretendRequest(email, pass, cb) {
  setTimeout(function () {
    if (email === 'angela@proxor.com' && pass === 'pw') {
      cb({
        authenticated: true,
        acl: 'proctor',
        token: Math.random().toString(36).substring(7)
      });
    } else if (email === 'james@school.edu' && pass === 'pw') {
      cb({
        authenticated: true,
        acl: 'student',
        token: Math.random().toString(36).substring(7)
      });
    } else {
      cb({authenticated: false});
    }
  }, 0);
}

var routes = (
  <Route handler={App}>
    <Route name="login" handler={Login}/>
    <Route name="logout" handler={Logout}/>
    <Route name="dashboard" handler={Dashboard}/>
    <Route name="students" handler={Students}/>
    <Route name="proctors" handler={Proctors}/>
    <Route name="error" handler={Error}/>
  </Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler) {
  React.render(<Handler/>, document.getElementById('main'));
});

var React = require('react');
var Router = require('react-router');
var auth = require('./lib/Auth.js');
var { Route, RouteHandler, Link } = Router;

var Authentication = require('./lib/ACL.js');

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
        <label><input ref="pass" placeholder="password" /></label> (hint: pw)<br/>
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

var Views = {
  Student: require('./views/Student/Home.js')
};

var routes = (
  <Route handler={App}>
    <Route name="login" handler={Login}/>
    <Route name="logout" handler={Logout}/>
    <Route name="dashboard" handler={Dashboard}/>
    <Route name="students" handler={Views.Student}/>
    <Route name="proctors" handler={Proctors}/>
    <Route name="error" handler={Error}/>
  </Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler) {
  React.render(<Handler/>, document.getElementById('main'));
});

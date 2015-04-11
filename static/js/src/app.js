var React = require('react');
var Router = require('react-router');
var auth = require('./lib/Auth.js');
var { Route, DefaultRoute, NotFoundRoute, RouteHandler, Link } = Router;

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
          <li><Link to="test">Students only</Link></li>
          <li><Link to="proctor">Proctors only</Link></li>
        </ul>
        <RouteHandler/>
      </div>
    );
  }
});

var Views = {
  Auth: require('./views/Auth.js'),
  Errors: require('./views/Errors.js'),
  Dashboard: require('./views/Dashboard.js'),
  Student: require('./views/Student/Home.js'),
  Proctor: require('./views/Proctor/index.js')
};

var routes = (
  <Route handler={App}>
    <Route name="signin" handler={Views.Auth.Signin}/>
    <Route name="signout" handler={Views.Auth.Signout}/>
    <Route name="dashboard" handler={Views.Dashboard}/>
    <Route name="test" handler={Views.Student}/>
    <Route name="proctor" handler={Views.Proctor}>
      <Route name="proctor-a" path="a" handler={Views.Proctor.A}/>
      <Route name="proctor-b" path="b" handler={Views.Proctor.B}/>
      <DefaultRoute handler={Views.Proctor.Home}/>
    </Route>
    <Route name="error" handler={Views.Errors.http403}/>
    <NotFoundRoute handler={Views.Errors.http404} />
  </Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler) {
  React.render(<Handler/>, document.getElementById('main'));
});

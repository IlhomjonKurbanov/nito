var auth = require('./Auth.js');

module.exports = function(acl) {
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

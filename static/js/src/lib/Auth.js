module.exports = {
  signin: function (email, pass, cb) {
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

  signout: function (cb) {
    delete localStorage.token;
    if (cb) cb();
    this.onChange(false);
  },

  signedIn: function () {
    return !!localStorage.token;
  },

  acl: function() {
    return localStorage.acl;
  },

  onChange: function () {}
};

function pretendRequest(email, pass, cb) {
  setTimeout(function () {
    if ((email === 'angela.warner@proxor.com' || email === 'aw@proxor.com') && pass === 'pw') {
      cb({
        authenticated: true,
        acl: 'proctor',
        token: Math.random().toString(36).substring(7)
      });
    } else if (email === 'jlibby@asu.edu' && pass === 'pw') {
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

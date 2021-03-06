var React = require('react');
var ACL = require('../../lib/ACL.js');
Object.assign = require('object-assign');

module.exports = React.createClass({
  mixins: [ ACL('proctor') ],
  getDefaultProps: function() {
    return {
      cols: 3
    }
  },
  getInitialState: function() {
    return {
      screens: [
        {
          id: '3819',
          warn: false
        },
        {
          id: '1048',
          warn: false
        },
        {
          id: '1058',
          warn: false
        },
        {
          id: '1742',
          warn: false
        },
        {
          id: 'live',
          warn: false
        },
        {
          id: '2293',
          warn: false
        },
        {
          id: '1849',
          warn: false
        },
        {
          id: '3823',
          warn: false
        },
        {
          id: '3932'
        }
      ],
      currentMenuShown: -1,
      warn: [],
      videoPlaying: false
    };
  },
  componentDidMount: function() {
    var self = this;
    this._socket = io.connect(window.location.origin);
    this._socket.on('start', function(data) {
      self.setState({
        videoPlaying: true,
        proctorId: data.proctorId
      });
    });
    this._socket.on('pause', function(data) {
      self.setState({
        videoPlaying: false
      });
    });
  },
  render: function () {
    var screens = this.state.screens.map(function(screen){
      return (<VideoScreen id={screen.id}
                          key={screen.id}
                          warn={this.state.warn.indexOf(screen.id) !== -1}
                          showMenu={this.showMenu}
                          isMenuVisible={this.state.currentMenuShown == screen.id}
                          hideMenu={this.hideMenu}
                          reportId={this.reportId}
                          duration={600}
                          examName="SDE 001 C"
                          videoPlaying={this.state.videoPlaying} />);
    }.bind(this));

    // split into rows
    var rows = splitarray(screens, this.props.cols).map(function(row) {
      return (
        <div style={this.styles.row}>
          {row}
        </div>);
    }.bind(this));

    return (
      <div style={this.styles.container}>
        {rows}
      </div>);
  },
  showMenu: function(id) {
    this.setState({
      currentMenuShown: id
    })
  },
  hideMenu: function() {
    this.setState({
      currentMenuShown: -1
    });
  },
  reportId: function(id, reason, time) {
    // make screen red for a second
    var newWarn = this.state.warn;
    newWarn.push(id);
    this.setState({
      warn: newWarn
    });

    // hmm how to do this better
    window.setTimeout(function() {
      var newWarn = this.state.warn;
      var i = newWarn.indexOf(id);
      newWarn.splice(i, 1);
      this.setState({
        warn: newWarn
      })
    }.bind(this), 1000);

    this._socket.emit('report', {
      ttId: id,
      reason: reason,
      time: time,
      proctorId: this.state.proctorId
    });
    console.log(`Report ${id} for ${reason} at ${time} to server`);
  },
  styles: {
    container: {
      display: 'flex',
      alignContent: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      flex: 1,
      backgroundColor: '#222'
    },
    row: {
      display: 'flex',
      alignContent: 'center',
      justifyContent: 'center',
    }
  }
});

var VideoScreen = React.createClass({
  getDefaultProps: function() {
    return {
      width: 300,
      height: 200,
      duration: 0,
      warn: false
    }
  },
  getInitialState: function() {
    return {
      src: '',
      currentTime: 0,
      duration: 0,
      timerStarted: false
    }
  },
  _startTimer: function() {
    if (this.state.timerStarted) return;

    var start = new Date().getTime();

    window.setInterval(function() {
      var time = new Date().getTime() - start;
      this.setState({currentTime: time / 1000});
    }.bind(this), 200);

    this.setState({timerStarted: true});
  },
  componentDidMount: function() {
    var vidTag = this.refs.video.getDOMNode();
    var vidContainerTag = this.refs.videoContainer.getDOMNode();

    if (this.props.id === 'live') {
      var webrtc = new SimpleWebRTC({
        // the id/element dom element that will hold "our" video
        localVideoEl: '',
        // the id/element dom element that will hold remote videos
        remoteVideosEl: '',
        // immediately ask for camera access
        autoRequestMedia: true
      });
      webrtc.on('readyToCall', function () {
        // you can name it anything
        webrtc.joinRoom('nito_test');
      });

      webrtc.on('videoAdded', function (video, peer) {
        video.style.width = this.props.width + 'px';
        video.style.height = this.props.height + 'px';
        vidContainerTag.removeChild(vidContainerTag.querySelector('video'));
        vidContainerTag.appendChild(video);
      }.bind(this));

    } else {
      // mute the video
      vidTag.muted = true;

      // get total duration
      this.setState({
        duration: vidTag.duration
      })

      // timeupdate
      vidTag.addEventListener('timeupdate', function() {
        this.setState({
          currentTime: vidTag.currentTime
        });
      }.bind(this));
    }
  },
  componentDidUpdate: function(prevProps, prevState) {
    if (this.props.id !== 'live') {
      var vidTag = this.refs.video.getDOMNode();
      // use play/paused props to play or pause video
      if (this.props.videoPlaying) {
        vidTag.play();
      } else {
        vidTag.pause();
      }
    } else {
        if (this.props.videoPlaying) this._startTimer();
    }
  },
  render: function() {
    var frameStyle = Object.assign({
      background: this.props.warn ? '#ca252f' : ''
    }, this.styles.frame);
    var videoStyle = Object.assign({
      width: this.props.width,
      height: this.props.height
    }, this.styles.video);

    var menu;
    if (this.props.isMenuVisible) {
      menu = (
        <div style={this.styles.menu}>
          <ReportButton id="people" onClick={this._reportButtonClick}>People</ReportButton>
          <ReportButton id="environment" onClick={this._reportButtonClick}>Environment</ReportButton>
          <ReportButton id="eyeHead" onClick={this._reportButtonClick}>Eye/head</ReportButton>
          <ReportButton id="other" onClick={this._reportButtonClick}>Other</ReportButton>
          <ReportButton id="cancel" onClick={this._reportButtonClick}>Cancel</ReportButton>
        </div>);
    }

    return (
      <div style={frameStyle} onClick={this._click}>
        <div style={this.styles.videoWrap} ref="videoContainer">
          <video style={videoStyle}
                  ref="video"
                  src={`http://${this.props.id}.stream.nito.me/stream/video/${this.props.id}.webm`} />
          {menu}
        </div>
        <div style={this.styles.caption}>
          <span>{this.props.id} - {this.props.examName}</span>
          <span>{secondToMMSS(this.state.currentTime)}/-{secondToMMSS(this.props.duration - this.state.currentTime)}</span>
        </div>
      </div>);
  },
  _click: function() {
    this.props.showMenu(this.props.id);
  },
  _reportButtonClick: function(btnClicked) {
    if (btnClicked !== 'cancel') {
      this.props.reportId(this.props.id, btnClicked, this.state.currentTime);
    }
    this.props.hideMenu(this.props.id);
  },
  styles: {
    frame: {
      margin: 10,
      padding: 3,
      transition: 'background 0.2s'
    },
    videoWrap: {
      position: 'relative'
    },
    caption: {
      color: '#aaa',
      fontSize: 12,
      marginTop: 3,
      display: 'flex',
      justifyContent: 'space-between'
    },
    menu: {
      position: 'absolute',
      background: 'rgba(0,0,0,0.5)',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      top:0,
    }
  }
});

var ReportButton = React.createClass({
  _btnStyle: {
    button: {
      width: 150
    },
    people: {
      order: 1,
      width: '43%'
    },
    clearDesk: {
      order: 2,
      width: '43%'
    },
    outView: {
      order: 3,
      width: '43%'
    },
    other: {
      order: 4,
      width: '43%'
    },
    cancel: {
      order: 5,
      width: '90%'
    }
  },
  render: function() {
    var buttonStyle = Object.assign(this._btnStyle.button, this._btnStyle[this.props.id]);
    return (
      <button onClick={this._click} style={buttonStyle} className="gridview-reportButton">
        {this.props.children}
      </button>
    );
  },
  _click: function(event) {
    if(this.props.onClick) {
      this.props.onClick(this.props.id);
    }
    event.stopPropagation();
  }
});

var secondToMMSS = function(s) {
  s = Math.round(s);
  var minutes = parseInt( s / 60 );
  var seconds = s % 60;

  var minStr = minutes < 10 ? '0' + minutes : minutes;
  var secStr = seconds  < 10 ? '0' + seconds : seconds;

  return `${minStr}:${secStr}`;
}

var splitarray = function(input, spacing) {
  var output = [];

  for (var i = 0; i < input.length; i += spacing) {
    output[output.length] = input.slice(i, i + spacing);
  }

  return output;
}

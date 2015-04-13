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
          id: 'nocheat-1',
          warn: false
        },
        {
          id: 'nocheat-2',
          warn: false
        },
        {
          id: 'nocheat-3',
          warn: false
        },
        {
          id: 'nocheat-4',
          warn: false
        },
        {
          id: 'nocheat-5',
          warn: false
        },
        {
          id: 'nocheat-6',
          warn: false
        },
        {
          id: 'cheat-1',
          warn: false
        },
        {
          id: '30572947',
          warn: false
        },
        {
          id: '30298943',
          warn: false
        },
      ],
      currentMenuShown: -1,
      warn: []
    };
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
                          examName="SDE 001 C" />);
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
      duration: 0
    }
  },
  componentDidMount: function() {
    var vidTag = this.refs.video.getDOMNode();

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
          <ReportButton id="clearDesk" onClick={this._reportButtonClick}>Clear desk</ReportButton>
          <ReportButton id="outView" onClick={this._reportButtonClick}>Out of view</ReportButton>
          <ReportButton id="other" onClick={this._reportButtonClick}>Other</ReportButton>
          <ReportButton id="cancel" onClick={this._reportButtonClick}>Cancel</ReportButton>
        </div>);
    }

    return (
      <div style={frameStyle} onClick={this._click}>
        <div style={this.styles.videoWrap}>
          <video style={videoStyle}
                  ref="video"
                  autoPlay="autoplay"
                  src={`/stream/video/${this.props.id}.webm`} />
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
    var buttonStyle = this._btnStyle[this.props.id];
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

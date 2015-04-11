var React = require('react');
var ACL = require('../../lib/ACL.js');
Object.assign = require('object-assign');

module.exports = React.createClass({
  mixins: [ ACL('proctor') ],
  getDefaultProps: function() {
    return {
      rows: 3,
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
          id: '30483627',
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
      currentMenuShown: -1
    };
  },
  render: function () {
    var screens = this.state.screens.map(function(screen){
      return (<VideoScreen id={screen.id}
                          key={screen.id}
                          warn={screen.warn}
                          showMenu={this.showMenu}
                          isMenuVisible={this.state.currentMenuShown == screen.id}
                          hideMenu={this.hideMenu}
                          reportId={this.reportId} />);
    }.bind(this));

    return (
      <div style={this.styles.container}>
        {screens}
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
  reportId: function(id, reason) {
    console.log(`Report ${id} for ${reason} to server`);
  },
  styles: {
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      alignContent: 'center',
      justifyContent: 'center',
      flex: 1,
      backgroundColor: '#222'
    }
  }
});

var VideoScreen = React.createClass({
  getDefaultProps: function() {
    return {
      width: 300,
      height: 200
    }
  },
  getInitialState: function() {
    return {
      warn: false
    }
  },
  render: function() {
    var frameStyle = Object.assign({
      background: this.state.warn ? '#ca252f' : ''
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
                  autoPlay="autoplay"
                  src={`/media/video/${this.props.id}.mov`} />
          {menu}
        </div>
        <div style={this.styles.caption}>
          <span>{this.props.id}</span>
        </div>
      </div>);
  },
  _click: function() {
    this.props.showMenu(this.props.id);
  },
  _reportButtonClick: function(btnClicked) {
    if (btnClicked !== 'cancel') {
      this.props.reportId(this.props.id, btnClicked);
    }
    this.props.hideMenu(this.props.id);
  },
  styles: {
    frame: {
      margin: 10,
      padding: 3
    },
    videoWrap: {
      position: 'relative'
    },
    caption: {
      color: '#aaa',
      fontSize: 12,
      marginTop: 3
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

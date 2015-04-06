var React = require('react');
var ACL = require('../../lib/ACL.js');
Object.assign = require('object-assign');

module.exports = React.createClass({
  mixins: [ ACL('proctor') ],

  render: function () {
    var videos = [];

    var ids = ['30278125','30273381','30273392','30278144','30279313','30285943','30483627','30572947','30298943'];
    ids.forEach(function(id){
      videos.push(<VideoScreen id={id} />);
    });

    return (
      <div style={this.styles.container}>
        {videos}
      </div>);
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
      warn: false,
      menuShow: false
    }
  },
  render: function() {
    var frameStyle = Object.assign({
      background: this.state.warn ? '#ca252f' : ''
    }, this.styles.frame);
    var videoStyle = Object.assign({
      width: this.props.width,
      height: this.props.height,
      backgroundImage: `url(/images/video/${this.props.id}.jpg)`
    }, this.styles.video);

    var menu;
    if (this.state.menuShow) {
      menu = (
        <div style={this.styles.menu}>
          menu
        </div>);
    }

    return (
      <div style={frameStyle} onClick={this._onVideoClick}>
        <div style={videoStyle}>
          {menu}
        </div>
        <div style={this.styles.caption}>
          <span>{this.props.id}</span>
        </div>
      </div>);
  },
  _onVideoClick: function() {
    this.setState({
      menuShow: true
    });
  },
  styles: {
    frame: {
      margin: 10,
      padding: 3
    },
    video: {
      position: 'relative',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
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
    }
  }
});

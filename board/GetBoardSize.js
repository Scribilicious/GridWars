import React, { Component } from 'react';
import sizeMe from 'react-sizeme';

class MyComponent extends Component {
  render() {
    const { width } = this.props.size;

    return (
      <div style={{
        width: '100%',
        backgroundColor: '#eee',
        textAlign: 'center'
      }}>
        <span>My width is: {Math.floor(width)}px</span>
      </div>
    );
  }
}

export default sizeMe()(MyComponent);

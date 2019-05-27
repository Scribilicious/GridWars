import React from 'react';
import ReactDOM from 'react-dom';

class Game extends React.PureComponent {
    render() {
        return (
            <div className="game">
                <div className="game-board" />
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}
ReactDOM.render(<Game />, document.getElementById('app'));

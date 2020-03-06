import React, { useEffect, useState, useRef } from 'react';
import { SizeMe, withSize } from 'react-sizeme';
import ReactDOM from 'react-dom';
import Player from './Player';
import Obstacles from './Obstacles';
import GetBoardSize from './GetBoardSize';
import { getMapData, setMapData, getBoardData, setBoardData } from './config';

let gameBoardWidth = false;
let boardHeight = 1000;
let fontSize = 10;

const measureElement = element => {
  const DOMNode = ReactDOM.findDOMNode(element);
  return {
    width: DOMNode.offsetWidth,
    height: DOMNode.offsetHeight,
  };
}

const Game = () => {
    const [players, setPlayers] = useState([]);
    const { width, height} = getMapData();
    boardHeight = getBoardData('height');
    fontSize = getBoardData('gridsize');

    const withSizeHOC = withSize();

    const canvasRef = useRef();
    const ctx = useRef();

    useEffect(() => {
        const webSocket = new WebSocket('ws://localhost:3001/');
        webSocket.onmessage = event => {
            const { players, map } = JSON.parse(event.data);
            setMapData(map);
            setBoardData(canvasRef);
            setPlayers(players);
        };
    }, []);

    if (!width && !height) {
        return (
            <div>Waiting for game to start...</div>
        );
    }

    return (
        <div className="game">
            <div className="game-board" ref={canvasRef} style={{height : boardHeight, fontSize}}>
                {boardHeight &&
                    <Obstacles />
                }
                    {players.map(player => {
                        const {
                            name,
                            level,
                            health,
                            position: { x, y },
                            color,
                            animationDelay,
                        } = player;
                        return (
                            <Player
                                name={name}
                                level={level}
                                health={health}
                                x={x}
                                y={y}
                                color={color}
                                animationDelay={animationDelay}
                                key={`player${player.name}`}
                            />
                        );
                    })}

            </div>
            <div className="game-info">
                <div>{/* status */}</div>
                <ol>{/* TODO */}</ol>
            </div>
        </div>
    );
};

ReactDOM.render(<Game />, document.getElementById('board'));

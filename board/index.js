import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Player from './Player';
import Obstacles from './Obstacles';
import { getMapData, setMapData } from './config';

const Game = () => {
    const [players, setPlayers] = useState([]);
    const { width, height} = getMapData();

    useEffect(() => {
        const webSocket = new WebSocket('ws://localhost:3001/');
        webSocket.onmessage = event => {
            const { players, map } = JSON.parse(event.data);
            setPlayers(players);
            setMapData(map);
        };
    }, []);

    if (!width || !height) {
        return (
            <div>Waiting for game to start...</div>
        );
    }

    return (
        <div className="game">
            <div className="game-board">
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

                <Obstacles />

                {new Array(height).fill(null).map((_, rowIndex) => (
                    <div className="row" key={`row_${rowIndex}`}>
                        {new Array(width).fill(null).map((_, colIndex) => (
                            <div
                                className="col"
                                key={`x${colIndex}_ y${rowIndex}`}
                                id={`x${colIndex}_ y${rowIndex}`}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <div className="game-info">
                <div>{/* status */}</div>
                <ol>{/* TODO */}</ol>
            </div>
        </div>
    );
};

ReactDOM.render(<Game />, document.getElementById('board'));

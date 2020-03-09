import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import Player from './Player';
import Obstacles from './Obstacles';
import { getMapData, setMapData, getBoardData, setBoardData } from './config';

let boardHeight = 1000;
let fontSize = 10;

const getTop3 = players => {
    const copy = [...players];
    copy.sort((p1, p2) => p2.kills - p1.kills).splice(3);

    return copy;
};

const Game = () => {
    const [players, setPlayers] = useState([]);
    const { width, height } = getMapData();
    boardHeight = getBoardData('height');
    fontSize = getBoardData('gridsize');
    const canvasRef = useRef();

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
        return <div>Waiting for game to start...</div>;
    }

    return (
        <div className="game">
            <div className="game-info">
                <div>Top3 :</div>
                <ol>
                    {getTop3(players).map(player => (
                        <li>
                            {player.name} Kills: {player.kills} Level:{player.level}
                        </li>
                    ))}
                </ol>
            </div>
            <div className="game-board" ref={canvasRef} style={{ height: boardHeight, fontSize }}>
                {boardHeight && <Obstacles />}
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
        </div>
    );
};

ReactDOM.render(<Game />, document.getElementById('board'));

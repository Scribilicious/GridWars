import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import Player from './Player';
import Obstacles from './Obstacles';
import GameData from './GameData';
import { getMapData, setMapData, getBoardData, setBoardData } from './config';

let boardHeight = 1000;
let fontSize = 10;

const Game = () => {
    const [players, setPlayers] = useState([]);
    const { width, height } = getMapData();
    boardHeight = getBoardData('height');
    fontSize = getBoardData('gridsize');
    const canvasRef = useRef();

    useEffect(() => {
        const webSocket = new WebSocket(window.gw_wss_url);
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
            <div
                className="game-board"
                ref={canvasRef}
                style={{ height: boardHeight, fontSize }}
            >
                {boardHeight && <Obstacles key={'obstacles'} />}
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
            <GameData players={players} fontSize={fontSize} />
        </div>
    );
};

ReactDOM.render(<Game />, document.getElementById('board'));

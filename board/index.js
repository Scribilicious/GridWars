import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Viking from './Viking';
import Obstacles from './Obstacles';
import { getMapData, setMapData } from './config';

const Game = () => {
    const [vikings, setVikings] = useState([]);
    const { mapSizeX, mapSizeY } = getMapData();

    useEffect(() => {
        const webSocket = new WebSocket('ws://localhost:3001/');
        webSocket.onmessage = event => {
            const { vikings, mapData } = JSON.parse(event.data);
            setVikings(vikings);
            setMapData(mapData);
        };
    }, []);

    if (!mapSizeX || !mapSizeY) {
        return <div>Waiting for game to start ...</div>;
    }

    return (
        <div className="game">
            <div className="game-board">
                {vikings.map(viking => {
                    const {
                        name,
                        level,
                        health,
                        position: { x, y },
                        color,
                        animationDelay,
                    } = viking;
                    return (
                        <Viking
                            name={name}
                            level={level}
                            health={health}
                            x={x}
                            y={y}
                            color={color}
                            animationDelay={animationDelay}
                            key={`viking${viking.name}`}
                        />
                    );
                })}

                <Obstacles />

                {new Array(mapSizeY).fill(null).map((_, rowIndex) => (
                    <div className="row" key={`row_${rowIndex}`}>
                        {new Array(mapSizeX).fill(null).map((_, colIndex) => (
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

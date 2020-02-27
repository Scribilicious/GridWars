import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Viking from './Viking';
import Obstacles from './Obstacles';
import { getMetadata, setMetadata } from './config';

const Game = () => {
    const [vikings, setVikings] = useState([]);
    const { mapSizeX, mapSizeY } = getMetadata();

    useEffect(() => {
        const webSocket = new WebSocket('ws://localhost:3001/');
        webSocket.onmessage = event => {
            const { vikings, meta } = JSON.parse(event.data);
            setVikings(vikings);
            setMetadata(meta);
        };
    }, []);

    if (!mapSizeX || !mapSizeY) {
        return <div>Waiting for game to start ...</div>;
    }

    return (
        <div className="game">
            <div className="game-board">
                {vikings.map(viking => (
                    <Viking viking={viking} key={viking.name} />
                ))}

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

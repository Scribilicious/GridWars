import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const createVikingsMap = vikings =>
    vikings.reduce((mapping, viking) => {
        const key = `${viking.position.x}_${viking.position.y}`;
        mapping[key] = viking;
        return mapping;
    }, {});

const getViking = (rowIndex, colIndex, vikings) => {
    const key = `${colIndex}_${rowIndex}`;
    return vikings[key] || null;
};

const Viking = viking => {
    const renderViking = viking.viking;
    return renderViking ? <div>{renderViking.name}</div> : null;
};

const Game = () => {
    const [vikings, setVikings] = useState([]);
    const [meta, setMeta] = useState({});
    const { mapSizeX, mapSizeY } = meta;
    useEffect(() => {
        const webSocket = new WebSocket('ws://localhost:3001/');
        webSocket.onmessage = event => {
            const { vikings, meta } = JSON.parse(event.data);
            setVikings(createVikingsMap(vikings));
            setMeta(meta);
        };
    }, []);

    return (
        <div className="game">
            <div className="game-board">
                {new Array(mapSizeY).fill(null).map((_, rowIndex) => (
                    <div className="row" key={`row_${rowIndex}`}>
                        {new Array(mapSizeX).fill(null).map((_, colIndex) => (
                            <div className="col" key={`x${colIndex}_ y${rowIndex}`} id={`x${colIndex}_ y${rowIndex}`}>
                                <Viking
                                    viking={getViking(
                                        rowIndex,
                                        colIndex,
                                        vikings
                                    )}
                                />
                            </div>
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

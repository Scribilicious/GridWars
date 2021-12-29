import React from 'react';

const getTop3 = players => {
    const arr = players
        .map(player => ({
            ...player,
            score:
                Math.pow(2, player.level - 1) +
                player.kills +
                (player.level - 1) * 1,
        }))
        .sort((p1, p2) => p2.score - p1.score);

    arr.splice(3);
    return arr;
};

const GameData = ({ players, fontSize }) => {
    const top3 = getTop3(players);
    return (
        <div className="game-info" style={{ fontSize }}>
            <h2>Top Three</h2>
            <table className="top-three">
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Kills</th>
                        <th>Level</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                {top3.length &&
                    top3.map(player => (
                        <tr>
                            <td>{player.name}</td>
                            <td>{player.kills}</td>
                            <td>{player.level}</td>
                            <td>{player.score}</td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </div>
    );
};

export default GameData;

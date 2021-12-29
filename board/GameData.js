import React from 'react';

const getTopPlayers = (players, count) => {
    const arr = players
        .map(player => ({
            ...player,
            score:
                Math.pow(2, player.level - 1) +
                player.kills +
                (player.level - 1) * 1,
        }))
        .sort((p1, p2) => p2.score - p1.score);

    arr.splice(count);
    return arr;
};

const GameData = ({ players, fontSize }) => {
    const topPlayers = getTopPlayers(players, 10);
    return (
        <div className="game-info" style={{ fontSize }}>
            <h2>Top Ten</h2>
            <table className="top-players">
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Kills</th>
                        <th>Level</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                {topPlayers.length &&
                    topPlayers.map(player => (
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

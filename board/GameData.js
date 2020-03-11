import React from 'react';

const getTop3 = players => {
    const arr = [...players]
        .map(player => ({
            ...player,
            killsTotal:
                Math.pow(2, player.level - 1) +
                player.kills +
                (player.level - 1) * 1,
        }))
        .sort((p1, p2) => p2.killsTotal - p1.killsTotal);

    arr.splice(3);
    return arr;
};

const GameData = ({ players }) => {
    const top3 = getTop3(players);
    return (
        <div className="game-info">
            <table className="top-three">
                <tr>
                    <td></td>
                    <td>Kills</td>
                    <td>Level</td>
                </tr>
                {top3.length &&
                    top3.map(player => (
                        <tr>
                            <td>{player.name}</td>
                            <td>{player.killsTotal}</td>
                            <td>{player.level}</td>
                        </tr>
                    ))}
            </table>
        </div>
    );
};

export default GameData;

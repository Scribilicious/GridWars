import React from 'react';
import { getMapData } from './config';
import Level1Avatar from './Avatars/Level1';
import Level2Avatar from './Avatars/Level2';
import Level3Avatar from './Avatars/Level3';

const BASEHEIGHT = 70; // %
const SIZE_INCREMENTS = 10;

const getAvatar = level => {
    if (level < 2) {
        return Level1Avatar;
    }

    if (level <= 4) {
        return Level2Avatar;
    }

    return Level3Avatar;
};

const calculateSizeFatctor = level =>
    (BASEHEIGHT + (level - 1) * SIZE_INCREMENTS) / 100;

const calculateOpacity = (level, health) => {
    const maxHealthForLevel = level * 2;
    return health / maxHealthForLevel;
};

const calculateStyles = player => {
    const { x, y, level, health } = player;
    const { width } = getMapData();
    const fieldSize = (window.innerWidth - 10) / width;
    const sizeFactor = calculateSizeFatctor(level);

    return {
        top: y + 'em',
        left: x + 'em',
        width: 1 * sizeFactor + 'em',
        height: 1 * sizeFactor + 'em',
        opacity: calculateOpacity(level, health),
        position: 'absolute',
    };
};

const Player = React.memo(props => {
    const { level, name, color, animationDelay , health} = props;
    const { top, left, width, height, opacity } = calculateStyles(props);
    const Avatar = getAvatar(level);

    // todo: set only changed properties as styles, set on ref
    return (
        <div className="player" style={{ top, left }}>
            <div className="player-avatar" style={{ width, height, opacity }}>
                <Avatar color={color} animationDelay={animationDelay} />
            </div>
            <span className="player-name">
                {name}|{level}|{health}
            </span>
        </div>
    );
});

export default Player;

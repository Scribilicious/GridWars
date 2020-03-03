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

const FIELD_HEIGHT = 45;
const calculateStyles = viking => {
    const { x, y, level, health } = viking;
    const { mapSizeX } = getMapData();
    const ww = window.innerWidth;
    const fieldWidth = ww / mapSizeX - 1;
    const sizeFactor = calculateSizeFatctor(level);
    return {
        top: Math.round(y * FIELD_HEIGHT),
        left: Math.round(x * fieldWidth),
        width: fieldWidth * sizeFactor,
        height: FIELD_HEIGHT * sizeFactor,
        opacity: calculateOpacity(level, health),
    };
};

const Viking = React.memo(props => {
    const { level, name, color, animationDelay } = props;
    const { top, left, width, height, opacity } = calculateStyles(props);
    const Avatar = getAvatar(level);

    // todo: set only changed properties as styles, set on ref
    return (
        <div className="viking" style={{ top, left, width, height, opacity }}>
            <Avatar color={color} animationDelay={animationDelay} />
            <span className="viking-name">
                {name} | {level}
            </span>
        </div>
    );
});

export default Viking;

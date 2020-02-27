import React from 'react';
import { getMetadata } from './config';

const BASEHEIGHT = 70; // %
const SIZE_INCREMENTS = 10;


const getAvatar = level => (level > 2 ? 'maulaf' : 'wiki');
const calculateAvaHeight = level => BASEHEIGHT + (level - 1) * SIZE_INCREMENTS;
const calculateOpacity = (level, health) => {
    const maxHealthForLevel = level * 2;
    return health / maxHealthForLevel;
};
const FIELD_HEIGHT = 45;
const calculateStyles = viking => {
    const { position, level, health } = viking;
    const { mapSizeX } = getMetadata();
    const vikingHeight = 12;
    const ww = window.innerWidth;
    const fieldWidth = ww / mapSizeX - 1;
    return {
        top: Math.round(position.y * FIELD_HEIGHT) - vikingHeight,
        left: Math.round(position.x * fieldWidth),
        width: fieldWidth,
        height: FIELD_HEIGHT,
        avaWidth: calculateAvaHeight(level),
        avaOpacity: calculateOpacity(level, health),
    };
};

const Viking = props => {
    const { viking } = props;
    const { level, health, name} = viking;
    const { top, left, width, height, avaWidth, avaOpacity } = calculateStyles(viking);

    // todo: set only changed properties as styles, set on ref
    return (
        <div className="viking" style={{ top, left, width, height }}>
            <img
                src={`${getAvatar(level)}.png`}
                alt="DIE IN HELL"
                style={{ width: `${avaWidth}%`, opacity: avaOpacity }}
            />
            <span className="viking-name">{name}</span>
        </div>
    );
};

export default Viking;

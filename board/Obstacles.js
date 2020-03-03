import React from 'react';
import { getMapData } from './config';

import Damage1 from './Obstacles/Damage1';
import Damage2 from './Obstacles/Damage2';
import Damage3 from './Obstacles/Damage3';
import Obstacle1 from './Obstacles/Obstacle1';

const FIELD_HEIGHT = 45;
const calculateStyles = (x, y, type) => {
    const { mapSizeX } = getMapData();
    const ww = window.innerWidth;
    const fieldWidth = ww / mapSizeX - 1;
    return {
        top: Math.round(y * FIELD_HEIGHT),
        left: Math.round(x * fieldWidth),
        width: fieldWidth,
        height: FIELD_HEIGHT,
        // background: colors[type],
        position: 'absolute',
    };
};

const getObstacle = (type, damage) => {
    if (damage) {
        if (type === 0) {
            return Damage1;
        }
        if (type === 1) {
            return Damage2;
        }
        return Damage3;
    }

    return Obstacle1;
};

const Obstacles = () => {
    const { obstacles } = getMapData();
    return obstacles.map(obstacle => <Obstacle {...obstacle} />);
};

const Obstacle = React.memo(props => {
    const { x, y, type, damage } = props;
    const SvgImage = getObstacle(type, damage);

    return (
        <div class="obstacles" key={'obst'+ x + y} style={calculateStyles(x, y)}>
            <SvgImage/>
        </div>
    );
});

export default Obstacles;

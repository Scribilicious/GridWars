import React from 'react';
import { getMapData } from './config';

const colors = ['red', 'pink', 'yellow', 'maroon', 'orange', 'green'];

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
        background: colors[type],
        position: 'absolute',
    };
};

const Obstacles = () => {
    const { obstacles } = getMapData();
    return obstacles.map((obstacle, index) => (
        <Obstacle {...obstacle} key={`obst${index}`} />
    ));
};

const Obstacle = React.memo(props => {
    const { x, y, type } = props;
    return (
        <div style={calculateStyles(x, y, type)}>
            {x} : {y}
        </div>
    );
});

export default Obstacles;

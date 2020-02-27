import React from 'react';
import { getMetadata } from './config';

const colors = ['red', 'pink', 'yellow', 'maroon', 'orange', 'green'];

const FIELD_HEIGHT = 45;
const calculateStyles = (x, y, type) => {
    const { mapSizeX } = getMetadata();
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

const Obstacle = () => {
    const { obstacles } = getMetadata();

    return obstacles.map((obstacle, index) => {
        const { x, y, type } = obstacle;
        return (
            <div key={index} style={calculateStyles(x, y, type)}>
                {x} : {y}
            </div>
        );
    });
};

export default Obstacle;

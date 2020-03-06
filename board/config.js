let map = {};
let boardsize = false;

export const setMapData = data => {
    map = data;
};

export const getMapData = () => map;

export const setBoardData = element => {
    if (element && element.current && map.width) {
        const width = element.current.offsetWidth;
        const gridsize = (width / map.width);
        const height = gridsize * map.height;
        const percentage = (100 / width) * gridsize;

        boardsize = {
            width,
            height,
            gridsize
        };
    }
};

export const getBoardData = key => {
    if (key) {
        return boardsize[key] ? boardsize[key] : false;
    }
    return boardsize;
};

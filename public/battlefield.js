const cBoard = document.getElementById('board');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

const units = 30;
const unitSize = 20; // px
const size = units * unitSize;

const timePeriod = 2000;

const vikingImg = new Image();
vikingImg.src = 'viking.png';

canvas.width = size;
canvas.height = size;
cBoard.appendChild(canvas);

function getVikings() {
    return fetch('./vikings');
}

function renderVikings(vikings) {
    vikings.forEach(viking => {
        const { x } = viking.position;
        const { y } = viking.position;

        const fontSize = 15;
        ctx.font = `${fontSize} px Arial`;

        ctx.fillText(viking.name, x * unitSize - 20, y * unitSize - 5);
        ctx.fillText(viking.level, x * unitSize + 3, y * unitSize + fontSize + 18);

        ctx.drawImage(vikingImg, x * unitSize, y * unitSize, unitSize, unitSize);
    });
}

function displayTheBest(vikings) {
    const bestViking = vikings.reduce(function(candidate, current) {
        return candidate.level > current.level ? candidate : current;
    }, 0);

    var div = document.getElementById('best-viking');
    div.innerHTML = '';
    var text = document.createTextNode(`Best Viking: ${bestViking.name || 'n/a'}`);
    div.appendChild(text);

    var div = document.getElementById('best-level');
    div.innerHTML = '';
    var text = document.createTextNode(`With level: ${bestViking.level || 'n/a'}`);
    div.appendChild(text);
}

function main() {
    getVikings().then(function(response) {
        return response.json().then(json => {
            const { vikings } = json;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            renderVikings(vikings);
            displayTheBest(vikings);
        });
    });
}

main();
window.setInterval(main, timePeriod);

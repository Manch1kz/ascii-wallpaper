var clockEl = document.getElementById("clock");
var dateEl = document.getElementById("date");
var canvas = document.getElementById("canvas");
var canvasWidth = 90;
var canvasHeight = 90;
var delay = 20;

var pitch = -10;
var yaw = 5;
var radius = 30;

var positionX = canvasWidth / 2;
var positionY = canvasHeight / 2;

var buffer = Array.from(
    { length: canvasHeight },
    () => new Uint8Array(canvasWidth)
);

var horizontal_speed;
var vertical_speed;

window.wallpaperPropertyListener = {
    applyUserProperties: (props) => {
        horizontal_speed = props.speed.value
        vertical_speed = props.speed.value
    }
}

function updateTime() {
    let currentTime = new Date();
    let hrs = currentTime.getHours().toString().padStart(2, "0");
    let mins = currentTime.getMinutes().toString().padStart(2, "0");
    let secs = currentTime.getSeconds().toString().padStart(2, "0");

    let day = currentTime.getUTCDate().toString().padStart(2, "0");
    let month = (currentTime.getUTCMonth() + 1).toString().padStart(2, "0");
    let year = currentTime.getFullYear();

    clockEl.innerHTML = `${hrs}:${mins}:${secs}`;
    dateEl.innerHTML = `${day}.${month}.${year}`;
}

function update() {
    clear();

    yaw += horizontal_speed / 10000;
    pitch += vertical_speed / 10000;

    var topX = [],
        topY = [],
        botX = [],
        botY = [];

    topX.push(Math.sin(yaw + 0) * radius + positionX);
    topY.push(
        Math.cos(yaw + 0) * radius * Math.sin(pitch) +
            (Math.cos(pitch) * Math.sqrt(radius * radius * 2)) / 2 +
            positionY
    );
    topX.push(Math.sin(yaw + 1.5708) * radius + positionX);
    topY.push(
        Math.cos(yaw + 1.5708) * radius * Math.sin(pitch) +
            (Math.cos(pitch) * Math.sqrt(radius * radius * 2)) / 2 +
            positionY
    );
    topX.push(Math.sin(yaw + 3.14159) * radius + positionX);
    topY.push(
        Math.cos(yaw + 3.14159) * radius * Math.sin(pitch) +
            (Math.cos(pitch) * Math.sqrt(radius * radius * 2)) / 2 +
            positionY
    );
    topX.push(Math.sin(yaw + 4.71239) * radius + positionX);
    topY.push(
        Math.cos(yaw + 4.71239) * radius * Math.sin(pitch) +
            (Math.cos(pitch) * Math.sqrt(radius * radius * 2)) / 2 +
            positionY
    );

    botX.push(Math.sin(yaw + 0) * radius + positionX);
    botY.push(
        Math.cos(yaw + 0) * radius * Math.sin(pitch) -
            (Math.cos(pitch) * Math.sqrt(radius * radius * 2)) / 2 +
            positionY
    );
    botX.push(Math.sin(yaw + 1.5708) * radius + positionX);
    botY.push(
        Math.cos(yaw + 1.5708) * radius * Math.sin(pitch) -
            (Math.cos(pitch) * Math.sqrt(radius * radius * 2)) / 2 +
            positionY
    );
    botX.push(Math.sin(yaw + 3.14159) * radius + positionX);
    botY.push(
        Math.cos(yaw + 3.14159) * radius * Math.sin(pitch) -
            (Math.cos(pitch) * Math.sqrt(radius * radius * 2)) / 2 +
            positionY
    );
    botX.push(Math.sin(yaw + 4.71239) * radius + positionX);
    botY.push(
        Math.cos(yaw + 4.71239) * radius * Math.sin(pitch) -
            (Math.cos(pitch) * Math.sqrt(radius * radius * 2)) / 2 +
            positionY
    );

    drawLine(topX[0], topY[0], topX[1], topY[1]);
    drawLine(topX[1], topY[1], topX[2], topY[2]);
    drawLine(topX[2], topY[2], topX[3], topY[3]);
    drawLine(topX[3], topY[3], topX[0], topY[0]);

    drawLine(botX[0], botY[0], botX[1], botY[1]);
    drawLine(botX[1], botY[1], botX[2], botY[2]);
    drawLine(botX[2], botY[2], botX[3], botY[3]);
    drawLine(botX[3], botY[3], botX[0], botY[0]);

    drawLine(topX[0], topY[0], botX[0], botY[0]);
    drawLine(topX[1], topY[1], botX[1], botY[1]);
    drawLine(topX[2], topY[2], botX[2], botY[2]);
    drawLine(topX[3], topY[3], botX[3], botY[3]);

    render();
}

function clear() {
    buffer = Array.from(
        { length: canvasHeight },
        () => new Uint8Array(canvasWidth)
    );
    canvas.innerText = "";
}

function drawPixel(x, y) {
    buffer[y][x] = true;
}

function drawLine(x1, y1, x2, y2) {
    x1 = Math.round(x1);
    y1 = Math.round(y1);
    x2 = Math.round(x2);
    y2 = Math.round(y2);
    var dx = Math.abs(x2 - x1),
        sx = x1 < x2 ? 1 : -1;
    var dy = Math.abs(y2 - y1),
        sy = y1 < y2 ? 1 : -1;
    var err = (dx > dy ? dx : -dy) / 2;

    while (true) {
        drawPixel(x1, y1);
        if (x1 === x2 && y1 === y2) break;
        var e2 = err;
        if (e2 > -dx) {
            err -= dy;
            x1 += sx;
        }
        if (e2 < dy) {
            err += dx;
            y1 += sy;
        }
    }
}

function render() {
    var t = [];
    for (var y = 0; y < buffer.length; y++) {
        for (var x = 0; x < buffer[y].length; x++) {
            t.push(buffer[y][x] ? "#" : " ");
        }
        t.push("\n");
    }
    canvas.appendChild(document.createTextNode(t.join("")));
}

setTimeout(() => {
    updateTime();

    setInterval(() => {
        updateTime();
    }, 1000);
    setInterval(update, delay);
}, 1);
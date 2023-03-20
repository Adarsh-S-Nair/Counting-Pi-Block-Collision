import Square from "./Square.js";
const pop = new Audio('pop.mp3');
let canvas = document.getElementById('canvas');
let sidebar = document.getElementById('sidebar');
let calculateButton = document.getElementById('calculate')

canvas.width = window.innerWidth - sidebar.offsetWidth;
canvas.height = window.innerHeight;
canvas.style.backgroundColor = "#282a36";
let context = canvas.getContext('2d');

window.onresize = () => {
    canvas.width = window.innerWidth - sidebar.offsetWidth;
    canvas.height = window.innerHeight;
    main();
}

let floorHeight;
let shapes = [];
let collisions = 0;
let timesteps = 1;
let running;

let updateTimeSteps = (d) => {
    if (d == 4) timesteps = 8;
    if (d == 5) timesteps = 75;
    if (d == 6) timesteps = 750;
    if (d == 7) timesteps = 7499;
}

let disableButton = () => {
    calculateButton.classList.add('stop');
    calculateButton.innerHTML = 'STOP';
    calculateButton.onclick = () => {
        console.log('hey')
        running = false;
    }
}

let enableButton = () => {
    calculateButton.classList.remove('stop');
    calculateButton.innerHTML = 'CALCULATE';
    calculateButton.onclick = calculate;
}

let calculate = () => {
    running = true;

    // Reset the counter
    collisions = 0;
    document.getElementById('counter').innerHTML = collisions;

    // Disable the button
    disableButton();

    // Get the number of digits we want to calculate
    let d = document.getElementById('numDigits').value;
    updateTimeSteps(d);

    getFirstSquare();

    // Create the square
    let squareWidth = d == 1 ? 100 : 300;
    let square = new Square({
        id: 1,
        width: squareWidth,
        position: {x: canvas.width, y: floorHeight - squareWidth},
        mass: Math.pow(100, d - 1),
        color: '#3a9182',
        constraint: shapes[0].width
    }, context);
    square.velocity = -3 / timesteps;

    shapes[1] = square;

    animate();
}

calculateButton.onclick = calculate

let drawFloor = () => {
    let margin = 5;
    let width = canvas.width - margin;
    
    context.fillStyle = "#1e2029";
    context.fillRect(0, floorHeight, canvas.width, floorHeight)
    // context.beginPath();
    // context.moveTo(margin, floorHeight);
    // context.lineTo(width, floorHeight);
    // context.strokeStyle = '#fff';
    // context.stroke();
}

let getFirstSquare = () => {
    // Draw the first square
    let squareWidth = 100;
    let square = new Square({
        id: 0,
        width: squareWidth,
        position: {x: (canvas.width / 2) - (squareWidth / 2), y: floorHeight - squareWidth},
        mass: 1,
        color: '#fff',
        constraint: 0
    }, context);
    shapes[0] = square;
    return square;
}

let animate = () => {
    if (!running ||
        (shapes[0].velocity == 0 && shapes[1].left > canvas.width) || 
        (shapes[0].left > canvas.width)) {
        enableButton();
        return;
    }

    requestAnimationFrame(animate);
    context.clearRect(0, 0, window.innerWidth - sidebar.offsetWidth, window.innerHeight);

    // Draw the floor
    drawFloor();

    // Get the number of collisions before
    let before = collisions;

    for (let i = 0; i < timesteps; i++) {
        shapes[0].update();
        shapes[1].update();

        if (shapes[0].left <= 0) {
            shapes[0].velocity *= -1;
            pop.play();
            collisions++;
        }

        if (shapes[0].collidesWith(shapes[1])) {
            shapes[0].resolveCollisionWith(shapes[1]);
            pop.play();
            collisions++;
        }
    }
    shapes[0].draw();
    shapes[1].draw();

    if (before != collisions)
        document.getElementById('counter').innerHTML = collisions.toLocaleString();
    
    console.log(collisions);
}

let main = () => {
    running = false;
    // Clear the canvas
    context.clearRect(0, 0, window.innerWidth - sidebar.offsetWidth, window.innerHeight);

    // Draw the ground
    floorHeight = canvas.height - canvas.height / 2
    drawFloor();
    
    // Draw the first square
    let square = getFirstSquare();
    square.draw();
}

main();
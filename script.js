let canvas = document.getElementById('medium');
let ctx = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let c = 0.7;
let waves = [];
let width = canvas.width;
let height = canvas.height;

let imageData = ctx.createImageData(canvas.width, canvas.height);
let data = imageData.data;

let current = new Float32Array(width*height);
let previous = new Float32Array(width*height);
let next = new Float32Array(width*height);

let isMouseDown = false;
let mouseX = 0;
let mouseY = 0;


function stepSimulation(){

    let c2 = c * c;
    let damping = 0.9999999;

    for(let y = 1;y < height - 1;y++){
        for(let x = 1;x < width - 1;x++){

            let i = x + (y * width);

            let sum = current[i - 1] + current[i + 1] + current[i - width] + current[i + width];

            next[i] = 2*current[i] - previous[i] + (c2 * (sum - 4 * current[i]));

            next[i] *= damping;
        }
    }
}

function timeForward(){

    let temp = previous;
    previous = current;
    current = next;
    next = temp;
}

function render(){

    for(let i = 0; i < current.length; i ++){

        let value = current[i];
        let brightness = value * 255;

        brightness = Math.max(0,Math.min(255,brightness));

        let j = i * 4;

        data[j] = brightness;
        data[j + 1] = brightness;
        data[j + 2] = brightness;
        data[j + 3] = 255;
    }

    ctx.putImageData(imageData,0,0);
}

/*function render(){

    // light direction (tweak these)
    let lightX = 0.5;
    let lightY = 0.5;

    for(let y = 1; y < height - 1; y++){
        for(let x = 1; x < width - 1; x++){

            let i = x + y * width;
            let j = i * 4;

            // --- compute gradient (surface slope) ---
            let left  = current[i - 1];
            let right = current[i + 1];
            let up    = current[i - width];
            let down  = current[i + width];

            let dx = right - left;
            let dy = down - up;

            // --- lighting (diffuse) ---
            let light = dx * lightX + dy * lightY;

            let brightness = 128 + light * 200;

            // --- base water color ---
            let r = 20 + brightness * 0.3;
            let g = 100 + brightness * 0.5;
            let b = 180 + brightness * 0.8;

            // --- specular highlight (shine) ---
            let spec = Math.pow(Math.max(0, light), 20) * 255;

            r += spec;
            g += spec;
            b += spec;

            // --- optional: add slight height tint ---
            let h = current[i];
            r += h * 30;
            g += h * 20;
            b += h * 10;

            // --- clamp ---
            data[j]     = Math.max(0, Math.min(255, r));
            data[j + 1] = Math.max(0, Math.min(255, g));
            data[j + 2] = Math.max(0, Math.min(255, b));
            data[j + 3] = 255;
        }
    }

    ctx.putImageData(imageData, 0, 0);
}*/


function inject(x,y){

    let radius = 10;

    for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {

            let nx = x + dx;
            let ny = y + dy;

            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {

                let i = nx + ny * width;

                let dist = dx*dx + dy*dy;

                current[i] += 20 * Math.exp(-dist / 10);
            }
        }
    }

}

function animate(){

    if(isMouseDown){
        inject(mouseX,mouseY);
    }

    stepSimulation();
    render();
    timeForward();

    requestAnimationFrame(animate);

}

canvas.addEventListener("mousedown",(e)=>{
    isMouseDown = true;
});

canvas.addEventListener("mouseup",(e)=>{
    isMouseDown = false;
});

canvas.addEventListener("mousemove",(e)=>{

    mouseX = e.offsetX;
    mouseY = e.offsetY;
});

animate();


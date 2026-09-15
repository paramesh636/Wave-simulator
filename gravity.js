let canvas = document.getElementById('medium');
let ctx = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let height = canvas.height;
let width = canvas.width;

let isMouseDown = false;
let mouseX = 0;
let mouseY = 0;

let particles = [];

/*Particle Description

Particle: {
	x : some x value
	y : some y value
	vx : velocity in x dir
	vy : velocity in y dir
	mass : some mass
}
*/


function  stepSimulation(){

	let G = 1.6;
	let softening = 10;

	for(let i = 0; i < particles.length; i++){

		let particle1 = particles[i];
		let ax = 0;
		let ay = 0;

		for(let j = 0; j < particles.length; j++){

			if(i == j){
				continue;
			}

			let particle2 = particles[j];

			let dx = particle2.x - particle1.x;
			let dy = particle2.y - particle1.y;

			let r2 = dx*dx + dy*dy + softening*softening;
			let r = Math.sqrt(r2);

            if(r < 10.1){
                
                particle1.mass += particle2.mass;
                particle1.vx = particle1.vx/particle1.mass + particle2.vx/particle2.mass;
                particle1.vy = particle1.vy/particle1.mass + particle2.vy/particle2.mass;
                particles.splice(j,1);
                continue;

            }

			let acc = G * (particle2.mass)/(r**2);

			ax += acc * dx/r;
			ay += acc * dy/r;

		}


		particle1.vx += ax;
		particle1.vy += ay;
	}

	for(let particle of particles){
		
		particle.x += particle.vx;
		particle.y += particle.vy;
	}

	for(let i = particles.length - 1; i >= 0; i--){

        let p = particles[i];

        if(
            p.x < 0 ||
            p.x > width ||
            p.y < 0 ||
            p.y > height
        ){
            particles.splice(i, 1);
        }
    }
}

/*function stepSimulation(){

    let G = 1.6;
    let softening = 10;
    let dt = 1;

    let accelerations = [];

    // Calculate current accelerations
    for(let i = 0; i < particles.length; i++){

        let particle1 = particles[i];

        let ax = 0;
        let ay = 0;

        for(let j = 0; j < particles.length; j++){

            if(i === j) continue;

            let particle2 = particles[j];

            let dx = particle2.x - particle1.x;
            let dy = particle2.y - particle1.y;

            let r2 = dx * dx + dy * dy + softening * softening;
            let r = Math.sqrt(r2);

            let acc = G * particle2.mass / (r2);

            ax += acc * dx / r;
            ay += acc * dy / r;
        }

        accelerations.push({ ax, ay });
    }


    // Move particles using velocity Verlet
    for(let i = 0; i < particles.length; i++){

        let p = particles[i];
        let a = accelerations[i];

        p.x += p.vx * dt + 0.5 * a.ax * dt * dt;
        p.y += p.vy * dt + 0.5 * a.ay * dt * dt;
    }


    // Calculate new accelerations
    let newAccelerations = [];

    for(let i = 0; i < particles.length; i++){

        let particle1 = particles[i];

        let ax = 0;
        let ay = 0;

        for(let j = 0; j < particles.length; j++){

            if(i === j) continue;

            let particle2 = particles[j];

            let dx = particle2.x - particle1.x;
            let dy = particle2.y - particle1.y;

            let r2 = dx * dx + dy * dy + softening * softening;
            let r = Math.sqrt(r2);

            let acc = G * particle2.mass / r2;

            ax += acc * dx / r;
            ay += acc * dy / r;
        }

        newAccelerations.push({ ax, ay });
    }


    // Update velocity using average acceleration
    for(let i = 0; i < particles.length; i++){

        let p = particles[i];

        p.vx += 0.5 *
            (accelerations[i].ax + newAccelerations[i].ax) * dt;

        p.vy += 0.5 *
            (accelerations[i].ay + newAccelerations[i].ay) * dt;
    }


    // Remove particles outside canvas
    for(let i = particles.length - 1; i >= 0; i--){

        let p = particles[i];

        if(
            p.x < 0 ||
            p.x > width ||
            p.y < 0 ||
            p.y > height
        ){
            particles.splice(i, 1);
        }
    }
}*/

function render(){

    ctx.clearRect(0, 0, width, height);

    for(let p of particles){

        let radius = Math.sqrt(p.mass);

        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

function inject(x,y){

    let radius = 1;

    for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {

            let distance = Math.sqrt(dx*dx + dy*dy);

            if(distance <= radius){
                particles.push(
						{
							x : x + dx,
							y : y + dy,
							vx : 0,
							vy : 0,
							mass : 1
						}
                	)
            }
        }
    }
}

function animate(){

    if(isMouseDown){
        inject(mouseX,mouseY);
    }

    if(particles.length >= 2){
    	stepSimulation();
    	render();
    }
    requestAnimationFrame(animate);

}

canvas.addEventListener("pointerdown", (e) => {
    isMouseDown = true;

    mouseX = e.offsetX;
    mouseY = e.offsetY;

    inject(mouseX, mouseY);
});

canvas.addEventListener("pointerup", () => {
    isMouseDown = false;
});

canvas.addEventListener("pointercancel", () => {
    isMouseDown = false;
});

canvas.addEventListener("pointermove", (e) => {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
});

animate();



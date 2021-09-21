class Particle {
	constructor(x, y, vx, vy, id)
	{
		this.id = id;
		this.ctx = null;
		this.position = {x: Number(x), y: Number(y)};
		this.velocity = {x: Number(vx), y: Number(vy)};
		this.radius = 1.5;

		this.color = "#555";
		this.lineColor = `hsl(${(360 * Math.random()).toFixed(2)}, 100%, 80%)`;
		this.grayscaleColor = ["#111111", "#222222", "#333333", "#444444", "#555555", "#666666"][[Math.floor(Math.random() * 6)]];
	}

	updatePosition()
	{
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
	}

	checkEdges(width, height)
	{
		// past left
		if(this.position.x < 0)
		{
			this.position.x = width;
		}

		// past right
		if(this.position.x > width)
		{
			this.position.x = 0;
		}

		// past bottom
		if(this.position.y > height)
		{
			this.position.y = 0;
		}

		// past top
		if(this.position.y < 0)
		{
			this.position.y = height;
		}
	}

	checkOthers(others, pairs)
	{
		const MAX_DIST = 115;
		const BRIGHT_COEFFICIENT = 0.85;

		for(let particle of others)
		{
			if(this != particle)// && !this.checkPairs(pairs, particle))
			{
				var a = this.position.x - particle.position.x, b = this.position.y - particle.position.y;
				var c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
				if(c < MAX_DIST)
				{
					let rgba = this.hexToRGB(this.grayscaleColor, Math.abs((c != 0 ? c / (MAX_DIST * BRIGHT_COEFFICIENT) : 0) - 1).toFixed(2));
					this.drawLine(particle.position, 1, rgba);
					pairs[this.id] = particle.id;
				}
				else
				{
					delete pairs[this.id];
				}
			}
		}

	}

	checkPairs(pairs, other)
	{
		if(pairs[this.id] && pairs[this.id] == other.id)
		{
			return true;
		}
		else if(pairs[other.id] && pairs[other.id] == this.id)
		{
			return true;
		}

		return false;
	}

	checkMouse(mouse)
	{
		const MAX_DIST = 100;
		const BRIGHT_COEFFICIENT = 0.95;

		var a = mouse.x - this.position.x, b = mouse.y - this.position.y;
		var c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

		if(c < MAX_DIST)
		{
			let tmp = this.lineColor.split(',');
			let hex = this.hslToHex(tmp[0].split("hsl(")[1], tmp[1].split(' ')[1].split('%')[0], tmp[2].split('%)')[0].split(' ')[1]);
			let rgba = this.hexToRGB(hex, Math.abs((c != 0 ? c / (MAX_DIST * BRIGHT_COEFFICIENT) : 0) - 1).toFixed(2));

			this.drawLine(mouse, 2, rgba);
		}
		

		// (c < MAX_DIST ? this.drawLine(mouse) : "");
	}

	setVelocity(x, y)
	{
		this.velocity = {x: x, y: y};
	}

	draw()
	{
		this.ctx.fillStyle = this.color;
		this.ctx.beginPath();
		this.ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
		this.ctx.fill();
	}

	drawLine(point, size=1, color=this.lineColor)
	{
		this.ctx.strokeStyle = color;
		this.ctx.lineWidth = size;

		this.ctx.beginPath();
		this.ctx.moveTo(this.position.x, this.position.y);
		this.ctx.lineTo(point.x, point.y);
		this.ctx.stroke();
	}

	

	hslToHex(h, s, l) {
		l /= 100;
		const a = s * Math.min(l, 1 - l) / 100;
		const f = n => {
		  const k = (n + h / 30) % 12;
		  const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		  return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
		};
		return `#${f(0)}${f(8)}${f(4)}`;
	}

	hexToRGB(hex, alpha=0) {
		var r = parseInt(hex.slice(1, 3), 16),
			g = parseInt(hex.slice(3, 5), 16),
			b = parseInt(hex.slice(5, 7), 16);
	
		if (alpha >= 0) {
			return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
		} else {
			return "rgb(" + r + ", " + g + ", " + b + ")";
		}
	}
}

class AnimationComponent {
	constructor() {
		this.POINT_COUNT = 125;
		this.PEAK_VELOCITY = 0.15;
		this.PARTICLES = [];
		this.PAIRS = {};
	
		this.canvas = document.getElementById('anim'),
		this.context = this.canvas.getContext('2d');
	
		// mouse move detection
		
		document.body.addEventListener('mousemove', ev => {
			let pos = this.getMouse(this.canvas, ev);
			this.canvas.mouse = pos;
		});
	
		window.addEventListener('resize', () => {this.resizeCanvas(this)}, false);
		
		this.resizeCanvas(this);
	}

	step(ts, self) {
		self.context.clearRect(0,0,self.canvas.width,self.canvas.height);
		
		// update particles
		for(let particle of self.PARTICLES)
		{
			particle.updatePosition();
			particle.checkEdges(self.canvas.width, self.canvas.height);
			particle.checkOthers(self.PARTICLES, self.PAIRS);
			(self.canvas.mouse ? particle.checkMouse(self.canvas.mouse) : "");
		}

		// draw particles
		for(let particle of self.PARTICLES)
		{
			particle.draw();
		}
		// console.timeEnd('step');

		requestAnimationFrame((ts) => {this.step(ts, this)});
	}

	start() {
		requestAnimationFrame((ts) => {this.step(ts, this)});
	}

	resizeCanvas(self) {
		self.canvas.width = window.innerWidth;
		self.canvas.height = window.innerHeight;


		self.PARTICLES = [];
		for(let i = 0; i < self.POINT_COUNT; i++)
		{
			let randX = self.getRandomInt(0, self.canvas.width), randY = self.getRandomInt(0, self.canvas.height);
			let randVelX = self.getRandom(-self.PEAK_VELOCITY, self.PEAK_VELOCITY), randVelY = self.getRandom(-self.PEAK_VELOCITY, self.PEAK_VELOCITY);

			self.PARTICLES.push(new Particle(randX, randY, randVelX,randVelY, i));
			self.PARTICLES[i].ctx = self.context;
		}

		self.canvas.mouse = {x: self.canvas.width / 2, y: self.canvas.height / 2}
	}

	getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min) + min);
	}

	getRandom(min, max) {
		return (Math.random() * (max - min) + min).toFixed(4);
	}

	getMouse(canvas, evt) {
		var rect = canvas.getBoundingClientRect();
		return {
		  x: evt.clientX - rect.left,
		  y: evt.clientY - rect.top
		};
	}
}
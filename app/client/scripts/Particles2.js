function Particle(nttl, nx, ny, ndx, ndy, nr, ng, nb, na){
	if(!new.target){
		return new Particle(...arguments);
	}
	Object.defineProperties(this, {
		'activate': {
			value: function(nttl, nx, ny, ndx, ndy, nr, ng, nb, na){
				this.active = true;
				this.ttl = nttl;
				this.t = 0;
				this.x = nx;
				this.y = ny;
				this.dx = ndx;
				this.dy = ndy;
				// this.ddx = 0;
				// this.ddy = 0;
				// this.dddx = 0;
				// this.dddy = 0;
				this.r = nr;
				this.g = ng;
				this.b = nb;
				this.a = na;
			}
		}
	});
	this.activate(nttl, nx, ny, ndx, ndy, nr, ng, nb, na);
}
function Particles(renderer, renderFn){
	if(!new.target){
		return new Particles(...arguments);
	}

	const particles = [];
	for(let i=0; i<this.MAX_COUNT; ++i){
		particles.push(new Particle());
	}

	Object.defineProperties(this, {
		render: {
			value: function(){
				for(let i=0; i<particles.length; ++i){
					const p = particles[i];
					if(!p.active){
						continue;
					}
					renderFn.apply(p);
					renderer.point(p.x, p.y, p.r, p.g, p.b, p.a);
				}
			}
		}
	});
}
Object.defineProperties(Particles, {
	MAX_COUNT: {
		value: 3000,
		writable: true
	}
});
module.exports = Particles;

function updateParticle(){
	this.x += this.dx;
	this.y += this.dy;
}
function renderParticle(pjs){
	pjs.stroke(this.r, this.g, this.b, this.a);
	pjs.point(this.x, this.y);
}

function Particles(pjs, updateFn=updateParticle, renderFn=renderParticle){
	if(!new.target){
		return new Particles(...arguments);
	}

	let count = 2;
	let head = new Particle();
	head.next = new Particle();
	head.prev = head.next;
	head.prev.next = head;
	head.prev.prev = head;
	head.active = false;
	head.prev.active = false;

	this.ACCELERATION = [0, 0.25];
	this.ELASTICITY = 0.2;
	this.MAX_COUNT = 3000;

	Object.defineProperties(this, {
		count: {
			get: function(){
				return count;
			}
		},
		createParticle: { // ttl, x, y, dx, dy, r, g, b, a
			value: function(nttl, nx, ny, ndx, ndy, nr, ng, nb, na){
				let newP;
				if(head.prev.active){
					if(count>=this.MAX_COUNT){
						return;
					}
					newP = new Particle(nttl, nx, ny, ndx, ndy, nr, ng, nb, na);
					newP.next = head;
					newP.prev = head.prev;
					newP.prev.next = newP;
					head.prev = newP;
					head = newP;
					++count;
				}else{
					newP = head.prev;
					newP.activate(nttl, nx, ny, ndx, ndy, nr, ng, nb, na);
					head = newP;
				}
				return newP;
			}
		},
		list: {
			get: function(){
				return head;
			}
		},
		render: {
			value: function(){
				let cur = head;
				while(cur.active){
					updateFn.call(cur, this);
					renderFn.call(cur, pjs);

					const dead = cur;
					if(cur.ttl>0 && ++cur.t>=cur.ttl){
						cur.active = false;
					}
					cur = cur.next;
					// if we're at the end, no need to unlink
					if(cur === head){
						break;
					}
					if(!dead.active){	// move dead particle to end of list
						if(dead===head){
							head = dead.next;
						}else{
							dead.next.prev = dead.prev;
							dead.prev.next = dead.next;
							dead.next = head;
							dead.prev = head.prev;
							head.prev.next = dead;
							head.prev = dead;
						}
					}
				}
			}
		}
	});

	// ttl, x, y, dx, dy, r, g, b, a
	function Particle(nttl, nx, ny, ndx, ndy, nr, ng, nb, na){
		if(!new.target){
			return new Particle(...arguments);
		}

		Object.defineProperties(this, {
			activate: {
				value: function(nttl, nx, ny, ndx, ndy, nr, ng, nb, na){
					this.active = true;
					this.ttl = nttl;
					this.t = 0;
					this.x = nx;
					this.y = ny;
					this.dx = ndx;
					this.dy = ndy;
					this.ddx = 0;
					this.ddy = 0;
					this.dddx = 0;
					this.dddy = 0;
					this.r = nr;
					this.g = ng;
					this.b = nb;
					this.a = na;
				}
			}
		});
		this.activate(nttl, nx, ny, ndx, ndy, nr, ng, nb, na);
	}
}
module.exports = Particles;

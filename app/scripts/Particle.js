function ParticleJS(pjs, fn){
	if(!(this instanceof ParticleJS)){
		return new ParticleJS(pjs, fn);
	}

	var count = 2;
	var head = new Particle();
	head.next = new Particle();
	head.prev = head.next;
	head.prev.next = head;
	head.prev.prev = head;
	head.active = false;
	head.prev.active = false;

	this.acceleration = [0, 0.25];
	this.elasticity = 0.2;
	this.MAX_COUNT = 3000;

	Object.defineProperties(this, {
		'createParticle': { // ttl, x, y, dx, dy, r, g, b, a
			value: function(nttl, nx, ny, ndx, ndy, nr, ng, nb, na){
				if(head.prev.active){
					if(count>=this.MAX_COUNT){
						return;
					}
					var newP = new Particle(nttl, nx, ny, ndx, ndy, nr, ng, nb, na);
					newP.next = head;
					newP.prev = head.prev;
					newP.prev.next = newP;
					head.prev = newP;
					head = newP;
					++count;
				}else{
					var newP = head.prev;
					newP.activate(nttl, nx, ny, ndx, ndy, nr, ng, nb, na);
					head = newP;
				}
			}
		},
		'render': {
			value: function(){
				var cur = head;
				while(cur.active){
					fn.apply(cur);
					pjs.stroke(cur.r, cur.g, cur.b, cur.a);
					pjs.point(cur.x, cur.y);

					var p;
					if(++cur.t>=cur.ttl){
						cur.active = false;
						p = cur;
					}
					cur = cur.next;
					// if we're at the end, no need to unlink
					if(cur === head){
						break;
					}
					if(p){	// move p to end of list
						if(p===head){
							head = p.next;
						}else{
							p.next.prev = p.prev;
							p.prev.next = p.next;
							p.next = head;
							p.prev = head.prev;
							head.prev.next = p;
							head.prev = p;
						}
					}
				}
			}
		}
	});

	// ttl, x, y, dx, dy, r, g, b, a
	function Particle(nttl, nx, ny, ndx, ndy, nr, ng, nb, na){
		if(!(this instanceof Particle)){
			return new Particle(nttl, nx, ny, ndx, ndy, nr, ng, nb, na);
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

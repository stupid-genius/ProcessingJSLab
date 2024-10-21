const demos = require('./demos');
const renderer = require('./Renderer').Renderer();

const registry = Object.freeze({
	clear: {
		func: function(){
			this.clear();
		}
	},
	help: {
		func: function(){
			this.echo('Available commands:');
			Object.keys(registry).forEach(cmd => this.echo(cmd));
		},
	},
	load: {
		func: function(name, ...args){
			this.echo(`Loading ${name}…`);
			if(name in demos){
				renderer.init();
				demos[name].apply(this, args);
			}
		}
	},
	ls: {
		func: function(){
			this.echo('Available demos:');
			Object.keys(demos).forEach(demo => this.echo(demo));
		}
	}
});
module.exports = registry;

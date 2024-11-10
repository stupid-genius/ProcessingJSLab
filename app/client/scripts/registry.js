const demos = require('./demos');
const renderer = require('./Renderer').Renderer();

const registry = Object.freeze({
	cat: {
		func: function(name){
			this.echo(demos[name].toString());
		},
		man: 'Print code listing for [demo]'
	},
	clear: {
		func: function(){
			this.clear();
		}
	},
	help: {
		func: function(command){
			if(command === undefined){
				this.echo('Available commands:');
				Object.keys(registry).forEach(cmd => this.echo(cmd));
			}else{
				this.echo(registry[command].man);
			}
		},
		man: 'Print help text for [command].  If no command is passed, list available commands.',
		usage: 'help [command]'
	},
	load: {
		func: function(name, ...args){
			this.echo(`Loading ${name}…`);
			if(name in demos){
				renderer.init();
				demos[name].apply(this, args);
			}
		},
		man: 'Load a demo.  Some demos accept additional arguments.\n<b>Example:</b>\n`load chaos 6`.',
		usage: 'load [demo] [args]'
	},
	ls: {
		func: function(){
			this.echo('Available demos:');
			Object.keys(demos).forEach(demo => this.echo(demo));
		},
		man: 'List available demos'
	},
	properties: {
		func: function(name){
			if(name === undefined){
				this.echo(JSON.stringify(renderer, null, 2));
			}
			this.echo(renderer[name]);
		}
	}
});
module.exports = registry;

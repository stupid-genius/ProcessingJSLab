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
	init: {
		func: function(){
			renderer.init();
		}
	},
	load: {
		func: function(name, ...args){
			if(name in demos){
				this.echo(`Loading ${name}…`);
				renderer.init();
				demos[name].apply(demos, args);
			}
		},
		man: 'Load a demo.  Some demos accept additional arguments.\n<b>Example:</b>\n`load chaos 6`.',
		usage: 'load [demo] [args]'
	},
	ls: {
		func: function(){
			this.echo('Available demos:');
			Object.keys(demos).filter(e => e !== 'rod').forEach(demo => this.echo(demo));
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

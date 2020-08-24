var commands = {
	'help': function(){
		this.echo('Available commands:');
		var cmds = Object.keys(commands);
		for(var cmd in cmds){
			this.echo(cmds[cmd]);
		}
	},
	'load': function(demoName){
		demos[demoName].bind(processor)();
	},
	'ls': function(){
		this.echo('Available demos:');
		var cmds = Object.keys(demos);
		for(var demo in cmds){
			this.echo(cmds[demo]);
		}
	}
};

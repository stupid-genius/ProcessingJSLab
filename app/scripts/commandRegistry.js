var commands = {
	"help": function(){
		this.echo('Available commands:');
		var cmds = Object.keys(commands);
		for(var cmd in cmds){
			this.echo(cmds[cmd]);
		}
		return '';
	},
	"load": function(demoName){
		demos[demoName].bind(processor)();
	}
};

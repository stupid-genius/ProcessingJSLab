import * as esbuild from 'esbuild';
import { exec } from 'child_process';

const devMode = process.env.NODE_ENV === 'development';

const onBuild = {
	name: 'onBuild',
	setup(build){
		build.onEnd(result => {
			// console.log(result);
			exec('./tools/build.sh spa', (err, stdout, stderr) => {
				if(err || stderr){
					console.dir(err);
					console.error(stderr);
				}
				console.log(stdout);
			});
		});
	}
};

const context = await esbuild.context({
	bundle: true,
	// entryNames: '[dir]/[name]-[hash]',
	entryPoints: ['app/client/scripts/index.js', 'app/client/styles/main.css', 'app/client/scripts/rod.js'],
	// external: ['https://cdnjs.cloudflare.com/ajax/libs/processing.js/1.4.7/processing.min.js'],
	loader: {'.png': 'dataurl'},
	minify: !devMode,
	outbase: 'app/client',
	outdir: 'dist/client',
	platform: 'browser',
	// plugins: [onBuild],
	sourcemap: devMode
});

let interactive = false;
async function buildCmd(cmd){
	switch(cmd){
		case 'build':
			console.log('building...');
			await context.rebuild();
			break;
		case 'serve':
			console.log('serving...');
			console.log(await context.serve({
				servedir: 'dist/client',
				port: 3000
			}));
			break;
		case 'watch':
			console.log('watching...');
			await context.watch();
			break;
		case 'i':
			console.log('interactive mode');
			process.stdin.on('data', (d) => buildCmd(d.toString().trim()))
			interactive = true;
			break;
		case 'exit':
			console.log((await context.dispose()) || 'context disposed');
			process.exit();
			break;
		default:
			console.error(`Unknown command: ${cmd}`);
	}
}

if(process.argv.length > 2){
	await Promise.all(process.argv.slice(2).map((arg) => buildCmd(arg)));

	if(!interactive){
		buildCmd('exit');
	}
	process.on('SIGINT', () => {
		console.log('cleaning up');
		buildCmd('exit');
	});
} else {
	await buildCmd('build');
	await buildCmd('exit');
}

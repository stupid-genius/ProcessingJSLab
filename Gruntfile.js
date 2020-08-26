'use strict';

module.exports = function(grunt){
	require('jit-grunt')(grunt);
	grunt.initConfig({
		watch: {
		},
        browserSync: {
            options: {
                background: true
            },
            livereload: {
                options: {
                    server: {
                        baseDir: 'app',
                        routes: {
                            '/images': 'images',
                            '/scripts': 'scripts',
                            '/styles': 'styles'
                        }
                    },
                    port: 9000,
                    files: [
                        'app/*.html',
                        'app/styles/*.css',
                        'app/scripts/*.js'
                    ]
                }
            }
        },
        copy: {
            build:{
                files: [
                    {
                        expand: true,
                        cwd: 'app',
                        dest: 'build/',
                        src: [
                            'styles/**',
                            'scripts/**',
							'**'
                        ]
                    },
                    {
                        expand: true,
                        cwd: 'app/pages',
                        dest: 'build/',
                        src: '*.html'
                    }
                ]
            }
        }
	});

    grunt.registerTask('serve', 'start local server', function (){
        grunt.task.run([
            'browserSync:livereload',
            'watch'
        ]);
    });
    grunt.registerTask('build', 'create build', function(){
        grunt.task.run([
            'copy'
        ]);
    });
};

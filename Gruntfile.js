/* jshint node:true */
'use strict';
var babelify = require('babelify');

module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			main: {
				src: ['*.js', 'lib/**/*'],
				options: {
					jshintrc: true
				}
			}
		},

		jscs: {
			main: {
				config: '.jscsrc',
				src: ['*.js', 'lib/**/*'],
			}
		},

		githooks: {
			all: {
				'pre-push': 'jshint jscs',
			}
		},

		nodemon: {
			main: {
				script: 'bin/www',
				options: {
					env: {'DEBUG': 'coffee'},
					ext: 'js,json,html',
					ignore: ['node_modules/**']
				}
			}
		},

		watch: {
			scripts: {
				files: ['public/**/*.less'],
				tasks: ['less', 'autoprefixer'],
				options: {
					spawn: false
				}
			},
			js: {
				files: [
					'lib/client/*.js',
					'lib/client/**/*.js'
				],
				tasks: ['browserify'],
				options: {
					spawn: false
				}
			}
		},

		less: {
			main: {
				options: {
					paths: [
						'public/less'
					],
				},
				files: {
					'public/css/main.css': 'public/less/main.less'
				}
			}
		},

		autoprefixer: {
			options: {
				diff: true
			},
			run: {
				src: 'public/css/main.css'
			}
		},

		concurrent: {
			tasks: ['nodemon:main', 'watch'],
			options: {
				logConcurrentOutput: true
			}
		},

		browserify: {
			options: {
				transform: [
					babelify
				],
				browserifyOptions: {
					debug: true
				}
			},
			client: {
				src: [
					'lib/client/main.js',
				],
				dest: 'public/js/main.js'
			}
		},

	});

	grunt.registerTask('default', [
		'jshint',
		'jscs',
		'githooks'
	]);

	grunt.registerTask('build', [
		'jshint',
		'jscs',
		'less',
		'autoprefixer',
		'browserify'
	]);

	grunt.registerTask('start', [
		'build',
		'concurrent:tasks'
	]);

};

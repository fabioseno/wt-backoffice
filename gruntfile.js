module.exports = function (grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: ['docs', 'tests/coverage', 'www'],

        jshint: {
            all: ['src/components/**/*.js']
        },

        karma: {
            unit: {
                configFile: 'config/karma.conf.js'
            }
        },

        concat: {
            dist: {
                src: ['src/components/backoffice.js', 'src/components/**/*.js'],
                dest: 'dist/app.js'
            }
        },
        
        copy: {
            dev: {
                files: [
                    { expand: true, cwd: 'src', src: ['assets/**'], dest: 'www/'},
                    { expand: true, cwd: 'dist', src: ['app.js'], dest: 'www/components/'},
                    { expand: true, cwd: 'src/components', src: ['translate.js'], dest: 'www/components/'},
                    { expand: true, cwd: 'src', src: ['components/**/*.html'], dest: 'www/'},
                    { expand: true, cwd: 'src', src: ['config/*'], dest: 'www'},
                    { expand: true, cwd: 'src', src: ['lib/**'], dest: 'www/'},
                    { expand: true, cwd: 'src', src: ['index.html'], dest: 'www/'}
                ]
            }
        },

        uglify: {
            options: {
                banner: '/*! Backoffice <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'dist/app.js',
                dest: 'dist/app.min.js'
            }
        },

        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                options: {
                    paths: ['src/components'],
                    outdir: 'docs/'
                }
            }
        },

        'http-server': {
            'dev': {

                // the server root directory
                root: 'www',

                port: 8282,
                // port: function() { return 8282; }

                host: "localhost",

                //cache: <sec>,
                showDir : true,
                autoIndex: true,
                defaultExt: "html",

                // run in parallel with other tasks
                runInBackground: false
            }
        }
    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-http-server');

    // Test task
    grunt.registerTask('test', function () {
        grunt.task.run('karma');
    });

    // Default task
    grunt.registerTask('default', ['clean', 'jshint', 'concat', 'uglify', 'yuidoc']);
    
    grunt.registerTask('dev', ['default', 'copy:dev', 'http-server:dev']);

};
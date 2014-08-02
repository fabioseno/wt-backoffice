module.exports = function (grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: ['dist', 'tests/coverage', 'docs'],

        jshint: {
            all: ['js/**/*.js']
        },

        karma: {
            unit: {
                configFile: 'config/karma.conf.js'
            }
        },

        concat: {
            dist: {
                src: ['js/backoffice.js', 'js/**/*.js'],
                dest: 'dist/backoffice_<%= pkg.version %>.js'
            }
        },

        uglify: {
            options: {
                banner: '/*! Backoffice <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'dist/backoffice_<%= pkg.version %>.js',
                dest: 'dist/backoffice_<%= pkg.version %>.min.js'
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
                //root: '/index.html',

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
    
    grunt.registerTask('dev', ['default', 'http-server:dev']);

};
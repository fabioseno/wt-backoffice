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
                    paths: ['components'],
                    outdir: 'docs/'
                }
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
    
    // Test task
    grunt.registerTask('test', function () {
        grunt.task.run('karma');
    });
    
    // Default task
    grunt.registerTask('default', ['test', 'clean', 'jshint', 'concat', 'uglify', 'yuidoc']);
    
};
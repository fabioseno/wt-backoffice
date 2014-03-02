// Karma configuration
// Generated on Fri Dec 13 2013 19:33:25 GMT-0200 (E. South America Daylight Time)

module.exports = function (config) {
    'use strict';
    
    config.set({
        
        // base path, that will be used to resolve files and exclude
        basePath: '../',
        
        // frameworks to use
        frameworks: ['jasmine'],
        
        //plugins: ['karma-jasmine', 'karma-phantomjs-launcher'],
        
        // list of files / patterns to load in the browser
        files: [
            'lib/angular/angular.js',
            'lib/angular-mocks/angular-mocks.js',
            'modules/backoffice.js',
            'modules/**/*.js',
            'tests/**/*.js'
        ],
        
        // list of files to exclude
        exclude: [
            
        ],
        
        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['progress', 'coverage'],
        
        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            'js/**/*.js': ['coverage']
        },
        
        // optionally, configure the reporter
        coverageReporter: {
            type : 'html',
            dir : 'tests/coverage/'
        },
        
        // web server port
        //port: 50960,
        
        
        // enable / disable colors in the output (reporters and logs)
        colors: true,
        
        
        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,
        
        
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,
        
        
        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera (has to be installed with `npm install karma-opera-launcher`)
        // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
        // - PhantomJS
        // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
        browsers: ['PhantomJS'],
        
        
        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,
        
        
        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true
    });
};
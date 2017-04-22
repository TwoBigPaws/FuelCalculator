// Karma configuration
// Generated on Fri Apr 07 2017 20:13:58 GMT+1000 (AEST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
      'js/*.js',
      'test/*.js'
    ],

    preprocessors: {
      // add webpack as preprocessor
      'test/*_test.js': ['webpack', 'sourcemap'],
      'test/**/*_test.js': ['webpack', 'sourcemap']
    },

    webpack: {
      // you don't need to specify the entry option because
      // karma watches the test entry points
      // webpack watches dependencies

      // ... remainder of webpack configuration (or import)
    },

    webpackMiddleware: {
      // webpack-dev-middleware configuration
      // i.e.
      noInfo: true,
      // and use stats to turn off verbose output
      stats: {
        // options i.e.
        chunks: false
      }
    },

    plugins: [
      require("karma-webpack"),
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-coverage',
      'karma-html-detailed-reporter',
      'karma-sourcemap-loader'
    ],


    // list of files to exclude
    exclude: [
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'htmlDetailed'],

    htmlReporter: {
      outputFile: 'test/units.html',

      // Optional
      pageTitle: 'FuelCalculator Unit Tests',
      subPageTitle: '',
      groupSuites: true,
      useCompactStyle: true,
      useLegacyStyle: true
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}

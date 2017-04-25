'use strict';

var gulp = require('gulp'),
  argv = require('yargs').argv,
  run = require('gulp-run'),
  awspublish = require('gulp-awspublish');

const ENV = {
  production: 'production',
  staging: 'staging'
};

const BUCKETS = {
  production: 'racing-apps.com',
  staging: 'staging.racing-apps.com'
};


gulp.task('webpack', function(){
  return run('npm run bundle').exec();
});

gulp.task('copy-sources',['webpack'], function () {
  return gulp.src(['js/**', 'index.html', 'fuel.png'],{ "base" : "." }).pipe(gulp.dest('site'));
});


gulp.task('deploy', ['webpack','copy-sources'],function () {

  // Figure out which bucket we are deploying to based on the environment
  // specified by the User.
  let validEnvironments = [ENV.production, ENV.staging];
  var bucket;
  if (argv.env &&
    validEnvironments.indexOf(argv.env) != -1) {
    bucket = BUCKETS[argv.env];
  } else {
    console.error('Error! Please specify a valid environment!');
    return;
  }

  console.log("Deploying to " + bucket);

  var publisher = awspublish.create({
    region: 'us-east-1',
    params: {
      Bucket: bucket
    }
  }, {
    cacheFileName: '.cache'
  });

  return gulp.src('site/**')
    .pipe(awspublish.gzip())  // gzip, Set Content-Encoding headers and add .gz extension
    .pipe(publisher.publish())
    .pipe(publisher.sync())
    .pipe(publisher.cache())              // create a cache file to speed up consecutive uploads
    .pipe(awspublish.reporter());         // print upload updates to console
});



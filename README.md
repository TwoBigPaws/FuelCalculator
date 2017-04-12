# FuelCalculator
A quick and helpful Fuel Calculator


## Development & Using locally

This project uses `npm` as it's build system.  You can [download it here](https://www.npmjs.com/get-npm).

Rather than commit _all_ the necessary components within this repository, `npm` will download this for you:

    npm install
    
    
# Continuous Integration (CI)

All branches and pull-requests are tracked via the TravisCI system: 

https://travis-ci.org/TwoBigPaws/FuelCalculator 

[![Build Status](https://travis-ci.org/TwoBigPaws/FuelCalculator.svg?branch=master)](https://travis-ci.org/TwoBigPaws/FuelCalculator)

## Testing

### Unit tests

This project uses [Karma/Jasmine](https://jasmine.github.io/) unit tests, which by default run continuously:

    $ npm test
    
    > iracing-fuelcalculator@0.0.1 test /Users/psmith/Aconex/repos/personal/FuelCalculator
    > ./node_modules/karma/bin/karma start karma.conf.js
    
    12 04 2017 16:33:43.479:WARN [karma]: No captured browser, open http://localhost:9876/
    12 04 2017 16:33:43.492:INFO [karma]: Karma v1.6.0 server started at http://0.0.0.0:9876/
    12 04 2017 16:33:43.493:INFO [launcher]: Launching browser PhantomJS with unlimited concurrency
    12 04 2017 16:33:43.499:INFO [launcher]: Starting browser PhantomJS
    12 04 2017 16:33:44.457:INFO [PhantomJS 2.1.1 (Mac OS X 0.0.0)]: Connected on socket 8jbyd89EGDyJIBtdAAAA with id 29197872
    PhantomJS 2.1.1 (Mac OS X 0.0.0): Executed 9 of 9 SUCCESS (0.014 secs / 0.036 secs)
    
(Press `CTRL-C` to cancel continous mode)
    
See the `test` sub-directory for the unit tests.
    
### End to End Browser testing
This project uses [Protracter]() to run automated in-browser (Chrome) end-to-end (e2e) testing.  

#### Prerequisites 
To run these tests you will need
to install some additional components:

    # install these tools globally, not inside thi project - this way they're on your path  
    npm install -g http-server webdriver-manager
    
    # update the webdriver
    webdriver-manager update
    

    
Once this is installed, you can run the e2e tests.  

You will need _*3*_ terminal windows:

1. Start the local webserver to server the content:

     
     http-server

2. Start Web-driver
 

    webdriver-manager start
      
      
3. Now run the actual tests


    protractor protractor/protractor.conf
 

See the `protractor` sub-directory with the tests and configuration defined.

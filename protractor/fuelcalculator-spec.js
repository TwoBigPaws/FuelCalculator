describe('FuelCalculator By Lap', function() {
  it('should show pitstop table with correct number of pitstops', function() {
    browser.get('http://localhost:8080/');

    element(by.id('byLapTab')).click();

    element(by.model('fuelTank.consumption')).isDisplayed();

    element(by.model('fuelTank.maximumFuel')).clear().sendKeys('3');
    element(by.model('numberOfLaps')).sendKeys('20');
    element(by.model('fuelTank.consumption')).sendKeys('0.605');
    element(by.model('fuelTank.minimumFuel')).sendKeys('0.3');


    // really need to use the gridTest but not sure how to include that library in there yett..
    // see http://ui-grid.info/docs/#/tutorial/403_end_to_end_testing
    // I've copied this from the test utility itself for now.
    var rows = element(by.id('pitStopGrid')).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') );
    expect(rows.count()).toEqual(4);

    expect(element(by.binding('lapsinsession')).getText()).toBe('Your race should be 20 laps');
    expect(element(by.binding('fuelneededinsession')).getText()).toBe('You need 12.100 units of fuel');
  });
});

describe('FuelCalculator By Time', function() {
  it('it should calculate correct number of laps', function() {
    browser.get('http://localhost:8080/');

    element(by.id('byTimeTab')).click();

    element(by.model('fuelTank.consumption')).isDisplayed();

    element(by.model('sessiontimeminutes')).sendKeys('40');
    element(by.model('laptime')).sendKeys('2:47');
    element(by.model('fuelTank.consumption')).sendKeys('2.69');
    element(by.model('fuelTank.maximumFuel')).clear().sendKeys('90');
    element(by.model('fuelTank.minimumFuel')).sendKeys('0.3');



    // really need to use the gridTest but not sure how to include that library in there yett..
    // see http://ui-grid.info/docs/#/tutorial/403_end_to_end_testing
    // I've copied this from the test utility itself for now.
    var rows = element(by.id('pitStopGrid')).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') );
    expect(rows.count()).toEqual(0);

    expect(element(by.binding('lapsinsession')).getText()).toBe('Your race should be 15 laps');
    expect(element(by.binding('fuelneededinsession')).getText()).toBe('You need 40.350 units of fuel');
  });
})

describe('Tab Switching', function() {
  it('It should clear the form when switching tabs', function() {
    browser.get('http://localhost:8080/');

    element(by.id('byTimeTab')).click();

    element(by.model('sessiontimeminutes')).sendKeys('40');
    element(by.model('laptime')).sendKeys('2:47');
    element(by.model('fuelTank.consumption')).sendKeys('2.69');
    element(by.model('fuelTank.maximumFuel')).clear().sendKeys('90');
    element(by.model('fuelTank.minimumFuel')).sendKeys('0.3');


    element(by.id('byLapTab')).click();

    var rows = element(by.id('pitStopGrid')).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') );
    expect(rows.count()).toEqual(0);

    expect(element(by.model('fuelTank.consumption')).getText()).toBe('');
    expect(element(by.model('fuelTank.minimumFuel')).getText()).toBe('');
    expect(element(by.model('fuelTank.maximumFuel')).getText()).toBe('');
  });
});

describe('Regression Tests', function() {
  it("It should not treat Consumption as a string, it\'s a number", function() {
    browser.get('http://localhost:8080/');

    element(by.id('byLapTab')).click();

  element(by.model('fuelTank.consumption')).isDisplayed();

  element(by.model('fuelTank.maximumFuel')).clear().sendKeys('20');
  element(by.model('numberOfLaps')).sendKeys('20');
  element(by.model('fuelTank.consumption')).sendKeys('4');
  element(by.model('fuelTank.minimumFuel')).sendKeys('4');


  // really need to use the gridTest but not sure how to include that library in there yett..
  // see http://ui-grid.info/docs/#/tutorial/403_end_to_end_testing
  // I've copied this from the test utility itself for now.
  var rows = element(by.id('pitStopGrid')).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') );
  expect(rows.count()).toEqual(4);

  expect(element(by.binding('lapsinsession')).getText()).toBe('Your race should be 20 laps');
  expect(element(by.binding('fuelneededinsession')).getText()).toBe('You need 80.000 units of fuel');
  });
});




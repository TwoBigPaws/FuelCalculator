describe('FuelCalculator By Lap', function() {
  it('should show pitstop table with correct number of pitstops', function() {
    browser.get('http://localhost:8080/');

    element(by.id('byLapTab')).click();

    element(by.model('consumption')).isDisplayed();

    element(by.model('totaltanksize')).clear().sendKeys('3');
    element(by.model('numberOfLaps')).sendKeys('20');
    element(by.model('consumption')).sendKeys('0.605');


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

    element(by.model('consumption')).isDisplayed();

    element(by.model('sessiontimeminutes')).sendKeys('40');
    element(by.model('lapminutes')).sendKeys('2');
    element(by.model('lapseconds')).sendKeys('47');
    element(by.model('consumption')).sendKeys('2.69');
    element(by.model('totaltanksize')).clear().sendKeys('90');


    // really need to use the gridTest but not sure how to include that library in there yett..
    // see http://ui-grid.info/docs/#/tutorial/403_end_to_end_testing
    // I've copied this from the test utility itself for now.
    var rows = element(by.id('pitStopGrid')).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') );
    expect(rows.count()).toEqual(0);

    expect(element(by.binding('lapsinsession')).getText()).toBe('Your race should be 15 laps');
    expect(element(by.binding('fuelneededinsession')).getText()).toBe('You need 40.350 units of fuel');
  });
});




describe('FuelCalculator By Lap', function() {
  it('should show pitstop table with correct number of pitstops', function() {
    browser.get('http://localhost:8080/');

    element(by.id('byLapTab')).click();

    element(by.model('totaltanksize')).clear().sendKeys('3');
    element(by.model('numberOfLaps')).sendKeys('20');
    element(by.model('consumption')).sendKeys('0.605');


    var pitTable = element.all(by.repeater('pit in pit'));
    expect(pitTable.count()).toEqual(5);

    expect(element(by.binding('lapsinsession')).getText()).toBe('Your race should be 20 laps');
    expect(element(by.binding('fuelneededinsession')).getText()).toBe('You need 12.100 units of fuel');
    //expect(element.all(by.id('CalculatedFuelRequirement')).getAttribute('value')).toEqual('You need 12.100 units of fuel');

    //browser.pause();

  });
});

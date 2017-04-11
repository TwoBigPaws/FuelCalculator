"use strict"

describe('Calculator', function () {
  var fuelTankSize = 3, expectedLaps = 20, fuelConsumptionPerLap = 0.605;
  var $ByLap;

  beforeEach(module("FuelCalculators"));

  beforeEach(inject(function (_ByLap_) {
    $ByLap = _ByLap_;
  }));

  it('should handle no lapDapHandler correctly', function () {

    var fc = new $ByLap.FuelCalculatorByLap(fuelTankSize, expectedLaps, fuelConsumptionPerLap, undefined, {});
    fc.startRace();
  });

  it('should handle no pitStopHandler correctly', function () {
    var fc = new $ByLap.FuelCalculatorByLap(fuelTankSize, expectedLaps, fuelConsumptionPerLap, {}, undefined);
    fc.startRace();
  });

  it('should compute correct number of laps', function () {
    var lapDataHandler = {};
    lapDataHandler.handleData = jasmine.createSpy("handleData");
    var fc = new $ByLap.FuelCalculatorByLap(fuelTankSize, expectedLaps, fuelConsumptionPerLap, lapDataHandler, undefined);
    fc.startRace();
    expect(lapDataHandler.handleData.calls.count()).toBe(21);
  });

  it('should compute correct number of pitstops', function () {
    var pitStopHandler = {};
    pitStopHandler.handlePitStop = jasmine.createSpy("handlePitStop");
    var fc = new $ByLap.FuelCalculatorByLap(fuelTankSize, expectedLaps, fuelConsumptionPerLap, undefined, pitStopHandler);
    fc.startRace();
    expect(pitStopHandler.handlePitStop.calls.count()).toBe(5);
  });

  it('Pitstop event should indicate how much fuel was put in', function () {
    var pitStopHandler = {};
    pitStopHandler.handlePitStop = jasmine.createSpy("handlePitStop");
    var fc = new $ByLap.FuelCalculatorByLap(10, 10, 2, undefined, pitStopHandler);
    fc.startRace();
    expect(pitStopHandler.handlePitStop.calls.first()).toEqual({object: pitStopHandler, args: [{lapNumber:5, fuelState:0, fuelAdded:10, fuelStateOnExit:10}], returnValue: undefined});

  });

  it('should not run any laps with 0 fuel tank consumption', function () {
    var lapDataHandler = {};
    lapDataHandler.handleData = jasmine.createSpy("handleData");
    var fc = new $ByLap.FuelCalculatorByLap(fuelTankSize, expectedLaps, 0, lapDataHandler, undefined);
    fc.startRace();
    expect(lapDataHandler.handleData.calls.count()).toBe(0);
  });

  it('should not run any laps with 0 expectedLaps', function () {
    var lapDataHandler = {};
    lapDataHandler.handleData = jasmine.createSpy("handleData");
    var fc = new $ByLap.FuelCalculatorByLap(fuelTankSize, 0, fuelConsumptionPerLap, lapDataHandler, undefined);
    fc.startRace();
    expect(lapDataHandler.handleData.calls.count()).toBe(0);
  });

  it('should not suggest to pit on the final lap...', function () {
    var pitStopHandler = {};
    pitStopHandler.handlePitStop = jasmine.createSpy("handlePitStop");
    var fc = new $ByLap.FuelCalculatorByLap(9.7, 16, 0.605, undefined, pitStopHandler);
    fc.startRace();
    expect(pitStopHandler.handlePitStop.calls.count()).toBe(0);
  });

  it('should not suggest to pit on the final lap...', function () {
    var pitStopHandler = {numPitstops: 0, fuelAdded: 0};
    pitStopHandler.handlePitStop = function (pitStopData) {
      this.fuelAdded = pitStopData.fuelAdded;
      this.numPitstops++;
    }
    var fc = new $ByLap.FuelCalculatorByLap(9.7, 16, 0.605, undefined, pitStopHandler);
    fc.startRace();
    expect(pitStopHandler.numPitstops).toBe(0);
    // TODO test suggested fuel is only 1 lap's worth
    expect(pitStopHandler.fuelAdded).toEqual(0.605);


  });

});

"use strict"

describe('Calculator', function () {
  var $ByLap;
  var fuelTankAttributes;
  var expectedLaps = 20;
  var pitStopParameters = {expectedLapTime:107, pitStopTimePenalty:0};

  beforeEach(module("FuelCalculators"));

  beforeEach(inject(function (_ByLap_) {
    $ByLap = _ByLap_;
    fuelTankAttributes = {maximumFuel: 9, initialFuel: 9, minimumFuel:0, consumption:  0.605};
  }));

  it('should handle no lapDapHandler correctly', function () {

    var fc = new $ByLap.FuelCalculatorByLap(fuelTankAttributes, expectedLaps, pitStopParameters, undefined, {});
    fc.startRace();
  });

  it('should handle no pitStopHandler correctly', function () {
    var fc = new $ByLap.FuelCalculatorByLap(fuelTankAttributes, expectedLaps, pitStopParameters, {}, undefined);
    fc.startRace();
  });

  it('should compute correct number of laps', function () {
    var lapDataHandler = {};
    lapDataHandler.handleData = jasmine.createSpy("handleData");
    var fc = new $ByLap.FuelCalculatorByLap(fuelTankAttributes, expectedLaps, pitStopParameters, lapDataHandler, undefined);
    fc.startRace();
    expect(lapDataHandler.handleData.calls.count()).toBe(21);
  });

  it('should compute correct number of pitstops', function () {
    var pitStopHandler = {};
    pitStopHandler.handlePitStop = jasmine.createSpy("handlePitStop");
    var fuelTankAttributes = {maximumFuel: 9, initialFuel: 9, minimumFuel: 0, consumption:  2};
    var fc = new $ByLap.FuelCalculatorByLap(fuelTankAttributes, expectedLaps, pitStopParameters, undefined, pitStopHandler);
    fc.startRace();
    expect(pitStopHandler.handlePitStop.calls.count()).toBe(4);
  });

  it('Pitstop event should indicate how much fuel was put in', function () {
    var pitStopHandler = {};
    pitStopHandler.handlePitStop = jasmine.createSpy("handlePitStop");
    var fc = new $ByLap.FuelCalculatorByLap({maximumFuel: 10, minimumFuel:0, consumption:2}, 10, pitStopParameters, undefined, pitStopHandler);
    fc.startRace();
    expect(pitStopHandler.handlePitStop.calls.first()).toEqual({object: pitStopHandler, args: [{lapNumber:5, fuelState:0, fuelAdded:10, fuelStateOnExit:10}], returnValue: undefined});

  });

  it('should not run any laps with 0 fuel tank consumption', function () {
    var lapDataHandler = {};
    lapDataHandler.handleData = jasmine.createSpy("handleData");
    var fc = new $ByLap.FuelCalculatorByLap(fuelTankAttributes, expectedLaps, 0, pitStopParameters, lapDataHandler, undefined);
    fc.startRace();
    expect(lapDataHandler.handleData.calls.count()).toBe(0);
  });

  it('should not run any laps with 0 expectedLaps', function () {
    var lapDataHandler = {};
    lapDataHandler.handleData = jasmine.createSpy("handleData");
    var fc = new $ByLap.FuelCalculatorByLap(fuelTankAttributes, 0, pitStopParameters, lapDataHandler, undefined);
    fc.startRace();
    expect(lapDataHandler.handleData.calls.count()).toBe(0);
  });

  it('should not suggest to pit on the final lap...', function () {
    var pitStopHandler = {};
    pitStopHandler.handlePitStop = jasmine.createSpy("handlePitStop");
    var fc = new $ByLap.FuelCalculatorByLap({maximumFuel: 9.7, consumption: 0.605}, 16, pitStopParameters, undefined, pitStopHandler);
    fc.startRace();
    expect(pitStopHandler.handlePitStop.calls.count()).toBe(0);
  });

  it('should not suggest to pit on the final lap...', function () {
    var pitStopHandler = {numPitstops: 0, fuelAdded: 0};
    pitStopHandler.handlePitStop = function (pitStopData) {
      this.fuelAdded = pitStopData.fuelAdded;
      this.numPitstops++;
    }
    var fc = new $ByLap.FuelCalculatorByLap({maximumFuel: 9.7, consumption: 0.605}, 16, pitStopParameters, undefined, pitStopHandler);
    fc.startRace();
    expect(pitStopHandler.numPitstops).toBe(0);
  });

  it('should not attempt to cough across the line gasping for fuel', function () {
    var pitStopHandler = {numPitstops: 0, fuelAdded: 0};
    pitStopHandler.handlePitStop = function (pitStopData) {
      this.fuelAdded = pitStopData.fuelAdded;
      this.numPitstops++;
    }
    var fc = new $ByLap.FuelCalculatorByLap({maximumFuel: 5, minimumFuel:0.3, consumption: 1}, 5, pitStopParameters, undefined, pitStopHandler);
    fc.startRace();
    expect(pitStopHandler.numPitstops).toBe(1);
  });



});

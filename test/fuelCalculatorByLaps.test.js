"use strict"

describe('Calculator', function () {
  var $ByLap;
  var fuelTankAttributes;
  var raceParameters;

  beforeEach(module("Strategies"));
  beforeEach(module("FuelCalculators"));

  beforeEach(inject(function (RaceByLap) {
    $ByLap = RaceByLap;
    fuelTankAttributes = {maximumFuel: 9, initialFuel: 9, minimumFuel:0, consumption:  0.605};
    raceParameters = {numLaps: 20, expectedLapTime:107, pitStopTimePenalty:0};
  }));

  it('should handle no lapDapHandler correctly', function () {

    var fc = new $ByLap.createRace(fuelTankAttributes, raceParameters, undefined, {});
    fc.startRace();
  });

  it('should handle no pitStopHandler correctly', function () {
    var fc = new $ByLap.createRace(fuelTankAttributes, raceParameters, {}, undefined);
    fc.startRace();
  });

  it('should confirm the car saw the Chequered Flag', function () {
    var fc = new $ByLap.createRace(fuelTankAttributes, raceParameters, {}, undefined);
    var raceResult = fc.startRace();
    expect(raceResult.chequeredFlag).toBe(true);
  });

  it('should run out of Fuel and not complete the race if using a dogy PitStopStrategy', function () {
    raceParameters.pitStopStrategy = {
      shouldPit: function (lapData) {
        return false;
      }
    };
    var fc = new $ByLap.createRace(fuelTankAttributes, raceParameters, {}, undefined);
    var raceResult = fc.startRace();
    expect(raceResult.chequeredFlag).toBe(false);
    expect(raceResult.lapsCompleted).toBe(14); // we make 15 laps with this consumption before it gives up on lap 16
  });

  it('should return Race Result showing all the laps Completed', function () {
    fuelTankAttributes = {maximumFuel: 9, initialFuel: 1, minimumFuel:0, consumption:  0.605};
    var fc = new $ByLap.createRace(fuelTankAttributes, raceParameters, {}, undefined);
    var raceResult = fc.startRace();
    expect(raceResult.lapsCompleted).toBe(20);
  });

  it('should compute correct number of laps', function () {
    var lapDataHandler = {};
    lapDataHandler.handleData = jasmine.createSpy("handleData");
    var fc = new $ByLap.createRace(fuelTankAttributes, raceParameters, lapDataHandler, undefined);
    fc.startRace();
    expect(lapDataHandler.handleData.calls.count()).toBe(21);
  });

  it('should compute correct number of pitstops', function () {
    var pitStopHandler = {};
    pitStopHandler.handlePitStop = jasmine.createSpy("handlePitStop");
    var fuelTankAttributes = {maximumFuel: 9, initialFuel: 9, minimumFuel: 0, consumption:  2};
    var fc = new $ByLap.createRace(fuelTankAttributes, raceParameters, undefined, pitStopHandler);
    fc.startRace();
    expect(pitStopHandler.handlePitStop.calls.count()).toBe(4);
  });

  it('Pitstop event should indicate how much fuel was put in', function () {
    var pitStopHandler = {};
    pitStopHandler.handlePitStop = jasmine.createSpy("handlePitStop");
    var fc = new $ByLap.createRace({maximumFuel: 10, minimumFuel:0, consumption:2}, raceParameters, undefined, pitStopHandler);
    fc.startRace();
    expect(pitStopHandler.handlePitStop.calls.first()).toEqual({object: pitStopHandler, args: [{lapNumber:5, fuelState:0, lapsRemaining:15, fuelAdded:10, fuelStateOnExit:10}], returnValue: undefined});

  });

  it('should not run any laps with 0 fuel tank consumption', function () {
    var lapDataHandler = {};
    lapDataHandler.handleData = jasmine.createSpy("handleData");
    fuelTankAttributes.consumption=0;
    var fc = new $ByLap.createRace(fuelTankAttributes, raceParameters, lapDataHandler, undefined);
    fc.startRace();
    expect(lapDataHandler.handleData.calls.count()).toBe(0);
  });

  it('should not run any laps with 0 numLaps', function () {
    var lapDataHandler = {};
    lapDataHandler.handleData = jasmine.createSpy("handleData");
    raceParameters.numLaps = 0;
    var fc = new $ByLap.createRace(fuelTankAttributes,  raceParameters, lapDataHandler, undefined);
    fc.startRace();
    expect(lapDataHandler.handleData.calls.count()).toBe(0);
  });

  it('should not suggest to pit on the final lap...', function () {
    var pitStopHandler = {};
    pitStopHandler.handlePitStop = jasmine.createSpy("handlePitStop");
    var fc = new $ByLap.createRace({maximumFuel: 9.7, consumption: 0.605}, raceParameters, undefined, pitStopHandler);
    fc.startRace();
    expect(pitStopHandler.handlePitStop.calls.count()).toBe(0);
  });

  it('should not suggest to pit on the final lap...', function () {
    var pitStopHandler = {numPitstops: 0, fuelAdded: 0};
    pitStopHandler.handlePitStop = function (pitStopData) {
      this.fuelAdded = pitStopData.fuelAdded;
      this.numPitstops++;
    }
    var fc = new $ByLap.createRace({maximumFuel: 9.7, consumption: 0.605}, raceParameters, undefined, pitStopHandler);
    fc.startRace();
    expect(pitStopHandler.numPitstops).toBe(0);
  });

  it('should not attempt to cough across the line gasping for fuel', function () {
    var pitStopHandler = {numPitstops: 0, fuelAdded: 0};
    pitStopHandler.handlePitStop = function (pitStopData) {
      this.fuelAdded = pitStopData.fuelAdded;
      this.numPitstops++;
    };
    raceParameters.numLaps = 5;
    var fc = new $ByLap.createRace({maximumFuel: 5, minimumFuel:0.3, consumption: 1}, raceParameters, undefined, pitStopHandler);
    fc.startRace();
    expect(pitStopHandler.numPitstops).toBe(1);
  });



});

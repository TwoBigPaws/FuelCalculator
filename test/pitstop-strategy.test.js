"use strict"

describe('Pitstop Strategy', function () {
  var $ByLap;
  var fuelTankAttributes;
  var expectedLaps = 20;

  beforeEach(module("FuelCalculators"));

  beforeEach(inject(function (_ByLap_) {
    $ByLap = _ByLap_;
    fuelTankAttributes = {maximumFuel: 9, initialFuel: 9, minimumFuel:0, consumption: 1};
  }));


  it('should calculate expected race time with no pitstops', function () {
    var raceParameters = {expectedLapTime:100, pitStopTimePenalty:60};
    var fc = new $ByLap.FuelCalculatorByLap(fuelTankAttributes, 9, raceParameters);
    fc.startRace();
    expect(fc.totalRaceTime()).toBe(900);
  });

  it('should calculate expected race time with 1 pitstops', function () {
    var raceParameters = {expectedLapTime:100, pitStopTimePenalty:60};
    fuelTankAttributes.consumption = 1.5; // increase fuel consumption so that it forces at least 1 pitstop
    var fc = new $ByLap.FuelCalculatorByLap(fuelTankAttributes, 9, raceParameters);
    fc.startRace();
    expect(fc.totalRaceTime()).toBe(960);
  });

  it('should calculate expected race time with 2 pitstops', function () {
    var raceParameters = {expectedLapTime:100, pitStopTimePenalty:60};
    fuelTankAttributes.consumption = 3; // increase fuel consumption so that it forces at least 1 pitstop
    var fc = new $ByLap.FuelCalculatorByLap(fuelTankAttributes, 9, raceParameters);
    fc.startRace();
    expect(fc.totalRaceTime()).toBe(1020); // 900 + 3 pitstops
  });

  it('should calculate expected race time with initial Fuel', function () {
    var raceParameters = {expectedLapTime:100, pitStopTimePenalty:60};
    fuelTankAttributes.initialFuel = 3; // start off with a smaller tank which forces a pitstop
    var fc = new $ByLap.FuelCalculatorByLap(fuelTankAttributes, 9, raceParameters);
    fc.startRace();
    expect(fc.totalRaceTime()).toBe(960); // 900 + 3 pitstops
  });

  it('should not be a valid Race if there is no fuel in the tank', function () {
    var raceParameters = {expectedLapTime:100, pitStopTimePenalty:60};
    fuelTankAttributes.initialFuel = 0; // start off with a smaller tank which forces a pitstop
    var fc = new $ByLap.FuelCalculatorByLap(fuelTankAttributes, 9, raceParameters);
    expect(fc.canStartRace()).toBe(false);
  });

  it('should not be a valid Race if the car consumes no fuel', function () {
    var raceParameters = {expectedLapTime:100, pitStopTimePenalty:60};
    fuelTankAttributes.consumption = 0;
    var fc = new $ByLap.FuelCalculatorByLap(fuelTankAttributes, 9, raceParameters);
    expect(fc.canStartRace()).toBe(false);
  });

  it('should not be a valid Race if there are no laps', function () {
    var raceParameters = {expectedLapTime:100, pitStopTimePenalty:60};
    var fc = new $ByLap.FuelCalculatorByLap(fuelTankAttributes, 0, raceParameters);
    expect(fc.canStartRace()).toBe(false);
  });





});

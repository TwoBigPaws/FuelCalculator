"use strict"

describe('Pitstop Strategy', function () {
  var $ByLap;
  var fuelTankAttributes;
  var raceParameters;

  beforeEach(module("FuelCalculators"));

  beforeEach(inject(function (_ByLap_) {
    $ByLap = _ByLap_;
    fuelTankAttributes = {maximumFuel: 9, initialFuel: 9, minimumFuel:0, consumption: 1};
    raceParameters = {numLaps: 9, expectedLapTime:100, pitStopTimePenalty:60};
  }));


  it('should calculate expected race time with no pitstops', function () {
    var fc = new $ByLap.FuelCalculatorByLap(fuelTankAttributes, raceParameters);
    var raceResult = fc.startRace();
    expect(raceResult.chequeredFlag).toBe(true);
    expect(fc.totalRaceTime()).toBe(900);
  });

  it('should calculate expected race time with 1 pitstops', function () {
    fuelTankAttributes.consumption = 1.5; // increase fuel consumption so that it forces at least 1 pitstop
    var fc = new $ByLap.FuelCalculatorByLap(fuelTankAttributes, raceParameters);
    fc.startRace();
    expect(fc.totalRaceTime()).toBe(960);
  });

  it('should calculate expected race time with 2 pitstops', function () {
    fuelTankAttributes.consumption = 3; // increase fuel consumption so that it forces at least 1 pitstop
    var fc = new $ByLap.FuelCalculatorByLap(fuelTankAttributes, raceParameters);
    fc.startRace();
    expect(fc.totalRaceTime()).toBe(1020); // 900 + 3 pitstops
  });

  it('should calculate expected race time with initial Fuel', function () {
    fuelTankAttributes.initialFuel = 3; // start off with a smaller tank which forces a pitstop
    var fc = new $ByLap.FuelCalculatorByLap(fuelTankAttributes, raceParameters);
    fc.startRace();
    expect(fc.totalRaceTime()).toBe(960); // 900 + 3 pitstops
  });

  it('should not be a valid Race if there is no fuel in the tank', function () {
    fuelTankAttributes.initialFuel = 0; // start off with a smaller tank which forces a pitstop
    var fc = new $ByLap.FuelCalculatorByLap(fuelTankAttributes, raceParameters);
    expect(fc.canStartRace()).toBe(false);
  });

  it('should not be a valid Race if the car consumes no fuel', function () {
    fuelTankAttributes.consumption = 0;
    var fc = new $ByLap.FuelCalculatorByLap(fuelTankAttributes, raceParameters);
    expect(fc.canStartRace()).toBe(false);
  });

  it('should not be a valid Race if there are no laps', function () {
    raceParameters.numLaps=0;
    var fc = new $ByLap.FuelCalculatorByLap(fuelTankAttributes, raceParameters);
    expect(fc.canStartRace()).toBe(false);
  });

});

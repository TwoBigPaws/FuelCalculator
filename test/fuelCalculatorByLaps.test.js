describe('Calculator', function () {
  const fuelTankSize = 3, expectedLaps = 20, fuelConsumptionPerLap = 0.605;
  var $ByLap;

  beforeEach(module("FuelCalculators"));

  beforeEach(inject(function (_ByLap_) {
    $ByLap = _ByLap_;
  }));

  it('should handle no lapDapHandler correctly', function () {

    fc = new $ByLap.FuelCalculatorByLap(fuelTankSize, expectedLaps, fuelConsumptionPerLap, undefined, {});
    fc.startRace();
  });

  it('should handle no pitStopHandler correctly', function () {
    fc = new $ByLap.FuelCalculatorByLap(fuelTankSize, expectedLaps, fuelConsumptionPerLap, {}, undefined);
    fc.startRace();
  });

  it('should compute correct number of laps', function () {
    lapDataHandler = {};
    lapDataHandler.handleData = jasmine.createSpy("handleData");
    fc = new $ByLap.FuelCalculatorByLap(fuelTankSize, expectedLaps, fuelConsumptionPerLap, lapDataHandler, undefined);
    fc.startRace();
    expect(lapDataHandler.handleData.calls.count()).toBe(21);
  });

  it('should compute correct number of pitstops', function () {
    pitStopHandler = {};
    pitStopHandler.handlePitStop = jasmine.createSpy("handlePitStop");
    fc = new $ByLap.FuelCalculatorByLap(fuelTankSize, expectedLaps, fuelConsumptionPerLap, undefined, pitStopHandler);
    fc.startRace();
    expect(pitStopHandler.handlePitStop.calls.count()).toBe(5);
  });

  it('Pitstop event should indicate how much fuel was put in', function () {
    pitStopHandler = {};
    pitStopHandler.handlePitStop = jasmine.createSpy("handlePitStop");
    fc = new $ByLap.FuelCalculatorByLap(10, 10, 2, undefined, pitStopHandler);
    fc.startRace();
    expect(pitStopHandler.handlePitStop.calls.first()).toEqual({object: pitStopHandler, args: [{lapNumber:5, fuelState:0, fuelAdded:10, fuelStateOnExit:10}], returnValue: undefined});

  });

  it('should not run any laps with 0 fuel tank consumption', function () {
    lapDataHandler = {};
    lapDataHandler.handleData = jasmine.createSpy("handleData");
    fc = new $ByLap.FuelCalculatorByLap(fuelTankSize, expectedLaps, 0, lapDataHandler, undefined);
    fc.startRace();
    expect(lapDataHandler.handleData.calls.count()).toBe(0);
  });

  it('should not run any laps with 0 expectedLaps', function () {
    lapDataHandler = {};
    lapDataHandler.handleData = jasmine.createSpy("handleData");
    fc = new $ByLap.FuelCalculatorByLap(fuelTankSize, 0, fuelConsumptionPerLap, lapDataHandler, undefined);
    fc.startRace();
    expect(lapDataHandler.handleData.calls.count()).toBe(0);
  });

});

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

});

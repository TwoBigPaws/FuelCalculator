describe('Calculator', function () {
  var $ByLap;

  beforeEach(module("FuelCalculators"));

  beforeEach(inject(function (_ByLap_) {
    $ByLap = _ByLap_;
  }));

  it('should compute correct number of laps and pitstops', function () {
    lapDataHandler = {
      counter: 0,
      handleData: function (lapData) {
        this.counter++;
      }
    };
    pitStopHandler = {
      counter: 0, handlePitStop: function () {
        this.counter++;

      }
    };
    fc = new $ByLap.FuelCalculatorByLap(3, 20, 0.605, lapDataHandler, pitStopHandler);
    fc.startRace();
    expect(lapDataHandler.counter).toBe(21);
    expect(pitStopHandler.counter).toBe(5);
  });

});

function SimplePitStopStrategy(consumption, minimumFuel, maximumFuel) {
  return {
    consumption: consumption,
    minimumFuel: minimumFuel,
    maximumFuel: maximumFuel,
    shouldPit: function (lapData) {
      // we need to make sure that we would consume fuel below minimumFuel
      // when the engine starts coughing
      var wouldBeBelowMinimum = (lapData.fuelState - this.consumption) < this.minimumFuel;
      if (wouldBeBelowMinimum && lapData.lapsRemaining > 0) {
        return true;
      }
      return false;
    },
    fuelLevelToFillTo: function (lapData) {
      return this.maximumFuel;
    }
  };
};

module.exports = SimplePitStopStrategy;

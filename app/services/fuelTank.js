'use strict';

function FuelTankFactory() {
  return {
    newFuelTank: function () {
      return {
        consumption: undefined,
        maximumFuel: undefined,
        initialFuel: undefined,
        minimumFuel: undefined,
        tankpercentstart: 60,

        validTank: function () {
          return this.maximumFuel > 0 && this.minimumFuel >= 0 && this.consumption > 0;
        }
      };
    }
  };
}
module.exports = FuelTankFactory;


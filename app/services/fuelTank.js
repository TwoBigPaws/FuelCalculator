"use strict"

angular.module('FuelTank', [])
  .factory('FuelTankFactory', function () {
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
  });

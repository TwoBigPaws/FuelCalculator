"use strict";


function PitstopStrategyIndividual( initialFuelPercent, pitstops) {
    this.initialFuelPercent = initialFuelPercent;
    this.fuelPercent = pitstops;
}



angular.module("GeneticAlgorithms", [])
  .factory("TwoPointCrossOver", function () {
      return {
        crossover: function (father, mother) {
          return [{}, {}];
        }
      };
    }
  )
  .factory("RandomPitstopStrategyCreator", function () {
    return {
      createRandomIndividual: function (numLaps) {
        var randomInitialFuel = Math.floor(Math.random() * 100 + 1);
        var randomPitstops = Array.apply(null, Array(numLaps)).map(function () {
          return Math.floor(Math.random() * 100)+1;
        });

        return new PitstopStrategyIndividual(randomInitialFuel, randomPitstops)
      }
    };
  });

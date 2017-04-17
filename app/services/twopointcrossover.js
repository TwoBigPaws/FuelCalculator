"use strict"

angular.module('GeneticAlgorithms.TwoPointCrossover', [])
  .factory('TwoPointCrossOver', function () {
    return {
      crossover: function (father, mother) {
        return [{}, {}];
      }
    };
  }
);

"use strict";


function PitstopStrategyIndividual(initialFuelPercent, pitstops) {
  this.initialFuelPercent = initialFuelPercent;
  this.pitstopFuelPercent = pitstops;
}

PitstopStrategyIndividual.equals = function (a, b) {
  return (a.initialFuelPercent === b.initialFuelPercent) && (a.pitstopFuelPercent === b.pitstopFuelPercent);
};


function PitstopStrategyBitEncoder() {
  return {
    encodeBits: function (pitstopStrategyIndividual) {
      var arrays = [];
      arrays.push(BitArray.parse(pitstopStrategyIndividual.initialFuelPercent, true));
      arrays = arrays.concat(pitstopStrategyIndividual.pitstopFuelPercent.map(function (x) {
        return BitArray.parse(x, true);
      }));
      return BitArray.parse(arrays);
    }
  };
}

function PitStopStrategyBitDecoder() {
  return {
    decodeBits: function (bitArray) {
      //todo if number of bits is <8, fail
      // todo if number of bits is not divisible by 8..
      var initialFuelPercent = BitArray.toNumber(bitArray.slice(bitArray.length - 8, bitArray.length));
      var remainingBits = bitArray.length-8;
      var arrayBits = bitArray.slice(0, remainingBits);
      var pitStopPercents = [];
      var i;
      for (i = 0; i < arrayBits.length; i += 8) {
        var pitstop = BitArray.toNumber(arrayBits.slice(i, i + 8));
        pitStopPercents.push(pitstop);
      }
      return new PitstopStrategyIndividual(initialFuelPercent, pitStopPercents.reverse());
    }
  };
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
          return Math.floor(Math.random() * 100) + 1;
        });

        return new PitstopStrategyIndividual(randomInitialFuel, randomPitstops);
      }
    };
  });

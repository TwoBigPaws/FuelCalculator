"use strict";


function PitstopStrategyIndividual(initialFuelPercent, pitstops) {
  this.initialFuelPercent = initialFuelPercent;
  this.pitstopFuelPercent = pitstops;
}

PitstopStrategyIndividual.equals = function (a, b) {
  return (a.initialFuelPercent === b.initialFuelPercent) && (a.pitstopFuelPercent === b.pitstopFuelPercent);
};


/**
 * Encodes a #PitstopStrategyIndividual into bits by lining up
 * the objects internal details into a contiguous BitArray
 * @see PitStopStrategyBitDecoder
 */
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

/**
 * Decodes a BitArray encoded #PitstopStrategyIndividual back into object form
 * @see PitstopStrategyBitEncoder
 */
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
          var bitEncoder = new PitstopStrategyBitEncoder();

          var fatherBits = bitEncoder.encodeBits(father).toString().replace(/,/g, "");
          var motherBits = bitEncoder.encodeBits(mother).toString().replace(/,/g, "");

          var sonBits = fatherBits;
          var daughterBits = motherBits;

          var numBits = fatherBits.toString().length; // TODO check the mother is the same size?

          var firstPoint = Math.floor(Math.random() * numBits);
          var secondPoint = numBits - Math.floor(Math.random() * numBits);

          if (firstPoint> secondPoint) {
            var tmp = firstPoint;
            firstPoint = secondPoint;
            secondPoint = tmp;
          }

          var firstSonBits = sonBits.substr(0, firstPoint);
          var lastSonBits = sonBits.substr(secondPoint);

          var firstDaughterBits = daughterBits.substr(0, firstPoint);
          var lastDaughterBits = daughterBits.substr(secondPoint);

          var midMotherBits = motherBits.substr(firstPoint, (secondPoint-firstPoint));
          var midFatherBits = fatherBits.substr(firstPoint, (secondPoint-firstPoint));

          sonBits = firstSonBits + midMotherBits + lastSonBits;
          daughterBits = firstDaughterBits + midFatherBits + lastDaughterBits;


          var decoder = new PitStopStrategyBitDecoder();

          sonBits = sonBits.split().join(",");
          daughterBits = daughterBits.split().join(",");

          var son = decoder.decodeBits(BitArray.fromBinary(sonBits));
          var daughter = decoder.decodeBits(BitArray.fromBinary(daughterBits));

          return [son, daughter];
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

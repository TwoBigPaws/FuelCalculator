"use strict"

describe("Genetic Algorithm", function () {

  beforeEach(module("GeneticAlgorithms"));

  describe("Two Point Cross Over", function () {

    var $TwoPointCrossOver;

    beforeEach(inject(function (_TwoPointCrossOver_) {
      $TwoPointCrossOver = _TwoPointCrossOver_;
    }));

    it("should return a son and daughter that are not just the father/mother", function () {
      var father = {};
      var mother = {};
      var children = $TwoPointCrossOver.crossover(father, mother);
      expect(children.length).toBe(2);
      expect(children[0]).not.toBe(father);
      expect(children[1]).not.toBe(father);
      expect(children[0]).not.toBe(mother);
      expect(children[1]).not.toBe(mother);
    });

  });

  describe("RandomPitstopStrategyCreator", function () {
    var $RandomPitstopStrategyCreator;

    beforeEach(inject(function (_RandomPitstopStrategyCreator_) {
      $RandomPitstopStrategyCreator = _RandomPitstopStrategyCreator_;
      spyOn(Math, "random").and.returnValues(0.41, 0.50, 0.23, 0.43, 0.98, 0.99, 0.90, 0.0, 0.1);
    }));

    it("Should create random individual with initialFuelPercent set", function () {
      var randomIndividual = $RandomPitstopStrategyCreator.createRandomIndividual(10);
      expect(randomIndividual.initialFuelPercent).toBe(42);
    });

    it("Should create random individual with correct number of Pitstop potentials", function () {
      var randomIndividual = $RandomPitstopStrategyCreator.createRandomIndividual(10);
      expect(randomIndividual.fuelPercent.length).toBe(10);
    });

    it("Should create random individual random Pitstop strategy", function () {
      var randomIndividual = $RandomPitstopStrategyCreator.createRandomIndividual(8);
      expect(randomIndividual.fuelPercent[0]).toBe(51);
      expect(randomIndividual.fuelPercent[1]).toBe(24);
      expect(randomIndividual.fuelPercent[2]).toBe(44);
      expect(randomIndividual.fuelPercent[7]).toBe(11);
    });


  });

});



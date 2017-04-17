"use strict"

describe('Two Point Crossover', function () {
  var $TwoPointCrossOver;

  beforeEach(module('GeneticAlgorithms.TwoPointCrossover'));

  beforeEach(inject(function (_TwoPointCrossOver_) {
    $TwoPointCrossOver = _TwoPointCrossOver_;
  }));

  it('should return a son and daughter', function () {
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



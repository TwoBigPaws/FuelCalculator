"use strict"

describe("Genetic Algorithm", function () {

  beforeEach(module("GeneticAlgorithms"));

  describe("Two Point Cross Over", function () {

    var $TwoPointCrossOver;

    beforeEach(inject(function (_TwoPointCrossOver_) {
      $TwoPointCrossOver = _TwoPointCrossOver_;
    }));

    it("should return a son and daughter that are not just the father/mother", function () {
      var father = new PitstopStrategyIndividual(5, [10, 20]);
      var mother = new PitstopStrategyIndividual(10, [5, 0]);
      var children = $TwoPointCrossOver.crossover(father, mother);
      expect(children.length).toBe(2);
      expect(children[0]).not.toBe(father);
      expect(children[1]).not.toBe(father);
      expect(children[0]).not.toBe(mother);
      expect(children[1]).not.toBe(mother);
    });

    it("should return a son that has some part of the father", function () {
      var father = new PitstopStrategyIndividual(0, [100, 50]); // 00000000 01100100 00110010 3 bytes : initialFuel=0, pitStop[0]=100, pitStop[1]=50
      var mother =  new PitstopStrategyIndividual(100, [0, 100]); // 01100100 00000000 01100100 3 bytes : initialFuel=100, pitStop[0]=0, pitStop[1]=100

      spyOn(Math, "random").and.returnValues(0.25, 0.25); //6th & 18th bits as the 2point crossover

      var children = $TwoPointCrossOver.crossover(father, mother);
      var son = children[0];
      var daughter = children[1];

      var pitstopStrategyBitEncoder = new PitstopStrategyBitEncoder();

      var sonBits = pitstopStrategyBitEncoder.encodeBits(son);
      var daughterBits = pitstopStrategyBitEncoder.encodeBits(daughter);
      expect(sonBits.toString()).toEqual("0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,1,0");
      expect(daughterBits.toString()).toEqual("0,1,1,0,0,1,0,0,0,1,1,0,0,1,0,0,0,0,1,0,0,1,0,0");
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
      expect(randomIndividual.pitstopFuelPercent.length).toBe(10);
    });

    it("Should create random individual random Pitstop strategy", function () {
      var randomIndividual = $RandomPitstopStrategyCreator.createRandomIndividual(8);
      expect(randomIndividual.pitstopFuelPercent[0]).toBe(51);
      expect(randomIndividual.pitstopFuelPercent[1]).toBe(24);
      expect(randomIndividual.pitstopFuelPercent[2]).toBe(44);
      expect(randomIndividual.pitstopFuelPercent[7]).toBe(11);
    });
  });

  describe('PitstopStrategyBitEncoder', function () {
    it('empty PitstopStrategyBitEncoder should encode bits correctly', function () {
      var pitstopStrategyBitEncoder = new PitstopStrategyBitEncoder();
      var encodedBits = pitstopStrategyBitEncoder.encodeBits(new PitstopStrategyIndividual(0, []));
      expect(encodedBits.toString()).toEqual('0,0,0,0,0,0,0,0');
    });

    it('simple initialFuel PitstopStrategyBitEncoder with 0 pit stops should encode correctly', function () {
      var pitstopStrategyBitEncoder = new PitstopStrategyBitEncoder();
      var encodedBits = pitstopStrategyBitEncoder.encodeBits(new PitstopStrategyIndividual(32, []));
      var expectedBits = BitArray.parse(32, true);
      expect(encodedBits.toString()).toEqual(expectedBits.toString());
    });

    it('simple initialFuel PitstopStrategyBitEncoder with 1 pit stops should encode correctly', function () {
      var pitstopStrategyBitEncoder = new PitstopStrategyBitEncoder();
      var encodedBits = pitstopStrategyBitEncoder.encodeBits(new PitstopStrategyIndividual(32, [64]));
      expect(encodedBits.toString()).toEqual("0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0");
    });

    it('multilap PitstopStrategyBitEncoder with 1 pit stops should encode correctly', function () {
      var pitstopStrategyBitEncoder = new PitstopStrategyBitEncoder();
      var encodedBits = pitstopStrategyBitEncoder.encodeBits(new PitstopStrategyIndividual(100, [0,64])); // 100% initial fuel, pit on lap 2
      expect(encodedBits.toString()).toEqual("0,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0");
    });
  });

  describe("PitstopStrategyBitDecoder", function () {
    it('should decode empty PitstopStrategy correctly', function () {
      var pitStopStrategyBitDecoder = new PitStopStrategyBitDecoder();
      var pitstopStrategy = pitStopStrategyBitDecoder.decodeBits(BitArray.parse(0, true));
      expect(pitstopStrategy).toEqual(new PitstopStrategyIndividual(0,[]));
    });

    it('should decode initialFuelOnly PitstopStrategy correctly', function () {
      var pitStopStrategyBitDecoder = new PitStopStrategyBitDecoder();
      var pitstopStrategy = pitStopStrategyBitDecoder.decodeBits(BitArray.fromBinary("011001000000000001000000"));
      expect(pitstopStrategy).toEqual(new PitstopStrategyIndividual(100,[0,64]));
    });

    it('simple initialFuel PitstopStrategyBitEncoder with 1 pit stops should decode correctly', function () {
      var pitStopStrategyBitDecoder = new PitStopStrategyBitDecoder();
      var bitArray = BitArray.fromBinary("0010000001000000");
      var pitstopStrategy = pitStopStrategyBitDecoder.decodeBits(bitArray);
      expect(pitstopStrategy).toEqual(new PitstopStrategyIndividual(32,[64]));
    });

    it('Should decode TwoPointCross over example correctlry', function () {
      var pitStopStrategyBitDecoder = new PitStopStrategyBitDecoder();
      var father = new PitstopStrategyIndividual(0, [100, 50]); // 00000000 01100100 00110010 3 bytes : initialFuel=0, pitStop[0]=100, pitStop[1]=50

      var bitArray = BitArray.fromBinary("000000000110010000110010");
      var pitstopStrategy = pitStopStrategyBitDecoder.decodeBits(bitArray);
      expect(pitstopStrategy).toEqual(new PitstopStrategyIndividual(0,[100,50]));
    });
  });

});



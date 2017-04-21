"use strict"


ByLap.$inject = ["SimplePitStopStrategy"];

function ByLap(fuelTankAttributes, raceParameters, lapDataHandler, pitStopHandler) {
  this.fuelTankAttributes = fuelTankAttributes;
  this.fuelTank = fuelTankAttributes.initialFuel === undefined ? fuelTankAttributes.maximumFuel : fuelTankAttributes.initialFuel;
  this.raceParameters = raceParameters;

  this.pitstopStrategy = raceParameters.pitStopStrategy || SimplePitStopStrategy(fuelTankAttributes.consumption, fuelTankAttributes.minimumFuel, fuelTankAttributes.maximumFuel);
  this.raceTime = 0;

  this.lapsRemaining = raceParameters.numLaps;
  this.lapNumber = 0;

  this.lapDataHandler = lapDataHandler;
  this.pitStopHandler = pitStopHandler;


  this.lapData = function () {
    return {lapNumber: this.lapNumber, fuelState: this.fuelTank, lapsRemaining: this.lapsRemaining};
  };

  this.emitLap = function () {
    var lapData = this.lapData();
    if (this.lapDataHandler && this.lapDataHandler.handleData) {
      this.lapDataHandler.handleData(lapData);
    }
  };

  this.completeLap = function () {
    this.lapsRemaining--;
    this.lapNumber++;
    this.consumeFuel();
  }

  this.consumeFuel = function () {
    this.raceTime += this.raceParameters.expectedLapTime;
    this.fuelTank -= this.fuelTankAttributes.consumption;
  }

  this.pitStopStrategyDecision = function () {
    var lapData = this.lapData();
    if (this.pitstopStrategy.shouldPit(lapData)) {
      this.pitstop(this.pitstopStrategy.fuelLevelToFillTo(lapData));
    }
  };
  this.doLap = function () {
    this.completeLap();
    this.pitStopStrategyDecision();
    this.emitLap();
  };

  this.raceCompleted = function () {
    // race is over if there are no more laps to do, or there is not enough fuel in the tank
    // to complete a lap
    return this.lapsRemaining === 0 || this.fuelTank < (this.fuelTankAttributes.consumption + this.fuelTankAttributes.minimumFuel);
  };

  this.pitstop = function (fuelLevelToFillTo) {
    var newFuelTank = fuelLevelToFillTo;
    if (this.pitStopHandler && this.pitStopHandler.handlePitStop) {
      var lapData = this.lapData();
      lapData.fuelAdded = fuelLevelToFillTo - this.fuelTank;
      lapData.fuelStateOnExit = newFuelTank;
      this.pitStopHandler.handlePitStop(lapData);
    }
    this.raceTime += raceParameters.pitStopTimePenalty;
    this.fuelTank = newFuelTank;
  };

  this.canStartRace = function () {
    return this.fuelTank > 0 && this.fuelTankAttributes.consumption > 0 && this.lapsRemaining > 0;
  };

  this.startRace = function () {
    if (this.fuelTankAttributes.consumption > 0 && !this.raceCompleted()) {
      this.emitLap();
      while (!this.raceCompleted()) {
        this.doLap();
      }
      return {
        chequeredFlag: this.lapsRemaining === 0,
        lapsCompleted: this.lapNumber,
        totalRaceTime: this.raceTime
      };
    }
  };
};

module.exports = ByLap;

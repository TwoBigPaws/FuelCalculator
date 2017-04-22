"use strict";


RaceByLap.$inject = ["SimplePitStopStrategy"];

function RaceByLap(SimplePitStopStrategy) {
  return {
    createRace: function (theFuelTankAttributes, raceParameters, lapDataHandler, pitStopHandler) {
      return {
        fuelTankAttributes: theFuelTankAttributes,
        fuelTank: theFuelTankAttributes.initialFuel === undefined ? theFuelTankAttributes.maximumFuel : theFuelTankAttributes.initialFuel,
        raceParameters: raceParameters,

        pitstopStrategy: raceParameters.pitStopStrategy || SimplePitStopStrategy.newStrategy(theFuelTankAttributes.consumption, theFuelTankAttributes.minimumFuel, theFuelTankAttributes.maximumFuel),
        raceTime: 0,

        lapsRemaining: raceParameters.numLaps,
        lapNumber: 0,

        lapDataHandler: lapDataHandler,
        pitStopHandler: pitStopHandler,


        lapData: function () {
          return {lapNumber: this.lapNumber, fuelState: this.fuelTank, lapsRemaining: this.lapsRemaining};
        },

        emitLap: function () {
          var lapData = this.lapData();
          if (this.lapDataHandler && this.lapDataHandler.handleData) {
            this.lapDataHandler.handleData(lapData);
          }
        },

        completeLap: function () {
          this.lapsRemaining--;
          this.lapNumber++;
          this.consumeFuel();
        },

        consumeFuel:function () {
          this.raceTime += this.raceParameters.expectedLapTime;
          this.fuelTank -= this.fuelTankAttributes.consumption;
        },

        pitStopStrategyDecision: function () {
          var lapData = this.lapData();
          if (this.pitstopStrategy.shouldPit(lapData)) {
            this.pitstop(this.pitstopStrategy.fuelLevelToFillTo(lapData));
          }
        },
        doLap: function () {
          this.completeLap();
          this.pitStopStrategyDecision();
          this.emitLap();
        },

        raceCompleted: function () {
          // race is over if there are no more laps to do, or there is not enough fuel in the tank
          // to complete a lap
          return this.lapsRemaining === 0 || this.fuelTank < (this.fuelTankAttributes.consumption + this.fuelTankAttributes.minimumFuel);
        },

        pitstop: function (fuelLevelToFillTo) {
          var newFuelTank = fuelLevelToFillTo;
          if (pitStopHandler && this.pitStopHandler.handlePitStop) {
            var lapData = this.lapData();
            lapData.fuelAdded = fuelLevelToFillTo - this.fuelTank;
            lapData.fuelStateOnExit = newFuelTank;
            this.pitStopHandler.handlePitStop(lapData);
          }
          this.raceTime += raceParameters.pitStopTimePenalty;
          this.fuelTank = newFuelTank;
        },

        canStartRace: function () {
          return this.fuelTank > 0 && this.fuelTankAttributes.consumption > 0 && this.lapsRemaining > 0;
        },

        startRace: function () {
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
        }
    }
      ;
    }
  };
}

module.exports = RaceByLap;

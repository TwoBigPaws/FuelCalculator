"use strict"

angular.module("FuelCalculators",[])
  .service("ByLap", function () {


    this.FuelCalculatorByLap = function (fuelTankAttributes, numLaps, raceParameters, lapDataHandler, pitStopHandler) {
      this.fuelTankAttributes = fuelTankAttributes;
      this.fuelTank = fuelTankAttributes.initialFuel === undefined ? fuelTankAttributes.maximumFuel : fuelTankAttributes.initialFuel;
      this.raceParameters = raceParameters;
      this.raceTime = 0;

      this.lapsRemaining = numLaps;
      this.lapNumber = 0;
      this.lapDataHandler = lapDataHandler;
      this.pitStopHandler = pitStopHandler;


      this.lapData = function () {
        return {lapNumber: this.lapNumber, fuelState: this.fuelTank};
      };

      this.emitLap = function () {
        var lapData = this.lapData();
        if (this.lapDataHandler &&  this.lapDataHandler.handleData) {
          this.lapDataHandler.handleData(lapData);
        }
      };

      this.completeLap = function() {
        this.lapsRemaining--;
        this.lapNumber++;
        this.consumeFuel();
      }

      this.consumeFuel = function() {
        this.raceTime += this.raceParameters.expectedLapTime;
        this.fuelTank -= this.fuelTankAttributes.consumption;
      }

      this.pitStopStrategyDecision = function () {
        // we need to make sure that we would consume fuel below minimumFuel
        // when the engine starts coughing
        var wouldBeBelowMinimum = (this.fuelTank - this.fuelTankAttributes.consumption) < this.fuelTankAttributes.minimumFuel;
        if (wouldBeBelowMinimum && this.lapsRemaining > 0) {
          this.pitstop();
        }
      };
      this.doLap = function () {
        this.completeLap();
        this.pitStopStrategyDecision();
        this.emitLap();
      };
      this.raceCompleted = function () {
        return this.lapsRemaining === 0;
      };

      this.pitstop = function () {
        var newFuelTank = this.fuelTankAttributes.maximumFuel;
        if(this.pitStopHandler && this.pitStopHandler.handlePitStop){
          var lapData = this.lapData();
          lapData.fuelAdded = this.fuelTankAttributes.maximumFuel - this.fuelTank;
          lapData.fuelStateOnExit = newFuelTank;
          this.pitStopHandler.handlePitStop(lapData);
        }
        this.raceTime += raceParameters.pitStopTimePenalty;
        this.fuelTank = newFuelTank;
      };

      this.canStartRace = function () {
        return this.fuelTank > 0 && this.fuelTankAttributes.consumption > 0;
      };

      this.startRace = function () {
        if (this.fuelTankAttributes.consumption > 0 && !this.raceCompleted()) {
          this.emitLap();
          while (!this.raceCompleted()) {
            this.doLap();
          }
        }
      };

      this.totalRaceTime = function () {
        return this.raceTime;
      };
    };
  });

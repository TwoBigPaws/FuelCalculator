angular.module("FuelCalculators",[])
  .service("ByLap", function () {


    this.FuelCalculatorByLap = function (fuelTankSize, numLaps, fuelConsumptionPerLap, lapDataHandler, pitStopHandler) {
      this.fuelTankSize = fuelTankSize;
      this.fuelTank = fuelTankSize;
      this.lapsRemaining = numLaps;
      this.fuelConsumptionPerLap = fuelConsumptionPerLap;
      this.lapNumber = 0;
      this.lapDataHandler = lapDataHandler;
      this.pitStopHandler = pitStopHandler;


      this.lapData = function () {
        return {lapNumber: this.lapNumber, fuelState: this.fuelTank};
      }

      this.emitLap = function () {
        var lapData = this.lapData();
        if (this.lapDataHandler &&  this.lapDataHandler.handleData) {
          this.lapDataHandler.handleData(lapData);
        }
      }
      this.doLap = function () {
        this.lapsRemaining--;
        this.lapNumber++;
        this.fuelTank -= this.fuelConsumptionPerLap;
        if (this.fuelTank < fuelConsumptionPerLap && this.lapsRemaining > 0) {
          this.pitstop();
        }
        this.emitLap();
      }

      this.raceCompleted = function () {
        return this.lapsRemaining == 0;
      }

      this.pitstop = function () {
        newFuelTank = this.fuelTankSize;
        if(this.pitStopHandler && this.pitStopHandler.handlePitStop){
          lapData = this.lapData();
          lapData.fuelAdded = this.fuelTankSize - this.fuelTank;
          lapData.fuelStateOnExit = newFuelTank;
          this.pitStopHandler.handlePitStop(lapData);
        }
        this.fuelTank = newFuelTank;
      }

      this.startRace = function () {
        if (this.fuelConsumptionPerLap > 0 && !this.raceCompleted()) {
          this.emitLap();
          while (!this.raceCompleted()) {
            this.doLap();
          }
        }
      }
    }
  });

'use strict';

var angular = require('angular');

angular.module("FuelTank", []).factory("FuelTankFactory", require("./fuelTank.js"));
angular.module("Strategies", []).factory("SimplePitStopStrategy", require("./simple-pitstop-strategy.js"));
angular.module("FuelCalculators", []).factory("RaceByLap", require("./fuelCalculatorByLaps.js"));

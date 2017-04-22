"use strict"

var angular = require("angular");
angular.module("CalcApp", ['ui.bootstrap','FuelCalculators','FuelTank','Strategies', 'ui.grid','chart.js', 'angularValidator']);

require("./controllers");
require("./services");
require("../node_modules/angular-ui-bootstrap");
require("../node_modules/chart.js");
require("../node_modules/angular-chart.js");
require("../node_modules/angular-ui-grid");
require("../node_modules/angular-validator");
require("bootstrap-webpack");
require("../node_modules/angular-ui-grid/ui-grid");



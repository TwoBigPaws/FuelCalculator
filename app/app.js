"use strict"

var angular = require("angular");

require("../node_modules/angular-ui-bootstrap");
require("../node_modules/chart.js");
require("../node_modules/angular-chart.js");
require("../node_modules/angular-ui-grid");
require("../node_modules/angular-ui-grid/ui-grid.css");
require("../node_modules/angular-validator");
var controllers = require("./controllers");
require("./services");

require("bootstrap-webpack");

angular.module("CalcApp", ['ui.bootstrap', controllers, 'ui.grid','chart.js', 'angularValidator']);


'use strict';

var angular = require('angular');

angular.module('CalcApp',['ui.bootstrap','FuelCalculators','FuelTank', 'ui.grid','chart.js', 'angularValidator']).controller('CalcCtrl', require('./calc-controller.js'));

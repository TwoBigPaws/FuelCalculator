'use strict';

var angular = require('angular');

module.exports = angular.module('CalcApp.Controllers',['ui.bootstrap','FuelCalculators','FuelTank','Strategies', 'ui.grid','chart.js', 'angularValidator'])
  .controller('CalcCtrl', require('./calc-controller.js'))
  .name;

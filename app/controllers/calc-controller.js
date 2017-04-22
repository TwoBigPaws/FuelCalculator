"use strict"

//angular.module("CalcApp", ['ui.bootstrap','FuelCalculators','FuelTank', 'ui.grid','chart.js', 'angularValidator'])
//  .controller("CalcCtrl", ['$scope','ByLap', 'FuelTankFactory','uiGridConstants', function ($scope, ByLap, FuelTankFactory, uiGridConstants) {
//['ui.bootstrap','FuelCalculators','FuelTank', 'ui.grid','chart.js', 'angularValidator']

CalcCtrl.$inject = ['$scope', 'RaceByLap', 'FuelTankFactory', 'uiGridConstants'];
function CalcCtrl($scope, RaceByLap, FuelTankFactory, uiGridConstants) {

  $scope.fuelTank = FuelTankFactory.newFuelTank();

  $scope.laptime = "";


  //$scope.sessiontimeminutes;
  $scope.byTimePresentation = true;

  $scope.laps = [];

  $scope.gridOptions1 = {
    enableSorting: false,
    columnDefs: [
      {
        field: 'lapNumber',
        displayName: "Lap #",
        headerTooltip: 'Pit at end of Lap #',
        cellFilter: "number",
        width: "20%"
      },
      {field: 'fuelState', headerTooltip: 'Fuel State entering Pits', cellFilter: "number", width: "25%"},
      {field: 'fuelAdded', headerTooltip: 'Fuel to add during Pitstop', cellFilter: "number", width: "25%"},
      {field: 'fuelStateOnExit', headerTooltip: 'Fuel state leaving pits', cellFilter: "number", width: "30%"}
    ],

    data: [],
    onRegisterApi: function (gridApi) {
      $scope.grid1Api = gridApi;
    }
  };

  var lapDataHandler = {
    handleData: function (lapData) {
      $scope.laps.push(lapData);
    }
  };

  var pitStopHandler = {
    handlePitStop: function (lapData) {
      $scope.gridOptions1.data.push(lapData);
    }
  };

  $scope.sessiontime = function () {
    return ($scope.sessiontimeminutes * 60);
  };
  $scope.lapTimeValidator = function (lapTimeString) {
    var convertedLapTime = 0
    const p = /((\d+):)?(\d+)(\.(\d+))?/.exec(lapTimeString);
    convertedLapTime = p ? ( +p[3] + (p[2] || 0) * 60 + (p[5] || 0) * 0.1 ) : 0;
    if (convertedLapTime > 0) {
      $scope.laptimeInSeconds = convertedLapTime;
    }
    return convertedLapTime > 0;
  };

  $scope.lapsinsession = function () {
    if ($scope.byTimePresentation && $scope.lapTimeValidator($scope.laptime)) {
      var laps = $scope.sessiontime() / $scope.laptimeInSeconds;
      var lapCount = Math.ceil(laps);
      var remainder = lapCount - laps;
      if (remainder < 0.3) {
        lapCount = lapCount + 1;
      }
      return lapCount;
    }

    return $scope.numberOfLaps;
  };

  $scope.clearTableData = function () {
    $scope.gridOptions1.data = [];
    $scope.laps = [];
    $scope.grid1Api.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
    $scope.chart.labels = [];
    $scope.chart.data = [[], []];
  };

  $scope.updateChart = function () {
    for (var lap in $scope.laps) {
      $scope.chart.labels.push($scope.laps[lap].lapNumber);
      $scope.chart.data[0].push($scope.laps[lap].fuelState);
      $scope.chart.data[1].push(NaN);
    }
    // now replace the NaN of each Lap for the 2nd series (pitstops)
    // with the actual Fuel Added
    for (var pitStop in $scope.gridOptions1.data) {
      const pitStopData = $scope.gridOptions1.data[pitStop];
      $scope.chart.data[1][pitStopData.lapNumber] = pitStopData.fuelState;
    }

  }

  $scope.recalculateLapData = function () {
    $scope.clearTableData();
    if ($scope.lapsinsession() > 0 && $scope.fuelTank.validTank()) {
      var raceParameters = {
        expectedLapTime: $scope.laptimeInSeconds,
        numLaps: $scope.lapsinsession()
      }
      var fc = RaceByLap.createRace($scope.fuelTank, raceParameters, lapDataHandler, pitStopHandler);
      fc.startRace();
    }
    if ($scope.validData()) {
      $scope.updateChart();
    }
  };

  $scope.validData = function () {
    return $scope.laps.length > 0;
  }

  $scope.resetForm = function () {
    $scope.clearTableData();
    $scope.sessiontimeminutes = null;
    $scope.lapminutes = null;
    $scope.lapseconds = null;
    $scope.numberOfLaps = null;
    $scope.fuelTank = FuelTankFactory.newFuelTank();
  };

  $scope.changeCalculationMode = function (value) {
    $scope.byTimePresentation = value;
    $scope.resetForm();
  };

  $scope.fuelneededinsession = function () {
    return $scope.lapsinsession() * $scope.fuelTank.consumption;
  };

  $scope.maxstintlength = function () {
    return $scope.fuelTank.consumption * $scope.startingfuel();
  };

  $scope.startingfuel = function () {
    return $scope.fuelTank.maximumFuel * ($scope.fuelTank.tankpercentstart / 100);
  };

  $scope.model = {
    name: 'Tabs'
  };

  $scope.chart = {
    labels: [],
    colors: [
      '#97BBCD', // blue
      '#F7464A', // red
      '#DCDCDC', // light grey
      '#46BFBD', // green
      '#FDB45C', // yellow
      '#949FB1', // grey
      '#4D5360'  // dark grey
    ],
    series: ['Fuel State', 'Fuel entering Pits'],
    data: [
      [], []
    ],
    datasetOverride: [{yAxisID: 'y-axis-1'}, {yAxisID: 'y-axis-1'}],
    options: {
      showLines: true,
      title: {
        display: true,
        text: 'Lap / Fuel Chart'
      },
      scales: {
        yAxes: [
          {
            id: 'y-axis-1',
            type: 'linear',
            display: true,
            position: 'left',
            ticks: {
              beginAtZero: true
            },
            scaleLabel: {
              display: true,
              labelString: 'Fuel State'
            }
          }
        ],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: "Lap #"

          }
        }]
      }
    }
  };
};

module.exports = CalcCtrl;

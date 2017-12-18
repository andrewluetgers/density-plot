/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var data1 = genData(60, 6, function () {
	return Math.random() - Math.random();
});
var data2 = genData(100, 100, function () {
	return Math.random() * 1e3;
});
var tip = document.getElementById("tip");
var randInt = function randInt(n) {
	return Math.round(Math.random() * n);
};
var colors = ["Viridis", "Rainbow", "Cool", "Warm", "Magma", "Plasma", "Inferno", "CubehelixDefault", "BrBG", "PRGn", "PiYG", "PuOr", "RdBu", "RdGy", "RdYlBu", "RdYlGn", "Spectral", "Blues", "Greens", "Greys", "Oranges", "Purples", "Reds", "BuGn", "BuPu", "GnBu", "OrRd", "PuBuGn", "PuBu", "PuRd", "RdPu", "YlGnBu", "YlGn", "YlOrBr", "YlOrRd"];
function randomColorType() {
	return colors[randInt(colors.length - 1)];
}

densityPlot(data1, {
	target: document.getElementById("plot1"),
	min: -1,
	max: 1,
	height: 200,
	color: "RdYlGn",
	mousemove: getHandler(data1)
});

function randomChart() {
	var f1 = Math.random() * 100,
	    rows = randInt(100),
	    cols = randInt(100),
	    algos = [{ fn: function fn() {
			return Math.random() * f1 - Math.random() * f1;
		}, min: -f1, max: f1 }, { fn: function fn(r, c) {
			return (r + c) * 2 * Math.random();
		}, min: 0, max: (rows + cols) * 2 }],
	    algo = algos[randInt(1)],
	    data = genData(randInt(100), randInt(100), algo.fn);
	densityPlot(data, {
		target: document.getElementById("plot2"),
		noXAxes: !randInt(2),
		noYAxes: !randInt(2),
		noLegend: !randInt(2),
		min: algo.min,
		max: algo.max,
		xTicks: randInt(10),
		yTicks: randInt(10),
		zTicks: randInt(10),
		width: 200,
		height: 200,
		segments: randInt(100),
		color: randomColorType(),
		mousemove: getHandler(data)
	});
}

setInterval(randomChart, 1000);

densityPlot(data2, {
	simple: true,
	width: 200,
	height: 200,
	color: "Spectral",
	mousemove: getHandler(data2)
});

var data3 = genData(10, 10, function (r, c) {
	return r + c;
});
densityPlot(data3, {
	scale: 20,
	min: 0,
	max: 20,
	mousemove: getHandler(data3)
});

var data4 = genData(100, 100, function (r, c) {
	return (r + c) * 2 * Math.random();
});
var update = densityPlot(data4, {
	id: "largePlot",
	min: 0,
	max: 400,
	scale: 2,
	xTicks: 10,
	yTicks: 10,
	zTicks: 10,
	color: "Warm",
	mousemove: getHandler(data4)
});

setInterval(function () {
	var data = genData(100, 100, function (r, c) {
		return (r + c) * 2 * Math.random();
	});
	update(data);
	if (tipId === "largePlotCanvas") {
		tip.innerText = Math.round(data[tipX][tipY] * 100) / 100;
	}
}, 60);

var tipX = void 0,
    tipY = void 0,
    tipId = void 0;
function getHandler(data) {
	return function (x, y, e) {
		var doc = document.documentElement,
		    left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0),
		    top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

		tipX = x;tipY = y;tipId = e.target.id;
		tip.innerText = Math.round(data[y][x] * 100) / 100;
		tip.setAttribute("style", "top:" + (e.clientY + top) + "px; left:" + (e.clientX + left) + "px");
	};
}

var data5 = genData(1000, 1000, function (r, c) {
	return (r + c) * 2 * Math.random();
});
densityPlot(data5, {
	noAxes: true,
	min: 0,
	max: 4000,
	segments: 20,
	zTicks: 20,
	color: "Rainbow",
	mousemove: getHandler(data5)
});

function genData(x, y, fn) {
	var plotData = [];
	for (var row = 0; row < x; row++) {
		var r = [];
		for (var col = 0; col < y; col++) {
			r[col] = fn(row, col);
		}
		plotData[row] = r;
	}
	return plotData;
}

/***/ })
/******/ ]);
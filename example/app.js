
let data1 = genData(60, 6, ()=>Math.random() - Math.random());
let data2 = genData(100, 100, ()=>Math.random() * 1e3);
let tip = document.getElementById("tip");
let randInt = (n) => Math.round(Math.random()*n);
let colors = [
	"Viridis", "Rainbow", "Cool", "Warm", "Magma", "Plasma", "Inferno", "CubehelixDefault",
	"BrBG", "PRGn", "PiYG", "PuOr", "RdBu", "RdGy", "RdYlBu", "RdYlGn", "Spectral",
	"Blues", "Greens", "Greys", "Oranges", "Purples", "Reds", "BuGn", "BuPu", "GnBu",
	"OrRd", "PuBuGn", "PuBu", "PuRd", "RdPu", "YlGnBu", "YlGn", "YlOrBr", "YlOrRd"
];
function randomColorType() {
	return colors[randInt(colors.length-1)];
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
	let f1 = Math.random()*100,
		rows = randInt(100),
		cols = randInt(100),
		algos = [
			{fn:()=>Math.random()*f1 - Math.random()*f1, min: -f1, max: f1},
			{fn: (r, c)=>((r+c)*2) * Math.random(), min: 0, max: (rows + cols)*2}
		],
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

let data3 = genData(10, 10, (r, c)=>r+c);
densityPlot(data3, {
	scale: 20,
	min: 0,
	max: 20,
	mousemove: getHandler(data3)
});

let data4 = genData(100, 100, (r, c)=>((r+c)*2) * Math.random()) ;
let update = densityPlot(data4, {
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

setInterval(function() {
	let data = genData(100, 100, (r, c)=>((r+c)*2) * Math.random());
	update(data);
	if (tipId === "largePlotCanvas") {
		tip.innerText = Math.round(data[tipX][tipY] * 100) / 100;
	}
}, 60);


let tipX, tipY, tipId;
function getHandler(data) {
	return (x, y, e) => {
		let doc = document.documentElement,
			left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0),
			top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
		
		tipX = x; tipY = y; tipId = e.target.id;
		tip.innerText = Math.round(data[y][x]*100)/100;
		tip.setAttribute("style", "top:" +(e.clientY+top)+"px; left:"+(e.clientX+left)+"px");
	};
}

let data5 = genData(1000, 1000, (r, c)=>((r+c)*2) * Math.random()) ;
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
	let plotData = [];
	for(let row=0; row<x; row++) {
		let r = [];
		for(let col=0; col<y; col++) {
			r[col] = fn(row, col);
		}
		plotData[row] = r;
	}
	return plotData;
}
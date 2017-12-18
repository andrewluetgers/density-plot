import {
	scaleLinear, scaleSequential,
	interpolateViridis, interpolateRainbow, interpolateCool,
	interpolateWarm, interpolateMagma, interpolatePlasma,
	interpolateInferno, interpolateCubehelixDefault
} from "d3-scale";
import * as chroma from "d3-scale-chromatic"
import { axisBottom, axisLeft } from "d3-axis";
import { max, min } from "d3-array";
import { color } from "d3-color";
import { select } from "d3-selection";
import { range } from 'lodash'


let scales = Object.assign({}, {
	interpolateViridis, interpolateRainbow,
	interpolateCool, interpolateWarm, interpolateMagma, interpolatePlasma,
	interpolateInferno, interpolateCubehelixDefault
}, chroma);

function densityPlot(buckets, opts, _div, _canvas) {
	opts = opts || {};
	let o = opts,
		id = o.id || Math.round(Math.random()*1e10),
		target = o.target || document.body,
		hasMin = 'min' in o,
		hasMax = 'max' in o,
		simple = o.simple,
		hasYAxes = !o.noYAxes,
		hasXAxes = !o.noXAxes,
		hasAxes = !simple && hasYAxes || hasXAxes,
		hasLegend = !simple && !o.noLegend,
		intScale = scales['interpolate'+o.color] || scales.interpolateCool,
		legendWidth = 10,
		textMargin = 6,
		textRoomR = 24,
		leftAxisRoom = 50,
		bottomAxisRoom = 20,
		legendRoom = (legendWidth * 2) + textMargin + textRoomR,
		margin = {
			top:    10,
			right:  hasLegend ? legendRoom : 10,
			bottom: hasXAxes ? bottomAxisRoom : 20,
			left:   hasYAxes ? leftAxisRoom : 20
		},
		zMax =  hasMax ? o.max : max(buckets, r => max(r)),
		zMin =  hasMin ? o.min : min(buckets, r => min(r)),
		dimX = buckets[0].length,
		dimY = buckets.length,
		xScale = o.scale || (o.width ? o.width/dimX : 1),
		yScale = o.scale || (o.height ? o.height/dimY : 1),
		width = o.width || dimX * xScale,
		height = o.height || dimY * yScale;
	
	// enforce a min size of 100px if width and height not set
	if (!o.width && !o.scale) {
		width = Math.max(width, 100);
		xScale = width/dimX;
	}
	
	if (!o.height && !o.scale) {
		height = Math.max(height, 100);
		yScale = height/dimY;
	}
	
	let totalWidth = width+margin.left+margin.right,
		totalHeight = height+margin.top+margin.bottom,
		x = scaleLinear().range([0, width]),
		y = scaleLinear().range([height, 0]),
		z = scaleSequential(intScale),
		div = _div,
		c = _canvas,
		svg;
	
	z.domain([zMin, zMax]);
	
	
	if (!div) {
		div = document.createElement("div");
		div.setAttribute("id", id);
		div.setAttribute("class", "plot");
		div.setAttribute("style", `width:${totalWidth}px; height:${totalHeight}px`);
		o.target && (target.innerHTML = "");
		target.appendChild(div);
		c = document.createElement("canvas");
		c.setAttribute("id", id+"Canvas");
		c.setAttribute("class", 'plotCanvas');
		c.setAttribute("width", dimX);
		c.setAttribute("height", dimY);
		c.setAttribute("style", `width:${width}px; height:${height}px; margin-left:${margin.left+1}px; margin-top:${margin.top}px`);
		div.appendChild(c);
	} else {
		div.innerHTML = "";
		div.appendChild(c);
	}
	
	setCanvasPixels(buckets, c, z);
	
	if (hasLegend || hasAxes) {
		let s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		s.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
		div.appendChild(s);
		svg = select(s)
			.attr("id", id + "svg")
			.attr("width", totalWidth)
			.attr("height", totalHeight)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	}
	
	if (hasLegend) {
		// I am legend
		let size = zMax - zMin,
			segments = o.segments || height,
			step = size / segments,
			zRange = range(zMin, zMax, step),
			z2 = scaleLinear().range([0, height]),
			segHeight = height / segments,
			zTicks = o.zTicks || 2;
		
		z2.domain([zMax, zMin]);
			
		svg.selectAll(".legend")
			.data(zRange.reverse())
			.enter().append("g")
			.attr("class", "legend")
			.attr("transform", function(d, i) {
				return "translate(" + (width + legendWidth) + "," + (i * segHeight) + ")";
			})
			.append("rect")
			.attr("width", legendWidth)
			.attr("height", Math.ceil(segHeight))
			.style("fill", z);
		
		svg.selectAll(".legendTxt")
			.data(z2.ticks(zTicks))
			.enter().append("text")
			.attr("x", width + (legendWidth*2) + textMargin)
			.attr("y", (d) => d === zMin ? z2(d)-4 : z2(d)+(d === zMax ? 4 : 2))
			.attr("dy", ".35em")
			.text(String);
	}
	
	if (hasAxes) {
		// axis forces
		x.domain([0, buckets[0].length]);
		y.domain([0, buckets.length]);
		
		let xTicks = o.xTicks || 2,
			yTicks = o.yTicks || 2;
		
		if (hasXAxes) {
			// x-axis
			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(axisBottom(x).ticks(xTicks))
				.append("text")
				.attr("class", "label")
				.attr("y", 6)
				.attr("dy", ".71em")
				.attr("text-anchor", "end")
				.attr("transform", "rotate(-90)");
		}
		
		if (hasXAxes) {
			// y-axis
			svg.append("g")
				.attr("class", "y axis")
				.call(axisLeft(y).ticks(yTicks))
				.append("text")
				.attr("class", "label")
				.attr("y", 6)
				.attr("dy", ".71em")
				.attr("text-anchor", "end")
				.attr("transform", "rotate(-90)");
		}
	}
	
	if (o.mousemove) {
		let fn = activate(o.mousemove);
		c.addEventListener("mousemove", e => {
			let m = getMousePos(c, e);
			fn(Math.floor(m.x/xScale), Math.floor(m.y/yScale), e);
		});
		c.addEventListener("mouseleave", e => {
			_x = _y = null;
		});
	}
	
	let _x, _y;
	function activate(fn) {
		return function handler(x, y, e) {
			if (x !== _x || y !== _y) {
				_x = x; _y = y; fn(x, y, e);
			}
		};
	}
	
	return function update(b, o) {
		densityPlot(b || buckets, o || opts, div, c);
	};
}

function getMousePos(canvas, e) {
	let rect = canvas.getBoundingClientRect();
	return {x: e.clientX - rect.left, y: e.clientY - rect.top};
}

function setCanvasPixels(data, canvas, z) {
	let ctx = canvas.getContext('2d'),
		imageData = ctx.getImageData(0, 0, canvas.width, canvas.height),
		rgb = imageData.data,
		i = 0;
	
	data.forEach(row => {
		row.forEach(val => {
			let c = color(z(val));
			rgb[i]     = c.r; // red
			rgb[i + 1] = c.g; // green
			rgb[i + 2] = c.b; // blue
			rgb[i + 3] = 255; // blue
			i += 4;
		});
	});
	
	ctx.putImageData(imageData, 0, 0, 0, 0, canvas.width, canvas.height);
}


module.exports = densityPlot;
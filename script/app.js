// Objective: Build a CodePen.io app that is functionally similar to this: https://codepen.io/freeCodeCamp/full/JEXgeY.
// Fulfill the below user stories and get all of the tests to pass. Give it your own personal style.
// You can use HTML, JavaScript, CSS, and the D3 svg-based visualization library. Required (non-virtual)
// DOM elements are queried on the moment of each test. If you use a frontend framework (like Vue for example),
// the test results may be inaccurate for dynamic content. We hope to accommodate them eventually, but these
// frameworks are not currently supported for D3 projects.
// User Story #1: My heat map should have a title with a corresponding id="title".
// User Story #2: My heat map should have a description with a corresponding id="description".
// User Story #3: My heat map should have an x-axis with a corresponding id="x-axis".
// User Story #4: My heat map should have a y-axis with a corresponding id="y-axis".
// User Story #5: My heat map should have rect elements with a class="cell" that represent the data.
// User Story #6: There should be at least 4 different fill colors used for the cells.
// User Story #7: Each cell will have the properties data-month, data-year, data-temp containing their
// corresponding month, year, and temperature values.
// User Story #8: The data-month, data-year of each cell should be within the range of the data.
// User Story #9: My heat map should have cells that align with the corresponding month on the y-axis.
// User Story #10: My heat map should have cells that align with the corresponding year on the x-axis.
// User Story #11: My heat map should have multiple tick labels on the y-axis with the full month name.
// User Story #12: My heat map should have multiple tick labels on the x-axis with the years between 1754 and 2015.
// User Story #13: My heat map should have a legend with a corresponding id="legend".
// User Story #14: My legend should contain rect elements.
// User Story #15: The rect elements in the legend should use at least 4 different fill colors.
// User Story #16: I can mouse over an area and see a tooltip with a corresponding id="tooltip" which
// displays more information about the area.
// User Story #16: My tooltip should have a data-year property that corresponds to the data-year of the active area.
// Here is the dataset you will need to complete this project:
// https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json
// You can build your project by forking this CodePen pen. Or you can use this CDN link to run the tests in
// any environment you like: https://cdn.freecodecamp.org/testable-projects-fcc/v1/bundle.js
// Once you're done, submit the URL to your working project with all its tests passing.
// Remember to use the Read-Search-Ask method if you get stuck.

document.addEventListener("DOMContentLoaded", function() {
	const req = new XMLHttpRequest();
	req.open(
		"GET",
		"https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json",
		true
	);
	req.send();
	req.onload = function() {
		const json = JSON.parse(req.responseText);
		const data = json.monthlyVariance;
		console.log(data);
		//		window.innerWidth and .innerHeight
		console.log(`${window.innerHeight}x${window.innerWidth}`);
		/*----------------D3 Code here-----------------*/
		const d3 = require("d3");
		const mg = { t: 50, b: 50, r: 30, l: 70 };
		/*-----------------Attributes------------------*/
		//Bar
		const b = { h: 20, w: 3 };
		//Diag
		const d = {
			h: 12 * b.h,
			w: Math.ceil((b.w * data.length) / 12)
		};
		//SVG
		const s = {
			h: mg.t + d.h + mg.b,
			w: mg.l + d.w + mg.r,
			i: "svg-canvas"
		};
		console.log(d);

		//Scales
		const parseMonth = d3.timeParse("%m");
		const parseYear = d3.timeParse("%Y");
		// let minMax = json
		// 	.map((obj) => +obj.Time.substring(0, 2))
		// 	.sort((a, b) => a - b);
		const x = d3
			.scaleTime()
			.domain([
				d3.min(data, (d) => parseYear(d.year + 1)),
				d3.max(data, (d) => parseYear(d.year - 1))
			])
			.range([0, d.w]);
		//console.log(d3.max(data, (d) => parseYear(d.year + 1)));
		//console.log(d3.min(data, (d) => parseYear(d.year - 1)));
		const y = d3
			.scaleTime()
			.domain([
				d3.max(data, (d) => parseMonth(d.month)),
				d3.min(data, (d) => parseMonth(d.month))
			])
			.range([0, d.h]);
		//console.log(y(parseMonth(1)));
		//console.log(y(parseMonth(12)));
		console.log(x.domain());

		//Axis
		const yAxis = d3.axisLeft(y).tickFormat(d3.timeFormat("%B"));
		//			.tickSize(1, 10);
		const xAxis = d3.axisBottom(x);

		const svg = d3
			.select("main")
			.append("svg")
			.attr("id", s.i)
			.attr("height", s.h)
			.attr("width", s.w);

		const diag = svg
			.append("g")
			.attr("height", d.h)
			.attr("width", d.w)
			.attr("transform", `translate(${mg.l},${mg.t})`);

		/*---------Generating axis`s-----------*/
		const myYaxs = diag
			.append("g")
			.call(yAxis)
			.attr("id", "y-axis");
		const myXaxs = diag
			.append("g")
			.call(xAxis)
			.attr("id", "x-axis")
			.attr("transform", `translate(0,${d.h})`);

		// let tooltipDiv = d3
		// 	.select("body")
		// 	.append("div")
		// 	.attr("id", "tooltip")
		// 	.attr("class", "mytooltip")
		// 	.style("opacity", 0);

		// const title = svg
		// 	.append("text")
		// 	.attr("id", "title")
		// 	.text("Doping in Professional Bicycle Racing");

		// /*---Centering title in data and top margin---*/
		// title
		// 	.attr(
		// 		"x",
		// 		mg.left +
		// 			diaAt.width / 2 -
		// 			title.node().getBoundingClientRect().width / 2
		// 	)
		// 	.attr("y", (mg.top + title.node().getBoundingClientRect().height) / 2);
		// /*Label for y-axis*/
		// const yLabel = diag
		// 	.append("text")
		// 	.attr("id", "label")
		// 	.attr("transform", "rotate(-90)")
		// 	.text("Time in minutes");
		// const yLbWid = myYaxs.node().getBoundingClientRect().width;
		// yLabel
		// 	.attr(
		// 		"x",
		// 		-(yLabel.node().getBoundingClientRect().height + diaAt.height) / 2
		// 	)
		// 	.attr("y", -yLbWid - (mg.left - yLbWid) / 4);
		// /*Circles*/
		// const color = d3.scaleOrdinal(d3.schemeCategory10).domain([0, false, true]);

		// const tooltipParse = (obj) =>
		// 	`${obj.Name} (${obj.Nationality})</br>${obj.Year} Place ${obj.Place} in ${
		// 		obj.Time
		// 	} min</br>${obj.Doping}`;
		// diag
		// 	.selectAll("rect")
		// 	.data(json)
		// 	.enter()
		// 	.append("circle")
		// 	.attr("data-xvalue", (d) => parseYear(d.Year))
		// 	.attr("data-yvalue", (d) => parseMinSec(d.Time))
		// 	.attr("class", "dot")
		// 	.attr("fill", (d) => color(d.Doping === ""))
		// 	.style("stroke", "black")
		// 	.attr("cx", (d) => x(parseYear(d.Year)))
		// 	.attr("cy", (d) => y(parseMinSec(d.Time)))
		// 	.attr("r", (d) => (d.Doping ? 4 : 8))
		// 	.on("mouseover", (d) => {
		// 		tooltipDiv
		// 			.attr("data-year", parseYear(d.Year))
		// 			.transition()
		// 			.duration(100)
		// 			.style("opacity", 0.9);
		// 		tooltipDiv
		// 			.html(tooltipParse(d))
		// 			.style("left", d3.event.pageX + mg.right / 2 + "px")
		// 			.style("top", d3.event.pageY - mg.bottom + "px");
		// 	})
		// 	.on("mouseout", () => {
		// 		tooltipDiv
		// 			.transition()
		// 			.duration(300)
		// 			.style("opacity", 0);
		// 	});
		// /*Legend*/
		// const lmg = { t: 2, b: 2, r: 2, l: 2 };
		// const lrec = { h: 15, w: 15 };
		// const legend = diag.append("svg").attr("id", "legend");
		// const legItems = legend
		// 	.selectAll(".legend-item")
		// 	.data(color.domain().slice(1))
		// 	.enter()
		// 	.append("g")
		// 	.attr("class", "legend-item")
		// 	.attr(
		// 		"transform",
		// 		(d, i) => `translate(0,${(lmg.t + lrec.h + lmg.b) * i})`
		// 	);

		// legItems
		// 	.append("rect")
		// 	.attr("width", lrec.w)
		// 	.attr("height", lrec.h)
		// 	.style("fill", color)
		// 	.style("stroke", "black");

		// legItems
		// 	.append("text")
		// 	.text(
		// 		(d) => (d ? "No doping allegations" : "Riders with doping allegations")
		// 	)
		// 	.attr("x", lrec.w + lmg.r)
		// 	.attr("y", lrec.h - 3);
		// const legDim = {
		// 	h: legItems.node().getBoundingClientRect().height,
		// 	w: legItems.node().getBoundingClientRect().width
		// };
		// legend.attr(
		// 	"transform",
		// 	`translate(${(diaAt.width - legDim.w) / 2},${lmg.t})`
		// );
	};
});

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
	const d3 = require("d3");
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

		/*----------------D3 Code here-----------------*/

		//Margins
		const mg = { t: 70, b: 90, r: 30, l: 70 };
		//Bar
		const b = { h: 30, w: 3 };
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
		//COLORBREWER
		const clr = [
			"#a50026",
			"#d73027",
			"#f46d43",
			"#fdae61",
			"#fee090",
			"#ffffbf",
			"#e0f3f8",
			"#abd9e9",
			"#74add1",
			"#4575b4",
			"#313695"
		];
		//Legend
		const lg = { h: 15, w: 30 };
		//Month names for y-axis
		const mon = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December"
		];

		/*-----------Scales----------*/
		const x = d3
			.scaleBand()
			.domain(
				data.reduce((acc, obj) => {
					acc.includes(obj.year) ? null : acc.push(obj.year);
					return acc;
				}, [])
			)
			.range([0, d.w]);

		const y = d3
			.scaleBand()
			.domain(d3.range(1, 13))
			.range([0, d.h]);

		const color = d3
			.scaleQuantize()
			.domain([
				d3.min(data, (d) => d.variance + json.baseTemperature),
				d3.max(data, (d) => d.variance + json.baseTemperature)
			])
			.range(clr.reverse());

		/*------------SVG + Diagram------------*/
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

		/*-------------Axis----------------*/
		const yAxis = d3.axisLeft(y).tickFormat((n, i) => mon[i]);
		const xAxis = d3
			.axisBottom(x)
			.tickValues(x.domain().filter((d, i) => !(i % 10)));

		//Generating axis`s
		const myYaxs = diag
			.append("g")
			.call(yAxis)
			.attr("id", "y-axis");
		const myXaxs = diag
			.append("g")
			.call(xAxis)
			.attr("id", "x-axis")
			.attr("transform", `translate(0,${d.h})`);

		/*----------Tooltip------------*/
		let tooltipDiv = d3
			.select("body")
			.append("div")
			.attr("id", "tooltip")
			.attr("class", "mytooltip")
			.attr("data-year", d.year)
			.style("opacity", 0);

		const tooltipParse = (obj) =>
			`${obj.year} - ${mon[obj.month - 1]}</br>${d3.format(".1f")(
				obj.variance + json.baseTemperature
			)}&deg;C</br>${d3.format(".1f")(obj.variance)}&deg;C`;

		/*----------Rectangles------------*/
		diag
			.selectAll("rect")
			.data(data)
			.enter()
			.append("rect")
			.attr("data-month", (d) => d.month - 1)
			.attr("data-year", (d) => d.year)
			.attr("data-temp", (d) => d.variance)
			.attr("class", "cell")
			.attr("x", (d) => x(d.year))
			.attr("y", (d) => y(d.month))
			.attr("height", b.h)
			.attr("width", b.w)
			.attr("fill", (d) => color(d.variance + json.baseTemperature))
			.on("mouseover", (d) => {
				tooltipDiv
					.attr("data-year", d.year)
					.transition()
					.duration(100)
					.style("opacity", 0.9);
				tooltipDiv
					.html(tooltipParse(d))
					.style("left", d3.event.pageX + 10 + "px")
					.style("top", d3.event.pageY - 80 + "px");
			})
			.on("mouseout", () => {
				tooltipDiv
					.transition()
					.duration(300)
					.style("opacity", 0);
			});

		/*----------Title + Description------------*/
		const title = svg
			.append("text")
			.attr("id", "title")
			.text("Monthly Global Land-Surface Temperature");

		const description = svg
			.append("text")
			.attr("id", "description")
			.html(
				`${d3.min(x.domain())}-${d3.max(x.domain())}, base temperature - ${
					json.baseTemperature
				}&deg;C`
			);

		//Centering title and description in data and top margin
		title
			.attr(
				"x",
				mg.l + d.w / 2 - title.node().getBoundingClientRect().width / 2
			)
			.attr("y", title.node().getBoundingClientRect().height / 2 + 20);
		description
			.attr(
				"x",
				mg.l + d.w / 2 - description.node().getBoundingClientRect().width / 2
			)
			.attr(
				"y",
				title.node().getBoundingClientRect().height +
					description.node().getBoundingClientRect().height +
					10
			);

		/*----------Legend------------*/
		const legend = svg.append("g").attr("id", "legend");
		legend
			.selectAll("rect")
			.data(clr)
			.enter()
			.append("rect")
			.attr("x", (d, i) => i * lg.w)
			.attr("height", lg.h)
			.attr("width", lg.w)
			.attr("fill", (d) => d)
			.attr("stroke", "black");

		//Legend scale

		const lgSc = d3
			.scaleLinear()
			.domain(color.domain())
			.range([0, lg.w * clr.length]);

		const tickVals = color.range().reduce((acc, d, i) => {
			let tmp = color.invertExtent(d);
			acc.push(tmp[0]);
			if (i === color.range().length - 1) acc.push(tmp[1]);
			return acc;
		}, []);

		const lgAxis = d3
			.axisBottom(lgSc)
			.tickFormat(d3.format(".1f"))
			.tickValues(tickVals);

		legend
			.append("g")
			.call(lgAxis)
			.attr("id", "lg-axis")
			.attr("transform", `translate(0,${lg.h})`);

		//Centering legend in lower margin

		const tmp = myXaxs.node().getBoundingClientRect().height;

		legend.attr(
			"transform",
			`translate(${mg.l +
				(d.w - legend.node().getBoundingClientRect().width) / 2},${mg.t +
				d.h +
				tmp +
				(mg.b - tmp) / 2 -
				legend.node().getBoundingClientRect().height / 2})`
		);
	};
});

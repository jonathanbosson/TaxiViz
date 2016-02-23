function slider(data) {
	console.log('Creating slider');

	var sliderDiv = $("#area");

    var margin = {top: sliderDiv.height() - 50, right: 40, bottom: 20, left: 40},
    	width = sliderDiv.width() - margin.left - margin.right,
        height = sliderDiv.height() - margin.top - margin.bottom;

    //Set time format
    var format = d3.time.format.utc("%Y-%m-%dT%H%M%S");
	d3.time.format.utc("data/test.csv");

	var x = d3.time.scale()
			.domain([new Date(d3.min(data.map(function(d) { return d.date; })))
				, new Date(d3.max(data.map(function(d) { return d.date; })))])
			.range([0, width])
			.clamp(true);


	var startVal = x((d3.min(data.map(function(d) { return d.date; }))));
	var endVal = x((d3.max(data.map(function(d) { return d.date }))));
		startVal = d3.min(data.map(function(d) { return d.date }));
		endVal = d3.max(data.map(function(d) { return d.date }));

		console.log(startVal)
		console.log(endVal)

	// defines brush
	var brush = d3.svg.brush()
		.x(x)
		//.extent([startVal, endVal])
		.on("brush", brushed);


    var svg = d3.select("#area").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		//.append("g");
		// classic transform to position g
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.append("g")
		.attr("class", "x axis")
		// put in middle of scree
		//.attr("transform", "translate(0," + height/4 + ")")
		// inroduce axis
		.call(d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.tickFormat(function(d) {
		return format(d);
		})
		.tickSize(0)
		.tickPadding(12)
		.tickValues([x.domain()[0], x.domain()[1]]))
		.select(".domain")
		.select(function() {
		//console.log(this);
		return this.parentNode.appendChild(this.cloneNode(true));
		})
		.attr("class", "halo");


	var slider = svg.append("g")
		.attr("class", "slider")
		.call(brush);

	d3.csv("data/test.csv", function(error, data) {
		x.domain(d3.extent(data.map(function(d) { return format.parse(d.date); })));//Complete the code
		

		});
/*
	slider.selectAll(".extent,.resize")
		.remove();

	slider.select(".background")
		.attr("height", height);

	var handleL = slider.append("g")
		.attr("class", "handle")

	var handleR = slider.append("g")
		.attr("class", "handle")

	handleL.append("path")
		.attr("transform", "translate(0," + height / 2 + ")")
		.attr("d", "M 0 20 V -20")
	handleR.append("path")
		.attr("transform", "translate(0," + height / 2 + ")")
		.attr("d", "M 0 -20 V 20")*/

	//add text to the handles
	//handleL.append('text')
	//	.text(startVal);
		//.attr("transform", "translate(" + (-18) + " ," + (height / 2 - 25) + ")");
	//handleR.append('text')
	//	.text(endVal);
		//.attr("transform", "translate(" + (-18) + " ," + (height / 2 - 25) + ")");


	//slider.call(brush.event)  

	function brushed() {
		/*
		x.domain(brush.empty() ? x.domain() : brush.extent());
		var valueL = brush.extent()[0];
        var valueR = brush.extent()[1];
		handleL.attr("transform", "translate(" + x(valueL) + ",0)");
		handleL.select('text').text('left');

		handleR.attr("transform", "translate(" + x(valueR) + ",0)");
		handleR.select('text').text('right');*/
		/*
        var valueL = brush.extent()[0];
        var valueR = brush.extent()[1];
        console.log(brush.extent())

		if (d3.event.sourceEvent) { // not a programmatic event
			valueL = x.invert(d3.mouse(this)[0]);
			valueR = x.invert(d3.mouse(this)[1]);
			brush.extent([valueL, valueR]);
		}

		handleL.attr("transform", "translate(" + x(valueL) + ",0)");
		handleL.select('text').text('left');

		handleR.attr("transform", "translate(" + x(valueR) + ",0)");
		handleR.select('text').text('right');
		*/
		//map1.filterTime(brush.extent());	
    }
}
function map(data) {
	var kmeansArray = [];
	//var color = d3.scale.category10();
	var color = ["green","blue","grey","yellow"];
	var cc = [];
	var format = d3.time.format.utc("%Y-%m-%dT%H%M%S");

    var zoom = d3.behavior.zoom()
            .scaleExtent([0.5, 8])
            .on("zoom", move);

    var mapDiv = $("#map");

    var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = mapDiv.width() - margin.right - margin.left,
            height = mapDiv.height() - margin.top - margin.bottom;

    var curr_mag = 4;

    var format = d3.time.format.utc("%Y-%m-%dT%H%M%S");
    //2013-03-08T18:06:15
    

   var timeExt = d3.extent(data.map(function (d) {
        return format.parse(d.date);
    }));

    var filterdData = data;

    //Sets the colormap
    var colors = colorbrewer.Set3[10];

    //Assings the svg canvas to the map div
    var svg = d3.select("#map").append("svg")
            .attr("width", width)
            .attr("height", height)
            .call(zoom);

    var g = svg.append("g");

    //Sets the map projection
    var projection = d3.geo.mercator()
            .center([19, 59])
            .scale(15000);

    //Creates a new geographic path generator and assing the projection
    var path = d3.geo.path().projection(projection);

    //Formats the data in a feature collection trougth geoFormat()
    var geoData = {type: "FeatureCollection", features: geoFormat(data)};
    //Loads geo data
    d3.json("topojson/swe_mun.topojson", function (error, data) {
        var countries = topojson.feature(data, data.objects.swe_mun).features;
        draw(countries);
    });

    //Calls the filtering function
    d3.select("#slider").on("input", function () {
        filterMag(this.value, data);
    });

    //Formats the data in a feature collection
    function geoFormat(array) {
        var data = [];
        array.map(function (d, i) {
            //Complete the code
            data.push(
            { 
                "type": "Feature",
                "geometry": {
                    "type": "Point", 
                    "coordinates": [d.x_coord, d.y_coord]},
                "properties": {
                    "id" : d.id,
                    "date" : d.date,
                    "depth" : d.hired,
                }
            });
        });
        return data;
    }

    //Draws the map and the points
    function draw(countries)
    {
        //draw map
        var country = g.selectAll(".country").data(countries);
        country.enter().insert("path")
                .attr("class", "country")
                .attr("d", path)
                .style('stroke-width', 1)
                .style("fill", "lightgray")
                .style("stroke", "white");


        //draw point        
        var point =  g.selectAll("circle")
            .data(geoData.features)
            .enter()
            .append("circle")
            .attr("cx", function(d) { return projection(d.geometry.coordinates)[0];})
            .attr("cy", function(d) { return projection(d.geometry.coordinates)[1]; })
            .attr("r", 2)
            .style("fill", "orange")
            .classed("pin", true);
    };

    //Filters data points according to the specified magnitude
    function filterMag(value) {
        //Complete the code
        magnitude = value;
        
        svg.selectAll("circle").data(data).style("opacity", function(d){
            if(d.mag < magnitude)
                return 0;
            else
                return 1;
            })
    }

    //Filters data points according to the specified time window
    this.filterTime = function (value) {
        //Complete the code
        
        startTime = value[0];//.getTime();
        endTime = value[1];//.getTime();
        //console.log('start: ' + startTime)
        //console.log('end: ' + endTime)
        
        svg.selectAll("circle").data(data).style("fill", function(d){
            //d.properties.date is a string, convert to a date
            var date = new Date(d.date);
            //console.log(date)
            //console.log('point:' + date);
            if(startTime <= date.getTime() && date.getTime() <= endTime)
                return "orange";
            else
                return "blue";
            })

    };

    //Calls k-means function and changes the color of the points
    this.cluster = function () {
        var k = 4;
        var kmeansRes = kmeans(kmeansArray,k);
        //initialize the cluster colors
		// add index to properties, and check if kmeansRes.id is same as data id.
		for (j = 0; j < k; j++) {
			data.forEach(function(d, i) {
				if (kmeansRes[i] == j) {
					cc[i] = color[j];

				}else
					cc[i] = "orange";
			});
		}
		console.log(cc);
		d3.selectAll(".point")
		.style("fill", function(d, i){ return cc[i]; });
    };

    //Zoom and panning method
    function move() {

        var t = d3.event.translate;
        var s = d3.event.scale;

        zoom.translate(t);
        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
    }

    //Prints features attributes
    function printInfo(value) {
        var elem = document.getElementById('info');
        elem.innerHTML = "Place: " + value["place"] + " / Depth: " + value["depth"] + " / Magnitude: " + value["mag"] + "&nbsp;";
    }

}

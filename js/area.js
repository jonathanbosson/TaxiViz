//Focus+Context via Brushing
//http://bl.ocks.org/mbostock/1667367

function area(data) {
    var areaDiv = $("#area");

    var margin = {top: 100, right: 40, bottom: 100, left: 40},
    margin2 = {top: areaDiv.height() - 50, right: 40, bottom: 20, left: 40},
    width = areaDiv.width() - margin.left - margin.right,
            height = areaDiv.height() - margin.top - margin.bottom,
            height2 = areaDiv.height() - margin2.top - margin2.bottom;

    //Sets the data format
    var format = d3.time.format.utc("");//Complete the code

    //Sets the scales 
    var x = d3.time.scale().range([0, width]),
            x2 = d3.time.scale().range([0, width]),
            y = d3.scale.linear().range([height, 0]),
            y2 = d3.scale.linear().range([height2, 0]);
    
    //Sets the axis 
    var xAxis = d3.svg.axis().scale(x).orient("bottom"),
            xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
            yAxis = d3.svg.axis().scale(y).orient("left");
    
    //Assigns the brush to the small chart's x axis
    var brush = d3.svg.brush()
            .x(x2)
            .on("brush", brush);
    
    //Creates the big chart
    var area = d3.svg.area()
            .interpolate("step")
            .x(function (d) {
                return 10;//Complete the code
            })
            .y0(height)
            .y1(function (d) {
                return 10;//Complete the code
            });
    
    //Creates the small chart        
        var area2 = d3.svg.area()
            .interpolate("step")
            .x(function (d) {
                return 10;//Complete the code
            })
            .y0(height2)
            .y1(function (d) {
                return 10;//Complete the code
            });
    
    //Assings the svg canvas to the area div
    var svg = d3.select("#area").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);
    
    //Defines clip region
    svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);
    
    //Defines the focus area
    var focus = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    //Defines the context area
    var context = svg.append("g")
            .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    //Initializes the axis domains for the big chart
    x.domain([10,10]);//Complete the code
    y.domain([4, 10]);//Complete the code
    //Initializes the axis domains for the small chart
    x2.domain(x.domain());
    y2.domain(y.domain());

    //Appends the big chart to the focus area
    focus.append("path")
            .datum(data)
            .attr("clip-path", "url(#clip)")
            .attr("d", area);
    
    //Appends the x axis 
    focus.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
    
    //Appends the y axis 
    focus.append("g")
            .attr("class", "y axis")
            .call(yAxis);

    //Appends the small chart to the focus area        
    context.append("path")
            .datum(data)
            .attr("d", area2);
    
    //Appends the x axis 
    context.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height2 + ")")
            .call(xAxis2);

    //Appends the brush 
    context.append("g")
            .attr("class", "x brush")
            .call(brush)
            .selectAll("rect")
            .attr("y", -6)
            .attr("height", height2 + 7);
    
  
     

    //Method for brushing
    function brush() {
        x.domain(brush.empty() ? x2.domain() : brush.extent());
        focus.select("path").attr("d", area);
        focus.select(".x.axis").call(xAxis);
        //Complete the code
    }
}

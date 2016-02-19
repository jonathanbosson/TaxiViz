var area1;
var map1;

d3.csv("data/taxi_sthlm_march_2013_2.csv", function (data) {

	//console.log(data)
    area1 = new area(data);
    map1 = new map(data);


});


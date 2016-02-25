var area1;
var map1;

console.log("Opening csv")

d3.csv("data/taxidata_preprocess.csv", function (data) {

	//console.log(data)
    //area1 = new area(data);
    map1 = new map(data);


});


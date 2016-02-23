var area1;
var map1;
var slider1;

d3.csv("data/test.csv", function (data) {

	//console.log(data)
    //area1 = new area(data);
    map1 = new map(data);
   	slider1 = new slider(data)

});


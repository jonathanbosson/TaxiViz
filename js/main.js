var map1;
var slider1;

console.log("Opening csv")

d3.csv("data/taxidata_preprocess.csv", function (data) {
    map1 = new map(data);
   	slider1 = new slider(data);
});

function getInfo()
{
	swal("Where should I park my taxi?", 
		"TaxiViz shows popular spots for grabbing a taxi in Stockholm. The data can be filtered over time with the slider in order to compare different time periods. With the cluster function you are able to see the most popular places to grab a taxi.");
}
/*

Idéer
preprocess - behålla alla taxibilar som går från inte hyrd till hyrd. 
Visa hot spots - klustra - filtrera över tiden/opacitet...
Punkter som ligger nära varandra kan grupperas till en större punkt
 
*/


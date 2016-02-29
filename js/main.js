var map1;
var slider1;

console.log("Opening csv")

d3.csv("data/test_small.csv", function (data) {
    map1 = new map(data);
   	slider1 = new slider(data);
});


/*

Idéer
preprocess - behålla alla taxibilar som går från inte hyrd till hyrd. 
Visa hot spots - klustra - filtrera över tiden/opacitet...
Punkter som ligger nära varandra kan grupperas till en större punkt
 
*/


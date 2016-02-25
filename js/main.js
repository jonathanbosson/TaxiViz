var map1;
var slider1;

d3.csv("data/test.csv", function (data) {
    map1 = new map(data);
   	slider1 = new slider(data);
});


/*

Idéer
preprocess - behålla alla taxibilar som går från inte hyrd till hyrd. 
Visa hot spots - klustra - filtrera över tiden/opacitet...
Punkter som ligger nära varandra kan grupperas till en större punkt
 
*/


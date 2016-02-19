    /**
    * k means algorithm
    * @param data
    * @param k
    * @return {Object}
    */
   var keys = [];
   var cluster = [];
   var centroids = [];
   var EPSILON = 0.01;
   
    function kmeans(data, k) {	
		var iteration = 0;
		var qualityDiff = 100000;
		
		// 0. Convert data
		data = convertData(data);
		keys = d3.keys(data[0]);
		
		// 1. Randomise k positions
		createCentroids(data, keys, k);
		
		do {
			// 2. Assign item to closest centroid
			data.forEach(function(d, i) { cluster[i] = assign(d, keys); });
			
			// 3. Reassign centroids
			reassign(data);
			
			// 4. Check quality
			//console.log("Quality: " + qualityDiff);
			var temp = qualityDifference(data);
			if (qualityDiff - EPSILON > temp)
				qualityDiff = temp;
			else 
				qualityDiff = 0;
			
			iteration++;
		} while( iteration < 15 && qualityDiff !== 0 );
		
		// 5. Return an array of assignments for color coding
		return cluster;
    };
	
	function convertData(data) {
	var temp = [];
		for (var row in data) {
			temp.push( { "mag": data[row].mag, "depth": data[row].depth} );
		}
		return temp;
	}
	
	function createCentroids(data, keys, k) {
		for(i = 0; i < k; i++)
			centroids[i] = data[Math.floor(Math.random()*data.length)];
	}
	
	// Calculate the euclidian distance between dataItem and centroid
	function assign(data, keys) {
		var dist = 10000;
		var k = -1;
		for (i = 0; i < centroids.length; i++) {
			var sum = 0;
			keys.forEach(function(d) { sum += Math.pow(Number(centroids[i][d]) - Number(data[d]),2); });
			var distance = Math.sqrt(sum);
			
			if (dist > distance) {
				dist = distance;
				k = i;
			}
		}
		return k; 
	};
	
	function reassign(data) {
		// Go through all clusters
		for(j = 0; j < centroids.length; j++) {
			var sum = [];
			keys.forEach(function(p) { sum[p] = 0; });
			var counter = 0;
			// Go through all data and check if its assigned to cluster j
			data.forEach(function(d, i) {
				if (cluster[i] == j) {
					// Add up 'A', 'B' and 'C' coordinates to calculate avg value
					keys.forEach(function(p) { sum[p] += Number(d[p]); });
					counter++;
				}
			});
			// Set the new position of the centroid as the avg position
			if (counter !== 0) {
				keys.forEach(function(p) { centroids[j][p] = sum[p] / counter; });
			}
		}
		//data.forEach(function(d, i) { cluster[i] = assign(d, keys); });
	};
	
	function qualityDifference(data) {
		var sum = 0;
		for(j = 0; j < centroids.length; j++) {	
			data.forEach(function(d, i) {
				if (cluster[i] == j) {
					keys.forEach(function(p) { sum += Math.pow(Number(d[p]) - centroids[j][p], 2); });
				}
			});
		}
		return sum;
	};
	

    
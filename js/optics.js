/**
* OPTICS algorithm
* @param data
* @param maxDist
* @param minPoints
* @return {Object}
*/

var seeds;
var data;
var clusters;

function optics(incomingdata, eps, minPoints) {	
	// A point p is a core point if at least minPoints
	// are found within its eps-neighborhood 
	// (this creates a cluster)
	
	// Incoming data is in the form of geoData which has
	// d.properties (cluster) and d.geometry (x- y-coordinates)
	data = incomingdata;
	var q;
	var N;
	var cluster = 0;
	//var orderedList = []; // Can return a list of the objects that belong to clusters
	clusters = {}; // Will contain the clusters
	seeds = new buckets.Heap(compare); // min Heap
	
	// Initialize data
	data.forEach(function(d,i) {
		d.processed = false;
		d.reachDist = undefined;
		d.index = i;
	});
	
	data.forEach(function(p) {
		if(!p.processed){
			N = getNeighbors(p, eps); //Finds the neighbors of point p
			
			p.processed = true;
			
			if(coreDistance(p, eps, minPoints) !== undefined) {
				//seeds.clear(); //clear priority queue
				update(N, p, seeds, eps, minPoints); //Update priority queue
				while(!seeds.isEmpty()) {
					q = seeds.removeRoot();
					if(!q.processed) {
						Nx = getNeighbors(q, eps);
						q.processed = true;
						
						countCluster(cluster, q);
						
						q.properties.cluster = cluster;
						p.properties.cluster = cluster;
						
						//output q to the ordered list?
						
						if(coreDistance(q, eps, minPoints) != undefined)
							update(Nx, q, seeds, eps, minPoints);
					}
				}
			}
		}
		cluster++;
	});
	
	// Remove added properties to clean up ordered list
	/*
	data.forEach(function(d,i) {
		delete d['processed'];
		delete d['reachDist'];
		delete d['index'];
		if(d.properties.cluster !== undefined) {
			orderedList.push(d);
		}
	});*/
	//console.log('cluster', clusters, Object.keys(clusters).length, clusters[0]);
	// Go through clusters and clean up information
	for(var key in clusters) {
		clusters[key].x /= clusters[key].amount; //Divide by amount
		clusters[key].y /= clusters[key].amount; //Divide by amount
		clusters[key].amount += 1; // +1 because the core point can't be counted
	}

	return clusters;
}

// Updates cluster points
function update(N, p, seeds, eps, minPoints) {
	var coreDist = coreDistance(p, eps, minPoints);
	
	N.forEach(function(o) {
		if(!o.processed) {
			var newReachDist = Math.max(coreDist, dist(p,o)); //Distance to core point
			if(o.reachDist === undefined) { //Set new reachDist, belongs to a cluster!
				//o is not in seed
				o.reachDist = newReachDist;
				seeds.add(o);
			} else if(newReachDist < o.reachDist) {//o is in seed, check for improvements (reorder)
				// Belongs to a better cluster!
				//move up this element in queue
				/*if (o.properties.cluster !== undefined && o.properties.cluster !== p.index)
					changeClusterCount(p.index, o.properties.cluster, o);*/
				
				o.reachDist = newReachDist;
				moveUp(o, newReachDist);
			}
		}
	});
}

// Checks if p is a core point (in the middle of a cluster)
function coreDistance(p, eps, minPoints) {
	var neighbor = getNeighbors(p, eps);
	var minDist = undefined;
	var distance;
	
	// Core points should at least be the minPoints, otherwise not a cluster
	if(neighbor.size() >= minPoints) { // Yay, core point!
		minDist = eps;
		
		neighbor.forEach(function(o) {
			distance = dist(p,o);
			if(distance < minDist)
				minDist = distance;
		});
	}
	
	return minDist;
}


// Returns n neighbors that is within eps distance of point p
function getNeighbors(p, eps) {
	var neighbor = buckets.Heap(compare);
	
	data.forEach(function(o) {
		if(p.index !== o.index && dist(p,o) < eps) {
			neighbor.add(o);
		}
	});
	
	return neighbor;
}

// Returns the euclidean distance between two GPS points
function dist(b1, b2) {
	return Math.sqrt(Math.pow((b1.geometry.coordinates[0] - b2.geometry.coordinates[0]), 2) + Math.pow((b1.geometry.coordinates[1] - b2.geometry.coordinates[1]),2));
}

// minHeap order function
function compare(a, b) {
	if (a.reachDist === undefined && b.reachDist === undefined)
		return 0; //Equals
	else if (a.reachDist === undefined && b.reachDist !== undefined)
		return 1; //a larger than b
	else if (a.reachDist !== undefined && b.reachDist === undefined)
		return -1; // a smaller than b
	else if (a.reachDist < b.reachDist)
		return -1;
	else if (a.reachDist > b.reachDist)
		return 1; // a larger than b
	else
		return 0; //a equal to b
}

// Move point a up in the heap (no function for renewing values in heap)
function moveUp(a, newReachDist) {
	var tempSeeds = seeds.toArray();
	seeds.clear();
	
	tempSeeds.forEach(function(d) {
		seeds.add(d);
	});
	
	if(tempSeeds.length === 0 )
		seeds.add(a);
}

// Count clusterpoint and cluster centerpoint
function countCluster(cID, point) {
	if(clusters[cID] != undefined) { // Update existing cluster 
		clusters[cID].amount += 1; // Add point
		clusters[cID].x += point.geometry.coordinates[0]; //Add coordinates
		clusters[cID].y += point.geometry.coordinates[1]; //Add coordinates
	} else { // New cluster, assign it
		clusters[cID] = {amount: 1, x: point.geometry.coordinates[0], y: point.geometry.coordinates[1]};
	}
}

// Not sure if function works in its context, subtracts point from old cluster
// and assigns it to its new cluster
// Doesn't seem to do anything good.
function changeClusterCount(newID, oldID, point) {
	if(clusters[oldID] === undefined) { //No old cluster, assign new
		countCluster(newID, point);
	} else { // Has old cluster, remove point and assign to the new cluster
		// Remove old score
		clusters[oldID].amount -= 1;
		clusters[oldID].x -= point.geometry.coordinates[0];
		clusters[oldID].y -= point.geometry.coordinates[1];
		
		// Add new score
		countCluster(newID, point);
	}
}

/*PSEUDOCODE
	// seeds is a priority queue
	
	
	for each point p of DB
		p.reachability-distance = undefined
	
	for each unprocessed point p of DB,
		N = getNeighbors(p, eps)
		mark p as processed
		output p to the ordered list
		
		if (coreDistance(p, eps, minPoints) != UNDEFINED)
			Seeds = empty priority queue
			update(N, p, Seeds, eps, minPoints)
			for each next q in Seeds
				N' = getNeighbors(q, eps)
				mark q as processed
				output q to the ordered list
				if(coreDistance(q, eps, minPoints) != UNDEFINED)
					update(N', q, Seeds, eps, minPoint)
					
	function update(N, p, seeds, eps, minPoints)
		coredist = coreDistance(p, eps, minPoints)
		
		for each o in N
			if(o is not processed)
				new-reach-dist = max(coredist, dist(p,o))
				if(o.reachability-distance == UNDEFINED)
					//o is not in Seeds
					o.reachability-distance = new-reach-dist
					Seeds.insert(o, new-reach-dist)
				else // o is in seeds, check for improvement
					if(new-reach-dist < o.reachability-distance)
						o.reachabbility-distance = new -reach-dist
						Seeds-move-up(o, new-reach-dist)
		
	
*/

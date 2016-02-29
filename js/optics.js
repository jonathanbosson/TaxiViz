/**
* OPTICS algorithm
* @param data
* @param maxDist
* @param minPoints
* @return {Object}
*/
var keys = [];
var cluster = [];
var centroids = [];
var EPSILON = 0.01;
var seeds = new buckets.PriorityQueue(compare);
var data;
var orderedList = []

//var seeds = new BinaryHeap(function(element){return element.reachDist}, function(element){return element.index},'reachDist');

function optics(incomingdata, eps, minPoints) {	
	// A point p is a core point if at least minPoints
	// are found within its eps-neighborhood
	data = incomingdata;
	var q;
	var N;
	
	// Initialize data
	data.forEach(function(d,i){
		d.processed = false;
		d.reachDist = undefined;
		d.index = i; //index?
	});
	
	data.forEach(function(p) {
		if(!p.processed){
			N = getNeighbors(p, eps); //Finds the neighbors correctly
			console.log('neig',N.toArray());
			p.processed = true;
			// output p to ordered list?
			orderedList.push(p);
			
			if(coreDistance(p, eps, minPoints) !== undefined){
				//seeds.clear(); //clear priority queue
				update(N, p, seeds, eps, minPoints); //Update priority queue
				while(!seeds.isEmpty()){
					q = seeds.dequeue();
					if(!q.processed) {
						Nx = getNeighbors(q, eps);
						q.processed = true;
						//output q to the ordered list?
						if(coreDistance(q, eps, minPoints) != undefined)
							update(Nx, q, seeds, eps, minPoints);
					}
				}
				
			}
		}
	});
	
	console.log(data);
}


function update(N, p, seeds, eps, minPoints) {
	var coreDist = coreDistance(p, eps, minPoints);
	console.log('core', coreDist);
	
	N.forEach(function(o){
		if(!o.processed){
			var newReachDist = Math.max(coreDist, dist(p,o));
			if(o.reachDist === undefined){
				console.log('not in', o.index);
				//o is not in seed
				o.reachDist = newReachDist;
				seeds.add(o);
			} else { //o is in seed, check for improvements (reorder)
				if(newReachDist < o.reachDist)
				{
					console.log('better', o.index)
					console.log(o.index, o.reachDist, newReachDist); 
					//move up this element in queue
					o.reachDist = newReachDist;
					moveUp(o, newReachDist);
				}
			}
		}
	});
}

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
	var neighbor = buckets.PriorityQueue(compare);
	
	data.forEach(function(o){
		if(p.index !== o.index && dist(p,o) < eps)
			neighbor.add(o);
	});
	
	return neighbor;
}

// Returns the euclidean distance between two GPS points
function dist(b1, b2) {
	return Math.sqrt(Math.pow((b1.x_coord - b2.x_coord), 2) + Math.pow((b1.y_coord - b2.y_coord),2));
}

function compare(a, b) {
	if(a.reachDist == undefined && b.reachDist == undefined)
		return 0; //Equals
	else if(a.reachDist == undefined && b.reachDist != undefined)
		return -1; //a smaller than b
	else if(a.reachDist != undefined && b.reachDist == undefined)
		return 1; // a larger than b
	else if( a.reachDist < b.reachDist)
		return -1;
	else if(a.reachDist > b.reachDist)
		return 1; // a larger than b
	else
		return 1; //a equal to b
}

function moveUp(a, newReachDist){
	var tempSeeds = seeds.toArray();
	seeds.clear();
	for(var i = 0; i < tempSeeds.length; i++)
	{		
		seeds.add(tempSeeds[i]);
	}
	if(tempSeeds.length === 0 )
		seeds.add(a);
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

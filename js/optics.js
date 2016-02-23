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
//var seeds = new BinaryHeap(function(element){return element.reachDist}, function(element){return element.index},'reachDist');

function optics(data, eps, minPoints) {	
	// A point p is a core point if atleast minPoints
	// are found in within its eps-neighborhood
	var q;
	
	// Initialize data
	data.forEach(function(d,i){
		d.processed = false;
		d.reachDist = undefined;
		//d.index = i;
	});
	
	data.forEach(function(p) {
		if(p.processed == false){
			N = getNeighbors(p, eps);
			p.processed = true;
			// output p to ordered list?
			if(coreDistance(p, eps, minPoints) != undefined){
				seeds.clear(); //clear priority queue
				update(N, p, seeds, eps, minPoints); //Update priority queue
				while(!seeds.isEmpty){
					q = seeds.enqueue;
					Nx = getNeighbors(q, eps);
					q.processed = true;
					//output q to the ordered list?
					if(core-distance(q, eps, minPoints) != undefined)
					update(Nx, q, seeds, eps, minPoint);
				}
				
			}
		}
	});
	
	console.log(data);
	
	/*PSEUDOCODE
	// seeds is a priority queue
	
	
	for each point p of DB
		p.reachability-distance = undefined
	
	for each unprocessed point p of DB,
		N = getNeighbors(p, eps)
		mark p as processed
		output p to the ordered list
		
		if (core-distance(p, eps, minPoints) != UNDEFINED)
			Seeds = empty priority queue
			update(N, p, Seeds, eps, minPoints)
			for each next q in Seeds
				N' = getNeighbors(q, eps)
				mark q as processed
				output q to the ordered list
				if(core-distance(q, eps, minPoints) != UNDEFINED)
					update(N', q, Seeds, eps, minPoint)
					
	function update(N, p, seeds, eps, minPoints)
		coredist = core-distance(p, eps, minPoints)
		
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
	
}


function update(N, p, seeds, eps, minPoints) {
	var coreDist = core-distance(p, eps, minPoints);
	
	N.forEach(function(o){
		if(!d.processed){
			newReachDist = max(coreDist, dist(p,o));
			if(o.reachDist == undefined){
				//o is not in seed
				o.reachDist = newReachDist;
				seeds.add(o);
			} else { //o is in seed, check for improvements (reorder)
				if(newReachDist < o.reachDist)
				{
					//move up this element in queue
					moveUp(o, newReachDist);
					o.reachDist = newReachDist;
				}
			}
		}
	});
}

function compare(a, b){
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
	for(i=0; i < tempSeeds.length; i++)
	{
		if(tempSeeds[i] === a)
		{
			tempSeeds[i].reachDist = newReachDist;
		}
		seeds.add(tempSeeds[i]);
	}
}

var heatmap;
var minTime;

function map(data) {
	var googleStyle = 

[
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#d3d3d3"
            }
        ]
    },
    {
        "featureType": "transit",
        "stylers": [
            {
                "color": "#808080"
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#b3b3b3"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#ffffff"
            },
            {
                "weight": 1.8
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#d7d7d7"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#ebebeb"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#a7a7a7"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#efefef"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#696969"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#737373"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#d6d6d6"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {},
    {
        "featureType": "poi",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#dadada"
            }
        ]
    }
]

;



    var colors = colorbrewer.Set3[10];
    var color = ["green","blue","grey","yellow"];
	var cc = [];

	var format = d3.time.format.utc("%Y-%m-%dT%H%M%S");
    var zoom = d3.behavior.zoom()
            .scaleExtent([0.5, 8])
            .on("zoom", move);

    var mapDiv = $("#map");

    var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = mapDiv.width() - margin.right - margin.left,
            height = mapDiv.height() - margin.top - margin.bottom;

    var curr_mag = 4;

   var timeExt = d3.extent(data.map(function (d) {
        return format.parse(d.date);
    }));

    var filterdData = data;

    //Sets the colormap
   

    //Assings the svg canvas to the map div
    var svg = d3.select("#map").append("svg")
            .attr("width", width)
            .attr("height", height)
            .call(zoom);

    var g = svg.append("g");

    //Sets the map projection
    var projection = d3.geo.mercator()
            .center([18.0658, 59.3279])
            .scale(220000);

    //Creates a new geographic path generator and assing the projection
    var path = d3.geo.path().projection(projection);
    var minDate = new Date(d3.min(data.map(function(d) { return d.date; })));
    var maxDate = new Date(d3.max(data.map(function(d) { return d.date; })));
    minTime = minDate;
    //Formats the data in a feature collection through geoFormat()
    var geoData = {type: "FeatureCollection", features: geoFormat(data)};

    console.log("geoData stored")
    var mapDim = {
    height: 500,
    width: 500
}
    var dateRange = new Array(minDate.getTime(), maxDate.getTime());
    var googlemap;
    initMap(googleStyle);

    heatmap = new google.maps.visualization.HeatmapLayer({
      dissipating: true,
      maxIntensity: 500
    });
    dataFeed_callback(geoData, dateRange);
    console.log("Initiated Google map");

    //Filters data points according to the specified time window
    this.filterTime = function (value) {
        dataFeed_callback(geoData, value);
    };

    //Calls cluster function and changes the color of the points
    this.cluster = function () {
        var k = 4;
        var opticsRes = optics(data,0.1, 2);
        
        //initialize the cluster colors
		// add index to properties, and check if kmeansRes.id is same as data id.
		
		data.forEach(function(d, i) {
			if (d.cluster !== undefined) {
				cc[i] = color[d.cluster];
			}else
				cc[i] = "orange";
		});
		
		svg.selectAll("circle").data(data).style("fill", function(d) {
            if(d.cluster != undefined)
				return color[d.cluster];
			else
				return 'orange';
        });
    };

    //Zoom and panning method
    function move() {

        var t = d3.event.translate;
        var s = d3.event.scale;

        zoom.translate(t);
        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
    }

    function initMap(googleStyle){
        googlemap = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 59.3279, lng: 18.0658},
            zoom: 12,
            styles: googleStyle,
            disableDoubleClickZoom: true
        });

        /*     
        googlemap.data.setStyle(function() {
            return {
              icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        fillColor: 'red',
                        fillOpacity: .2,
                        scale: 6,
                        strokeColor: 'white',
                        strokeWeight: .5
                    }
            };
        });*/
        
    }
    // work in progress - solve bounds problem
    function boundsCheck(value){
        var marker = new google.maps.LatLng(value.coordinates[1], value.coordinates[0])
        return googlemap.getBounds().contains(marker.getPosition());
    }

    function dataFeed_callback(geoData, dateRange) {
        var heatmapData = new google.maps.MVCArray();
        for (var i = 0, features; features = geoData.features[i]; i++) {
            var date = new Date(features.properties.date);
            if (features.geometry && date.getTime() >= dateRange[0] && date.getTime() <= dateRange[1]) {
                heatmapData.push(new google.maps.LatLng(features.geometry.coordinates[1], features.geometry.coordinates[0]));
            }
        }
        heatmap.data = heatmapData;
        heatmap.maxIntensity = Math.floor(255410*(dateRange[1] - dateRange[0]) / minTime);
        console.log(heatmap);

        heatmap.setMap(googlemap);
    }

    //Formats the data in a feature collection
    function geoFormat(array) {
        var data = [];
        array.map(function (d, i) {
            data.push(
            { 
                "type": "Feature",
                "geometry": {
                    "type": "Point", 
                    "coordinates": [Number(d.x_coord), Number(d.y_coord)]},
                "properties": {
                    "id" : Number(d.id),
                    "date" : d.date,
                }
            });
        });
        return data;
    }


}

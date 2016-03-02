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
    ];

    var colors = colorbrewer.Set3[10];
	var format = d3.time.format.utc("%Y-%m-%dT%H%M%S");
    var minDate = new Date(d3.min(data.map(function(d) { return d.date; })));
    var maxDate = new Date(d3.max(data.map(function(d) { return d.date; })));
    
    //Formats the data in a feature collection through geoFormat()
    var geoData = {type: "FeatureCollection", features: geoFormat(data)};
    console.log("geoData stored")

    var dateRange = new Array(minDate.getTime(), maxDate.getTime());
    var googlemap;
    google.maps.event.addDomListener(window, 'load', initMap(googleStyle));

    var heatmap = new google.maps.visualization.HeatmapLayer({
      dissipating: true,
      maxIntensity: 500
    });
    dataFeed_callback(geoData, dateRange);
    console.log("Initiated Google map");

    //Filters data points according to the specified time window
    this.filterTime = function (value) {
    	dateRange = value;
        dataFeed_callback(geoData, value);
    };

    //Calls cluster function and changes the color of the points
    this.cluster = function () {
        var radius = document.getElementById("radius").value;
        var minPoints = document.getElementById("minpoints").value;
        var filteredData = []
        
        for (var i = 0, features; features = geoData.features[i]; i++) {
            var date = new Date(features.properties.date);
            if (features.geometry && date.getTime() >= dateRange[0] && date.getTime() <= dateRange[1]) {
                filteredData.push(features);
            }
        }
        
        console.log(filteredData, filteredData.length, radius, minPoints);
        
        var opticsRes = optics(filteredData, radius, minPoints);
        console.log(opticsRes, opticsRes.length);
        //initialize the cluster colors
		// add index to properties, and check if kmeansRes.id is same as data id.
		
		/*data.forEach(function(d, i) {
			if (d.cluster !== undefined) {
				cc[i] = color[d.cluster];
			}else
				cc[i] = "orange";
		});
		console.log(cc);
		svg.selectAll("circle").data(data).style("fill", function(d) {
            if(d.cluster != undefined)
				return color[d.cluster];
			else
				return 'orange';
        });*/
    };

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
        });
        */
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
        heatmap.maxIntensity = Math.floor(255410*(dateRange[1] - dateRange[0]) / minDate);
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
                    "cluster" : undefined,
                }
            });
        });
        return data;
    }
}

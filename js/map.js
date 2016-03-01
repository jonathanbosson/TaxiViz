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
    setGradient();
    setLegendGradient();
    setLegendLabels();
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
                }
            });
        });
        return data;
    }


    function setGradient() {
      gradient = [
        /*'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(255, 255, 0, 1)',
        'rgba(223, 223, 0, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)'*/

        'rgba(0, 255, 255, 0)',
        'rgba(100, 100, 255, 1)',
        'rgba(255, 30, 30, 1)',
      ]
      heatmap.set('gradient', gradient);
    }

    function setLegendGradient() {
        var gradientCss = '(left';
        for (var i = 0; i < gradient.length; ++i) {
            gradientCss += ', ' + gradient[i];
        }
        gradientCss += ')';
        
        $('#legendGradient').css('background', '-webkit-linear-gradient' + gradientCss);
        $('#legendGradient').css('background', '-moz-linear-gradient' + gradientCss);
        $('#legendGradient').css('background', '-o-linear-gradient' + gradientCss);
        $('#legendGradient').css('background', 'linear-gradient' + gradientCss);
    }

    function setLegendLabels() {
        google.maps.event.addListenerOnce(map, 'tilesloaded', function() {
            var maxIntensity = heatmap['gm_bindings_']['data'][158]['kd']['D'];
            var legendWidth = $('#legendGradient').outerWidth();
            
            for (var i = 0; i <= maxIntensity; ++i) {
                var offset = i * legendWidth / maxIntensity;
                if (i > 0 && i < maxIntensity) {
                    offset -= 0.5;
                } else if (i == maxIntensity) {
                    offset -= 1;
                }
                
                $('#legend').append($('<div>').css({
                    'position': 'absolute',
                    'left': offset + 'px',
                    'top': '15px',
                    'width': '1px',
                    'height': '3px',
                    'background': 'black'
                }));
                $('#legend').append($('<div>').css({
                    'position': 'absolute',
                    'left': (offset - 5) + 'px',
                    'top': '18px',
                    'width': '10px',
                    'text-align': 'center',
                    'font-size': '0.8em',
                }).html(i));
            }
        });
    }
}

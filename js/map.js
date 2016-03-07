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

    var opticsRes;
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
    	dateRange = value;
        dataFeed_callback(geoData, value);
    };

    this.remove = function() {
        googlemap.data.forEach(function(opticsRes) {
            googlemap.data.remove(opticsRes);
        });
    }

    //Calls cluster function and changes the color of the points
    this.cluster = function () {
        var cartRadius = document.getElementById("radius").value;
        var radius = 0.008992806 * cartRadius;
        var minPoints = document.getElementById("minpoints").value;
        var filteredData = [];
        
        for (var i = 0, features; features = geoData.features[i]; i++) {
            var date = new Date(features.properties.date);
            if (features.geometry && date.getTime() >= dateRange[0] && date.getTime() <= dateRange[1]) {
                filteredData.push(features);
            }
        }

        console.log(filteredData, filteredData.length, radius, minPoints);
        if(filteredData.length > 10000)
            swal("Please select a smaller time period");

        else {
                swal({  title: "Clustering may take a few minutes",   
                        text: "Maybe it's time for a coffee break?",   
                        type: "warning",   
                        showCancelButton: true, 
                        closeOnConfirm: false,  
                        confirmButtonColor: "#3385ff",   
                        confirmButtonText: "Start",   
                         }, 
                            function(){  
                                opticsRes = {type: "FeatureCollection", features: geoCluster(optics(filteredData, radius, minPoints))};
                                console.log(opticsRes);
                                googlemap.data.setStyle(function(feature) {
                                    var mag = feature.getProperty('amount');
                                    return {
                                      icon: {
                                                path: google.maps.SymbolPath.CIRCLE,
                                                fillColor: 'red',
                                                fillOpacity: .3,
                                                scale: 60*cartRadius*(1.5-minPoints/mag),
                                                strokeColor: 'white',
                                                strokeWeight: .5
                                            }
                                    };
                                });
                                googlemap.data.addGeoJson(opticsRes);
                                swal("Done!");
                        });

            
        }
        
    };

    function initMap(googleStyle){
        googlemap = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 59.3279, lng: 18.0658},
            zoom: 12,
            styles: googleStyle,
            disableDoubleClickZoom: true
        });
    }

    function dataFeed_callback(geoData, dateRange) {
        var counter = 0;
        var heatmapData = new google.maps.MVCArray();
        for (var i = 0, features; features = geoData.features[i]; i++) {
            var date = new Date(features.properties.date);
            if (features.geometry && date.getTime() >= dateRange[0] && date.getTime() <= dateRange[1]) {
                heatmapData.push(new google.maps.LatLng(features.geometry.coordinates[1], features.geometry.coordinates[0]));
                counter++;
            }
        }
        heatmap.data = heatmapData;
        heatmap.maxIntensity = Math.floor(255410*(dateRange[1] - dateRange[0]) / minDate);
        console.log(heatmap);
        console.log(counter, "datapoints considered");
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

    //Formats the data in a feature collection
    function geoCluster(array) {
        var data = [];
        for (var key in array) {
            data.push(
            { 
                "type": "Feature",
                "geometry": {
                    "type": "Point", 
                    "coordinates": [Number(array[key].x), Number(array[key].y)]},
                "properties": {
                    "amount" : Number(array[key].amount)
                }
            });
        }
        return data;
    }


    function setGradient() {
      gradient = [
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

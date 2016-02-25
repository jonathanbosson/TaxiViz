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
	var format = d3.time.format.utc("%Y-%m-%d %H%M%S");

    var zoom = d3.behavior.zoom()
            .scaleExtent([0.5, 8])
            .on("zoom", move);

    var mapDiv = $("#map");

    var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = mapDiv.width() - margin.right - margin.left,
            height = mapDiv.height() - margin.top - margin.bottom;

    var curr_mag = 4;

   //var format = d3.time.format.utc("%Y-%m-%d %H%M%S");
    //2013-03-08 18:06:15
    

   /* var timeExt = d3.extent(data.map(function (d) {
        return format.parse(d.time);
    }));*/

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

    //Formats the data in a feature collection through geoFormat()
    var geoData = {type: "FeatureCollection", features: geoFormat(data)};
    console.log("geoData stored")

    
    var googlemap;
    initMap(googleStyle);
    console.log("Map initiated")

    dataFeed_callback(geoData);
    console.log("Initiated heatmap");

    //Filters data points according to the specified time window
    this.filterTime = function (value) {
        //Complete the code
        
        startTime = value[0].getTime();
        endTime = value[1].getTime();
        
        svg.selectAll("circle").data(data).style("opacity", function(d){
            //d.properties.time is a string, convert to a date
            var date = new Date(d.time);
            if(startTime <= date.getTime() && date.getTime() <= endTime)
                return 1;
            else
                return 0;
            })

    };

    //Calls cluster function and changes the color of the points
    this.cluster = function () {
        // to do
    };

    //Zoom and panning method
    function move() {

        var t = d3.event.translate;
        var s = d3.event.scale;

        zoom.translate(t);
        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
    }

}

function dataFeed_callback(geoData) {
    var heatmapData = processJSON(geoData);
    console.log("JSON processed");
    var heatmap = new google.maps.visualization.HeatmapLayer({
      data: heatmapData,
      dissipating: true,
      maxIntensity: 200
    });
    heatmap.setMap(googlemap);
    //googlemap.data.addGeoJson(geoData);
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
                "date" : Date(d.date),
                "hired" : Number(d.hired),
            }
        });
    });
    return data;
}

function processJSON(geoData) {
    var myData = new Array();
    for (var i = 0, features; features = geoData.features[i]; i++) {
      if (features.geometry) {
        myData.push(new google.maps.LatLng(features.geometry.coordinates[1], features.geometry.coordinates[0]));
      }
    }
    return myData;
}

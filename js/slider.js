function slider(data) {
	console.log('Creating slider');

	var format = d3.time.format.utc("%Y-%m-%dT%H%M%S");
	d3.time.format.utc("data/test.csv");
	//var minDate = new Date('2013-03-01');
	//var maxDate = new Date('2013-03-31');  
	var minDate = new Date(d3.min(data.map(function(d) { return d.date; })));
	var maxDate = new Date(d3.max(data.map(function(d) { return d.date; })));
	var handleTop = minDate;//new Date('2013-03-10'); 
	var handleBottom = maxDate;//new Date('2013-03-20');

	var dateValues = [
		document.getElementById('handle1'),
		document.getElementById('handle2')
	];

	var slider = document.getElementById('sliderContainer');
	noUiSlider.create(slider, {
		connect: true,
		tooltip: [true, true],
		orientation: "vertical",
		behaviour: 'drag-tap',
		range: {
			'min': minDate.getTime(), /* start value for left handle */
			'max': maxDate.getTime() /* start value for right handle */
		},
		start: [handleTop.getTime(), handleBottom.getTime()]
	});
	//console.log(handleTop + ' ' + handleBottom)
	slider.noUiSlider.on('update', function( values, handle ){
		map1.filterTime(values);
		//dateValues[handle].innerHTML = formatDate(new Date(+values[handle]));
	});


	// Create a string representation of the date.
	//not working yet
	function formatDate ( date ) {
	    var string = date.getMonth() + "-" + date.getDay();
	    console.log(string);
	    return string;
	}
}
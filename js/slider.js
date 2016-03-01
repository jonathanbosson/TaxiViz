function slider(data) {
	console.log('Creating slider');

	var format = d3.time.format.utc("%Y-%m-%dT%H%M%S");
	//d3.time.format.utc("data/test_small.csv");
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

	var weekdays = [
		"Sunday", "Monday", "Tuesday",
		"Wednesday", "Thursday", "Friday",
		"Saturday"
	],
	months = [
		"January", "February", "March",
		"April", "May", "June", "July",
		"August", "September", "October",
		"November", "December"
	];

	var slider = document.getElementById('sliderContainer');
	noUiSlider.create(slider, {
		connect: true,
		tooltip: [formatDate(handleTop), formatDate(handleBottom)],
		orientation: "vertical",
		behaviour: 'drag-tap',
		range: {
			'min': minDate.getTime(), /* start value for left handle */
			'max': maxDate.getTime() /* start value for right handle */
		},
		start: [handleTop.getTime(), handleBottom.getTime()]
	});
	
	//Set legend to min/max dates
	dateValues[0].innerHTML = formatDate(minDate);
	dateValues[1].innerHTML = formatDate(maxDate);
	

	slider.noUiSlider.on('change', function( values, handle ){
		map1.filterTime(values);
		//update legends
		dateValues[handle].innerHTML = formatDate(new Date(+values[handle]));
	});


	// Create a string representation of the date.
	// Formatting is borrowed from https://refreshless.com/nouislider/examples/ 
	// Create a list of day and monthnames.
	function formatDate ( date ) {
	    //var string = date.getMonth()+1 + "-" + date.getDate(); //month [0,11], date [1,31]
	    return weekdays[date.getDay()] + ", " +
	        date.getDate() + nth(date.getDate()) + " " +
	        months[date.getMonth()] + " " +
	        date.getFullYear();// + " " + date.getHours() + " " + 
	       // date.getMinutes() + " " +date.getSeconds();
	    console.log(string);
	    return string;
	}

	// Append a suffix to dates.
	// Example: 23 => 23rd, 1 => 1st.
	function nth (d) {
	  if(d>3 && d<21) return 'th';
	  switch (d % 10) {
	        case 1:  return "st";
	        case 2:  return "nd";
	        case 3:  return "rd";
	        default: return "th";
	    }
	}

}
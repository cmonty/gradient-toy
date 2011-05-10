Core.register('picker', PICKER);
Core.start('picker');

function PICKER(sandbox) {
	
	var picker;
	var pRadius;
	var color = {};
	var value = 1;
	var stops = new Array();
	var key;
	
	this.init = init;
	function init() {
		picker = $('.color-wheel');
		cross = $('#cross-hair');
		valBox = $('.value');
		valSlider = $('#value-slider');
		input = $('#color-input');
		
		stops.push(build({hex: "FFFFFF", position: 0}));
		stops.push(build({hex: "000000", position: 1}));
		sandbox.notify({type: 'colorchange', data: stops});
		
		picker.click(getColor);		
		cross.mousedown(startColor);
		valSlider.mousedown(startValue);
		input.keyup(txtColor);
		$('.stop').live('click', setStop);
		sandbox.listen('newstop', this.handleNotifications);	
	} // init
	
	this.handleNotifications = handleNotifications;
	function handleNotifications(e) {		
		switch(e.type) {
			case "newstop":
			key = e.data.key;
			build(e.data);
			break;
		}
	} //handleNotifications
	
	function getColor(e) {	
		curX = e.pageX;
		curY = e.pageY;
		
		val = value;
		x = curX - picker.offset().left;
		y = curY - picker.offset().top;
		pRadius = picker.innerWidth() / 2;
		cartx = x - pRadius;
		carty = pRadius - y;
		r = Math.sqrt(Math.pow(cartx, 2) + Math.pow(carty, 2));
		rnorm = r / pRadius;
		
		if(r == 0){
			hue = 0;
			sat = 0;
		}
		else {
			arad = Math.acos(cartx/r);
			aradc = (carty >= 0) ? arad : 2 * Math.PI - arad;
			adeg = 360 * aradc/(2 * Math.PI);
			hue = adeg;
			sat = (rnorm > 1) ? 1 : rnorm;
		}
		
		if (rnorm <= 1) {
			cross.css({'left': x - 2 + 'px', 'top': y - 2 + 'px'});
			build({hue:hue, sat:sat, val:val, position: stops[key].position});
		}
		
	} // getColor
	
	function getValue(e) {
		valY = e.pageY;
		valOffset = valY - valBox.offset().top;
		valHeight = valBox.innerHeight();
		
		if(valOffset <= 150 && valOffset >= 0) {
			value =  1 - (valOffset / valHeight);
			valSlider.css({'top': valOffset - 5 + 'px'});
			picker.css({'opacity': value});
			if(key) {
				build({hue:stops[key].hue, sat:stops[key].sat, val:value, position: stops[key].position});
			}
		}
	} // getValue
	
	function plotColor() {
		color = stops[key];
		cross.css({'left': color.x + 'px', 'top': color.y + 'px'});
		
		var val = Math.abs( (color.val - 1) * valBox.innerHeight());
		value = 1 - (val/150);
		valSlider.css({'top': val + 'px'});
		picker.css({'opacity': color.val});
		input.val(color.hex.toUpperCase());
	} //plotColor
	
	function txtColor() {
		var hex = input.val();
		
		if(hex.length < 6 || ! key)
			return false;
		else {
			stops[key] = build({hex: hex, position: stops[key].position});
			plotColor();
		}
	} // txtColor
	
	function startColor(e) {
		document.onmousemove = getColor;
		return false;
	} // startColor
	
	function startValue(e) {
		document.onmousemove = getValue;
		return false;
	} // startValue
	
	
	function setStop() {
		$('.select').removeClass('select');
		
		key = $(this).attr('data-stop');
		$(this).addClass('select');
		plotColor();
		
		return false;
		
	} // setStop
	
	
	/*
	*	Purpose: Color functions
	*/
	function build(c) {
		color = new Object();
		color = c;
		if (color.hasOwnProperty('hex')) {
			hex2rgb();
			rgb2hsv();
		}
		else if (color.hasOwnProperty('red')) {
			rgb2hex();
			rgb2hsv();
		}
		else if (color.hasOwnProperty('hue')) {
			hsv2rgb();
			rgb2hex();
		}
		setCoords();
		if(key) {
			stops[key] = color;
			sandbox.notify({type: "colorchange", data: stops});
			input.val(color.hex.toUpperCase());
		}
		return color;
	} // build
	
	function hsv2rgb() {
		if(color.sat == 0) {			
			color.red = 255 * color.val;
			color.green = 255 * color.val;
			color.blue = 255 * color.val;
		}
		else if (color.val == 0) {			
			color.red = 0;
			color.green = 0;
			color.blue = 0;
		}
		else {
			hue = color.hue/60;
			var i = Math.floor(hue);
			var f = hue - i;
			var p = color.val * ( 1 - color.sat );
			var q = color.val * ( 1 - color.sat * f );
			var t = color.val * ( 1 - color.sat * ( 1 - f ) );
			switch( i ) {
				case 0:
					r = color.val;
					g = t;
					b = p;
					break;
				case 1:
					r = q;
					g = color.val;
					b = p;
					break;
				case 2:
					r = p;
					g = color.val;
					b = t;
					break;
				case 3:
					r = p;
					g = q;
					b = color.val;
					break;
				case 4:
					r = t;
					g = p;
					b = color.val;
					break;
				default:
					r = color.val;
					g = p;
					b = q;
					break;
			}
			color.red = Math.floor(255 * r);
			color.green = Math.floor(255 * g);
			color.blue = Math.floor(255 * b);
		}
		
	} // hsv2rgb
	
	function rgb2hsv() {
		var r = color.red / 255;
		var g = color.green / 255;
		var b = color.blue / 255;
		var max = Math.max(r, g, b);
		var min = Math.min(r, g, b);
	
		color.val = max;
		var d = max - min;
		color.sat = (max == 0) ? 0 : d / max;
	
		if (max == min) {
			color.hue = 0;
		}
		else {
			switch(max) {
				case r:
					hue = (g - b) / d + (g < b ? 6 : 0);
					break;
				case g:
					hue = (b - r)/d + 2;
					break;
				case b:
					hue = (r - g)/d + 4;
					break;
			}
			color.hue *= 60;
		}
	
	} //rgb2hsv
	
	function rgb2hex() {
		var hex = (1 << 24) | (color.red << 16) | (color.green << 8) | color.blue;
		color.hex = hex.toString(16).substr(1);
	} // rgb2hex
	
	function hex2rgb() {
		color.red = parseInt(color.hex.substring(0,2), 16);
		color.green = parseInt(color.hex.substring(2,4), 16);
		color.blue = parseInt(color.hex.substring(4,6), 16);
	} // hex2rgb
	
	function setCoords() { 
		var rads = color.hue * (Math.PI/180);
		var cartx = color.sat * Math.cos(rads);
		var carty = color.sat * Math.sin(rads);
		var radius = picker.innerWidth() / 2;
		var cWidth = cross.innerWidth();
		var cHeight = cross.innerHeight();

		color.x = (cartx * radius) + radius - cWidth;
		color.y = radius - (carty * radius) - cHeight;	
						
	} //setCoords
	
	return this;
	
} // PICKER
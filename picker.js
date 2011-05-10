gradient = new GRADIENT();
picker = new PICKER();
$(document).ready(picker.init);

function PICKER() {
	
	var picker;
	var pRadius;
	var color;
	var value = 1;
	var stops = new Array();
	this.stops = stops;
	var key;
	
	this.init = init;
	function init() {
		picker = $('.color-wheel');
		cross = $('#cross-hair');
		valBox = $('.value');
		valSlider = $('#value-slider');
		input = $('#color-input');
		gradient.init();
		
		color = new COLOR();
		start = color.build("FFFFFF", 0);
		stops.push(start);
		
		color = new COLOR();
		end = color.build("000000", 1);
		stops.push(end);
		gradient.fill(stops);
		
		picker.click(getColor);		
		cross.mousedown(startColor);
		valSlider.mousedown(startValue);
		input.keyup(txtColor);
		$('.stop').live('click', setStop);
		//$('body').click(reset);
				
	} // init
	
	function fillKey() {		
		if(key) {
			color.position = stops[key].position;
			stops[key] = color;
			gradient.fill(stops);
			input.val(color.hex.toUpperCase());
		}
	} // fillKey
	
	function getColor(e) {	
		curX = e.pageX;
		curY = e.pageY;
		
		color = new COLOR();
		color.val = value;
		color.x = curX - picker.offset().left;
		color.y = curY - picker.offset().top;
		pRadius = picker.innerWidth() / 2;
		cartx = color.x - pRadius;
		carty = pRadius - color.y;
		r = Math.sqrt(Math.pow(cartx, 2) + Math.pow(carty, 2));
		rnorm = r / pRadius;
		
		if(r == 0){
			color.hue = 0;
			color.sat = 0;
		}
		else {
			arad = Math.acos(cartx/r);
			aradc = (carty >= 0) ? arad : 2 * Math.PI - arad;
			adeg = 360 * aradc/(2 * Math.PI);
			color.hue = adeg;
			color.sat = (rnorm > 1) ? 1 : rnorm;
		}
		
		if (rnorm <= 1) {
			cross.css({'left': color.x - 2 + 'px', 'top': color.y - 2 + 'px'});
			color.hsv2rgb().rgb2hex();
			fillKey();
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
			if(color) {
				color.val = value;
				color.hsv2rgb().rgb2hex();
				fillKey();
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
	
	function reset(e) {
		if(e.className == 'stop')
			return false;
		
		$('.select').removeClass('select');
		key = null;
	} // reset
	
	function txtColor() {
		var hex = input.val();
		
		if(hex.length < 6 || ! key)
			return false;
		else {
			color = new COLOR();
			stops[key] = color.build(hex, stops[key].position);
			plotColor();
			gradient.fill(stops);
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
	
	
} // PICKER

function GRADIENT() {
	
	var canvas;
	var gradient;
	var my_gradient;
	var key;

	
	this.init = init;
	function init() {
		canvas = document.getElementById('gradient');
		gradient = canvas.getContext('2d');
		
		slider = $('#stops');
		slideWidth = slider.innerWidth();
		slideOffset = slider.offset().left;
		
		stopWidth = ($('.stop').innerWidth()) / 2;
		
		$('#new-stop').click(addStop);
		$('.stop').mousedown(startSlide);
		$(document).mouseup(endSlide);
		
	} // init
	
	function addStop() {
		$('.select').removeClass('select');
		var newStop = $('#stop-1').clone(true).removeAttr('id').attr('data-stop', picker.stops.length).appendTo('#stops');
		var position = (slideWidth - slideOffset - stopWidth) / 2;
		newStop.css('left', position + "px");
		
		var nKey = picker.stops.push(new Object()) - 1;	
		color = new COLOR();	
		picker.stops[nKey] = color.build(picker.stops[1].hex, 0.5);
		fill(picker.stops);
		
	} // addStop
	
	function endSlide() {
		document.onmousemove = null;
	} // endSlide
	
	this.fill = fill;
	function fill(colors) {
		my_gradient = gradient.createLinearGradient(0, 0, canvas.width, 0);
		for(var i in colors) {
			my_gradient.addColorStop(colors[i].position, colors[i].hex);
		}
		gradient.fillStyle = my_gradient;
		gradient.fillRect(0, 0, canvas.width, canvas.height);
		
	} // fill
	
	function moveSlide(e) {
		curX = e.pageX;
		
		offset = curX - slideOffset;
		newPosition = offset / slideWidth;
		
		if(offset < 300 && offset > 5) {
			curStop.css('left', (offset - stopWidth) + "px");
			picker.stops[key].position = newPosition;
			fill(picker.stops);
		}
		
	} // moveSlide
	
	function startSlide(e) {
		curX = e.pageX;		
		offset = curX - slideOffset;
		curStop = $(this);
		key = curStop.data('stop');
		
		document.onmousemove = moveSlide;

		return false;
	} // startSlide
	
} // GRADIENT
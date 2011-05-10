Core.register('gradient', GRADIENT);
Core.start('gradient'); 

function GRADIENT(sandbox) {
	
	var canvas;
	var colors;
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
		sandbox.listen('colorchange', this.fill);
		
	} // init
	
	function addStop() {
		$('.select').removeClass('select');
		var newStop = $('[data-stop=1]').clone(true).removeAttr('id').attr('data-stop', colors.length).appendTo('#stops');
		var position = (slideWidth - slideOffset - stopWidth) / 2;
		newStop.css('left', position + "px");
	
		sandbox.notify({type: 'newstop', data: {hex:colors[1].hex, position: 0.5, key: colors.length}});		
	} // addStop
	
	function endSlide() {
		document.onmousemove = null;
	} // endSlide
	
	this.fill = fill;
	function fill(e) {
		colors = e.data;
		my_gradient = gradient.createLinearGradient(0, 0, canvas.width, 0);
		for(var i = 0; i < colors.length; i++) {
			my_gradient.addColorStop(colors[i].position, colors[i].hex);
		}
		gradient.fillStyle = my_gradient;
		gradient.fillRect(0, 0, canvas.width, canvas.height);
		
	} // fill
	
	function moveSlide(e) {
		curX = e.pageX;
		
		offset = curX - slideOffset;
		newPosition = offset / slideWidth;
		
		if(offset < canvas.width && offset > 5) {
			curStop.css('left', (offset - stopWidth) + "px");
			colors[key].position = newPosition;
			fill({data: colors});
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
	
	return this;
	
} // GRADIENT
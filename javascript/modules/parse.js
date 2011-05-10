Core.register('parse', PARSE);
Core.start('parse');

function PARSE(sandbox) {
	
	var output;	
	var kit;
	var moz;
	var fallback;
	var from;
	var to;
	
	this.init = init;
	function init() {
		output = $('#syntax');
		kit = $('code[data-browser=kit]').children('span.color-stops');
		moz = $('code[data-browser=moz]');
		fallback = $('code[data-browser=fallback]');
		from = $('span.from');
		to = $('span.to');
		
		sandbox.listen('colorchange', this.render);
	} //init
	
	this.render = render;
	function render(e) {
		colors = sortColors(e.data);
		
		$('.color-stop').remove();
		from.text('#' + colors[0].hex);
		to.text('#' + colors[colors.length - 1].hex);
		
		
		for(var i = 0; i < colors.length; i++) {
			if(colors[i].position > 0 && colors[i].position < 1) {
				var stop = $('<span></span>').addClass('color-stop').text(colors[i].hex);
				kit.append(stop);
			}
		}
	} // render
	
	function sortColors(c) {
		var positions = new Array();
		var colors = new Array();
		
		for(var i = 0; i < c.length; i++) {
			positions.push(c[i].position);
		}
		
		positions.sort();
		
		for(var i = 0; i < positions.length; i++) {
			var position = positions[i];
			for(var k =0; k < c.length; k++) {
				if(position == c[k].position) {
					colors[i] = c[k];
				}
			}
		}
		
		return colors;		
	} // sortColors
	
	return this;
} // parse

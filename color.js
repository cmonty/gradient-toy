/*
*	Color Functions
*/

function COLOR() {
	
	var hex;
	var red;
	var blue;
	var green;
	var val;
	var hue;
	var sat;
	var x;
	var y;
	var position;

	var picker = $('.color-wheel');
	var cross = $('#cross-hair');
	
	this.build = build;
	function build(h, p) {
		position = p;
		hex = h;
		hex2rgb();
		this.red = red;
		this.blue = blue;
		this.green = green;
		
		rgb2hsv();
		this.hue = hue;
		this.sat = sat;
		this.val = val;
		
		setCoords();
		this.x = x;
		this.y = y;
		
		this.hex = hex;
		this.position = position;
		return this;
	} // build
	
	this.hsv2rgb = hsv2rgb;
	function hsv2rgb() {
		if(this.sat == 0) {			
			red = 255 * this.val;
			green = 255 * this.val;
			blue = 255 * this.val;
		}
		else if (this.val == 0) {			
			red = 0;
			green = 0;
			blue = 0;
		}
		else {
			hue = this.hue/60;
			var i = Math.floor(hue);
			var f = hue - i;
			var p = this.val * ( 1 - this.sat );
			var q = this.val * ( 1 - this.sat * f );
			var t = this.val * ( 1 - this.sat * ( 1 - f ) );
			switch( i ) {
				case 0:
					r = this.val;
					g = t;
					b = p;
					break;
				case 1:
					r = q;
					g = this.val;
					b = p;
					break;
				case 2:
					r = p;
					g = this.val;
					b = t;
					break;
				case 3:
					r = p;
					g = q;
					b = this.val;
					break;
				case 4:
					r = t;
					g = p;
					b = this.val;
					break;
				default:
					r = this.val;
					g = p;
					b = q;
					break;
			}
			red = Math.floor(255 * r);
			green = Math.floor(255 * g);
			blue = Math.floor(255 * b);
		}
		
		this.red = red;
		this.green = green;
		this.blue = blue;
		
		return this;
	} // hsv2rgb
	
	this.rgb2hsv = rgb2hsv;
	function rgb2hsv() {
		var r = red / 255;
		var g = green / 255;
		var b = blue / 255;
		var max = Math.max(r, g, b);
		var min = Math.min(r, g, b);
	
		val = max;
		var d = max - min;
		sat = (max == 0) ? 0 : d / max;
	
		if (max == min) {
			hue = 0;
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
			hue *= 60;
		}
		
		
		this.hue = hue;
		this.val = val;
		this.sat = sat;
		
		return this;
	
	} //rgb2hsv
	
	this.rgb2hex = rgb2hex;
	function rgb2hex() {
		var hex = (1 << 24) | (this.red << 16) | (this.green << 8) | this.blue;
		hex = hex.toString(16).substr(1);
		
		this.hex = hex;
		return this;
	} // rgb2hex
	
	this.hex2rgb = hex2rgb;
	function hex2rgb() {
		red = parseInt(hex.substring(0,2), 16);
		green = parseInt(hex.substring(2,4), 16);
		blue = parseInt(hex.substring(4,6), 16);
		
		this.red = red;
		this.green = green;
		this.blue = blue;
		
		return this;
	} // hex2rgb
	
	function setCoords() { 
		var rads = hue * (Math.PI/180);
		var cartx = sat * Math.cos(rads);
		var carty = sat * Math.sin(rads);
		var radius = picker.innerWidth() / 2;
		var cWidth = cross.innerWidth();
		var cHeight = cross.innerHeight();

		x = (cartx * radius) + radius - cWidth;
		y = radius - (carty * radius) - cHeight;	
		
		this.x = x;
		this.y = y;
						
	} //setCoords

} //COLOR

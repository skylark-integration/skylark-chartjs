/**
 * skylark-chartjs - A version of chartjs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.2
 * @link https://github.com/skylarkui/skylark-chartjs/
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                resolved: false,
                exports: null
            };
            require(id);
        } else {
            map[id] = {
                factory : null,
                resolved : true,
                exports : factory
            };
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.resolved) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(globals, args) || null;
            module.resolved = true;
        }
        return module.exports;
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (!isAmd) {
    var skylarkjs = require("skylark-langx/skylark");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

defin([
	'./conversions',
	'./route'
],function(conversions,route) {

	const convert = {};

	const models = Object.keys(conversions);

	function wrapRaw(fn) {
		const wrappedFn = function (...args) {
			const arg0 = args[0];
			if (arg0 === undefined || arg0 === null) {
				return arg0;
			}

			if (arg0.length > 1) {
				args = arg0;
			}

			return fn(args);
		};

		// Preserve .conversion property if there is one
		if ('conversion' in fn) {
			wrappedFn.conversion = fn.conversion;
		}

		return wrappedFn;
	}

	function wrapRounded(fn) {
		const wrappedFn = function (...args) {
			const arg0 = args[0];

			if (arg0 === undefined || arg0 === null) {
				return arg0;
			}

			if (arg0.length > 1) {
				args = arg0;
			}

			const result = fn(args);

			// We're assuming the result is an array here.
			// see notice in conversions.js; don't use box types
			// in conversion functions.
			if (typeof result === 'object') {
				for (let len = result.length, i = 0; i < len; i++) {
					result[i] = Math.round(result[i]);
				}
			}

			return result;
		};

		// Preserve .conversion property if there is one
		if ('conversion' in fn) {
			wrappedFn.conversion = fn.conversion;
		}

		return wrappedFn;
	}

	models.forEach(fromModel => {
		convert[fromModel] = {};

		Object.defineProperty(convert[fromModel], 'channels', {value: conversions[fromModel].channels});
		Object.defineProperty(convert[fromModel], 'labels', {value: conversions[fromModel].labels});

		const routes = route(fromModel);
		const routeModels = Object.keys(routes);

		routeModels.forEach(toModel => {
			const fn = routes[toModel];

			convert[fromModel][toModel] = wrapRounded(fn);
			convert[fromModel][toModel].raw = wrapRaw(fn);
		});
	});

	return  convert;

});


define("packages/color-convert/index", function(){});

define('packages/color-name',[],function(){
'use strict'

return {
	"aliceblue": [240, 248, 255],
	"antiquewhite": [250, 235, 215],
	"aqua": [0, 255, 255],
	"aquamarine": [127, 255, 212],
	"azure": [240, 255, 255],
	"beige": [245, 245, 220],
	"bisque": [255, 228, 196],
	"black": [0, 0, 0],
	"blanchedalmond": [255, 235, 205],
	"blue": [0, 0, 255],
	"blueviolet": [138, 43, 226],
	"brown": [165, 42, 42],
	"burlywood": [222, 184, 135],
	"cadetblue": [95, 158, 160],
	"chartreuse": [127, 255, 0],
	"chocolate": [210, 105, 30],
	"coral": [255, 127, 80],
	"cornflowerblue": [100, 149, 237],
	"cornsilk": [255, 248, 220],
	"crimson": [220, 20, 60],
	"cyan": [0, 255, 255],
	"darkblue": [0, 0, 139],
	"darkcyan": [0, 139, 139],
	"darkgoldenrod": [184, 134, 11],
	"darkgray": [169, 169, 169],
	"darkgreen": [0, 100, 0],
	"darkgrey": [169, 169, 169],
	"darkkhaki": [189, 183, 107],
	"darkmagenta": [139, 0, 139],
	"darkolivegreen": [85, 107, 47],
	"darkorange": [255, 140, 0],
	"darkorchid": [153, 50, 204],
	"darkred": [139, 0, 0],
	"darksalmon": [233, 150, 122],
	"darkseagreen": [143, 188, 143],
	"darkslateblue": [72, 61, 139],
	"darkslategray": [47, 79, 79],
	"darkslategrey": [47, 79, 79],
	"darkturquoise": [0, 206, 209],
	"darkviolet": [148, 0, 211],
	"deeppink": [255, 20, 147],
	"deepskyblue": [0, 191, 255],
	"dimgray": [105, 105, 105],
	"dimgrey": [105, 105, 105],
	"dodgerblue": [30, 144, 255],
	"firebrick": [178, 34, 34],
	"floralwhite": [255, 250, 240],
	"forestgreen": [34, 139, 34],
	"fuchsia": [255, 0, 255],
	"gainsboro": [220, 220, 220],
	"ghostwhite": [248, 248, 255],
	"gold": [255, 215, 0],
	"goldenrod": [218, 165, 32],
	"gray": [128, 128, 128],
	"green": [0, 128, 0],
	"greenyellow": [173, 255, 47],
	"grey": [128, 128, 128],
	"honeydew": [240, 255, 240],
	"hotpink": [255, 105, 180],
	"indianred": [205, 92, 92],
	"indigo": [75, 0, 130],
	"ivory": [255, 255, 240],
	"khaki": [240, 230, 140],
	"lavender": [230, 230, 250],
	"lavenderblush": [255, 240, 245],
	"lawngreen": [124, 252, 0],
	"lemonchiffon": [255, 250, 205],
	"lightblue": [173, 216, 230],
	"lightcoral": [240, 128, 128],
	"lightcyan": [224, 255, 255],
	"lightgoldenrodyellow": [250, 250, 210],
	"lightgray": [211, 211, 211],
	"lightgreen": [144, 238, 144],
	"lightgrey": [211, 211, 211],
	"lightpink": [255, 182, 193],
	"lightsalmon": [255, 160, 122],
	"lightseagreen": [32, 178, 170],
	"lightskyblue": [135, 206, 250],
	"lightslategray": [119, 136, 153],
	"lightslategrey": [119, 136, 153],
	"lightsteelblue": [176, 196, 222],
	"lightyellow": [255, 255, 224],
	"lime": [0, 255, 0],
	"limegreen": [50, 205, 50],
	"linen": [250, 240, 230],
	"magenta": [255, 0, 255],
	"maroon": [128, 0, 0],
	"mediumaquamarine": [102, 205, 170],
	"mediumblue": [0, 0, 205],
	"mediumorchid": [186, 85, 211],
	"mediumpurple": [147, 112, 219],
	"mediumseagreen": [60, 179, 113],
	"mediumslateblue": [123, 104, 238],
	"mediumspringgreen": [0, 250, 154],
	"mediumturquoise": [72, 209, 204],
	"mediumvioletred": [199, 21, 133],
	"midnightblue": [25, 25, 112],
	"mintcream": [245, 255, 250],
	"mistyrose": [255, 228, 225],
	"moccasin": [255, 228, 181],
	"navajowhite": [255, 222, 173],
	"navy": [0, 0, 128],
	"oldlace": [253, 245, 230],
	"olive": [128, 128, 0],
	"olivedrab": [107, 142, 35],
	"orange": [255, 165, 0],
	"orangered": [255, 69, 0],
	"orchid": [218, 112, 214],
	"palegoldenrod": [238, 232, 170],
	"palegreen": [152, 251, 152],
	"paleturquoise": [175, 238, 238],
	"palevioletred": [219, 112, 147],
	"papayawhip": [255, 239, 213],
	"peachpuff": [255, 218, 185],
	"peru": [205, 133, 63],
	"pink": [255, 192, 203],
	"plum": [221, 160, 221],
	"powderblue": [176, 224, 230],
	"purple": [128, 0, 128],
	"rebeccapurple": [102, 51, 153],
	"red": [255, 0, 0],
	"rosybrown": [188, 143, 143],
	"royalblue": [65, 105, 225],
	"saddlebrown": [139, 69, 19],
	"salmon": [250, 128, 114],
	"sandybrown": [244, 164, 96],
	"seagreen": [46, 139, 87],
	"seashell": [255, 245, 238],
	"sienna": [160, 82, 45],
	"silver": [192, 192, 192],
	"skyblue": [135, 206, 235],
	"slateblue": [106, 90, 205],
	"slategray": [112, 128, 144],
	"slategrey": [112, 128, 144],
	"snow": [255, 250, 250],
	"springgreen": [0, 255, 127],
	"steelblue": [70, 130, 180],
	"tan": [210, 180, 140],
	"teal": [0, 128, 128],
	"thistle": [216, 191, 216],
	"tomato": [255, 99, 71],
	"turquoise": [64, 224, 208],
	"violet": [238, 130, 238],
	"wheat": [245, 222, 179],
	"white": [255, 255, 255],
	"whitesmoke": [245, 245, 245],
	"yellow": [255, 255, 0],
	"yellowgreen": [154, 205, 50]
};
});
define('packages/chartjs-color-string',[
  './color-name'
],function(colorNames){
 
   function getRgba(string) {
     if (!string) {
        return;
     }
     var abbr =  /^#([a-fA-F0-9]{3,4})$/i,
         hex =  /^#([a-fA-F0-9]{6}([a-fA-F0-9]{2})?)$/i,
         rgba = /^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/i,
         per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/i,
         keyword = /(\w+)/;

     var rgb = [0, 0, 0],
         a = 1,
         match = string.match(abbr),
         hexAlpha = "";
     if (match) {
        match = match[1];
        hexAlpha = match[3];
        for (var i = 0; i < rgb.length; i++) {
           rgb[i] = parseInt(match[i] + match[i], 16);
        }
        if (hexAlpha) {
           a = Math.round((parseInt(hexAlpha + hexAlpha, 16) / 255) * 100) / 100;
        }
     }
     else if (match = string.match(hex)) {
        hexAlpha = match[2];
        match = match[1];
        for (var i = 0; i < rgb.length; i++) {
           rgb[i] = parseInt(match.slice(i * 2, i * 2 + 2), 16);
        }
        if (hexAlpha) {
           a = Math.round((parseInt(hexAlpha, 16) / 255) * 100) / 100;
        }
     }
     else if (match = string.match(rgba)) {
        for (var i = 0; i < rgb.length; i++) {
           rgb[i] = parseInt(match[i + 1]);
        }
        a = parseFloat(match[4]);
     }
     else if (match = string.match(per)) {
        for (var i = 0; i < rgb.length; i++) {
           rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
        }
        a = parseFloat(match[4]);
     }
     else if (match = string.match(keyword)) {
        if (match[1] == "transparent") {
           return [0, 0, 0, 0];
        }
        rgb = colorNames[match[1]];
        if (!rgb) {
           return;
        }
     }

     for (var i = 0; i < rgb.length; i++) {
        rgb[i] = scale(rgb[i], 0, 255);
     }
     if (!a && a != 0) {
        a = 1;
     }
     else {
        a = scale(a, 0, 1);
     }
     rgb[3] = a;
     return rgb;
  }

  function getHsla(string) {
     if (!string) {
        return;
     }
     var hsl = /^hsla?\(\s*([+-]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/;
     var match = string.match(hsl);
     if (match) {
        var alpha = parseFloat(match[4]);
        var h = scale(parseInt(match[1]), 0, 360),
            s = scale(parseFloat(match[2]), 0, 100),
            l = scale(parseFloat(match[3]), 0, 100),
            a = scale(isNaN(alpha) ? 1 : alpha, 0, 1);
        return [h, s, l, a];
     }
  }

  function getHwb(string) {
     if (!string) {
        return;
     }
     var hwb = /^hwb\(\s*([+-]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/;
     var match = string.match(hwb);
     if (match) {
      var alpha = parseFloat(match[4]);
        var h = scale(parseInt(match[1]), 0, 360),
            w = scale(parseFloat(match[2]), 0, 100),
            b = scale(parseFloat(match[3]), 0, 100),
            a = scale(isNaN(alpha) ? 1 : alpha, 0, 1);
        return [h, w, b, a];
     }
  }

  function getRgb(string) {
     var rgba = getRgba(string);
     return rgba && rgba.slice(0, 3);
  }

  function getHsl(string) {
    var hsla = getHsla(string);
    return hsla && hsla.slice(0, 3);
  }

  function getAlpha(string) {
     var vals = getRgba(string);
     if (vals) {
        return vals[3];
     }
     else if (vals = getHsla(string)) {
        return vals[3];
     }
     else if (vals = getHwb(string)) {
        return vals[3];
     }
  }

  // generators
  function hexString(rgba, a) {
     var a = (a !== undefined && rgba.length === 3) ? a : rgba[3];
     return "#" + hexDouble(rgba[0]) 
                + hexDouble(rgba[1])
                + hexDouble(rgba[2])
                + (
                   (a >= 0 && a < 1)
                   ? hexDouble(Math.round(a * 255))
                   : ""
                );
  }

  function rgbString(rgba, alpha) {
     if (alpha < 1 || (rgba[3] && rgba[3] < 1)) {
        return rgbaString(rgba, alpha);
     }
     return "rgb(" + rgba[0] + ", " + rgba[1] + ", " + rgba[2] + ")";
  }

  function rgbaString(rgba, alpha) {
     if (alpha === undefined) {
        alpha = (rgba[3] !== undefined ? rgba[3] : 1);
     }
     return "rgba(" + rgba[0] + ", " + rgba[1] + ", " + rgba[2]
             + ", " + alpha + ")";
  }

  function percentString(rgba, alpha) {
     if (alpha < 1 || (rgba[3] && rgba[3] < 1)) {
        return percentaString(rgba, alpha);
     }
     var r = Math.round(rgba[0]/255 * 100),
         g = Math.round(rgba[1]/255 * 100),
         b = Math.round(rgba[2]/255 * 100);

     return "rgb(" + r + "%, " + g + "%, " + b + "%)";
  }

  function percentaString(rgba, alpha) {
     var r = Math.round(rgba[0]/255 * 100),
         g = Math.round(rgba[1]/255 * 100),
         b = Math.round(rgba[2]/255 * 100);
     return "rgba(" + r + "%, " + g + "%, " + b + "%, " + (alpha || rgba[3] || 1) + ")";
  }

  function hslString(hsla, alpha) {
     if (alpha < 1 || (hsla[3] && hsla[3] < 1)) {
        return hslaString(hsla, alpha);
     }
     return "hsl(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%)";
  }

  function hslaString(hsla, alpha) {
     if (alpha === undefined) {
        alpha = (hsla[3] !== undefined ? hsla[3] : 1);
     }
     return "hsla(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%, "
             + alpha + ")";
  }

  // hwb is a bit different than rgb(a) & hsl(a) since there is no alpha specific syntax
  // (hwb have alpha optional & 1 is default value)
  function hwbString(hwb, alpha) {
     if (alpha === undefined) {
        alpha = (hwb[3] !== undefined ? hwb[3] : 1);
     }
     return "hwb(" + hwb[0] + ", " + hwb[1] + "%, " + hwb[2] + "%"
             + (alpha !== undefined && alpha !== 1 ? ", " + alpha : "") + ")";
  }

  function keyword(rgb) {
    return reverseNames[rgb.slice(0, 3)];
  }

  // helpers
  function scale(num, min, max) {
     return Math.min(Math.max(min, num), max);
  }

  function hexDouble(num) {
    var str = num.toString(16).toUpperCase();
    return (str.length < 2) ? "0" + str : str;
  }


  //create a list of reverse color names
  var reverseNames = {};
  for (var name in colorNames) {
     reverseNames[colorNames[name]] = name;
  }

 return {
     getRgba: getRgba,
     getHsla: getHsla,
     getRgb: getRgb,
     getHsl: getHsl,
     getHwb: getHwb,
     getAlpha: getAlpha,

     hexString: hexString,
     rgbString: rgbString,
     rgbaString: rgbaString,
     percentString: percentString,
     percentaString: percentaString,
     hslString: hslString,
     hslaString: hslaString,
     hwbString: hwbString,
     keyword: keyword
  }

});

define('packages/chartjs-color',[
	"./color-convert/index",
	"./chartjs-color-string"
],function(convert,string){

	var Color = function (obj) {
		if (obj instanceof Color) {
			return obj;
		}
		if (!(this instanceof Color)) {
			return new Color(obj);
		}

		this.valid = false;
		this.values = {
			rgb: [0, 0, 0],
			hsl: [0, 0, 0],
			hsv: [0, 0, 0],
			hwb: [0, 0, 0],
			cmyk: [0, 0, 0, 0],
			alpha: 1
		};

		// parse Color() argument
		var vals;
		if (typeof obj === 'string') {
			vals = string.getRgba(obj);
			if (vals) {
				this.setValues('rgb', vals);
			} else if (vals = string.getHsla(obj)) {
				this.setValues('hsl', vals);
			} else if (vals = string.getHwb(obj)) {
				this.setValues('hwb', vals);
			}
		} else if (typeof obj === 'object') {
			vals = obj;
			if (vals.r !== undefined || vals.red !== undefined) {
				this.setValues('rgb', vals);
			} else if (vals.l !== undefined || vals.lightness !== undefined) {
				this.setValues('hsl', vals);
			} else if (vals.v !== undefined || vals.value !== undefined) {
				this.setValues('hsv', vals);
			} else if (vals.w !== undefined || vals.whiteness !== undefined) {
				this.setValues('hwb', vals);
			} else if (vals.c !== undefined || vals.cyan !== undefined) {
				this.setValues('cmyk', vals);
			}
		}
	};

	Color.prototype = {
		isValid: function () {
			return this.valid;
		},
		rgb: function () {
			return this.setSpace('rgb', arguments);
		},
		hsl: function () {
			return this.setSpace('hsl', arguments);
		},
		hsv: function () {
			return this.setSpace('hsv', arguments);
		},
		hwb: function () {
			return this.setSpace('hwb', arguments);
		},
		cmyk: function () {
			return this.setSpace('cmyk', arguments);
		},

		rgbArray: function () {
			return this.values.rgb;
		},
		hslArray: function () {
			return this.values.hsl;
		},
		hsvArray: function () {
			return this.values.hsv;
		},
		hwbArray: function () {
			var values = this.values;
			if (values.alpha !== 1) {
				return values.hwb.concat([values.alpha]);
			}
			return values.hwb;
		},
		cmykArray: function () {
			return this.values.cmyk;
		},
		rgbaArray: function () {
			var values = this.values;
			return values.rgb.concat([values.alpha]);
		},
		hslaArray: function () {
			var values = this.values;
			return values.hsl.concat([values.alpha]);
		},
		alpha: function (val) {
			if (val === undefined) {
				return this.values.alpha;
			}
			this.setValues('alpha', val);
			return this;
		},

		red: function (val) {
			return this.setChannel('rgb', 0, val);
		},
		green: function (val) {
			return this.setChannel('rgb', 1, val);
		},
		blue: function (val) {
			return this.setChannel('rgb', 2, val);
		},
		hue: function (val) {
			if (val) {
				val %= 360;
				val = val < 0 ? 360 + val : val;
			}
			return this.setChannel('hsl', 0, val);
		},
		saturation: function (val) {
			return this.setChannel('hsl', 1, val);
		},
		lightness: function (val) {
			return this.setChannel('hsl', 2, val);
		},
		saturationv: function (val) {
			return this.setChannel('hsv', 1, val);
		},
		whiteness: function (val) {
			return this.setChannel('hwb', 1, val);
		},
		blackness: function (val) {
			return this.setChannel('hwb', 2, val);
		},
		value: function (val) {
			return this.setChannel('hsv', 2, val);
		},
		cyan: function (val) {
			return this.setChannel('cmyk', 0, val);
		},
		magenta: function (val) {
			return this.setChannel('cmyk', 1, val);
		},
		yellow: function (val) {
			return this.setChannel('cmyk', 2, val);
		},
		black: function (val) {
			return this.setChannel('cmyk', 3, val);
		},

		hexString: function () {
			return string.hexString(this.values.rgb);
		},
		rgbString: function () {
			return string.rgbString(this.values.rgb, this.values.alpha);
		},
		rgbaString: function () {
			return string.rgbaString(this.values.rgb, this.values.alpha);
		},
		percentString: function () {
			return string.percentString(this.values.rgb, this.values.alpha);
		},
		hslString: function () {
			return string.hslString(this.values.hsl, this.values.alpha);
		},
		hslaString: function () {
			return string.hslaString(this.values.hsl, this.values.alpha);
		},
		hwbString: function () {
			return string.hwbString(this.values.hwb, this.values.alpha);
		},
		keyword: function () {
			return string.keyword(this.values.rgb, this.values.alpha);
		},

		rgbNumber: function () {
			var rgb = this.values.rgb;
			return (rgb[0] << 16) | (rgb[1] << 8) | rgb[2];
		},

		luminosity: function () {
			// http://www.w3.org/TR/WCAG20/#relativeluminancedef
			var rgb = this.values.rgb;
			var lum = [];
			for (var i = 0; i < rgb.length; i++) {
				var chan = rgb[i] / 255;
				lum[i] = (chan <= 0.03928) ? chan / 12.92 : Math.pow(((chan + 0.055) / 1.055), 2.4);
			}
			return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
		},

		contrast: function (color2) {
			// http://www.w3.org/TR/WCAG20/#contrast-ratiodef
			var lum1 = this.luminosity();
			var lum2 = color2.luminosity();
			if (lum1 > lum2) {
				return (lum1 + 0.05) / (lum2 + 0.05);
			}
			return (lum2 + 0.05) / (lum1 + 0.05);
		},

		level: function (color2) {
			var contrastRatio = this.contrast(color2);
			if (contrastRatio >= 7.1) {
				return 'AAA';
			}

			return (contrastRatio >= 4.5) ? 'AA' : '';
		},

		dark: function () {
			// YIQ equation from http://24ways.org/2010/calculating-color-contrast
			var rgb = this.values.rgb;
			var yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
			return yiq < 128;
		},

		light: function () {
			return !this.dark();
		},

		negate: function () {
			var rgb = [];
			for (var i = 0; i < 3; i++) {
				rgb[i] = 255 - this.values.rgb[i];
			}
			this.setValues('rgb', rgb);
			return this;
		},

		lighten: function (ratio) {
			var hsl = this.values.hsl;
			hsl[2] += hsl[2] * ratio;
			this.setValues('hsl', hsl);
			return this;
		},

		darken: function (ratio) {
			var hsl = this.values.hsl;
			hsl[2] -= hsl[2] * ratio;
			this.setValues('hsl', hsl);
			return this;
		},

		saturate: function (ratio) {
			var hsl = this.values.hsl;
			hsl[1] += hsl[1] * ratio;
			this.setValues('hsl', hsl);
			return this;
		},

		desaturate: function (ratio) {
			var hsl = this.values.hsl;
			hsl[1] -= hsl[1] * ratio;
			this.setValues('hsl', hsl);
			return this;
		},

		whiten: function (ratio) {
			var hwb = this.values.hwb;
			hwb[1] += hwb[1] * ratio;
			this.setValues('hwb', hwb);
			return this;
		},

		blacken: function (ratio) {
			var hwb = this.values.hwb;
			hwb[2] += hwb[2] * ratio;
			this.setValues('hwb', hwb);
			return this;
		},

		greyscale: function () {
			var rgb = this.values.rgb;
			// http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
			var val = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
			this.setValues('rgb', [val, val, val]);
			return this;
		},

		clearer: function (ratio) {
			var alpha = this.values.alpha;
			this.setValues('alpha', alpha - (alpha * ratio));
			return this;
		},

		opaquer: function (ratio) {
			var alpha = this.values.alpha;
			this.setValues('alpha', alpha + (alpha * ratio));
			return this;
		},

		rotate: function (degrees) {
			var hsl = this.values.hsl;
			var hue = (hsl[0] + degrees) % 360;
			hsl[0] = hue < 0 ? 360 + hue : hue;
			this.setValues('hsl', hsl);
			return this;
		},

		/**
		 * Ported from sass implementation in C
		 * https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209
		 */
		mix: function (mixinColor, weight) {
			var color1 = this;
			var color2 = mixinColor;
			var p = weight === undefined ? 0.5 : weight;

			var w = 2 * p - 1;
			var a = color1.alpha() - color2.alpha();

			var w1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
			var w2 = 1 - w1;

			return this
				.rgb(
					w1 * color1.red() + w2 * color2.red(),
					w1 * color1.green() + w2 * color2.green(),
					w1 * color1.blue() + w2 * color2.blue()
				)
				.alpha(color1.alpha() * p + color2.alpha() * (1 - p));
		},

		toJSON: function () {
			return this.rgb();
		},

		clone: function () {
			// NOTE(SB): using node-clone creates a dependency to Buffer when using browserify,
			// making the final build way to big to embed in Chart.js. So let's do it manually,
			// assuming that values to clone are 1 dimension arrays containing only numbers,
			// except 'alpha' which is a number.
			var result = new Color();
			var source = this.values;
			var target = result.values;
			var value, type;

			for (var prop in source) {
				if (source.hasOwnProperty(prop)) {
					value = source[prop];
					type = ({}).toString.call(value);
					if (type === '[object Array]') {
						target[prop] = value.slice(0);
					} else if (type === '[object Number]') {
						target[prop] = value;
					} else {
						console.error('unexpected color value:', value);
					}
				}
			}

			return result;
		}
	};

	Color.prototype.spaces = {
		rgb: ['red', 'green', 'blue'],
		hsl: ['hue', 'saturation', 'lightness'],
		hsv: ['hue', 'saturation', 'value'],
		hwb: ['hue', 'whiteness', 'blackness'],
		cmyk: ['cyan', 'magenta', 'yellow', 'black']
	};

	Color.prototype.maxes = {
		rgb: [255, 255, 255],
		hsl: [360, 100, 100],
		hsv: [360, 100, 100],
		hwb: [360, 100, 100],
		cmyk: [100, 100, 100, 100]
	};

	Color.prototype.getValues = function (space) {
		var values = this.values;
		var vals = {};

		for (var i = 0; i < space.length; i++) {
			vals[space.charAt(i)] = values[space][i];
		}

		if (values.alpha !== 1) {
			vals.a = values.alpha;
		}

		// {r: 255, g: 255, b: 255, a: 0.4}
		return vals;
	};

	Color.prototype.setValues = function (space, vals) {
		var values = this.values;
		var spaces = this.spaces;
		var maxes = this.maxes;
		var alpha = 1;
		var i;

		this.valid = true;

		if (space === 'alpha') {
			alpha = vals;
		} else if (vals.length) {
			// [10, 10, 10]
			values[space] = vals.slice(0, space.length);
			alpha = vals[space.length];
		} else if (vals[space.charAt(0)] !== undefined) {
			// {r: 10, g: 10, b: 10}
			for (i = 0; i < space.length; i++) {
				values[space][i] = vals[space.charAt(i)];
			}

			alpha = vals.a;
		} else if (vals[spaces[space][0]] !== undefined) {
			// {red: 10, green: 10, blue: 10}
			var chans = spaces[space];

			for (i = 0; i < space.length; i++) {
				values[space][i] = vals[chans[i]];
			}

			alpha = vals.alpha;
		}

		values.alpha = Math.max(0, Math.min(1, (alpha === undefined ? values.alpha : alpha)));

		if (space === 'alpha') {
			return false;
		}

		var capped;

		// cap values of the space prior converting all values
		for (i = 0; i < space.length; i++) {
			capped = Math.max(0, Math.min(maxes[space][i], values[space][i]));
			values[space][i] = Math.round(capped);
		}

		// convert to all the other color spaces
		for (var sname in spaces) {
			if (sname !== space) {
				values[sname] = convert[space][sname](values[space]);
			}
		}

		return true;
	};

	Color.prototype.setSpace = function (space, args) {
		var vals = args[0];

		if (vals === undefined) {
			// color.rgb()
			return this.getValues(space);
		}

		// color.rgb(10, 10, 10)
		if (typeof vals === 'number') {
			vals = Array.prototype.slice.call(args);
		}

		this.setValues(space, vals);
		return this;
	};

	Color.prototype.setChannel = function (space, index, val) {
		var svalues = this.values[space];
		if (val === undefined) {
			// color.red()
			return svalues[index];
		} else if (val === svalues[index]) {
			// color.red(color.red())
			return this;
		}

		// color.red(100)
		svalues[index] = val;
		this.setValues(space, svalues);

		return this;
	};

	return Color;
});
define('skylark-chartjs/helpers/helpers.core',[], function () {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var helpers = {
        noop: function () {
        },
        uid: function () {
            var id = 0;
            return function () {
                return id++;
            };
        }(),
        isNullOrUndef: function (value) {
            return value === null || typeof value === 'undefined';
        },
        isArray: function (value) {
            if (Array.isArray && Array.isArray(value)) {
                return true;
            }
            var type = Object.prototype.toString.call(value);
            if (type.substr(0, 7) === '[object' && type.substr(-6) === 'Array]') {
                return true;
            }
            return false;
        },
        isObject: function (value) {
            return value !== null && Object.prototype.toString.call(value) === '[object Object]';
        },
        isFinite: function (value) {
            return (typeof value === 'number' || value instanceof Number) && isFinite(value);
        },
        valueOrDefault: function (value, defaultValue) {
            return typeof value === 'undefined' ? defaultValue : value;
        },
        valueAtIndexOrDefault: function (value, index, defaultValue) {
            return helpers.valueOrDefault(helpers.isArray(value) ? value[index] : value, defaultValue);
        },
        callback: function (fn, args, thisArg) {
            if (fn && typeof fn.call === 'function') {
                return fn.apply(thisArg, args);
            }
        },
        each: function (loopable, fn, thisArg, reverse) {
            var i, len, keys;
            if (helpers.isArray(loopable)) {
                len = loopable.length;
                if (reverse) {
                    for (i = len - 1; i >= 0; i--) {
                        fn.call(thisArg, loopable[i], i);
                    }
                } else {
                    for (i = 0; i < len; i++) {
                        fn.call(thisArg, loopable[i], i);
                    }
                }
            } else if (helpers.isObject(loopable)) {
                keys = Object.keys(loopable);
                len = keys.length;
                for (i = 0; i < len; i++) {
                    fn.call(thisArg, loopable[keys[i]], keys[i]);
                }
            }
        },
        arrayEquals: function (a0, a1) {
            var i, ilen, v0, v1;
            if (!a0 || !a1 || a0.length !== a1.length) {
                return false;
            }
            for (i = 0, ilen = a0.length; i < ilen; ++i) {
                v0 = a0[i];
                v1 = a1[i];
                if (v0 instanceof Array && v1 instanceof Array) {
                    if (!helpers.arrayEquals(v0, v1)) {
                        return false;
                    }
                } else if (v0 !== v1) {
                    return false;
                }
            }
            return true;
        },
        clone: function (source) {
            if (helpers.isArray(source)) {
                return source.map(helpers.clone);
            }
            if (helpers.isObject(source)) {
                var target = {};
                var keys = Object.keys(source);
                var klen = keys.length;
                var k = 0;
                for (; k < klen; ++k) {
                    target[keys[k]] = helpers.clone(source[keys[k]]);
                }
                return target;
            }
            return source;
        },
        _merger: function (key, target, source, options) {
            var tval = target[key];
            var sval = source[key];
            if (helpers.isObject(tval) && helpers.isObject(sval)) {
                helpers.merge(tval, sval, options);
            } else {
                target[key] = helpers.clone(sval);
            }
        },
        _mergerIf: function (key, target, source) {
            var tval = target[key];
            var sval = source[key];
            if (helpers.isObject(tval) && helpers.isObject(sval)) {
                helpers.mergeIf(tval, sval);
            } else if (!target.hasOwnProperty(key)) {
                target[key] = helpers.clone(sval);
            }
        },
        merge: function (target, source, options) {
            var sources = helpers.isArray(source) ? source : [source];
            var ilen = sources.length;
            var merge, i, keys, klen, k;
            if (!helpers.isObject(target)) {
                return target;
            }
            options = options || {};
            merge = options.merger || helpers._merger;
            for (i = 0; i < ilen; ++i) {
                source = sources[i];
                if (!helpers.isObject(source)) {
                    continue;
                }
                keys = Object.keys(source);
                for (k = 0, klen = keys.length; k < klen; ++k) {
                    merge(keys[k], target, source, options);
                }
            }
            return target;
        },
        mergeIf: function (target, source) {
            return helpers.merge(target, source, { merger: helpers._mergerIf });
        },
        extend: function (target) {
            var setFn = function (value, key) {
                target[key] = value;
            };
            for (var i = 1, ilen = arguments.length; i < ilen; ++i) {
                helpers.each(arguments[i], setFn);
            }
            return target;
        },
        inherits: function (extensions) {
            var me = this;
            var ChartElement = extensions && extensions.hasOwnProperty('constructor') ? extensions.constructor : function () {
                return me.apply(this, arguments);
            };
            var Surrogate = function () {
                this.constructor = ChartElement;
            };
            Surrogate.prototype = me.prototype;
            ChartElement.prototype = new Surrogate();
            ChartElement.extend = helpers.inherits;
            if (extensions) {
                helpers.extend(ChartElement.prototype, extensions);
            }
            ChartElement.__super__ = me.prototype;
            return ChartElement;
        }
    };
    module.exports = helpers;
    helpers.callCallback = helpers.callback;
    helpers.indexOf = function (array, item, fromIndex) {
        return Array.prototype.indexOf.call(array, item, fromIndex);
    };
    helpers.getValueOrDefault = helpers.valueOrDefault;
    helpers.getValueAtIndexOrDefault = helpers.valueAtIndexOrDefault;
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/helpers/helpers.easing',['./helpers.core'], function (__module__0) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var helpers = __module__0;
    var effects = {
        linear: function (t) {
            return t;
        },
        easeInQuad: function (t) {
            return t * t;
        },
        easeOutQuad: function (t) {
            return -t * (t - 2);
        },
        easeInOutQuad: function (t) {
            if ((t /= 0.5) < 1) {
                return 0.5 * t * t;
            }
            return -0.5 * (--t * (t - 2) - 1);
        },
        easeInCubic: function (t) {
            return t * t * t;
        },
        easeOutCubic: function (t) {
            return (t = t - 1) * t * t + 1;
        },
        easeInOutCubic: function (t) {
            if ((t /= 0.5) < 1) {
                return 0.5 * t * t * t;
            }
            return 0.5 * ((t -= 2) * t * t + 2);
        },
        easeInQuart: function (t) {
            return t * t * t * t;
        },
        easeOutQuart: function (t) {
            return -((t = t - 1) * t * t * t - 1);
        },
        easeInOutQuart: function (t) {
            if ((t /= 0.5) < 1) {
                return 0.5 * t * t * t * t;
            }
            return -0.5 * ((t -= 2) * t * t * t - 2);
        },
        easeInQuint: function (t) {
            return t * t * t * t * t;
        },
        easeOutQuint: function (t) {
            return (t = t - 1) * t * t * t * t + 1;
        },
        easeInOutQuint: function (t) {
            if ((t /= 0.5) < 1) {
                return 0.5 * t * t * t * t * t;
            }
            return 0.5 * ((t -= 2) * t * t * t * t + 2);
        },
        easeInSine: function (t) {
            return -Math.cos(t * (Math.PI / 2)) + 1;
        },
        easeOutSine: function (t) {
            return Math.sin(t * (Math.PI / 2));
        },
        easeInOutSine: function (t) {
            return -0.5 * (Math.cos(Math.PI * t) - 1);
        },
        easeInExpo: function (t) {
            return t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
        },
        easeOutExpo: function (t) {
            return t === 1 ? 1 : -Math.pow(2, -10 * t) + 1;
        },
        easeInOutExpo: function (t) {
            if (t === 0) {
                return 0;
            }
            if (t === 1) {
                return 1;
            }
            if ((t /= 0.5) < 1) {
                return 0.5 * Math.pow(2, 10 * (t - 1));
            }
            return 0.5 * (-Math.pow(2, -10 * --t) + 2);
        },
        easeInCirc: function (t) {
            if (t >= 1) {
                return t;
            }
            return -(Math.sqrt(1 - t * t) - 1);
        },
        easeOutCirc: function (t) {
            return Math.sqrt(1 - (t = t - 1) * t);
        },
        easeInOutCirc: function (t) {
            if ((t /= 0.5) < 1) {
                return -0.5 * (Math.sqrt(1 - t * t) - 1);
            }
            return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
        },
        easeInElastic: function (t) {
            var s = 1.70158;
            var p = 0;
            var a = 1;
            if (t === 0) {
                return 0;
            }
            if (t === 1) {
                return 1;
            }
            if (!p) {
                p = 0.3;
            }
            if (a < 1) {
                a = 1;
                s = p / 4;
            } else {
                s = p / (2 * Math.PI) * Math.asin(1 / a);
            }
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p));
        },
        easeOutElastic: function (t) {
            var s = 1.70158;
            var p = 0;
            var a = 1;
            if (t === 0) {
                return 0;
            }
            if (t === 1) {
                return 1;
            }
            if (!p) {
                p = 0.3;
            }
            if (a < 1) {
                a = 1;
                s = p / 4;
            } else {
                s = p / (2 * Math.PI) * Math.asin(1 / a);
            }
            return a * Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / p) + 1;
        },
        easeInOutElastic: function (t) {
            var s = 1.70158;
            var p = 0;
            var a = 1;
            if (t === 0) {
                return 0;
            }
            if ((t /= 0.5) === 2) {
                return 1;
            }
            if (!p) {
                p = 0.45;
            }
            if (a < 1) {
                a = 1;
                s = p / 4;
            } else {
                s = p / (2 * Math.PI) * Math.asin(1 / a);
            }
            if (t < 1) {
                return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p));
            }
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p) * 0.5 + 1;
        },
        easeInBack: function (t) {
            var s = 1.70158;
            return t * t * ((s + 1) * t - s);
        },
        easeOutBack: function (t) {
            var s = 1.70158;
            return (t = t - 1) * t * ((s + 1) * t + s) + 1;
        },
        easeInOutBack: function (t) {
            var s = 1.70158;
            if ((t /= 0.5) < 1) {
                return 0.5 * (t * t * (((s *= 1.525) + 1) * t - s));
            }
            return 0.5 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2);
        },
        easeInBounce: function (t) {
            return 1 - effects.easeOutBounce(1 - t);
        },
        easeOutBounce: function (t) {
            if (t < 1 / 2.75) {
                return 7.5625 * t * t;
            }
            if (t < 2 / 2.75) {
                return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
            }
            if (t < 2.5 / 2.75) {
                return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
            }
            return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
        },
        easeInOutBounce: function (t) {
            if (t < 0.5) {
                return effects.easeInBounce(t * 2) * 0.5;
            }
            return effects.easeOutBounce(t * 2 - 1) * 0.5 + 0.5;
        }
    };
    module.exports = { effects: effects };
    helpers.easingEffects = effects;
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/helpers/helpers.canvas',['./helpers.core'], function (__module__0) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var helpers = __module__0;
    var PI = Math.PI;
    var RAD_PER_DEG = PI / 180;
    var DOUBLE_PI = PI * 2;
    var HALF_PI = PI / 2;
    var QUARTER_PI = PI / 4;
    var TWO_THIRDS_PI = PI * 2 / 3;
    var exports = {
        clear: function (chart) {
            chart.ctx.clearRect(0, 0, chart.width, chart.height);
        },
        roundedRect: function (ctx, x, y, width, height, radius) {
            if (radius) {
                var r = Math.min(radius, height / 2, width / 2);
                var left = x + r;
                var top = y + r;
                var right = x + width - r;
                var bottom = y + height - r;
                ctx.moveTo(x, top);
                if (left < right && top < bottom) {
                    ctx.arc(left, top, r, -PI, -HALF_PI);
                    ctx.arc(right, top, r, -HALF_PI, 0);
                    ctx.arc(right, bottom, r, 0, HALF_PI);
                    ctx.arc(left, bottom, r, HALF_PI, PI);
                } else if (left < right) {
                    ctx.moveTo(left, y);
                    ctx.arc(right, top, r, -HALF_PI, HALF_PI);
                    ctx.arc(left, top, r, HALF_PI, PI + HALF_PI);
                } else if (top < bottom) {
                    ctx.arc(left, top, r, -PI, 0);
                    ctx.arc(left, bottom, r, 0, PI);
                } else {
                    ctx.arc(left, top, r, -PI, PI);
                }
                ctx.closePath();
                ctx.moveTo(x, y);
            } else {
                ctx.rect(x, y, width, height);
            }
        },
        drawPoint: function (ctx, style, radius, x, y, rotation) {
            var type, xOffset, yOffset, size, cornerRadius;
            var rad = (rotation || 0) * RAD_PER_DEG;
            if (style && typeof style === 'object') {
                type = style.toString();
                if (type === '[object HTMLImageElement]' || type === '[object HTMLCanvasElement]') {
                    ctx.drawImage(style, x - style.width / 2, y - style.height / 2, style.width, style.height);
                    return;
                }
            }
            if (isNaN(radius) || radius <= 0) {
                return;
            }
            ctx.beginPath();
            switch (style) {
            default:
                ctx.arc(x, y, radius, 0, DOUBLE_PI);
                ctx.closePath();
                break;
            case 'triangle':
                ctx.moveTo(x + Math.sin(rad) * radius, y - Math.cos(rad) * radius);
                rad += TWO_THIRDS_PI;
                ctx.lineTo(x + Math.sin(rad) * radius, y - Math.cos(rad) * radius);
                rad += TWO_THIRDS_PI;
                ctx.lineTo(x + Math.sin(rad) * radius, y - Math.cos(rad) * radius);
                ctx.closePath();
                break;
            case 'rectRounded':
                cornerRadius = radius * 0.516;
                size = radius - cornerRadius;
                xOffset = Math.cos(rad + QUARTER_PI) * size;
                yOffset = Math.sin(rad + QUARTER_PI) * size;
                ctx.arc(x - xOffset, y - yOffset, cornerRadius, rad - PI, rad - HALF_PI);
                ctx.arc(x + yOffset, y - xOffset, cornerRadius, rad - HALF_PI, rad);
                ctx.arc(x + xOffset, y + yOffset, cornerRadius, rad, rad + HALF_PI);
                ctx.arc(x - yOffset, y + xOffset, cornerRadius, rad + HALF_PI, rad + PI);
                ctx.closePath();
                break;
            case 'rect':
                if (!rotation) {
                    size = Math.SQRT1_2 * radius;
                    ctx.rect(x - size, y - size, 2 * size, 2 * size);
                    break;
                }
                rad += QUARTER_PI;
            case 'rectRot':
                xOffset = Math.cos(rad) * radius;
                yOffset = Math.sin(rad) * radius;
                ctx.moveTo(x - xOffset, y - yOffset);
                ctx.lineTo(x + yOffset, y - xOffset);
                ctx.lineTo(x + xOffset, y + yOffset);
                ctx.lineTo(x - yOffset, y + xOffset);
                ctx.closePath();
                break;
            case 'crossRot':
                rad += QUARTER_PI;
            case 'cross':
                xOffset = Math.cos(rad) * radius;
                yOffset = Math.sin(rad) * radius;
                ctx.moveTo(x - xOffset, y - yOffset);
                ctx.lineTo(x + xOffset, y + yOffset);
                ctx.moveTo(x + yOffset, y - xOffset);
                ctx.lineTo(x - yOffset, y + xOffset);
                break;
            case 'star':
                xOffset = Math.cos(rad) * radius;
                yOffset = Math.sin(rad) * radius;
                ctx.moveTo(x - xOffset, y - yOffset);
                ctx.lineTo(x + xOffset, y + yOffset);
                ctx.moveTo(x + yOffset, y - xOffset);
                ctx.lineTo(x - yOffset, y + xOffset);
                rad += QUARTER_PI;
                xOffset = Math.cos(rad) * radius;
                yOffset = Math.sin(rad) * radius;
                ctx.moveTo(x - xOffset, y - yOffset);
                ctx.lineTo(x + xOffset, y + yOffset);
                ctx.moveTo(x + yOffset, y - xOffset);
                ctx.lineTo(x - yOffset, y + xOffset);
                break;
            case 'line':
                xOffset = Math.cos(rad) * radius;
                yOffset = Math.sin(rad) * radius;
                ctx.moveTo(x - xOffset, y - yOffset);
                ctx.lineTo(x + xOffset, y + yOffset);
                break;
            case 'dash':
                ctx.moveTo(x, y);
                ctx.lineTo(x + Math.cos(rad) * radius, y + Math.sin(rad) * radius);
                break;
            }
            ctx.fill();
            ctx.stroke();
        },
        _isPointInArea: function (point, area) {
            var epsilon = 0.000001;
            return point.x > area.left - epsilon && point.x < area.right + epsilon && point.y > area.top - epsilon && point.y < area.bottom + epsilon;
        },
        clipArea: function (ctx, area) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(area.left, area.top, area.right - area.left, area.bottom - area.top);
            ctx.clip();
        },
        unclipArea: function (ctx) {
            ctx.restore();
        },
        lineTo: function (ctx, previous, target, flip) {
            var stepped = target.steppedLine;
            if (stepped) {
                if (stepped === 'middle') {
                    var midpoint = (previous.x + target.x) / 2;
                    ctx.lineTo(midpoint, flip ? target.y : previous.y);
                    ctx.lineTo(midpoint, flip ? previous.y : target.y);
                } else if (stepped === 'after' && !flip || stepped !== 'after' && flip) {
                    ctx.lineTo(previous.x, target.y);
                } else {
                    ctx.lineTo(target.x, previous.y);
                }
                ctx.lineTo(target.x, target.y);
                return;
            }
            if (!target.tension) {
                ctx.lineTo(target.x, target.y);
                return;
            }
            ctx.bezierCurveTo(flip ? previous.controlPointPreviousX : previous.controlPointNextX, flip ? previous.controlPointPreviousY : previous.controlPointNextY, flip ? target.controlPointNextX : target.controlPointPreviousX, flip ? target.controlPointNextY : target.controlPointPreviousY, target.x, target.y);
        }
    };
    module.exports = exports;
    helpers.clear = exports.clear;
    helpers.drawRoundedRectangle = function (ctx) {
        ctx.beginPath();
        exports.roundedRect.apply(exports, arguments);
    };
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/core/core.defaults',['../helpers/helpers.core'], function (__module__0) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var helpers = __module__0;
    var defaults = {
        _set: function (scope, values) {
            return helpers.merge(this[scope] || (this[scope] = {}), values);
        }
    };
    defaults._set('global', {
        defaultColor: 'rgba(0,0,0,0.1)',
        defaultFontColor: '#666',
        defaultFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
        defaultFontSize: 12,
        defaultFontStyle: 'normal',
        defaultLineHeight: 1.2,
        showLines: true
    });
    module.exports = defaults;
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/helpers/helpers.options',[
    '../core/core.defaults',
    './helpers.core'
], function (__module__0, __module__1) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var defaults = __module__0;
    var helpers = __module__1;
    var valueOrDefault = helpers.valueOrDefault;
    function toFontString(font) {
        if (!font || helpers.isNullOrUndef(font.size) || helpers.isNullOrUndef(font.family)) {
            return null;
        }
        return (font.style ? font.style + ' ' : '') + (font.weight ? font.weight + ' ' : '') + font.size + 'px ' + font.family;
    }
    module.exports = {
        toLineHeight: function (value, size) {
            var matches = ('' + value).match(/^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/);
            if (!matches || matches[1] === 'normal') {
                return size * 1.2;
            }
            value = +matches[2];
            switch (matches[3]) {
            case 'px':
                return value;
            case '%':
                value /= 100;
                break;
            default:
                break;
            }
            return size * value;
        },
        toPadding: function (value) {
            var t, r, b, l;
            if (helpers.isObject(value)) {
                t = +value.top || 0;
                r = +value.right || 0;
                b = +value.bottom || 0;
                l = +value.left || 0;
            } else {
                t = r = b = l = +value || 0;
            }
            return {
                top: t,
                right: r,
                bottom: b,
                left: l,
                height: t + b,
                width: l + r
            };
        },
        _parseFont: function (options) {
            var globalDefaults = defaults.global;
            var size = valueOrDefault(options.fontSize, globalDefaults.defaultFontSize);
            var font = {
                family: valueOrDefault(options.fontFamily, globalDefaults.defaultFontFamily),
                lineHeight: helpers.options.toLineHeight(valueOrDefault(options.lineHeight, globalDefaults.defaultLineHeight), size),
                size: size,
                style: valueOrDefault(options.fontStyle, globalDefaults.defaultFontStyle),
                weight: null,
                string: ''
            };
            font.string = toFontString(font);
            return font;
        },
        resolve: function (inputs, context, index) {
            var i, ilen, value;
            for (i = 0, ilen = inputs.length; i < ilen; ++i) {
                value = inputs[i];
                if (value === undefined) {
                    continue;
                }
                if (context !== undefined && typeof value === 'function') {
                    value = value(context);
                }
                if (index !== undefined && helpers.isArray(value)) {
                    value = value[index];
                }
                if (value !== undefined) {
                    return value;
                }
            }
        }
    };
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/helpers/index',[
    './helpers.core',
    './helpers.easing',
    './helpers.canvas',
    './helpers.options'
], function (__module__0, __module__1, __module__2, __module__3) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    module.exports = __module__0;
    module.exports.easing = __module__1;
    module.exports.canvas = __module__2;
    module.exports.options = __module__3;
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/core/core.element',[
    '../../packages/chartjs-color',
    '../helpers/index'
], function (__module__0, __module__1) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var color = __module__0;
    var helpers = __module__1;
    function interpolate(start, view, model, ease) {
        var keys = Object.keys(model);
        var i, ilen, key, actual, origin, target, type, c0, c1;
        for (i = 0, ilen = keys.length; i < ilen; ++i) {
            key = keys[i];
            target = model[key];
            if (!view.hasOwnProperty(key)) {
                view[key] = target;
            }
            actual = view[key];
            if (actual === target || key[0] === '_') {
                continue;
            }
            if (!start.hasOwnProperty(key)) {
                start[key] = actual;
            }
            origin = start[key];
            type = typeof target;
            if (type === typeof origin) {
                if (type === 'string') {
                    c0 = color(origin);
                    if (c0.valid) {
                        c1 = color(target);
                        if (c1.valid) {
                            view[key] = c1.mix(c0, ease).rgbString();
                            continue;
                        }
                    }
                } else if (helpers.isFinite(origin) && helpers.isFinite(target)) {
                    view[key] = origin + (target - origin) * ease;
                    continue;
                }
            }
            view[key] = target;
        }
    }
    var Element = function (configuration) {
        helpers.extend(this, configuration);
        this.initialize.apply(this, arguments);
    };
    helpers.extend(Element.prototype, {
        initialize: function () {
            this.hidden = false;
        },
        pivot: function () {
            var me = this;
            if (!me._view) {
                me._view = helpers.clone(me._model);
            }
            me._start = {};
            return me;
        },
        transition: function (ease) {
            var me = this;
            var model = me._model;
            var start = me._start;
            var view = me._view;
            if (!model || ease === 1) {
                me._view = model;
                me._start = null;
                return me;
            }
            if (!view) {
                view = me._view = {};
            }
            if (!start) {
                start = me._start = {};
            }
            interpolate(start, view, model, ease);
            return me;
        },
        tooltipPosition: function () {
            return {
                x: this._model.x,
                y: this._model.y
            };
        },
        hasValue: function () {
            return helpers.isNumber(this._model.x) && helpers.isNumber(this._model.y);
        }
    });
    Element.extend = helpers.inherits;
    module.exports = Element;
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/core/core.animation',['./core.element'], function (__module__0) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var Element = __module__0;
    var exports = Element.extend({
        chart: null,
        currentStep: 0,
        numSteps: 60,
        easing: '',
        render: null,
        onAnimationProgress: null,
        onAnimationComplete: null
    });
    module.exports = exports;
    Object.defineProperty(exports.prototype, 'animationObject', {
        get: function () {
            return this;
        }
    });
    Object.defineProperty(exports.prototype, 'chartInstance', {
        get: function () {
            return this.chart;
        },
        set: function (value) {
            this.chart = value;
        }
    });
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/core/core.animations',[
    './core.defaults',
    '../helpers/index'
], function (__module__0, __module__1) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var defaults = __module__0;
    var helpers = __module__1;
    defaults._set('global', {
        animation: {
            duration: 1000,
            easing: 'easeOutQuart',
            onProgress: helpers.noop,
            onComplete: helpers.noop
        }
    });
    module.exports = {
        animations: [],
        request: null,
        addAnimation: function (chart, animation, duration, lazy) {
            var animations = this.animations;
            var i, ilen;
            animation.chart = chart;
            animation.startTime = Date.now();
            animation.duration = duration;
            if (!lazy) {
                chart.animating = true;
            }
            for (i = 0, ilen = animations.length; i < ilen; ++i) {
                if (animations[i].chart === chart) {
                    animations[i] = animation;
                    return;
                }
            }
            animations.push(animation);
            if (animations.length === 1) {
                this.requestAnimationFrame();
            }
        },
        cancelAnimation: function (chart) {
            var index = helpers.findIndex(this.animations, function (animation) {
                return animation.chart === chart;
            });
            if (index !== -1) {
                this.animations.splice(index, 1);
                chart.animating = false;
            }
        },
        requestAnimationFrame: function () {
            var me = this;
            if (me.request === null) {
                me.request = helpers.requestAnimFrame.call(window, function () {
                    me.request = null;
                    me.startDigest();
                });
            }
        },
        startDigest: function () {
            var me = this;
            me.advance();
            if (me.animations.length > 0) {
                me.requestAnimationFrame();
            }
        },
        advance: function () {
            var animations = this.animations;
            var animation, chart, numSteps, nextStep;
            var i = 0;
            while (i < animations.length) {
                animation = animations[i];
                chart = animation.chart;
                numSteps = animation.numSteps;
                nextStep = Math.floor((Date.now() - animation.startTime) / animation.duration * numSteps) + 1;
                animation.currentStep = Math.min(nextStep, numSteps);
                helpers.callback(animation.render, [
                    chart,
                    animation
                ], chart);
                helpers.callback(animation.onAnimationProgress, [animation], chart);
                if (animation.currentStep >= numSteps) {
                    helpers.callback(animation.onAnimationComplete, [animation], chart);
                    chart.animating = false;
                    animations.splice(i, 1);
                } else {
                    ++i;
                }
            }
        }
    };
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/core/core.datasetController',['../helpers/index'], function (__module__0) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var helpers = __module__0;
    var resolve = helpers.options.resolve;
    var arrayEvents = [
        'push',
        'pop',
        'shift',
        'splice',
        'unshift'
    ];
    function listenArrayEvents(array, listener) {
        if (array._chartjs) {
            array._chartjs.listeners.push(listener);
            return;
        }
        Object.defineProperty(array, '_chartjs', {
            configurable: true,
            enumerable: false,
            value: { listeners: [listener] }
        });
        arrayEvents.forEach(function (key) {
            var method = 'onData' + key.charAt(0).toUpperCase() + key.slice(1);
            var base = array[key];
            Object.defineProperty(array, key, {
                configurable: true,
                enumerable: false,
                value: function () {
                    var args = Array.prototype.slice.call(arguments);
                    var res = base.apply(this, args);
                    helpers.each(array._chartjs.listeners, function (object) {
                        if (typeof object[method] === 'function') {
                            object[method].apply(object, args);
                        }
                    });
                    return res;
                }
            });
        });
    }
    function unlistenArrayEvents(array, listener) {
        var stub = array._chartjs;
        if (!stub) {
            return;
        }
        var listeners = stub.listeners;
        var index = listeners.indexOf(listener);
        if (index !== -1) {
            listeners.splice(index, 1);
        }
        if (listeners.length > 0) {
            return;
        }
        arrayEvents.forEach(function (key) {
            delete array[key];
        });
        delete array._chartjs;
    }
    var DatasetController = function (chart, datasetIndex) {
        this.initialize(chart, datasetIndex);
    };
    helpers.extend(DatasetController.prototype, {
        datasetElementType: null,
        dataElementType: null,
        initialize: function (chart, datasetIndex) {
            var me = this;
            me.chart = chart;
            me.index = datasetIndex;
            me.linkScales();
            me.addElements();
        },
        updateIndex: function (datasetIndex) {
            this.index = datasetIndex;
        },
        linkScales: function () {
            var me = this;
            var meta = me.getMeta();
            var dataset = me.getDataset();
            if (meta.xAxisID === null || !(meta.xAxisID in me.chart.scales)) {
                meta.xAxisID = dataset.xAxisID || me.chart.options.scales.xAxes[0].id;
            }
            if (meta.yAxisID === null || !(meta.yAxisID in me.chart.scales)) {
                meta.yAxisID = dataset.yAxisID || me.chart.options.scales.yAxes[0].id;
            }
        },
        getDataset: function () {
            return this.chart.data.datasets[this.index];
        },
        getMeta: function () {
            return this.chart.getDatasetMeta(this.index);
        },
        getScaleForId: function (scaleID) {
            return this.chart.scales[scaleID];
        },
        _getValueScaleId: function () {
            return this.getMeta().yAxisID;
        },
        _getIndexScaleId: function () {
            return this.getMeta().xAxisID;
        },
        _getValueScale: function () {
            return this.getScaleForId(this._getValueScaleId());
        },
        _getIndexScale: function () {
            return this.getScaleForId(this._getIndexScaleId());
        },
        reset: function () {
            this.update(true);
        },
        destroy: function () {
            if (this._data) {
                unlistenArrayEvents(this._data, this);
            }
        },
        createMetaDataset: function () {
            var me = this;
            var type = me.datasetElementType;
            return type && new type({
                _chart: me.chart,
                _datasetIndex: me.index
            });
        },
        createMetaData: function (index) {
            var me = this;
            var type = me.dataElementType;
            return type && new type({
                _chart: me.chart,
                _datasetIndex: me.index,
                _index: index
            });
        },
        addElements: function () {
            var me = this;
            var meta = me.getMeta();
            var data = me.getDataset().data || [];
            var metaData = meta.data;
            var i, ilen;
            for (i = 0, ilen = data.length; i < ilen; ++i) {
                metaData[i] = metaData[i] || me.createMetaData(i);
            }
            meta.dataset = meta.dataset || me.createMetaDataset();
        },
        addElementAndReset: function (index) {
            var element = this.createMetaData(index);
            this.getMeta().data.splice(index, 0, element);
            this.updateElement(element, index, true);
        },
        buildOrUpdateElements: function () {
            var me = this;
            var dataset = me.getDataset();
            var data = dataset.data || (dataset.data = []);
            if (me._data !== data) {
                if (me._data) {
                    unlistenArrayEvents(me._data, me);
                }
                if (data && Object.isExtensible(data)) {
                    listenArrayEvents(data, me);
                }
                me._data = data;
            }
            me.resyncElements();
        },
        update: helpers.noop,
        transition: function (easingValue) {
            var meta = this.getMeta();
            var elements = meta.data || [];
            var ilen = elements.length;
            var i = 0;
            for (; i < ilen; ++i) {
                elements[i].transition(easingValue);
            }
            if (meta.dataset) {
                meta.dataset.transition(easingValue);
            }
        },
        draw: function () {
            var meta = this.getMeta();
            var elements = meta.data || [];
            var ilen = elements.length;
            var i = 0;
            if (meta.dataset) {
                meta.dataset.draw();
            }
            for (; i < ilen; ++i) {
                elements[i].draw();
            }
        },
        removeHoverStyle: function (element) {
            helpers.merge(element._model, element.$previousStyle || {});
            delete element.$previousStyle;
        },
        setHoverStyle: function (element) {
            var dataset = this.chart.data.datasets[element._datasetIndex];
            var index = element._index;
            var custom = element.custom || {};
            var model = element._model;
            var getHoverColor = helpers.getHoverColor;
            element.$previousStyle = {
                backgroundColor: model.backgroundColor,
                borderColor: model.borderColor,
                borderWidth: model.borderWidth
            };
            model.backgroundColor = resolve([
                custom.hoverBackgroundColor,
                dataset.hoverBackgroundColor,
                getHoverColor(model.backgroundColor)
            ], undefined, index);
            model.borderColor = resolve([
                custom.hoverBorderColor,
                dataset.hoverBorderColor,
                getHoverColor(model.borderColor)
            ], undefined, index);
            model.borderWidth = resolve([
                custom.hoverBorderWidth,
                dataset.hoverBorderWidth,
                model.borderWidth
            ], undefined, index);
        },
        resyncElements: function () {
            var me = this;
            var meta = me.getMeta();
            var data = me.getDataset().data;
            var numMeta = meta.data.length;
            var numData = data.length;
            if (numData < numMeta) {
                meta.data.splice(numData, numMeta - numData);
            } else if (numData > numMeta) {
                me.insertElements(numMeta, numData - numMeta);
            }
        },
        insertElements: function (start, count) {
            for (var i = 0; i < count; ++i) {
                this.addElementAndReset(start + i);
            }
        },
        onDataPush: function () {
            var count = arguments.length;
            this.insertElements(this.getDataset().data.length - count, count);
        },
        onDataPop: function () {
            this.getMeta().data.pop();
        },
        onDataShift: function () {
            this.getMeta().data.shift();
        },
        onDataSplice: function (start, count) {
            this.getMeta().data.splice(start, count);
            this.insertElements(start, arguments.length - 2);
        },
        onDataUnshift: function () {
            this.insertElements(0, arguments.length);
        }
    });
    DatasetController.extend = helpers.inherits;
    module.exports = DatasetController;
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/elements/element.arc',[
    '../core/core.defaults',
    '../core/core.element',
    '../helpers/index'
], function (__module__0, __module__1, __module__2) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var defaults = __module__0;
    var Element = __module__1;
    var helpers = __module__2;
    defaults._set('global', {
        elements: {
            arc: {
                backgroundColor: defaults.global.defaultColor,
                borderColor: '#fff',
                borderWidth: 2,
                borderAlign: 'center'
            }
        }
    });
    module.exports = Element.extend({
        inLabelRange: function (mouseX) {
            var vm = this._view;
            if (vm) {
                return Math.pow(mouseX - vm.x, 2) < Math.pow(vm.radius + vm.hoverRadius, 2);
            }
            return false;
        },
        inRange: function (chartX, chartY) {
            var vm = this._view;
            if (vm) {
                var pointRelativePosition = helpers.getAngleFromPoint(vm, {
                    x: chartX,
                    y: chartY
                });
                var angle = pointRelativePosition.angle;
                var distance = pointRelativePosition.distance;
                var startAngle = vm.startAngle;
                var endAngle = vm.endAngle;
                while (endAngle < startAngle) {
                    endAngle += 2 * Math.PI;
                }
                while (angle > endAngle) {
                    angle -= 2 * Math.PI;
                }
                while (angle < startAngle) {
                    angle += 2 * Math.PI;
                }
                var betweenAngles = angle >= startAngle && angle <= endAngle;
                var withinRadius = distance >= vm.innerRadius && distance <= vm.outerRadius;
                return betweenAngles && withinRadius;
            }
            return false;
        },
        getCenterPoint: function () {
            var vm = this._view;
            var halfAngle = (vm.startAngle + vm.endAngle) / 2;
            var halfRadius = (vm.innerRadius + vm.outerRadius) / 2;
            return {
                x: vm.x + Math.cos(halfAngle) * halfRadius,
                y: vm.y + Math.sin(halfAngle) * halfRadius
            };
        },
        getArea: function () {
            var vm = this._view;
            return Math.PI * ((vm.endAngle - vm.startAngle) / (2 * Math.PI)) * (Math.pow(vm.outerRadius, 2) - Math.pow(vm.innerRadius, 2));
        },
        tooltipPosition: function () {
            var vm = this._view;
            var centreAngle = vm.startAngle + (vm.endAngle - vm.startAngle) / 2;
            var rangeFromCentre = (vm.outerRadius - vm.innerRadius) / 2 + vm.innerRadius;
            return {
                x: vm.x + Math.cos(centreAngle) * rangeFromCentre,
                y: vm.y + Math.sin(centreAngle) * rangeFromCentre
            };
        },
        draw: function () {
            var ctx = this._chart.ctx;
            var vm = this._view;
            var sA = vm.startAngle;
            var eA = vm.endAngle;
            var pixelMargin = vm.borderAlign === 'inner' ? 0.33 : 0;
            var angleMargin;
            ctx.save();
            ctx.beginPath();
            ctx.arc(vm.x, vm.y, Math.max(vm.outerRadius - pixelMargin, 0), sA, eA);
            ctx.arc(vm.x, vm.y, vm.innerRadius, eA, sA, true);
            ctx.closePath();
            ctx.fillStyle = vm.backgroundColor;
            ctx.fill();
            if (vm.borderWidth) {
                if (vm.borderAlign === 'inner') {
                    ctx.beginPath();
                    angleMargin = pixelMargin / vm.outerRadius;
                    ctx.arc(vm.x, vm.y, vm.outerRadius, sA - angleMargin, eA + angleMargin);
                    if (vm.innerRadius > pixelMargin) {
                        angleMargin = pixelMargin / vm.innerRadius;
                        ctx.arc(vm.x, vm.y, vm.innerRadius - pixelMargin, eA + angleMargin, sA - angleMargin, true);
                    } else {
                        ctx.arc(vm.x, vm.y, pixelMargin, eA + Math.PI / 2, sA - Math.PI / 2);
                    }
                    ctx.closePath();
                    ctx.clip();
                    ctx.beginPath();
                    ctx.arc(vm.x, vm.y, vm.outerRadius, sA, eA);
                    ctx.arc(vm.x, vm.y, vm.innerRadius, eA, sA, true);
                    ctx.closePath();
                    ctx.lineWidth = vm.borderWidth * 2;
                    ctx.lineJoin = 'round';
                } else {
                    ctx.lineWidth = vm.borderWidth;
                    ctx.lineJoin = 'bevel';
                }
                ctx.strokeStyle = vm.borderColor;
                ctx.stroke();
            }
            ctx.restore();
        }
    });
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/elements/element.line',[
    '../core/core.defaults',
    '../core/core.element',
    '../helpers/index'
], function (__module__0, __module__1, __module__2) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var defaults = __module__0;
    var Element = __module__1;
    var helpers = __module__2;
    var valueOrDefault = helpers.valueOrDefault;
    var defaultColor = defaults.global.defaultColor;
    defaults._set('global', {
        elements: {
            line: {
                tension: 0.4,
                backgroundColor: defaultColor,
                borderWidth: 3,
                borderColor: defaultColor,
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0,
                borderJoinStyle: 'miter',
                capBezierPoints: true,
                fill: true
            }
        }
    });
    module.exports = Element.extend({
        draw: function () {
            var me = this;
            var vm = me._view;
            var ctx = me._chart.ctx;
            var spanGaps = vm.spanGaps;
            var points = me._children.slice();
            var globalDefaults = defaults.global;
            var globalOptionLineElements = globalDefaults.elements.line;
            var lastDrawnIndex = -1;
            var index, current, previous, currentVM;
            if (me._loop && points.length) {
                points.push(points[0]);
            }
            ctx.save();
            ctx.lineCap = vm.borderCapStyle || globalOptionLineElements.borderCapStyle;
            if (ctx.setLineDash) {
                ctx.setLineDash(vm.borderDash || globalOptionLineElements.borderDash);
            }
            ctx.lineDashOffset = valueOrDefault(vm.borderDashOffset, globalOptionLineElements.borderDashOffset);
            ctx.lineJoin = vm.borderJoinStyle || globalOptionLineElements.borderJoinStyle;
            ctx.lineWidth = valueOrDefault(vm.borderWidth, globalOptionLineElements.borderWidth);
            ctx.strokeStyle = vm.borderColor || globalDefaults.defaultColor;
            ctx.beginPath();
            lastDrawnIndex = -1;
            for (index = 0; index < points.length; ++index) {
                current = points[index];
                previous = helpers.previousItem(points, index);
                currentVM = current._view;
                if (index === 0) {
                    if (!currentVM.skip) {
                        ctx.moveTo(currentVM.x, currentVM.y);
                        lastDrawnIndex = index;
                    }
                } else {
                    previous = lastDrawnIndex === -1 ? previous : points[lastDrawnIndex];
                    if (!currentVM.skip) {
                        if (lastDrawnIndex !== index - 1 && !spanGaps || lastDrawnIndex === -1) {
                            ctx.moveTo(currentVM.x, currentVM.y);
                        } else {
                            helpers.canvas.lineTo(ctx, previous._view, current._view);
                        }
                        lastDrawnIndex = index;
                    }
                }
            }
            ctx.stroke();
            ctx.restore();
        }
    });
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/elements/element.point',[
    '../core/core.defaults',
    '../core/core.element',
    '../helpers/index'
], function (__module__0, __module__1, __module__2) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var defaults = __module__0;
    var Element = __module__1;
    var helpers = __module__2;
    var valueOrDefault = helpers.valueOrDefault;
    var defaultColor = defaults.global.defaultColor;
    defaults._set('global', {
        elements: {
            point: {
                radius: 3,
                pointStyle: 'circle',
                backgroundColor: defaultColor,
                borderColor: defaultColor,
                borderWidth: 1,
                hitRadius: 1,
                hoverRadius: 4,
                hoverBorderWidth: 1
            }
        }
    });
    function xRange(mouseX) {
        var vm = this._view;
        return vm ? Math.abs(mouseX - vm.x) < vm.radius + vm.hitRadius : false;
    }
    function yRange(mouseY) {
        var vm = this._view;
        return vm ? Math.abs(mouseY - vm.y) < vm.radius + vm.hitRadius : false;
    }
    module.exports = Element.extend({
        inRange: function (mouseX, mouseY) {
            var vm = this._view;
            return vm ? Math.pow(mouseX - vm.x, 2) + Math.pow(mouseY - vm.y, 2) < Math.pow(vm.hitRadius + vm.radius, 2) : false;
        },
        inLabelRange: xRange,
        inXRange: xRange,
        inYRange: yRange,
        getCenterPoint: function () {
            var vm = this._view;
            return {
                x: vm.x,
                y: vm.y
            };
        },
        getArea: function () {
            return Math.PI * Math.pow(this._view.radius, 2);
        },
        tooltipPosition: function () {
            var vm = this._view;
            return {
                x: vm.x,
                y: vm.y,
                padding: vm.radius + vm.borderWidth
            };
        },
        draw: function (chartArea) {
            var vm = this._view;
            var ctx = this._chart.ctx;
            var pointStyle = vm.pointStyle;
            var rotation = vm.rotation;
            var radius = vm.radius;
            var x = vm.x;
            var y = vm.y;
            var globalDefaults = defaults.global;
            var defaultColor = globalDefaults.defaultColor;
            if (vm.skip) {
                return;
            }
            if (chartArea === undefined || helpers.canvas._isPointInArea(vm, chartArea)) {
                ctx.strokeStyle = vm.borderColor || defaultColor;
                ctx.lineWidth = valueOrDefault(vm.borderWidth, globalDefaults.elements.point.borderWidth);
                ctx.fillStyle = vm.backgroundColor || defaultColor;
                helpers.canvas.drawPoint(ctx, pointStyle, radius, x, y, rotation);
            }
        }
    });
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/elements/element.rectangle',[
    '../core/core.defaults',
    '../core/core.element',
    '../helpers/index'
], function (__module__0, __module__1, __module__2) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var defaults = __module__0;
    var Element = __module__1;
    var helpers = __module__2;
    var defaultColor = defaults.global.defaultColor;
    defaults._set('global', {
        elements: {
            rectangle: {
                backgroundColor: defaultColor,
                borderColor: defaultColor,
                borderSkipped: 'bottom',
                borderWidth: 0
            }
        }
    });
    function isVertical(vm) {
        return vm && vm.width !== undefined;
    }
    function getBarBounds(vm) {
        var x1, x2, y1, y2, half;
        if (isVertical(vm)) {
            half = vm.width / 2;
            x1 = vm.x - half;
            x2 = vm.x + half;
            y1 = Math.min(vm.y, vm.base);
            y2 = Math.max(vm.y, vm.base);
        } else {
            half = vm.height / 2;
            x1 = Math.min(vm.x, vm.base);
            x2 = Math.max(vm.x, vm.base);
            y1 = vm.y - half;
            y2 = vm.y + half;
        }
        return {
            left: x1,
            top: y1,
            right: x2,
            bottom: y2
        };
    }
    function swap(orig, v1, v2) {
        return orig === v1 ? v2 : orig === v2 ? v1 : orig;
    }
    function parseBorderSkipped(vm) {
        var edge = vm.borderSkipped;
        var res = {};
        if (!edge) {
            return res;
        }
        if (vm.horizontal) {
            if (vm.base > vm.x) {
                edge = swap(edge, 'left', 'right');
            }
        } else if (vm.base < vm.y) {
            edge = swap(edge, 'bottom', 'top');
        }
        res[edge] = true;
        return res;
    }
    function parseBorderWidth(vm, maxW, maxH) {
        var value = vm.borderWidth;
        var skip = parseBorderSkipped(vm);
        var t, r, b, l;
        if (helpers.isObject(value)) {
            t = +value.top || 0;
            r = +value.right || 0;
            b = +value.bottom || 0;
            l = +value.left || 0;
        } else {
            t = r = b = l = +value || 0;
        }
        return {
            t: skip.top || t < 0 ? 0 : t > maxH ? maxH : t,
            r: skip.right || r < 0 ? 0 : r > maxW ? maxW : r,
            b: skip.bottom || b < 0 ? 0 : b > maxH ? maxH : b,
            l: skip.left || l < 0 ? 0 : l > maxW ? maxW : l
        };
    }
    function boundingRects(vm) {
        var bounds = getBarBounds(vm);
        var width = bounds.right - bounds.left;
        var height = bounds.bottom - bounds.top;
        var border = parseBorderWidth(vm, width / 2, height / 2);
        return {
            outer: {
                x: bounds.left,
                y: bounds.top,
                w: width,
                h: height
            },
            inner: {
                x: bounds.left + border.l,
                y: bounds.top + border.t,
                w: width - border.l - border.r,
                h: height - border.t - border.b
            }
        };
    }
    function inRange(vm, x, y) {
        var skipX = x === null;
        var skipY = y === null;
        var bounds = !vm || skipX && skipY ? false : getBarBounds(vm);
        return bounds && (skipX || x >= bounds.left && x <= bounds.right) && (skipY || y >= bounds.top && y <= bounds.bottom);
    }
    module.exports = Element.extend({
        draw: function () {
            var ctx = this._chart.ctx;
            var vm = this._view;
            var rects = boundingRects(vm);
            var outer = rects.outer;
            var inner = rects.inner;
            ctx.fillStyle = vm.backgroundColor;
            ctx.fillRect(outer.x, outer.y, outer.w, outer.h);
            if (outer.w === inner.w && outer.h === inner.h) {
                return;
            }
            ctx.save();
            ctx.beginPath();
            ctx.rect(outer.x, outer.y, outer.w, outer.h);
            ctx.clip();
            ctx.fillStyle = vm.borderColor;
            ctx.rect(inner.x, inner.y, inner.w, inner.h);
            ctx.fill('evenodd');
            ctx.restore();
        },
        height: function () {
            var vm = this._view;
            return vm.base - vm.y;
        },
        inRange: function (mouseX, mouseY) {
            return inRange(this._view, mouseX, mouseY);
        },
        inLabelRange: function (mouseX, mouseY) {
            var vm = this._view;
            return isVertical(vm) ? inRange(vm, mouseX, null) : inRange(vm, null, mouseY);
        },
        inXRange: function (mouseX) {
            return inRange(this._view, mouseX, null);
        },
        inYRange: function (mouseY) {
            return inRange(this._view, null, mouseY);
        },
        getCenterPoint: function () {
            var vm = this._view;
            var x, y;
            if (isVertical(vm)) {
                x = vm.x;
                y = (vm.y + vm.base) / 2;
            } else {
                x = (vm.x + vm.base) / 2;
                y = vm.y;
            }
            return {
                x: x,
                y: y
            };
        },
        getArea: function () {
            var vm = this._view;
            return isVertical(vm) ? vm.width * Math.abs(vm.y - vm.base) : vm.height * Math.abs(vm.x - vm.base);
        },
        tooltipPosition: function () {
            var vm = this._view;
            return {
                x: vm.x,
                y: vm.y
            };
        }
    });
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/elements/index',[
    './element.arc',
    './element.line',
    './element.point',
    './element.rectangle'
], function (__module__0, __module__1, __module__2, __module__3) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    module.exports = {};
    module.exports.Arc = __module__0;
    module.exports.Line = __module__1;
    module.exports.Point = __module__2;
    module.exports.Rectangle = __module__3;
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/controllers/controller.bar',[
    '../core/core.datasetController',
    '../core/core.defaults',
    '../elements/index',
    '../helpers/index'
], function (__module__0, __module__1, __module__2, __module__3) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var DatasetController = __module__0;
    var defaults = __module__1;
    var elements = __module__2;
    var helpers = __module__3;
    var resolve = helpers.options.resolve;
    defaults._set('bar', {
        hover: { mode: 'label' },
        scales: {
            xAxes: [{
                    type: 'category',
                    categoryPercentage: 0.8,
                    barPercentage: 0.9,
                    offset: true,
                    gridLines: { offsetGridLines: true }
                }],
            yAxes: [{ type: 'linear' }]
        }
    });
    function computeMinSampleSize(scale, pixels) {
        var min = scale.isHorizontal() ? scale.width : scale.height;
        var ticks = scale.getTicks();
        var prev, curr, i, ilen;
        for (i = 1, ilen = pixels.length; i < ilen; ++i) {
            min = Math.min(min, Math.abs(pixels[i] - pixels[i - 1]));
        }
        for (i = 0, ilen = ticks.length; i < ilen; ++i) {
            curr = scale.getPixelForTick(i);
            min = i > 0 ? Math.min(min, curr - prev) : min;
            prev = curr;
        }
        return min;
    }
    function computeFitCategoryTraits(index, ruler, options) {
        var thickness = options.barThickness;
        var count = ruler.stackCount;
        var curr = ruler.pixels[index];
        var size, ratio;
        if (helpers.isNullOrUndef(thickness)) {
            size = ruler.min * options.categoryPercentage;
            ratio = options.barPercentage;
        } else {
            size = thickness * count;
            ratio = 1;
        }
        return {
            chunk: size / count,
            ratio: ratio,
            start: curr - size / 2
        };
    }
    function computeFlexCategoryTraits(index, ruler, options) {
        var pixels = ruler.pixels;
        var curr = pixels[index];
        var prev = index > 0 ? pixels[index - 1] : null;
        var next = index < pixels.length - 1 ? pixels[index + 1] : null;
        var percent = options.categoryPercentage;
        var start, size;
        if (prev === null) {
            prev = curr - (next === null ? ruler.end - ruler.start : next - curr);
        }
        if (next === null) {
            next = curr + curr - prev;
        }
        start = curr - (curr - Math.min(prev, next)) / 2 * percent;
        size = Math.abs(next - prev) / 2 * percent;
        return {
            chunk: size / ruler.stackCount,
            ratio: options.barPercentage,
            start: start
        };
    }
    module.exports = DatasetController.extend({
        dataElementType: elements.Rectangle,
        initialize: function () {
            var me = this;
            var meta;
            DatasetController.prototype.initialize.apply(me, arguments);
            meta = me.getMeta();
            meta.stack = me.getDataset().stack;
            meta.bar = true;
        },
        update: function (reset) {
            var me = this;
            var rects = me.getMeta().data;
            var i, ilen;
            me._ruler = me.getRuler();
            for (i = 0, ilen = rects.length; i < ilen; ++i) {
                me.updateElement(rects[i], i, reset);
            }
        },
        updateElement: function (rectangle, index, reset) {
            var me = this;
            var meta = me.getMeta();
            var dataset = me.getDataset();
            var options = me._resolveElementOptions(rectangle, index);
            rectangle._xScale = me.getScaleForId(meta.xAxisID);
            rectangle._yScale = me.getScaleForId(meta.yAxisID);
            rectangle._datasetIndex = me.index;
            rectangle._index = index;
            rectangle._model = {
                backgroundColor: options.backgroundColor,
                borderColor: options.borderColor,
                borderSkipped: options.borderSkipped,
                borderWidth: options.borderWidth,
                datasetLabel: dataset.label,
                label: me.chart.data.labels[index]
            };
            me._updateElementGeometry(rectangle, index, reset);
            rectangle.pivot();
        },
        _updateElementGeometry: function (rectangle, index, reset) {
            var me = this;
            var model = rectangle._model;
            var vscale = me._getValueScale();
            var base = vscale.getBasePixel();
            var horizontal = vscale.isHorizontal();
            var ruler = me._ruler || me.getRuler();
            var vpixels = me.calculateBarValuePixels(me.index, index);
            var ipixels = me.calculateBarIndexPixels(me.index, index, ruler);
            model.horizontal = horizontal;
            model.base = reset ? base : vpixels.base;
            model.x = horizontal ? reset ? base : vpixels.head : ipixels.center;
            model.y = horizontal ? ipixels.center : reset ? base : vpixels.head;
            model.height = horizontal ? ipixels.size : undefined;
            model.width = horizontal ? undefined : ipixels.size;
        },
        _getStacks: function (last) {
            var me = this;
            var chart = me.chart;
            var scale = me._getIndexScale();
            var stacked = scale.options.stacked;
            var ilen = last === undefined ? chart.data.datasets.length : last + 1;
            var stacks = [];
            var i, meta;
            for (i = 0; i < ilen; ++i) {
                meta = chart.getDatasetMeta(i);
                if (meta.bar && chart.isDatasetVisible(i) && (stacked === false || stacked === true && stacks.indexOf(meta.stack) === -1 || stacked === undefined && (meta.stack === undefined || stacks.indexOf(meta.stack) === -1))) {
                    stacks.push(meta.stack);
                }
            }
            return stacks;
        },
        getStackCount: function () {
            return this._getStacks().length;
        },
        getStackIndex: function (datasetIndex, name) {
            var stacks = this._getStacks(datasetIndex);
            var index = name !== undefined ? stacks.indexOf(name) : -1;
            return index === -1 ? stacks.length - 1 : index;
        },
        getRuler: function () {
            var me = this;
            var scale = me._getIndexScale();
            var stackCount = me.getStackCount();
            var datasetIndex = me.index;
            var isHorizontal = scale.isHorizontal();
            var start = isHorizontal ? scale.left : scale.top;
            var end = start + (isHorizontal ? scale.width : scale.height);
            var pixels = [];
            var i, ilen, min;
            for (i = 0, ilen = me.getMeta().data.length; i < ilen; ++i) {
                pixels.push(scale.getPixelForValue(null, i, datasetIndex));
            }
            min = helpers.isNullOrUndef(scale.options.barThickness) ? computeMinSampleSize(scale, pixels) : -1;
            return {
                min: min,
                pixels: pixels,
                start: start,
                end: end,
                stackCount: stackCount,
                scale: scale
            };
        },
        calculateBarValuePixels: function (datasetIndex, index) {
            var me = this;
            var chart = me.chart;
            var meta = me.getMeta();
            var scale = me._getValueScale();
            var isHorizontal = scale.isHorizontal();
            var datasets = chart.data.datasets;
            var value = +scale.getRightValue(datasets[datasetIndex].data[index]);
            var minBarLength = scale.options.minBarLength;
            var stacked = scale.options.stacked;
            var stack = meta.stack;
            var start = 0;
            var i, imeta, ivalue, base, head, size;
            if (stacked || stacked === undefined && stack !== undefined) {
                for (i = 0; i < datasetIndex; ++i) {
                    imeta = chart.getDatasetMeta(i);
                    if (imeta.bar && imeta.stack === stack && imeta.controller._getValueScaleId() === scale.id && chart.isDatasetVisible(i)) {
                        ivalue = +scale.getRightValue(datasets[i].data[index]);
                        if (value < 0 && ivalue < 0 || value >= 0 && ivalue > 0) {
                            start += ivalue;
                        }
                    }
                }
            }
            base = scale.getPixelForValue(start);
            head = scale.getPixelForValue(start + value);
            size = head - base;
            if (minBarLength !== undefined && Math.abs(size) < minBarLength) {
                size = minBarLength;
                if (value >= 0 && !isHorizontal || value < 0 && isHorizontal) {
                    head = base - minBarLength;
                } else {
                    head = base + minBarLength;
                }
            }
            return {
                size: size,
                base: base,
                head: head,
                center: head + size / 2
            };
        },
        calculateBarIndexPixels: function (datasetIndex, index, ruler) {
            var me = this;
            var options = ruler.scale.options;
            var range = options.barThickness === 'flex' ? computeFlexCategoryTraits(index, ruler, options) : computeFitCategoryTraits(index, ruler, options);
            var stackIndex = me.getStackIndex(datasetIndex, me.getMeta().stack);
            var center = range.start + range.chunk * stackIndex + range.chunk / 2;
            var size = Math.min(helpers.valueOrDefault(options.maxBarThickness, Infinity), range.chunk * range.ratio);
            return {
                base: center - size / 2,
                head: center + size / 2,
                center: center,
                size: size
            };
        },
        draw: function () {
            var me = this;
            var chart = me.chart;
            var scale = me._getValueScale();
            var rects = me.getMeta().data;
            var dataset = me.getDataset();
            var ilen = rects.length;
            var i = 0;
            helpers.canvas.clipArea(chart.ctx, chart.chartArea);
            for (; i < ilen; ++i) {
                if (!isNaN(scale.getRightValue(dataset.data[i]))) {
                    rects[i].draw();
                }
            }
            helpers.canvas.unclipArea(chart.ctx);
        },
        _resolveElementOptions: function (rectangle, index) {
            var me = this;
            var chart = me.chart;
            var datasets = chart.data.datasets;
            var dataset = datasets[me.index];
            var custom = rectangle.custom || {};
            var options = chart.options.elements.rectangle;
            var values = {};
            var i, ilen, key;
            var context = {
                chart: chart,
                dataIndex: index,
                dataset: dataset,
                datasetIndex: me.index
            };
            var keys = [
                'backgroundColor',
                'borderColor',
                'borderSkipped',
                'borderWidth'
            ];
            for (i = 0, ilen = keys.length; i < ilen; ++i) {
                key = keys[i];
                values[key] = resolve([
                    custom[key],
                    dataset[key],
                    options[key]
                ], context, index);
            }
            return values;
        }
    });
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/controllers/controller.bubble',[
    '../core/core.datasetController',
    '../core/core.defaults',
    '../elements/index',
    '../helpers/index'
], function (__module__0, __module__1, __module__2, __module__3) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var DatasetController = __module__0;
    var defaults = __module__1;
    var elements = __module__2;
    var helpers = __module__3;
    var valueOrDefault = helpers.valueOrDefault;
    var resolve = helpers.options.resolve;
    defaults._set('bubble', {
        hover: { mode: 'single' },
        scales: {
            xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    id: 'x-axis-0'
                }],
            yAxes: [{
                    type: 'linear',
                    position: 'left',
                    id: 'y-axis-0'
                }]
        },
        tooltips: {
            callbacks: {
                title: function () {
                    return '';
                },
                label: function (item, data) {
                    var datasetLabel = data.datasets[item.datasetIndex].label || '';
                    var dataPoint = data.datasets[item.datasetIndex].data[item.index];
                    return datasetLabel + ': (' + item.xLabel + ', ' + item.yLabel + ', ' + dataPoint.r + ')';
                }
            }
        }
    });
    module.exports = DatasetController.extend({
        dataElementType: elements.Point,
        update: function (reset) {
            var me = this;
            var meta = me.getMeta();
            var points = meta.data;
            helpers.each(points, function (point, index) {
                me.updateElement(point, index, reset);
            });
        },
        updateElement: function (point, index, reset) {
            var me = this;
            var meta = me.getMeta();
            var custom = point.custom || {};
            var xScale = me.getScaleForId(meta.xAxisID);
            var yScale = me.getScaleForId(meta.yAxisID);
            var options = me._resolveElementOptions(point, index);
            var data = me.getDataset().data[index];
            var dsIndex = me.index;
            var x = reset ? xScale.getPixelForDecimal(0.5) : xScale.getPixelForValue(typeof data === 'object' ? data : NaN, index, dsIndex);
            var y = reset ? yScale.getBasePixel() : yScale.getPixelForValue(data, index, dsIndex);
            point._xScale = xScale;
            point._yScale = yScale;
            point._options = options;
            point._datasetIndex = dsIndex;
            point._index = index;
            point._model = {
                backgroundColor: options.backgroundColor,
                borderColor: options.borderColor,
                borderWidth: options.borderWidth,
                hitRadius: options.hitRadius,
                pointStyle: options.pointStyle,
                rotation: options.rotation,
                radius: reset ? 0 : options.radius,
                skip: custom.skip || isNaN(x) || isNaN(y),
                x: x,
                y: y
            };
            point.pivot();
        },
        setHoverStyle: function (point) {
            var model = point._model;
            var options = point._options;
            var getHoverColor = helpers.getHoverColor;
            point.$previousStyle = {
                backgroundColor: model.backgroundColor,
                borderColor: model.borderColor,
                borderWidth: model.borderWidth,
                radius: model.radius
            };
            model.backgroundColor = valueOrDefault(options.hoverBackgroundColor, getHoverColor(options.backgroundColor));
            model.borderColor = valueOrDefault(options.hoverBorderColor, getHoverColor(options.borderColor));
            model.borderWidth = valueOrDefault(options.hoverBorderWidth, options.borderWidth);
            model.radius = options.radius + options.hoverRadius;
        },
        _resolveElementOptions: function (point, index) {
            var me = this;
            var chart = me.chart;
            var datasets = chart.data.datasets;
            var dataset = datasets[me.index];
            var custom = point.custom || {};
            var options = chart.options.elements.point;
            var data = dataset.data[index];
            var values = {};
            var i, ilen, key;
            var context = {
                chart: chart,
                dataIndex: index,
                dataset: dataset,
                datasetIndex: me.index
            };
            var keys = [
                'backgroundColor',
                'borderColor',
                'borderWidth',
                'hoverBackgroundColor',
                'hoverBorderColor',
                'hoverBorderWidth',
                'hoverRadius',
                'hitRadius',
                'pointStyle',
                'rotation'
            ];
            for (i = 0, ilen = keys.length; i < ilen; ++i) {
                key = keys[i];
                values[key] = resolve([
                    custom[key],
                    dataset[key],
                    options[key]
                ], context, index);
            }
            values.radius = resolve([
                custom.radius,
                data ? data.r : undefined,
                dataset.radius,
                options.radius
            ], context, index);
            return values;
        }
    });
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/controllers/controller.doughnut',[
    '../core/core.datasetController',
    '../core/core.defaults',
    '../elements/index',
    '../helpers/index'
], function (__module__0, __module__1, __module__2, __module__3) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var DatasetController = __module__0;
    var defaults = __module__1;
    var elements = __module__2;
    var helpers = __module__3;
    var resolve = helpers.options.resolve;
    var valueOrDefault = helpers.valueOrDefault;
    defaults._set('doughnut', {
        animation: {
            animateRotate: true,
            animateScale: false
        },
        hover: { mode: 'single' },
        legendCallback: function (chart) {
            var text = [];
            text.push('<ul class="' + chart.id + '-legend">');
            var data = chart.data;
            var datasets = data.datasets;
            var labels = data.labels;
            if (datasets.length) {
                for (var i = 0; i < datasets[0].data.length; ++i) {
                    text.push('<li><span style="background-color:' + datasets[0].backgroundColor[i] + '"></span>');
                    if (labels[i]) {
                        text.push(labels[i]);
                    }
                    text.push('</li>');
                }
            }
            text.push('</ul>');
            return text.join('');
        },
        legend: {
            labels: {
                generateLabels: function (chart) {
                    var data = chart.data;
                    if (data.labels.length && data.datasets.length) {
                        return data.labels.map(function (label, i) {
                            var meta = chart.getDatasetMeta(0);
                            var ds = data.datasets[0];
                            var arc = meta.data[i];
                            var custom = arc && arc.custom || {};
                            var arcOpts = chart.options.elements.arc;
                            var fill = resolve([
                                custom.backgroundColor,
                                ds.backgroundColor,
                                arcOpts.backgroundColor
                            ], undefined, i);
                            var stroke = resolve([
                                custom.borderColor,
                                ds.borderColor,
                                arcOpts.borderColor
                            ], undefined, i);
                            var bw = resolve([
                                custom.borderWidth,
                                ds.borderWidth,
                                arcOpts.borderWidth
                            ], undefined, i);
                            return {
                                text: label,
                                fillStyle: fill,
                                strokeStyle: stroke,
                                lineWidth: bw,
                                hidden: isNaN(ds.data[i]) || meta.data[i].hidden,
                                index: i
                            };
                        });
                    }
                    return [];
                }
            },
            onClick: function (e, legendItem) {
                var index = legendItem.index;
                var chart = this.chart;
                var i, ilen, meta;
                for (i = 0, ilen = (chart.data.datasets || []).length; i < ilen; ++i) {
                    meta = chart.getDatasetMeta(i);
                    if (meta.data[index]) {
                        meta.data[index].hidden = !meta.data[index].hidden;
                    }
                }
                chart.update();
            }
        },
        cutoutPercentage: 50,
        rotation: Math.PI * -0.5,
        circumference: Math.PI * 2,
        tooltips: {
            callbacks: {
                title: function () {
                    return '';
                },
                label: function (tooltipItem, data) {
                    var dataLabel = data.labels[tooltipItem.index];
                    var value = ': ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                    if (helpers.isArray(dataLabel)) {
                        dataLabel = dataLabel.slice();
                        dataLabel[0] += value;
                    } else {
                        dataLabel += value;
                    }
                    return dataLabel;
                }
            }
        }
    });
    module.exports = DatasetController.extend({
        dataElementType: elements.Arc,
        linkScales: helpers.noop,
        getRingIndex: function (datasetIndex) {
            var ringIndex = 0;
            for (var j = 0; j < datasetIndex; ++j) {
                if (this.chart.isDatasetVisible(j)) {
                    ++ringIndex;
                }
            }
            return ringIndex;
        },
        update: function (reset) {
            var me = this;
            var chart = me.chart;
            var chartArea = chart.chartArea;
            var opts = chart.options;
            var availableWidth = chartArea.right - chartArea.left;
            var availableHeight = chartArea.bottom - chartArea.top;
            var minSize = Math.min(availableWidth, availableHeight);
            var offset = {
                x: 0,
                y: 0
            };
            var meta = me.getMeta();
            var arcs = meta.data;
            var cutoutPercentage = opts.cutoutPercentage;
            var circumference = opts.circumference;
            var chartWeight = me._getRingWeight(me.index);
            var i, ilen;
            if (circumference < Math.PI * 2) {
                var startAngle = opts.rotation % (Math.PI * 2);
                startAngle += Math.PI * 2 * (startAngle >= Math.PI ? -1 : startAngle < -Math.PI ? 1 : 0);
                var endAngle = startAngle + circumference;
                var start = {
                    x: Math.cos(startAngle),
                    y: Math.sin(startAngle)
                };
                var end = {
                    x: Math.cos(endAngle),
                    y: Math.sin(endAngle)
                };
                var contains0 = startAngle <= 0 && endAngle >= 0 || startAngle <= Math.PI * 2 && Math.PI * 2 <= endAngle;
                var contains90 = startAngle <= Math.PI * 0.5 && Math.PI * 0.5 <= endAngle || startAngle <= Math.PI * 2.5 && Math.PI * 2.5 <= endAngle;
                var contains180 = startAngle <= -Math.PI && -Math.PI <= endAngle || startAngle <= Math.PI && Math.PI <= endAngle;
                var contains270 = startAngle <= -Math.PI * 0.5 && -Math.PI * 0.5 <= endAngle || startAngle <= Math.PI * 1.5 && Math.PI * 1.5 <= endAngle;
                var cutout = cutoutPercentage / 100;
                var min = {
                    x: contains180 ? -1 : Math.min(start.x * (start.x < 0 ? 1 : cutout), end.x * (end.x < 0 ? 1 : cutout)),
                    y: contains270 ? -1 : Math.min(start.y * (start.y < 0 ? 1 : cutout), end.y * (end.y < 0 ? 1 : cutout))
                };
                var max = {
                    x: contains0 ? 1 : Math.max(start.x * (start.x > 0 ? 1 : cutout), end.x * (end.x > 0 ? 1 : cutout)),
                    y: contains90 ? 1 : Math.max(start.y * (start.y > 0 ? 1 : cutout), end.y * (end.y > 0 ? 1 : cutout))
                };
                var size = {
                    width: (max.x - min.x) * 0.5,
                    height: (max.y - min.y) * 0.5
                };
                minSize = Math.min(availableWidth / size.width, availableHeight / size.height);
                offset = {
                    x: (max.x + min.x) * -0.5,
                    y: (max.y + min.y) * -0.5
                };
            }
            for (i = 0, ilen = arcs.length; i < ilen; ++i) {
                arcs[i]._options = me._resolveElementOptions(arcs[i], i);
            }
            chart.borderWidth = me.getMaxBorderWidth();
            chart.outerRadius = Math.max((minSize - chart.borderWidth) / 2, 0);
            chart.innerRadius = Math.max(cutoutPercentage ? chart.outerRadius / 100 * cutoutPercentage : 0, 0);
            chart.radiusLength = (chart.outerRadius - chart.innerRadius) / (me._getVisibleDatasetWeightTotal() || 1);
            chart.offsetX = offset.x * chart.outerRadius;
            chart.offsetY = offset.y * chart.outerRadius;
            meta.total = me.calculateTotal();
            me.outerRadius = chart.outerRadius - chart.radiusLength * me._getRingWeightOffset(me.index);
            me.innerRadius = Math.max(me.outerRadius - chart.radiusLength * chartWeight, 0);
            for (i = 0, ilen = arcs.length; i < ilen; ++i) {
                me.updateElement(arcs[i], i, reset);
            }
        },
        updateElement: function (arc, index, reset) {
            var me = this;
            var chart = me.chart;
            var chartArea = chart.chartArea;
            var opts = chart.options;
            var animationOpts = opts.animation;
            var centerX = (chartArea.left + chartArea.right) / 2;
            var centerY = (chartArea.top + chartArea.bottom) / 2;
            var startAngle = opts.rotation;
            var endAngle = opts.rotation;
            var dataset = me.getDataset();
            var circumference = reset && animationOpts.animateRotate ? 0 : arc.hidden ? 0 : me.calculateCircumference(dataset.data[index]) * (opts.circumference / (2 * Math.PI));
            var innerRadius = reset && animationOpts.animateScale ? 0 : me.innerRadius;
            var outerRadius = reset && animationOpts.animateScale ? 0 : me.outerRadius;
            var options = arc._options || {};
            helpers.extend(arc, {
                _datasetIndex: me.index,
                _index: index,
                _model: {
                    backgroundColor: options.backgroundColor,
                    borderColor: options.borderColor,
                    borderWidth: options.borderWidth,
                    borderAlign: options.borderAlign,
                    x: centerX + chart.offsetX,
                    y: centerY + chart.offsetY,
                    startAngle: startAngle,
                    endAngle: endAngle,
                    circumference: circumference,
                    outerRadius: outerRadius,
                    innerRadius: innerRadius,
                    label: helpers.valueAtIndexOrDefault(dataset.label, index, chart.data.labels[index])
                }
            });
            var model = arc._model;
            if (!reset || !animationOpts.animateRotate) {
                if (index === 0) {
                    model.startAngle = opts.rotation;
                } else {
                    model.startAngle = me.getMeta().data[index - 1]._model.endAngle;
                }
                model.endAngle = model.startAngle + model.circumference;
            }
            arc.pivot();
        },
        calculateTotal: function () {
            var dataset = this.getDataset();
            var meta = this.getMeta();
            var total = 0;
            var value;
            helpers.each(meta.data, function (element, index) {
                value = dataset.data[index];
                if (!isNaN(value) && !element.hidden) {
                    total += Math.abs(value);
                }
            });
            return total;
        },
        calculateCircumference: function (value) {
            var total = this.getMeta().total;
            if (total > 0 && !isNaN(value)) {
                return Math.PI * 2 * (Math.abs(value) / total);
            }
            return 0;
        },
        getMaxBorderWidth: function (arcs) {
            var me = this;
            var max = 0;
            var chart = me.chart;
            var i, ilen, meta, arc, controller, options, borderWidth, hoverWidth;
            if (!arcs) {
                for (i = 0, ilen = chart.data.datasets.length; i < ilen; ++i) {
                    if (chart.isDatasetVisible(i)) {
                        meta = chart.getDatasetMeta(i);
                        arcs = meta.data;
                        if (i !== me.index) {
                            controller = meta.controller;
                        }
                        break;
                    }
                }
            }
            if (!arcs) {
                return 0;
            }
            for (i = 0, ilen = arcs.length; i < ilen; ++i) {
                arc = arcs[i];
                options = controller ? controller._resolveElementOptions(arc, i) : arc._options;
                if (options.borderAlign !== 'inner') {
                    borderWidth = options.borderWidth;
                    hoverWidth = options.hoverBorderWidth;
                    max = borderWidth > max ? borderWidth : max;
                    max = hoverWidth > max ? hoverWidth : max;
                }
            }
            return max;
        },
        setHoverStyle: function (arc) {
            var model = arc._model;
            var options = arc._options;
            var getHoverColor = helpers.getHoverColor;
            arc.$previousStyle = {
                backgroundColor: model.backgroundColor,
                borderColor: model.borderColor,
                borderWidth: model.borderWidth
            };
            model.backgroundColor = valueOrDefault(options.hoverBackgroundColor, getHoverColor(options.backgroundColor));
            model.borderColor = valueOrDefault(options.hoverBorderColor, getHoverColor(options.borderColor));
            model.borderWidth = valueOrDefault(options.hoverBorderWidth, options.borderWidth);
        },
        _resolveElementOptions: function (arc, index) {
            var me = this;
            var chart = me.chart;
            var dataset = me.getDataset();
            var custom = arc.custom || {};
            var options = chart.options.elements.arc;
            var values = {};
            var i, ilen, key;
            var context = {
                chart: chart,
                dataIndex: index,
                dataset: dataset,
                datasetIndex: me.index
            };
            var keys = [
                'backgroundColor',
                'borderColor',
                'borderWidth',
                'borderAlign',
                'hoverBackgroundColor',
                'hoverBorderColor',
                'hoverBorderWidth'
            ];
            for (i = 0, ilen = keys.length; i < ilen; ++i) {
                key = keys[i];
                values[key] = resolve([
                    custom[key],
                    dataset[key],
                    options[key]
                ], context, index);
            }
            return values;
        },
        _getRingWeightOffset: function (datasetIndex) {
            var ringWeightOffset = 0;
            for (var i = 0; i < datasetIndex; ++i) {
                if (this.chart.isDatasetVisible(i)) {
                    ringWeightOffset += this._getRingWeight(i);
                }
            }
            return ringWeightOffset;
        },
        _getRingWeight: function (dataSetIndex) {
            return Math.max(valueOrDefault(this.chart.data.datasets[dataSetIndex].weight, 1), 0);
        },
        _getVisibleDatasetWeightTotal: function () {
            return this._getRingWeightOffset(this.chart.data.datasets.length);
        }
    });
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/controllers/controller.horizontalBar',[
    './controller.bar',
    '../core/core.defaults'
], function (__module__0, __module__1) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var BarController = __module__0;
    var defaults = __module__1;
    defaults._set('horizontalBar', {
        hover: {
            mode: 'index',
            axis: 'y'
        },
        scales: {
            xAxes: [{
                    type: 'linear',
                    position: 'bottom'
                }],
            yAxes: [{
                    type: 'category',
                    position: 'left',
                    categoryPercentage: 0.8,
                    barPercentage: 0.9,
                    offset: true,
                    gridLines: { offsetGridLines: true }
                }]
        },
        elements: { rectangle: { borderSkipped: 'left' } },
        tooltips: {
            mode: 'index',
            axis: 'y'
        }
    });
    module.exports = BarController.extend({
        _getValueScaleId: function () {
            return this.getMeta().xAxisID;
        },
        _getIndexScaleId: function () {
            return this.getMeta().yAxisID;
        }
    });
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/controllers/controller.line',[
    '../core/core.datasetController',
    '../core/core.defaults',
    '../elements/index',
    '../helpers/index'
], function (__module__0, __module__1, __module__2, __module__3) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var DatasetController = __module__0;
    var defaults = __module__1;
    var elements = __module__2;
    var helpers = __module__3;
    var valueOrDefault = helpers.valueOrDefault;
    var resolve = helpers.options.resolve;
    var isPointInArea = helpers.canvas._isPointInArea;
    defaults._set('line', {
        showLines: true,
        spanGaps: false,
        hover: { mode: 'label' },
        scales: {
            xAxes: [{
                    type: 'category',
                    id: 'x-axis-0'
                }],
            yAxes: [{
                    type: 'linear',
                    id: 'y-axis-0'
                }]
        }
    });
    function lineEnabled(dataset, options) {
        return valueOrDefault(dataset.showLine, options.showLines);
    }
    module.exports = DatasetController.extend({
        datasetElementType: elements.Line,
        dataElementType: elements.Point,
        update: function (reset) {
            var me = this;
            var meta = me.getMeta();
            var line = meta.dataset;
            var points = meta.data || [];
            var scale = me.getScaleForId(meta.yAxisID);
            var dataset = me.getDataset();
            var showLine = lineEnabled(dataset, me.chart.options);
            var i, ilen;
            if (showLine) {
                if (dataset.tension !== undefined && dataset.lineTension === undefined) {
                    dataset.lineTension = dataset.tension;
                }
                line._scale = scale;
                line._datasetIndex = me.index;
                line._children = points;
                line._model = me._resolveLineOptions(line);
                line.pivot();
            }
            for (i = 0, ilen = points.length; i < ilen; ++i) {
                me.updateElement(points[i], i, reset);
            }
            if (showLine && line._model.tension !== 0) {
                me.updateBezierControlPoints();
            }
            for (i = 0, ilen = points.length; i < ilen; ++i) {
                points[i].pivot();
            }
        },
        updateElement: function (point, index, reset) {
            var me = this;
            var meta = me.getMeta();
            var custom = point.custom || {};
            var dataset = me.getDataset();
            var datasetIndex = me.index;
            var value = dataset.data[index];
            var yScale = me.getScaleForId(meta.yAxisID);
            var xScale = me.getScaleForId(meta.xAxisID);
            var lineModel = meta.dataset._model;
            var x, y;
            var options = me._resolvePointOptions(point, index);
            x = xScale.getPixelForValue(typeof value === 'object' ? value : NaN, index, datasetIndex);
            y = reset ? yScale.getBasePixel() : me.calculatePointY(value, index, datasetIndex);
            point._xScale = xScale;
            point._yScale = yScale;
            point._options = options;
            point._datasetIndex = datasetIndex;
            point._index = index;
            point._model = {
                x: x,
                y: y,
                skip: custom.skip || isNaN(x) || isNaN(y),
                radius: options.radius,
                pointStyle: options.pointStyle,
                rotation: options.rotation,
                backgroundColor: options.backgroundColor,
                borderColor: options.borderColor,
                borderWidth: options.borderWidth,
                tension: valueOrDefault(custom.tension, lineModel ? lineModel.tension : 0),
                steppedLine: lineModel ? lineModel.steppedLine : false,
                hitRadius: options.hitRadius
            };
        },
        _resolvePointOptions: function (element, index) {
            var me = this;
            var chart = me.chart;
            var dataset = chart.data.datasets[me.index];
            var custom = element.custom || {};
            var options = chart.options.elements.point;
            var values = {};
            var i, ilen, key;
            var context = {
                chart: chart,
                dataIndex: index,
                dataset: dataset,
                datasetIndex: me.index
            };
            var ELEMENT_OPTIONS = {
                backgroundColor: 'pointBackgroundColor',
                borderColor: 'pointBorderColor',
                borderWidth: 'pointBorderWidth',
                hitRadius: 'pointHitRadius',
                hoverBackgroundColor: 'pointHoverBackgroundColor',
                hoverBorderColor: 'pointHoverBorderColor',
                hoverBorderWidth: 'pointHoverBorderWidth',
                hoverRadius: 'pointHoverRadius',
                pointStyle: 'pointStyle',
                radius: 'pointRadius',
                rotation: 'pointRotation'
            };
            var keys = Object.keys(ELEMENT_OPTIONS);
            for (i = 0, ilen = keys.length; i < ilen; ++i) {
                key = keys[i];
                values[key] = resolve([
                    custom[key],
                    dataset[ELEMENT_OPTIONS[key]],
                    dataset[key],
                    options[key]
                ], context, index);
            }
            return values;
        },
        _resolveLineOptions: function (element) {
            var me = this;
            var chart = me.chart;
            var dataset = chart.data.datasets[me.index];
            var custom = element.custom || {};
            var options = chart.options;
            var elementOptions = options.elements.line;
            var values = {};
            var i, ilen, key;
            var keys = [
                'backgroundColor',
                'borderWidth',
                'borderColor',
                'borderCapStyle',
                'borderDash',
                'borderDashOffset',
                'borderJoinStyle',
                'fill',
                'cubicInterpolationMode'
            ];
            for (i = 0, ilen = keys.length; i < ilen; ++i) {
                key = keys[i];
                values[key] = resolve([
                    custom[key],
                    dataset[key],
                    elementOptions[key]
                ]);
            }
            values.spanGaps = valueOrDefault(dataset.spanGaps, options.spanGaps);
            values.tension = valueOrDefault(dataset.lineTension, elementOptions.tension);
            values.steppedLine = resolve([
                custom.steppedLine,
                dataset.steppedLine,
                elementOptions.stepped
            ]);
            return values;
        },
        calculatePointY: function (value, index, datasetIndex) {
            var me = this;
            var chart = me.chart;
            var meta = me.getMeta();
            var yScale = me.getScaleForId(meta.yAxisID);
            var sumPos = 0;
            var sumNeg = 0;
            var i, ds, dsMeta;
            if (yScale.options.stacked) {
                for (i = 0; i < datasetIndex; i++) {
                    ds = chart.data.datasets[i];
                    dsMeta = chart.getDatasetMeta(i);
                    if (dsMeta.type === 'line' && dsMeta.yAxisID === yScale.id && chart.isDatasetVisible(i)) {
                        var stackedRightValue = Number(yScale.getRightValue(ds.data[index]));
                        if (stackedRightValue < 0) {
                            sumNeg += stackedRightValue || 0;
                        } else {
                            sumPos += stackedRightValue || 0;
                        }
                    }
                }
                var rightValue = Number(yScale.getRightValue(value));
                if (rightValue < 0) {
                    return yScale.getPixelForValue(sumNeg + rightValue);
                }
                return yScale.getPixelForValue(sumPos + rightValue);
            }
            return yScale.getPixelForValue(value);
        },
        updateBezierControlPoints: function () {
            var me = this;
            var chart = me.chart;
            var meta = me.getMeta();
            var lineModel = meta.dataset._model;
            var area = chart.chartArea;
            var points = meta.data || [];
            var i, ilen, model, controlPoints;
            if (lineModel.spanGaps) {
                points = points.filter(function (pt) {
                    return !pt._model.skip;
                });
            }
            function capControlPoint(pt, min, max) {
                return Math.max(Math.min(pt, max), min);
            }
            if (lineModel.cubicInterpolationMode === 'monotone') {
                helpers.splineCurveMonotone(points);
            } else {
                for (i = 0, ilen = points.length; i < ilen; ++i) {
                    model = points[i]._model;
                    controlPoints = helpers.splineCurve(helpers.previousItem(points, i)._model, model, helpers.nextItem(points, i)._model, lineModel.tension);
                    model.controlPointPreviousX = controlPoints.previous.x;
                    model.controlPointPreviousY = controlPoints.previous.y;
                    model.controlPointNextX = controlPoints.next.x;
                    model.controlPointNextY = controlPoints.next.y;
                }
            }
            if (chart.options.elements.line.capBezierPoints) {
                for (i = 0, ilen = points.length; i < ilen; ++i) {
                    model = points[i]._model;
                    if (isPointInArea(model, area)) {
                        if (i > 0 && isPointInArea(points[i - 1]._model, area)) {
                            model.controlPointPreviousX = capControlPoint(model.controlPointPreviousX, area.left, area.right);
                            model.controlPointPreviousY = capControlPoint(model.controlPointPreviousY, area.top, area.bottom);
                        }
                        if (i < points.length - 1 && isPointInArea(points[i + 1]._model, area)) {
                            model.controlPointNextX = capControlPoint(model.controlPointNextX, area.left, area.right);
                            model.controlPointNextY = capControlPoint(model.controlPointNextY, area.top, area.bottom);
                        }
                    }
                }
            }
        },
        draw: function () {
            var me = this;
            var chart = me.chart;
            var meta = me.getMeta();
            var points = meta.data || [];
            var area = chart.chartArea;
            var ilen = points.length;
            var halfBorderWidth;
            var i = 0;
            if (lineEnabled(me.getDataset(), chart.options)) {
                halfBorderWidth = (meta.dataset._model.borderWidth || 0) / 2;
                helpers.canvas.clipArea(chart.ctx, {
                    left: area.left,
                    right: area.right,
                    top: area.top - halfBorderWidth,
                    bottom: area.bottom + halfBorderWidth
                });
                meta.dataset.draw();
                helpers.canvas.unclipArea(chart.ctx);
            }
            for (; i < ilen; ++i) {
                points[i].draw(area);
            }
        },
        setHoverStyle: function (point) {
            var model = point._model;
            var options = point._options;
            var getHoverColor = helpers.getHoverColor;
            point.$previousStyle = {
                backgroundColor: model.backgroundColor,
                borderColor: model.borderColor,
                borderWidth: model.borderWidth,
                radius: model.radius
            };
            model.backgroundColor = valueOrDefault(options.hoverBackgroundColor, getHoverColor(options.backgroundColor));
            model.borderColor = valueOrDefault(options.hoverBorderColor, getHoverColor(options.borderColor));
            model.borderWidth = valueOrDefault(options.hoverBorderWidth, options.borderWidth);
            model.radius = valueOrDefault(options.hoverRadius, options.radius);
        }
    });
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/controllers/controller.polarArea',[
    '../core/core.datasetController',
    '../core/core.defaults',
    '../elements/index',
    '../helpers/index'
], function (__module__0, __module__1, __module__2, __module__3) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var DatasetController = __module__0;
    var defaults = __module__1;
    var elements = __module__2;
    var helpers = __module__3;
    var resolve = helpers.options.resolve;
    defaults._set('polarArea', {
        scale: {
            type: 'radialLinear',
            angleLines: { display: false },
            gridLines: { circular: true },
            pointLabels: { display: false },
            ticks: { beginAtZero: true }
        },
        animation: {
            animateRotate: true,
            animateScale: true
        },
        startAngle: -0.5 * Math.PI,
        legendCallback: function (chart) {
            var text = [];
            text.push('<ul class="' + chart.id + '-legend">');
            var data = chart.data;
            var datasets = data.datasets;
            var labels = data.labels;
            if (datasets.length) {
                for (var i = 0; i < datasets[0].data.length; ++i) {
                    text.push('<li><span style="background-color:' + datasets[0].backgroundColor[i] + '"></span>');
                    if (labels[i]) {
                        text.push(labels[i]);
                    }
                    text.push('</li>');
                }
            }
            text.push('</ul>');
            return text.join('');
        },
        legend: {
            labels: {
                generateLabels: function (chart) {
                    var data = chart.data;
                    if (data.labels.length && data.datasets.length) {
                        return data.labels.map(function (label, i) {
                            var meta = chart.getDatasetMeta(0);
                            var ds = data.datasets[0];
                            var arc = meta.data[i];
                            var custom = arc.custom || {};
                            var arcOpts = chart.options.elements.arc;
                            var fill = resolve([
                                custom.backgroundColor,
                                ds.backgroundColor,
                                arcOpts.backgroundColor
                            ], undefined, i);
                            var stroke = resolve([
                                custom.borderColor,
                                ds.borderColor,
                                arcOpts.borderColor
                            ], undefined, i);
                            var bw = resolve([
                                custom.borderWidth,
                                ds.borderWidth,
                                arcOpts.borderWidth
                            ], undefined, i);
                            return {
                                text: label,
                                fillStyle: fill,
                                strokeStyle: stroke,
                                lineWidth: bw,
                                hidden: isNaN(ds.data[i]) || meta.data[i].hidden,
                                index: i
                            };
                        });
                    }
                    return [];
                }
            },
            onClick: function (e, legendItem) {
                var index = legendItem.index;
                var chart = this.chart;
                var i, ilen, meta;
                for (i = 0, ilen = (chart.data.datasets || []).length; i < ilen; ++i) {
                    meta = chart.getDatasetMeta(i);
                    meta.data[index].hidden = !meta.data[index].hidden;
                }
                chart.update();
            }
        },
        tooltips: {
            callbacks: {
                title: function () {
                    return '';
                },
                label: function (item, data) {
                    return data.labels[item.index] + ': ' + item.yLabel;
                }
            }
        }
    });
    module.exports = DatasetController.extend({
        dataElementType: elements.Arc,
        linkScales: helpers.noop,
        update: function (reset) {
            var me = this;
            var dataset = me.getDataset();
            var meta = me.getMeta();
            var start = me.chart.options.startAngle || 0;
            var starts = me._starts = [];
            var angles = me._angles = [];
            var arcs = meta.data;
            var i, ilen, angle;
            me._updateRadius();
            meta.count = me.countVisibleElements();
            for (i = 0, ilen = dataset.data.length; i < ilen; i++) {
                starts[i] = start;
                angle = me._computeAngle(i);
                angles[i] = angle;
                start += angle;
            }
            for (i = 0, ilen = arcs.length; i < ilen; ++i) {
                arcs[i]._options = me._resolveElementOptions(arcs[i], i);
                me.updateElement(arcs[i], i, reset);
            }
        },
        _updateRadius: function () {
            var me = this;
            var chart = me.chart;
            var chartArea = chart.chartArea;
            var opts = chart.options;
            var minSize = Math.min(chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
            chart.outerRadius = Math.max(minSize / 2, 0);
            chart.innerRadius = Math.max(opts.cutoutPercentage ? chart.outerRadius / 100 * opts.cutoutPercentage : 1, 0);
            chart.radiusLength = (chart.outerRadius - chart.innerRadius) / chart.getVisibleDatasetCount();
            me.outerRadius = chart.outerRadius - chart.radiusLength * me.index;
            me.innerRadius = me.outerRadius - chart.radiusLength;
        },
        updateElement: function (arc, index, reset) {
            var me = this;
            var chart = me.chart;
            var dataset = me.getDataset();
            var opts = chart.options;
            var animationOpts = opts.animation;
            var scale = chart.scale;
            var labels = chart.data.labels;
            var centerX = scale.xCenter;
            var centerY = scale.yCenter;
            var datasetStartAngle = opts.startAngle;
            var distance = arc.hidden ? 0 : scale.getDistanceFromCenterForValue(dataset.data[index]);
            var startAngle = me._starts[index];
            var endAngle = startAngle + (arc.hidden ? 0 : me._angles[index]);
            var resetRadius = animationOpts.animateScale ? 0 : scale.getDistanceFromCenterForValue(dataset.data[index]);
            var options = arc._options || {};
            helpers.extend(arc, {
                _datasetIndex: me.index,
                _index: index,
                _scale: scale,
                _model: {
                    backgroundColor: options.backgroundColor,
                    borderColor: options.borderColor,
                    borderWidth: options.borderWidth,
                    borderAlign: options.borderAlign,
                    x: centerX,
                    y: centerY,
                    innerRadius: 0,
                    outerRadius: reset ? resetRadius : distance,
                    startAngle: reset && animationOpts.animateRotate ? datasetStartAngle : startAngle,
                    endAngle: reset && animationOpts.animateRotate ? datasetStartAngle : endAngle,
                    label: helpers.valueAtIndexOrDefault(labels, index, labels[index])
                }
            });
            arc.pivot();
        },
        countVisibleElements: function () {
            var dataset = this.getDataset();
            var meta = this.getMeta();
            var count = 0;
            helpers.each(meta.data, function (element, index) {
                if (!isNaN(dataset.data[index]) && !element.hidden) {
                    count++;
                }
            });
            return count;
        },
        setHoverStyle: function (arc) {
            var model = arc._model;
            var options = arc._options;
            var getHoverColor = helpers.getHoverColor;
            var valueOrDefault = helpers.valueOrDefault;
            arc.$previousStyle = {
                backgroundColor: model.backgroundColor,
                borderColor: model.borderColor,
                borderWidth: model.borderWidth
            };
            model.backgroundColor = valueOrDefault(options.hoverBackgroundColor, getHoverColor(options.backgroundColor));
            model.borderColor = valueOrDefault(options.hoverBorderColor, getHoverColor(options.borderColor));
            model.borderWidth = valueOrDefault(options.hoverBorderWidth, options.borderWidth);
        },
        _resolveElementOptions: function (arc, index) {
            var me = this;
            var chart = me.chart;
            var dataset = me.getDataset();
            var custom = arc.custom || {};
            var options = chart.options.elements.arc;
            var values = {};
            var i, ilen, key;
            var context = {
                chart: chart,
                dataIndex: index,
                dataset: dataset,
                datasetIndex: me.index
            };
            var keys = [
                'backgroundColor',
                'borderColor',
                'borderWidth',
                'borderAlign',
                'hoverBackgroundColor',
                'hoverBorderColor',
                'hoverBorderWidth'
            ];
            for (i = 0, ilen = keys.length; i < ilen; ++i) {
                key = keys[i];
                values[key] = resolve([
                    custom[key],
                    dataset[key],
                    options[key]
                ], context, index);
            }
            return values;
        },
        _computeAngle: function (index) {
            var me = this;
            var count = this.getMeta().count;
            var dataset = me.getDataset();
            var meta = me.getMeta();
            if (isNaN(dataset.data[index]) || meta.data[index].hidden) {
                return 0;
            }
            var context = {
                chart: me.chart,
                dataIndex: index,
                dataset: dataset,
                datasetIndex: me.index
            };
            return resolve([
                me.chart.options.elements.arc.angle,
                2 * Math.PI / count
            ], context, index);
        }
    });
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/controllers/controller.pie',[
    './controller.doughnut',
    '../core/core.defaults',
    '../helpers/index'
], function (__module__0, __module__1, __module__2) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var DoughnutController = __module__0;
    var defaults = __module__1;
    var helpers = __module__2;
    defaults._set('pie', helpers.clone(defaults.doughnut));
    defaults._set('pie', { cutoutPercentage: 0 });
    module.exports = DoughnutController;
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/controllers/controller.radar',[
    '../core/core.datasetController',
    '../core/core.defaults',
    '../elements/index',
    '../helpers/index'
], function (__module__0, __module__1, __module__2, __module__3) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var DatasetController = __module__0;
    var defaults = __module__1;
    var elements = __module__2;
    var helpers = __module__3;
    var valueOrDefault = helpers.valueOrDefault;
    var resolve = helpers.options.resolve;
    defaults._set('radar', {
        scale: { type: 'radialLinear' },
        elements: { line: { tension: 0 } }
    });
    module.exports = DatasetController.extend({
        datasetElementType: elements.Line,
        dataElementType: elements.Point,
        linkScales: helpers.noop,
        update: function (reset) {
            var me = this;
            var meta = me.getMeta();
            var line = meta.dataset;
            var points = meta.data || [];
            var scale = me.chart.scale;
            var dataset = me.getDataset();
            var i, ilen;
            if (dataset.tension !== undefined && dataset.lineTension === undefined) {
                dataset.lineTension = dataset.tension;
            }
            line._scale = scale;
            line._datasetIndex = me.index;
            line._children = points;
            line._loop = true;
            line._model = me._resolveLineOptions(line);
            line.pivot();
            for (i = 0, ilen = points.length; i < ilen; ++i) {
                me.updateElement(points[i], i, reset);
            }
            me.updateBezierControlPoints();
            for (i = 0, ilen = points.length; i < ilen; ++i) {
                points[i].pivot();
            }
        },
        updateElement: function (point, index, reset) {
            var me = this;
            var custom = point.custom || {};
            var dataset = me.getDataset();
            var scale = me.chart.scale;
            var pointPosition = scale.getPointPositionForValue(index, dataset.data[index]);
            var options = me._resolvePointOptions(point, index);
            var lineModel = me.getMeta().dataset._model;
            var x = reset ? scale.xCenter : pointPosition.x;
            var y = reset ? scale.yCenter : pointPosition.y;
            point._scale = scale;
            point._options = options;
            point._datasetIndex = me.index;
            point._index = index;
            point._model = {
                x: x,
                y: y,
                skip: custom.skip || isNaN(x) || isNaN(y),
                radius: options.radius,
                pointStyle: options.pointStyle,
                rotation: options.rotation,
                backgroundColor: options.backgroundColor,
                borderColor: options.borderColor,
                borderWidth: options.borderWidth,
                tension: valueOrDefault(custom.tension, lineModel ? lineModel.tension : 0),
                hitRadius: options.hitRadius
            };
        },
        _resolvePointOptions: function (element, index) {
            var me = this;
            var chart = me.chart;
            var dataset = chart.data.datasets[me.index];
            var custom = element.custom || {};
            var options = chart.options.elements.point;
            var values = {};
            var i, ilen, key;
            var context = {
                chart: chart,
                dataIndex: index,
                dataset: dataset,
                datasetIndex: me.index
            };
            var ELEMENT_OPTIONS = {
                backgroundColor: 'pointBackgroundColor',
                borderColor: 'pointBorderColor',
                borderWidth: 'pointBorderWidth',
                hitRadius: 'pointHitRadius',
                hoverBackgroundColor: 'pointHoverBackgroundColor',
                hoverBorderColor: 'pointHoverBorderColor',
                hoverBorderWidth: 'pointHoverBorderWidth',
                hoverRadius: 'pointHoverRadius',
                pointStyle: 'pointStyle',
                radius: 'pointRadius',
                rotation: 'pointRotation'
            };
            var keys = Object.keys(ELEMENT_OPTIONS);
            for (i = 0, ilen = keys.length; i < ilen; ++i) {
                key = keys[i];
                values[key] = resolve([
                    custom[key],
                    dataset[ELEMENT_OPTIONS[key]],
                    dataset[key],
                    options[key]
                ], context, index);
            }
            return values;
        },
        _resolveLineOptions: function (element) {
            var me = this;
            var chart = me.chart;
            var dataset = chart.data.datasets[me.index];
            var custom = element.custom || {};
            var options = chart.options.elements.line;
            var values = {};
            var i, ilen, key;
            var keys = [
                'backgroundColor',
                'borderWidth',
                'borderColor',
                'borderCapStyle',
                'borderDash',
                'borderDashOffset',
                'borderJoinStyle',
                'fill'
            ];
            for (i = 0, ilen = keys.length; i < ilen; ++i) {
                key = keys[i];
                values[key] = resolve([
                    custom[key],
                    dataset[key],
                    options[key]
                ]);
            }
            values.tension = valueOrDefault(dataset.lineTension, options.tension);
            return values;
        },
        updateBezierControlPoints: function () {
            var me = this;
            var meta = me.getMeta();
            var area = me.chart.chartArea;
            var points = meta.data || [];
            var i, ilen, model, controlPoints;
            function capControlPoint(pt, min, max) {
                return Math.max(Math.min(pt, max), min);
            }
            for (i = 0, ilen = points.length; i < ilen; ++i) {
                model = points[i]._model;
                controlPoints = helpers.splineCurve(helpers.previousItem(points, i, true)._model, model, helpers.nextItem(points, i, true)._model, model.tension);
                model.controlPointPreviousX = capControlPoint(controlPoints.previous.x, area.left, area.right);
                model.controlPointPreviousY = capControlPoint(controlPoints.previous.y, area.top, area.bottom);
                model.controlPointNextX = capControlPoint(controlPoints.next.x, area.left, area.right);
                model.controlPointNextY = capControlPoint(controlPoints.next.y, area.top, area.bottom);
            }
        },
        setHoverStyle: function (point) {
            var model = point._model;
            var options = point._options;
            var getHoverColor = helpers.getHoverColor;
            point.$previousStyle = {
                backgroundColor: model.backgroundColor,
                borderColor: model.borderColor,
                borderWidth: model.borderWidth,
                radius: model.radius
            };
            model.backgroundColor = valueOrDefault(options.hoverBackgroundColor, getHoverColor(options.backgroundColor));
            model.borderColor = valueOrDefault(options.hoverBorderColor, getHoverColor(options.borderColor));
            model.borderWidth = valueOrDefault(options.hoverBorderWidth, options.borderWidth);
            model.radius = valueOrDefault(options.hoverRadius, options.radius);
        }
    });
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/controllers/controller.scatter',[
    './controller.line',
    '../core/core.defaults'
], function (__module__0, __module__1) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var LineController = __module__0;
    var defaults = __module__1;
    defaults._set('scatter', {
        hover: { mode: 'single' },
        scales: {
            xAxes: [{
                    id: 'x-axis-1',
                    type: 'linear',
                    position: 'bottom'
                }],
            yAxes: [{
                    id: 'y-axis-1',
                    type: 'linear',
                    position: 'left'
                }]
        },
        showLines: false,
        tooltips: {
            callbacks: {
                title: function () {
                    return '';
                },
                label: function (item) {
                    return '(' + item.xLabel + ', ' + item.yLabel + ')';
                }
            }
        }
    });
    module.exports = LineController;
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/controllers/index',[
    './controller.bar',
    './controller.bubble',
    './controller.doughnut',
    './controller.horizontalBar',
    './controller.line',
    './controller.polarArea',
    './controller.pie',
    './controller.radar',
    './controller.scatter'
], function (__module__0, __module__1, __module__2, __module__3, __module__4, __module__5, __module__6, __module__7, __module__8) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var bar = __module__0;
    var bubble = __module__1;
    var doughnut = __module__2;
    var horizontalBar = __module__3;
    var line = __module__4;
    var polarArea = __module__5;
    var pie = __module__6;
    var radar = __module__7;
    var scatter = __module__8;
    module.exports = {
        bar: bar,
        bubble: bubble,
        doughnut: doughnut,
        horizontalBar: horizontalBar,
        line: line,
        polarArea: polarArea,
        pie: pie,
        radar: radar,
        scatter: scatter
    };
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/core/core.interaction',['../helpers/index'], function (__module__0) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var helpers = __module__0;
    function getRelativePosition(e, chart) {
        if (e.native) {
            return {
                x: e.x,
                y: e.y
            };
        }
        return helpers.getRelativePosition(e, chart);
    }
    function parseVisibleItems(chart, handler) {
        var datasets = chart.data.datasets;
        var meta, i, j, ilen, jlen;
        for (i = 0, ilen = datasets.length; i < ilen; ++i) {
            if (!chart.isDatasetVisible(i)) {
                continue;
            }
            meta = chart.getDatasetMeta(i);
            for (j = 0, jlen = meta.data.length; j < jlen; ++j) {
                var element = meta.data[j];
                if (!element._view.skip) {
                    handler(element);
                }
            }
        }
    }
    function getIntersectItems(chart, position) {
        var elements = [];
        parseVisibleItems(chart, function (element) {
            if (element.inRange(position.x, position.y)) {
                elements.push(element);
            }
        });
        return elements;
    }
    function getNearestItems(chart, position, intersect, distanceMetric) {
        var minDistance = Number.POSITIVE_INFINITY;
        var nearestItems = [];
        parseVisibleItems(chart, function (element) {
            if (intersect && !element.inRange(position.x, position.y)) {
                return;
            }
            var center = element.getCenterPoint();
            var distance = distanceMetric(position, center);
            if (distance < minDistance) {
                nearestItems = [element];
                minDistance = distance;
            } else if (distance === minDistance) {
                nearestItems.push(element);
            }
        });
        return nearestItems;
    }
    function getDistanceMetricForAxis(axis) {
        var useX = axis.indexOf('x') !== -1;
        var useY = axis.indexOf('y') !== -1;
        return function (pt1, pt2) {
            var deltaX = useX ? Math.abs(pt1.x - pt2.x) : 0;
            var deltaY = useY ? Math.abs(pt1.y - pt2.y) : 0;
            return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
        };
    }
    function indexMode(chart, e, options) {
        var position = getRelativePosition(e, chart);
        options.axis = options.axis || 'x';
        var distanceMetric = getDistanceMetricForAxis(options.axis);
        var items = options.intersect ? getIntersectItems(chart, position) : getNearestItems(chart, position, false, distanceMetric);
        var elements = [];
        if (!items.length) {
            return [];
        }
        chart.data.datasets.forEach(function (dataset, datasetIndex) {
            if (chart.isDatasetVisible(datasetIndex)) {
                var meta = chart.getDatasetMeta(datasetIndex);
                var element = meta.data[items[0]._index];
                if (element && !element._view.skip) {
                    elements.push(element);
                }
            }
        });
        return elements;
    }
    module.exports = {
        modes: {
            single: function (chart, e) {
                var position = getRelativePosition(e, chart);
                var elements = [];
                parseVisibleItems(chart, function (element) {
                    if (element.inRange(position.x, position.y)) {
                        elements.push(element);
                        return elements;
                    }
                });
                return elements.slice(0, 1);
            },
            label: indexMode,
            index: indexMode,
            dataset: function (chart, e, options) {
                var position = getRelativePosition(e, chart);
                options.axis = options.axis || 'xy';
                var distanceMetric = getDistanceMetricForAxis(options.axis);
                var items = options.intersect ? getIntersectItems(chart, position) : getNearestItems(chart, position, false, distanceMetric);
                if (items.length > 0) {
                    items = chart.getDatasetMeta(items[0]._datasetIndex).data;
                }
                return items;
            },
            'x-axis': function (chart, e) {
                return indexMode(chart, e, { intersect: false });
            },
            point: function (chart, e) {
                var position = getRelativePosition(e, chart);
                return getIntersectItems(chart, position);
            },
            nearest: function (chart, e, options) {
                var position = getRelativePosition(e, chart);
                options.axis = options.axis || 'xy';
                var distanceMetric = getDistanceMetricForAxis(options.axis);
                return getNearestItems(chart, position, options.intersect, distanceMetric);
            },
            x: function (chart, e, options) {
                var position = getRelativePosition(e, chart);
                var items = [];
                var intersectsItem = false;
                parseVisibleItems(chart, function (element) {
                    if (element.inXRange(position.x)) {
                        items.push(element);
                    }
                    if (element.inRange(position.x, position.y)) {
                        intersectsItem = true;
                    }
                });
                if (options.intersect && !intersectsItem) {
                    items = [];
                }
                return items;
            },
            y: function (chart, e, options) {
                var position = getRelativePosition(e, chart);
                var items = [];
                var intersectsItem = false;
                parseVisibleItems(chart, function (element) {
                    if (element.inYRange(position.y)) {
                        items.push(element);
                    }
                    if (element.inRange(position.x, position.y)) {
                        intersectsItem = true;
                    }
                });
                if (options.intersect && !intersectsItem) {
                    items = [];
                }
                return items;
            }
        }
    };
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/core/core.layouts',[
    './core.defaults',
    '../helpers/index'
], function (__module__0, __module__1) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var defaults = __module__0;
    var helpers = __module__1;
    function filterByPosition(array, position) {
        return helpers.where(array, function (v) {
            return v.position === position;
        });
    }
    function sortByWeight(array, reverse) {
        array.forEach(function (v, i) {
            v._tmpIndex_ = i;
            return v;
        });
        array.sort(function (a, b) {
            var v0 = reverse ? b : a;
            var v1 = reverse ? a : b;
            return v0.weight === v1.weight ? v0._tmpIndex_ - v1._tmpIndex_ : v0.weight - v1.weight;
        });
        array.forEach(function (v) {
            delete v._tmpIndex_;
        });
    }
    function findMaxPadding(boxes) {
        var top = 0;
        var left = 0;
        var bottom = 0;
        var right = 0;
        helpers.each(boxes, function (box) {
            if (box.getPadding) {
                var boxPadding = box.getPadding();
                top = Math.max(top, boxPadding.top);
                left = Math.max(left, boxPadding.left);
                bottom = Math.max(bottom, boxPadding.bottom);
                right = Math.max(right, boxPadding.right);
            }
        });
        return {
            top: top,
            left: left,
            bottom: bottom,
            right: right
        };
    }
    function addSizeByPosition(boxes, size) {
        helpers.each(boxes, function (box) {
            size[box.position] += box.isHorizontal() ? box.height : box.width;
        });
    }
    defaults._set('global', {
        layout: {
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            }
        }
    });
    module.exports = {
        defaults: {},
        addBox: function (chart, item) {
            if (!chart.boxes) {
                chart.boxes = [];
            }
            item.fullWidth = item.fullWidth || false;
            item.position = item.position || 'top';
            item.weight = item.weight || 0;
            chart.boxes.push(item);
        },
        removeBox: function (chart, layoutItem) {
            var index = chart.boxes ? chart.boxes.indexOf(layoutItem) : -1;
            if (index !== -1) {
                chart.boxes.splice(index, 1);
            }
        },
        configure: function (chart, item, options) {
            var props = [
                'fullWidth',
                'position',
                'weight'
            ];
            var ilen = props.length;
            var i = 0;
            var prop;
            for (; i < ilen; ++i) {
                prop = props[i];
                if (options.hasOwnProperty(prop)) {
                    item[prop] = options[prop];
                }
            }
        },
        update: function (chart, width, height) {
            if (!chart) {
                return;
            }
            var layoutOptions = chart.options.layout || {};
            var padding = helpers.options.toPadding(layoutOptions.padding);
            var leftPadding = padding.left;
            var rightPadding = padding.right;
            var topPadding = padding.top;
            var bottomPadding = padding.bottom;
            var leftBoxes = filterByPosition(chart.boxes, 'left');
            var rightBoxes = filterByPosition(chart.boxes, 'right');
            var topBoxes = filterByPosition(chart.boxes, 'top');
            var bottomBoxes = filterByPosition(chart.boxes, 'bottom');
            var chartAreaBoxes = filterByPosition(chart.boxes, 'chartArea');
            sortByWeight(leftBoxes, true);
            sortByWeight(rightBoxes, false);
            sortByWeight(topBoxes, true);
            sortByWeight(bottomBoxes, false);
            var verticalBoxes = leftBoxes.concat(rightBoxes);
            var horizontalBoxes = topBoxes.concat(bottomBoxes);
            var outerBoxes = verticalBoxes.concat(horizontalBoxes);
            var chartWidth = width - leftPadding - rightPadding;
            var chartHeight = height - topPadding - bottomPadding;
            var chartAreaWidth = chartWidth / 2;
            var verticalBoxWidth = (width - chartAreaWidth) / verticalBoxes.length;
            var maxChartAreaWidth = chartWidth;
            var maxChartAreaHeight = chartHeight;
            var outerBoxSizes = {
                top: topPadding,
                left: leftPadding,
                bottom: bottomPadding,
                right: rightPadding
            };
            var minBoxSizes = [];
            var maxPadding;
            function getMinimumBoxSize(box) {
                var minSize;
                var isHorizontal = box.isHorizontal();
                if (isHorizontal) {
                    minSize = box.update(box.fullWidth ? chartWidth : maxChartAreaWidth, chartHeight / 2);
                    maxChartAreaHeight -= minSize.height;
                } else {
                    minSize = box.update(verticalBoxWidth, maxChartAreaHeight);
                    maxChartAreaWidth -= minSize.width;
                }
                minBoxSizes.push({
                    horizontal: isHorizontal,
                    width: minSize.width,
                    box: box
                });
            }
            helpers.each(outerBoxes, getMinimumBoxSize);
            maxPadding = findMaxPadding(outerBoxes);
            function fitBox(box) {
                var minBoxSize = helpers.findNextWhere(minBoxSizes, function (minBox) {
                    return minBox.box === box;
                });
                if (minBoxSize) {
                    if (minBoxSize.horizontal) {
                        var scaleMargin = {
                            left: Math.max(outerBoxSizes.left, maxPadding.left),
                            right: Math.max(outerBoxSizes.right, maxPadding.right),
                            top: 0,
                            bottom: 0
                        };
                        box.update(box.fullWidth ? chartWidth : maxChartAreaWidth, chartHeight / 2, scaleMargin);
                    } else {
                        box.update(minBoxSize.width, maxChartAreaHeight);
                    }
                }
            }
            helpers.each(verticalBoxes, fitBox);
            addSizeByPosition(verticalBoxes, outerBoxSizes);
            helpers.each(horizontalBoxes, fitBox);
            addSizeByPosition(horizontalBoxes, outerBoxSizes);
            function finalFitVerticalBox(box) {
                var minBoxSize = helpers.findNextWhere(minBoxSizes, function (minSize) {
                    return minSize.box === box;
                });
                var scaleMargin = {
                    left: 0,
                    right: 0,
                    top: outerBoxSizes.top,
                    bottom: outerBoxSizes.bottom
                };
                if (minBoxSize) {
                    box.update(minBoxSize.width, maxChartAreaHeight, scaleMargin);
                }
            }
            helpers.each(verticalBoxes, finalFitVerticalBox);
            outerBoxSizes = {
                top: topPadding,
                left: leftPadding,
                bottom: bottomPadding,
                right: rightPadding
            };
            addSizeByPosition(outerBoxes, outerBoxSizes);
            var leftPaddingAddition = Math.max(maxPadding.left - outerBoxSizes.left, 0);
            outerBoxSizes.left += leftPaddingAddition;
            outerBoxSizes.right += Math.max(maxPadding.right - outerBoxSizes.right, 0);
            var topPaddingAddition = Math.max(maxPadding.top - outerBoxSizes.top, 0);
            outerBoxSizes.top += topPaddingAddition;
            outerBoxSizes.bottom += Math.max(maxPadding.bottom - outerBoxSizes.bottom, 0);
            var newMaxChartAreaHeight = height - outerBoxSizes.top - outerBoxSizes.bottom;
            var newMaxChartAreaWidth = width - outerBoxSizes.left - outerBoxSizes.right;
            if (newMaxChartAreaWidth !== maxChartAreaWidth || newMaxChartAreaHeight !== maxChartAreaHeight) {
                helpers.each(verticalBoxes, function (box) {
                    box.height = newMaxChartAreaHeight;
                });
                helpers.each(horizontalBoxes, function (box) {
                    if (!box.fullWidth) {
                        box.width = newMaxChartAreaWidth;
                    }
                });
                maxChartAreaHeight = newMaxChartAreaHeight;
                maxChartAreaWidth = newMaxChartAreaWidth;
            }
            var left = leftPadding + leftPaddingAddition;
            var top = topPadding + topPaddingAddition;
            function placeBox(box) {
                if (box.isHorizontal()) {
                    box.left = box.fullWidth ? leftPadding : outerBoxSizes.left;
                    box.right = box.fullWidth ? width - rightPadding : outerBoxSizes.left + maxChartAreaWidth;
                    box.top = top;
                    box.bottom = top + box.height;
                    top = box.bottom;
                } else {
                    box.left = left;
                    box.right = left + box.width;
                    box.top = outerBoxSizes.top;
                    box.bottom = outerBoxSizes.top + maxChartAreaHeight;
                    left = box.right;
                }
            }
            helpers.each(leftBoxes.concat(topBoxes), placeBox);
            left += maxChartAreaWidth;
            top += maxChartAreaHeight;
            helpers.each(rightBoxes, placeBox);
            helpers.each(bottomBoxes, placeBox);
            chart.chartArea = {
                left: outerBoxSizes.left,
                top: outerBoxSizes.top,
                right: outerBoxSizes.left + maxChartAreaWidth,
                bottom: outerBoxSizes.top + maxChartAreaHeight
            };
            helpers.each(chartAreaBoxes, function (box) {
                box.left = chart.chartArea.left;
                box.top = chart.chartArea.top;
                box.right = chart.chartArea.right;
                box.bottom = chart.chartArea.bottom;
                box.update(maxChartAreaWidth, maxChartAreaHeight);
            });
        }
    };
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/platforms/platform.basic',[], function () {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    module.exports = {
        acquireContext: function (item) {
            if (item && item.canvas) {
                item = item.canvas;
            }
            return item && item.getContext('2d') || null;
        }
    };
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/platforms/platform.dom.css',[], function() { return "/*\n * DOM element rendering detection\n * https://davidwalsh.name/detect-node-insertion\n */\n@keyframes chartjs-render-animation {\n\tfrom { opacity: 0.99; }\n\tto { opacity: 1; }\n}\n\n.chartjs-render-monitor {\n\tanimation: chartjs-render-animation 0.001s;\n}\n\n/*\n * DOM element resizing detection\n * https://github.com/marcj/css-element-queries\n */\n.chartjs-size-monitor,\n.chartjs-size-monitor-expand,\n.chartjs-size-monitor-shrink {\n\tposition: absolute;\n\tdirection: ltr;\n\tleft: 0;\n\ttop: 0;\n\tright: 0;\n\tbottom: 0;\n\toverflow: hidden;\n\tpointer-events: none;\n\tvisibility: hidden;\n\tz-index: -1;\n}\n\n.chartjs-size-monitor-expand > div {\n\tposition: absolute;\n\twidth: 1000000px;\n\theight: 1000000px;\n\tleft: 0;\n\ttop: 0;\n}\n\n.chartjs-size-monitor-shrink > div {\n\tposition: absolute;\n\twidth: 200%;\n\theight: 200%;\n\tleft: 0;\n\ttop: 0;\n}\n"; });
define('skylark-chartjs/platforms/platform.dom',[
    '../helpers/index',
    './platform.dom.css'
], function (__module__0, __module__1) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var helpers = __module__0;
    var stylesheet = __module__1;
    var EXPANDO_KEY = '$chartjs';
    var CSS_PREFIX = 'chartjs-';
    var CSS_SIZE_MONITOR = CSS_PREFIX + 'size-monitor';
    var CSS_RENDER_MONITOR = CSS_PREFIX + 'render-monitor';
    var CSS_RENDER_ANIMATION = CSS_PREFIX + 'render-animation';
    var ANIMATION_START_EVENTS = [
        'animationstart',
        'webkitAnimationStart'
    ];
    var EVENT_TYPES = {
        touchstart: 'mousedown',
        touchmove: 'mousemove',
        touchend: 'mouseup',
        pointerenter: 'mouseenter',
        pointerdown: 'mousedown',
        pointermove: 'mousemove',
        pointerup: 'mouseup',
        pointerleave: 'mouseout',
        pointerout: 'mouseout'
    };
    function readUsedSize(element, property) {
        var value = helpers.getStyle(element, property);
        var matches = value && value.match(/^(\d+)(\.\d+)?px$/);
        return matches ? Number(matches[1]) : undefined;
    }
    function initCanvas(canvas, config) {
        var style = canvas.style;
        var renderHeight = canvas.getAttribute('height');
        var renderWidth = canvas.getAttribute('width');
        canvas[EXPANDO_KEY] = {
            initial: {
                height: renderHeight,
                width: renderWidth,
                style: {
                    display: style.display,
                    height: style.height,
                    width: style.width
                }
            }
        };
        style.display = style.display || 'block';
        if (renderWidth === null || renderWidth === '') {
            var displayWidth = readUsedSize(canvas, 'width');
            if (displayWidth !== undefined) {
                canvas.width = displayWidth;
            }
        }
        if (renderHeight === null || renderHeight === '') {
            if (canvas.style.height === '') {
                canvas.height = canvas.width / (config.options.aspectRatio || 2);
            } else {
                var displayHeight = readUsedSize(canvas, 'height');
                if (displayWidth !== undefined) {
                    canvas.height = displayHeight;
                }
            }
        }
        return canvas;
    }
    var supportsEventListenerOptions = function () {
        var supports = false;
        try {
            var options = Object.defineProperty({}, 'passive', {
                get: function () {
                    supports = true;
                }
            });
            window.addEventListener('e', null, options);
        } catch (e) {
        }
        return supports;
    }();
    var eventListenerOptions = supportsEventListenerOptions ? { passive: true } : false;
    function addListener(node, type, listener) {
        node.addEventListener(type, listener, eventListenerOptions);
    }
    function removeListener(node, type, listener) {
        node.removeEventListener(type, listener, eventListenerOptions);
    }
    function createEvent(type, chart, x, y, nativeEvent) {
        return {
            type: type,
            chart: chart,
            native: nativeEvent || null,
            x: x !== undefined ? x : null,
            y: y !== undefined ? y : null
        };
    }
    function fromNativeEvent(event, chart) {
        var type = EVENT_TYPES[event.type] || event.type;
        var pos = helpers.getRelativePosition(event, chart);
        return createEvent(type, chart, pos.x, pos.y, event);
    }
    function throttled(fn, thisArg) {
        var ticking = false;
        var args = [];
        return function () {
            args = Array.prototype.slice.call(arguments);
            thisArg = thisArg || this;
            if (!ticking) {
                ticking = true;
                helpers.requestAnimFrame.call(window, function () {
                    ticking = false;
                    fn.apply(thisArg, args);
                });
            }
        };
    }
    function createDiv(cls) {
        var el = document.createElement('div');
        el.className = cls || '';
        return el;
    }
    function createResizer(handler) {
        var maxSize = 1000000;
        var resizer = createDiv(CSS_SIZE_MONITOR);
        var expand = createDiv(CSS_SIZE_MONITOR + '-expand');
        var shrink = createDiv(CSS_SIZE_MONITOR + '-shrink');
        expand.appendChild(createDiv());
        shrink.appendChild(createDiv());
        resizer.appendChild(expand);
        resizer.appendChild(shrink);
        resizer._reset = function () {
            expand.scrollLeft = maxSize;
            expand.scrollTop = maxSize;
            shrink.scrollLeft = maxSize;
            shrink.scrollTop = maxSize;
        };
        var onScroll = function () {
            resizer._reset();
            handler();
        };
        addListener(expand, 'scroll', onScroll.bind(expand, 'expand'));
        addListener(shrink, 'scroll', onScroll.bind(shrink, 'shrink'));
        return resizer;
    }
    function watchForRender(node, handler) {
        var expando = node[EXPANDO_KEY] || (node[EXPANDO_KEY] = {});
        var proxy = expando.renderProxy = function (e) {
            if (e.animationName === CSS_RENDER_ANIMATION) {
                handler();
            }
        };
        helpers.each(ANIMATION_START_EVENTS, function (type) {
            addListener(node, type, proxy);
        });
        expando.reflow = !!node.offsetParent;
        node.classList.add(CSS_RENDER_MONITOR);
    }
    function unwatchForRender(node) {
        var expando = node[EXPANDO_KEY] || {};
        var proxy = expando.renderProxy;
        if (proxy) {
            helpers.each(ANIMATION_START_EVENTS, function (type) {
                removeListener(node, type, proxy);
            });
            delete expando.renderProxy;
        }
        node.classList.remove(CSS_RENDER_MONITOR);
    }
    function addResizeListener(node, listener, chart) {
        var expando = node[EXPANDO_KEY] || (node[EXPANDO_KEY] = {});
        var resizer = expando.resizer = createResizer(throttled(function () {
            if (expando.resizer) {
                var container = chart.options.maintainAspectRatio && node.parentNode;
                var w = container ? container.clientWidth : 0;
                listener(createEvent('resize', chart));
                if (container && container.clientWidth < w && chart.canvas) {
                    listener(createEvent('resize', chart));
                }
            }
        }));
        watchForRender(node, function () {
            if (expando.resizer) {
                var container = node.parentNode;
                if (container && container !== resizer.parentNode) {
                    container.insertBefore(resizer, container.firstChild);
                }
                resizer._reset();
            }
        });
    }
    function removeResizeListener(node) {
        var expando = node[EXPANDO_KEY] || {};
        var resizer = expando.resizer;
        delete expando.resizer;
        unwatchForRender(node);
        if (resizer && resizer.parentNode) {
            resizer.parentNode.removeChild(resizer);
        }
    }
    function injectCSS(platform, css) {
        var style = platform._style || document.createElement('style');
        if (!platform._style) {
            platform._style = style;
            css = '/* Chart.js */\n' + css;
            style.setAttribute('type', 'text/css');
            document.getElementsByTagName('head')[0].appendChild(style);
        }
        style.appendChild(document.createTextNode(css));
    }
    module.exports = {
        disableCSSInjection: false,
        _enabled: typeof window !== 'undefined' && typeof document !== 'undefined',
        _ensureLoaded: function () {
            if (this._loaded) {
                return;
            }
            this._loaded = true;
            if (!this.disableCSSInjection) {
                injectCSS(this, stylesheet);
            }
        },
        acquireContext: function (item, config) {
            if (typeof item === 'string') {
                item = document.getElementById(item);
            } else if (item.length) {
                item = item[0];
            }
            if (item && item.canvas) {
                item = item.canvas;
            }
            var context = item && item.getContext && item.getContext('2d');
            this._ensureLoaded();
            if (context && context.canvas === item) {
                initCanvas(item, config);
                return context;
            }
            return null;
        },
        releaseContext: function (context) {
            var canvas = context.canvas;
            if (!canvas[EXPANDO_KEY]) {
                return;
            }
            var initial = canvas[EXPANDO_KEY].initial;
            [
                'height',
                'width'
            ].forEach(function (prop) {
                var value = initial[prop];
                if (helpers.isNullOrUndef(value)) {
                    canvas.removeAttribute(prop);
                } else {
                    canvas.setAttribute(prop, value);
                }
            });
            helpers.each(initial.style || {}, function (value, key) {
                canvas.style[key] = value;
            });
            canvas.width = canvas.width;
            delete canvas[EXPANDO_KEY];
        },
        addEventListener: function (chart, type, listener) {
            var canvas = chart.canvas;
            if (type === 'resize') {
                addResizeListener(canvas, listener, chart);
                return;
            }
            var expando = listener[EXPANDO_KEY] || (listener[EXPANDO_KEY] = {});
            var proxies = expando.proxies || (expando.proxies = {});
            var proxy = proxies[chart.id + '_' + type] = function (event) {
                listener(fromNativeEvent(event, chart));
            };
            addListener(canvas, type, proxy);
        },
        removeEventListener: function (chart, type, listener) {
            var canvas = chart.canvas;
            if (type === 'resize') {
                removeResizeListener(canvas);
                return;
            }
            var expando = listener[EXPANDO_KEY] || {};
            var proxies = expando.proxies || {};
            var proxy = proxies[chart.id + '_' + type];
            if (!proxy) {
                return;
            }
            removeListener(canvas, type, proxy);
        }
    };
    helpers.addEvent = addListener;
    helpers.removeEvent = removeListener;
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/platforms/platform',[
    '../helpers/index',
    './platform.basic',
    './platform.dom'
], function (__module__0, __module__1, __module__2) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var helpers = __module__0;
    var basic = __module__1;
    var dom = __module__2;
    var implementation = dom._enabled ? dom : basic;
    module.exports = helpers.extend({
        initialize: function () {
        },
        acquireContext: function () {
        },
        releaseContext: function () {
        },
        addEventListener: function () {
        },
        removeEventListener: function () {
        }
    }, implementation);
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/core/core.plugins',[
    './core.defaults',
    '../helpers/index'
], function (__module__0, __module__1) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var defaults = __module__0;
    var helpers = __module__1;
    defaults._set('global', { plugins: {} });
    module.exports = {
        _plugins: [],
        _cacheId: 0,
        register: function (plugins) {
            var p = this._plugins;
            [].concat(plugins).forEach(function (plugin) {
                if (p.indexOf(plugin) === -1) {
                    p.push(plugin);
                }
            });
            this._cacheId++;
        },
        unregister: function (plugins) {
            var p = this._plugins;
            [].concat(plugins).forEach(function (plugin) {
                var idx = p.indexOf(plugin);
                if (idx !== -1) {
                    p.splice(idx, 1);
                }
            });
            this._cacheId++;
        },
        clear: function () {
            this._plugins = [];
            this._cacheId++;
        },
        count: function () {
            return this._plugins.length;
        },
        getAll: function () {
            return this._plugins;
        },
        notify: function (chart, hook, args) {
            var descriptors = this.descriptors(chart);
            var ilen = descriptors.length;
            var i, descriptor, plugin, params, method;
            for (i = 0; i < ilen; ++i) {
                descriptor = descriptors[i];
                plugin = descriptor.plugin;
                method = plugin[hook];
                if (typeof method === 'function') {
                    params = [chart].concat(args || []);
                    params.push(descriptor.options);
                    if (method.apply(plugin, params) === false) {
                        return false;
                    }
                }
            }
            return true;
        },
        descriptors: function (chart) {
            var cache = chart.$plugins || (chart.$plugins = {});
            if (cache.id === this._cacheId) {
                return cache.descriptors;
            }
            var plugins = [];
            var descriptors = [];
            var config = chart && chart.config || {};
            var options = config.options && config.options.plugins || {};
            this._plugins.concat(config.plugins || []).forEach(function (plugin) {
                var idx = plugins.indexOf(plugin);
                if (idx !== -1) {
                    return;
                }
                var id = plugin.id;
                var opts = options[id];
                if (opts === false) {
                    return;
                }
                if (opts === true) {
                    opts = helpers.clone(defaults.global.plugins[id]);
                }
                plugins.push(plugin);
                descriptors.push({
                    plugin: plugin,
                    options: opts || {}
                });
            });
            cache.descriptors = descriptors;
            cache.id = this._cacheId;
            return descriptors;
        },
        _invalidate: function (chart) {
            delete chart.$plugins;
        }
    };
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/core/core.scaleService',[
    './core.defaults',
    '../helpers/index',
    './core.layouts'
], function (__module__0, __module__1, __module__2) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var defaults = __module__0;
    var helpers = __module__1;
    var layouts = __module__2;
    module.exports = {
        constructors: {},
        defaults: {},
        registerScaleType: function (type, scaleConstructor, scaleDefaults) {
            this.constructors[type] = scaleConstructor;
            this.defaults[type] = helpers.clone(scaleDefaults);
        },
        getScaleConstructor: function (type) {
            return this.constructors.hasOwnProperty(type) ? this.constructors[type] : undefined;
        },
        getScaleDefaults: function (type) {
            return this.defaults.hasOwnProperty(type) ? helpers.merge({}, [
                defaults.scale,
                this.defaults[type]
            ]) : {};
        },
        updateScaleDefaults: function (type, additions) {
            var me = this;
            if (me.defaults.hasOwnProperty(type)) {
                me.defaults[type] = helpers.extend(me.defaults[type], additions);
            }
        },
        addScalesToLayout: function (chart) {
            helpers.each(chart.scales, function (scale) {
                scale.fullWidth = scale.options.fullWidth;
                scale.position = scale.options.position;
                scale.weight = scale.options.weight;
                layouts.addBox(chart, scale);
            });
        }
    };
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/core/core.tooltip',[
    './core.defaults',
    './core.element',
    '../helpers/index'
], function (__module__0, __module__1, __module__2) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var defaults = __module__0;
    var Element = __module__1;
    var helpers = __module__2;
    var valueOrDefault = helpers.valueOrDefault;
    defaults._set('global', {
        tooltips: {
            enabled: true,
            custom: null,
            mode: 'nearest',
            position: 'average',
            intersect: true,
            backgroundColor: 'rgba(0,0,0,0.8)',
            titleFontStyle: 'bold',
            titleSpacing: 2,
            titleMarginBottom: 6,
            titleFontColor: '#fff',
            titleAlign: 'left',
            bodySpacing: 2,
            bodyFontColor: '#fff',
            bodyAlign: 'left',
            footerFontStyle: 'bold',
            footerSpacing: 2,
            footerMarginTop: 6,
            footerFontColor: '#fff',
            footerAlign: 'left',
            yPadding: 6,
            xPadding: 6,
            caretPadding: 2,
            caretSize: 5,
            cornerRadius: 6,
            multiKeyBackground: '#fff',
            displayColors: true,
            borderColor: 'rgba(0,0,0,0)',
            borderWidth: 0,
            callbacks: {
                beforeTitle: helpers.noop,
                title: function (tooltipItems, data) {
                    var title = '';
                    var labels = data.labels;
                    var labelCount = labels ? labels.length : 0;
                    if (tooltipItems.length > 0) {
                        var item = tooltipItems[0];
                        if (item.label) {
                            title = item.label;
                        } else if (item.xLabel) {
                            title = item.xLabel;
                        } else if (labelCount > 0 && item.index < labelCount) {
                            title = labels[item.index];
                        }
                    }
                    return title;
                },
                afterTitle: helpers.noop,
                beforeBody: helpers.noop,
                beforeLabel: helpers.noop,
                label: function (tooltipItem, data) {
                    var label = data.datasets[tooltipItem.datasetIndex].label || '';
                    if (label) {
                        label += ': ';
                    }
                    if (!helpers.isNullOrUndef(tooltipItem.value)) {
                        label += tooltipItem.value;
                    } else {
                        label += tooltipItem.yLabel;
                    }
                    return label;
                },
                labelColor: function (tooltipItem, chart) {
                    var meta = chart.getDatasetMeta(tooltipItem.datasetIndex);
                    var activeElement = meta.data[tooltipItem.index];
                    var view = activeElement._view;
                    return {
                        borderColor: view.borderColor,
                        backgroundColor: view.backgroundColor
                    };
                },
                labelTextColor: function () {
                    return this._options.bodyFontColor;
                },
                afterLabel: helpers.noop,
                afterBody: helpers.noop,
                beforeFooter: helpers.noop,
                footer: helpers.noop,
                afterFooter: helpers.noop
            }
        }
    });
    var positioners = {
        average: function (elements) {
            if (!elements.length) {
                return false;
            }
            var i, len;
            var x = 0;
            var y = 0;
            var count = 0;
            for (i = 0, len = elements.length; i < len; ++i) {
                var el = elements[i];
                if (el && el.hasValue()) {
                    var pos = el.tooltipPosition();
                    x += pos.x;
                    y += pos.y;
                    ++count;
                }
            }
            return {
                x: x / count,
                y: y / count
            };
        },
        nearest: function (elements, eventPosition) {
            var x = eventPosition.x;
            var y = eventPosition.y;
            var minDistance = Number.POSITIVE_INFINITY;
            var i, len, nearestElement;
            for (i = 0, len = elements.length; i < len; ++i) {
                var el = elements[i];
                if (el && el.hasValue()) {
                    var center = el.getCenterPoint();
                    var d = helpers.distanceBetweenPoints(eventPosition, center);
                    if (d < minDistance) {
                        minDistance = d;
                        nearestElement = el;
                    }
                }
            }
            if (nearestElement) {
                var tp = nearestElement.tooltipPosition();
                x = tp.x;
                y = tp.y;
            }
            return {
                x: x,
                y: y
            };
        }
    };
    function pushOrConcat(base, toPush) {
        if (toPush) {
            if (helpers.isArray(toPush)) {
                Array.prototype.push.apply(base, toPush);
            } else {
                base.push(toPush);
            }
        }
        return base;
    }
    function splitNewlines(str) {
        if ((typeof str === 'string' || str instanceof String) && str.indexOf('\n') > -1) {
            return str.split('\n');
        }
        return str;
    }
    function createTooltipItem(element) {
        var xScale = element._xScale;
        var yScale = element._yScale || element._scale;
        var index = element._index;
        var datasetIndex = element._datasetIndex;
        var controller = element._chart.getDatasetMeta(datasetIndex).controller;
        var indexScale = controller._getIndexScale();
        var valueScale = controller._getValueScale();
        return {
            xLabel: xScale ? xScale.getLabelForIndex(index, datasetIndex) : '',
            yLabel: yScale ? yScale.getLabelForIndex(index, datasetIndex) : '',
            label: indexScale ? '' + indexScale.getLabelForIndex(index, datasetIndex) : '',
            value: valueScale ? '' + valueScale.getLabelForIndex(index, datasetIndex) : '',
            index: index,
            datasetIndex: datasetIndex,
            x: element._model.x,
            y: element._model.y
        };
    }
    function getBaseModel(tooltipOpts) {
        var globalDefaults = defaults.global;
        return {
            xPadding: tooltipOpts.xPadding,
            yPadding: tooltipOpts.yPadding,
            xAlign: tooltipOpts.xAlign,
            yAlign: tooltipOpts.yAlign,
            bodyFontColor: tooltipOpts.bodyFontColor,
            _bodyFontFamily: valueOrDefault(tooltipOpts.bodyFontFamily, globalDefaults.defaultFontFamily),
            _bodyFontStyle: valueOrDefault(tooltipOpts.bodyFontStyle, globalDefaults.defaultFontStyle),
            _bodyAlign: tooltipOpts.bodyAlign,
            bodyFontSize: valueOrDefault(tooltipOpts.bodyFontSize, globalDefaults.defaultFontSize),
            bodySpacing: tooltipOpts.bodySpacing,
            titleFontColor: tooltipOpts.titleFontColor,
            _titleFontFamily: valueOrDefault(tooltipOpts.titleFontFamily, globalDefaults.defaultFontFamily),
            _titleFontStyle: valueOrDefault(tooltipOpts.titleFontStyle, globalDefaults.defaultFontStyle),
            titleFontSize: valueOrDefault(tooltipOpts.titleFontSize, globalDefaults.defaultFontSize),
            _titleAlign: tooltipOpts.titleAlign,
            titleSpacing: tooltipOpts.titleSpacing,
            titleMarginBottom: tooltipOpts.titleMarginBottom,
            footerFontColor: tooltipOpts.footerFontColor,
            _footerFontFamily: valueOrDefault(tooltipOpts.footerFontFamily, globalDefaults.defaultFontFamily),
            _footerFontStyle: valueOrDefault(tooltipOpts.footerFontStyle, globalDefaults.defaultFontStyle),
            footerFontSize: valueOrDefault(tooltipOpts.footerFontSize, globalDefaults.defaultFontSize),
            _footerAlign: tooltipOpts.footerAlign,
            footerSpacing: tooltipOpts.footerSpacing,
            footerMarginTop: tooltipOpts.footerMarginTop,
            caretSize: tooltipOpts.caretSize,
            cornerRadius: tooltipOpts.cornerRadius,
            backgroundColor: tooltipOpts.backgroundColor,
            opacity: 0,
            legendColorBackground: tooltipOpts.multiKeyBackground,
            displayColors: tooltipOpts.displayColors,
            borderColor: tooltipOpts.borderColor,
            borderWidth: tooltipOpts.borderWidth
        };
    }
    function getTooltipSize(tooltip, model) {
        var ctx = tooltip._chart.ctx;
        var height = model.yPadding * 2;
        var width = 0;
        var body = model.body;
        var combinedBodyLength = body.reduce(function (count, bodyItem) {
            return count + bodyItem.before.length + bodyItem.lines.length + bodyItem.after.length;
        }, 0);
        combinedBodyLength += model.beforeBody.length + model.afterBody.length;
        var titleLineCount = model.title.length;
        var footerLineCount = model.footer.length;
        var titleFontSize = model.titleFontSize;
        var bodyFontSize = model.bodyFontSize;
        var footerFontSize = model.footerFontSize;
        height += titleLineCount * titleFontSize;
        height += titleLineCount ? (titleLineCount - 1) * model.titleSpacing : 0;
        height += titleLineCount ? model.titleMarginBottom : 0;
        height += combinedBodyLength * bodyFontSize;
        height += combinedBodyLength ? (combinedBodyLength - 1) * model.bodySpacing : 0;
        height += footerLineCount ? model.footerMarginTop : 0;
        height += footerLineCount * footerFontSize;
        height += footerLineCount ? (footerLineCount - 1) * model.footerSpacing : 0;
        var widthPadding = 0;
        var maxLineWidth = function (line) {
            width = Math.max(width, ctx.measureText(line).width + widthPadding);
        };
        ctx.font = helpers.fontString(titleFontSize, model._titleFontStyle, model._titleFontFamily);
        helpers.each(model.title, maxLineWidth);
        ctx.font = helpers.fontString(bodyFontSize, model._bodyFontStyle, model._bodyFontFamily);
        helpers.each(model.beforeBody.concat(model.afterBody), maxLineWidth);
        widthPadding = model.displayColors ? bodyFontSize + 2 : 0;
        helpers.each(body, function (bodyItem) {
            helpers.each(bodyItem.before, maxLineWidth);
            helpers.each(bodyItem.lines, maxLineWidth);
            helpers.each(bodyItem.after, maxLineWidth);
        });
        widthPadding = 0;
        ctx.font = helpers.fontString(footerFontSize, model._footerFontStyle, model._footerFontFamily);
        helpers.each(model.footer, maxLineWidth);
        width += 2 * model.xPadding;
        return {
            width: width,
            height: height
        };
    }
    function determineAlignment(tooltip, size) {
        var model = tooltip._model;
        var chart = tooltip._chart;
        var chartArea = tooltip._chart.chartArea;
        var xAlign = 'center';
        var yAlign = 'center';
        if (model.y < size.height) {
            yAlign = 'top';
        } else if (model.y > chart.height - size.height) {
            yAlign = 'bottom';
        }
        var lf, rf;
        var olf, orf;
        var yf;
        var midX = (chartArea.left + chartArea.right) / 2;
        var midY = (chartArea.top + chartArea.bottom) / 2;
        if (yAlign === 'center') {
            lf = function (x) {
                return x <= midX;
            };
            rf = function (x) {
                return x > midX;
            };
        } else {
            lf = function (x) {
                return x <= size.width / 2;
            };
            rf = function (x) {
                return x >= chart.width - size.width / 2;
            };
        }
        olf = function (x) {
            return x + size.width + model.caretSize + model.caretPadding > chart.width;
        };
        orf = function (x) {
            return x - size.width - model.caretSize - model.caretPadding < 0;
        };
        yf = function (y) {
            return y <= midY ? 'top' : 'bottom';
        };
        if (lf(model.x)) {
            xAlign = 'left';
            if (olf(model.x)) {
                xAlign = 'center';
                yAlign = yf(model.y);
            }
        } else if (rf(model.x)) {
            xAlign = 'right';
            if (orf(model.x)) {
                xAlign = 'center';
                yAlign = yf(model.y);
            }
        }
        var opts = tooltip._options;
        return {
            xAlign: opts.xAlign ? opts.xAlign : xAlign,
            yAlign: opts.yAlign ? opts.yAlign : yAlign
        };
    }
    function getBackgroundPoint(vm, size, alignment, chart) {
        var x = vm.x;
        var y = vm.y;
        var caretSize = vm.caretSize;
        var caretPadding = vm.caretPadding;
        var cornerRadius = vm.cornerRadius;
        var xAlign = alignment.xAlign;
        var yAlign = alignment.yAlign;
        var paddingAndSize = caretSize + caretPadding;
        var radiusAndPadding = cornerRadius + caretPadding;
        if (xAlign === 'right') {
            x -= size.width;
        } else if (xAlign === 'center') {
            x -= size.width / 2;
            if (x + size.width > chart.width) {
                x = chart.width - size.width;
            }
            if (x < 0) {
                x = 0;
            }
        }
        if (yAlign === 'top') {
            y += paddingAndSize;
        } else if (yAlign === 'bottom') {
            y -= size.height + paddingAndSize;
        } else {
            y -= size.height / 2;
        }
        if (yAlign === 'center') {
            if (xAlign === 'left') {
                x += paddingAndSize;
            } else if (xAlign === 'right') {
                x -= paddingAndSize;
            }
        } else if (xAlign === 'left') {
            x -= radiusAndPadding;
        } else if (xAlign === 'right') {
            x += radiusAndPadding;
        }
        return {
            x: x,
            y: y
        };
    }
    function getAlignedX(vm, align) {
        return align === 'center' ? vm.x + vm.width / 2 : align === 'right' ? vm.x + vm.width - vm.xPadding : vm.x + vm.xPadding;
    }
    function getBeforeAfterBodyLines(callback) {
        return pushOrConcat([], splitNewlines(callback));
    }
    var exports = Element.extend({
        initialize: function () {
            this._model = getBaseModel(this._options);
            this._lastActive = [];
        },
        getTitle: function () {
            var me = this;
            var opts = me._options;
            var callbacks = opts.callbacks;
            var beforeTitle = callbacks.beforeTitle.apply(me, arguments);
            var title = callbacks.title.apply(me, arguments);
            var afterTitle = callbacks.afterTitle.apply(me, arguments);
            var lines = [];
            lines = pushOrConcat(lines, splitNewlines(beforeTitle));
            lines = pushOrConcat(lines, splitNewlines(title));
            lines = pushOrConcat(lines, splitNewlines(afterTitle));
            return lines;
        },
        getBeforeBody: function () {
            return getBeforeAfterBodyLines(this._options.callbacks.beforeBody.apply(this, arguments));
        },
        getBody: function (tooltipItems, data) {
            var me = this;
            var callbacks = me._options.callbacks;
            var bodyItems = [];
            helpers.each(tooltipItems, function (tooltipItem) {
                var bodyItem = {
                    before: [],
                    lines: [],
                    after: []
                };
                pushOrConcat(bodyItem.before, splitNewlines(callbacks.beforeLabel.call(me, tooltipItem, data)));
                pushOrConcat(bodyItem.lines, callbacks.label.call(me, tooltipItem, data));
                pushOrConcat(bodyItem.after, splitNewlines(callbacks.afterLabel.call(me, tooltipItem, data)));
                bodyItems.push(bodyItem);
            });
            return bodyItems;
        },
        getAfterBody: function () {
            return getBeforeAfterBodyLines(this._options.callbacks.afterBody.apply(this, arguments));
        },
        getFooter: function () {
            var me = this;
            var callbacks = me._options.callbacks;
            var beforeFooter = callbacks.beforeFooter.apply(me, arguments);
            var footer = callbacks.footer.apply(me, arguments);
            var afterFooter = callbacks.afterFooter.apply(me, arguments);
            var lines = [];
            lines = pushOrConcat(lines, splitNewlines(beforeFooter));
            lines = pushOrConcat(lines, splitNewlines(footer));
            lines = pushOrConcat(lines, splitNewlines(afterFooter));
            return lines;
        },
        update: function (changed) {
            var me = this;
            var opts = me._options;
            var existingModel = me._model;
            var model = me._model = getBaseModel(opts);
            var active = me._active;
            var data = me._data;
            var alignment = {
                xAlign: existingModel.xAlign,
                yAlign: existingModel.yAlign
            };
            var backgroundPoint = {
                x: existingModel.x,
                y: existingModel.y
            };
            var tooltipSize = {
                width: existingModel.width,
                height: existingModel.height
            };
            var tooltipPosition = {
                x: existingModel.caretX,
                y: existingModel.caretY
            };
            var i, len;
            if (active.length) {
                model.opacity = 1;
                var labelColors = [];
                var labelTextColors = [];
                tooltipPosition = positioners[opts.position].call(me, active, me._eventPosition);
                var tooltipItems = [];
                for (i = 0, len = active.length; i < len; ++i) {
                    tooltipItems.push(createTooltipItem(active[i]));
                }
                if (opts.filter) {
                    tooltipItems = tooltipItems.filter(function (a) {
                        return opts.filter(a, data);
                    });
                }
                if (opts.itemSort) {
                    tooltipItems = tooltipItems.sort(function (a, b) {
                        return opts.itemSort(a, b, data);
                    });
                }
                helpers.each(tooltipItems, function (tooltipItem) {
                    labelColors.push(opts.callbacks.labelColor.call(me, tooltipItem, me._chart));
                    labelTextColors.push(opts.callbacks.labelTextColor.call(me, tooltipItem, me._chart));
                });
                model.title = me.getTitle(tooltipItems, data);
                model.beforeBody = me.getBeforeBody(tooltipItems, data);
                model.body = me.getBody(tooltipItems, data);
                model.afterBody = me.getAfterBody(tooltipItems, data);
                model.footer = me.getFooter(tooltipItems, data);
                model.x = tooltipPosition.x;
                model.y = tooltipPosition.y;
                model.caretPadding = opts.caretPadding;
                model.labelColors = labelColors;
                model.labelTextColors = labelTextColors;
                model.dataPoints = tooltipItems;
                tooltipSize = getTooltipSize(this, model);
                alignment = determineAlignment(this, tooltipSize);
                backgroundPoint = getBackgroundPoint(model, tooltipSize, alignment, me._chart);
            } else {
                model.opacity = 0;
            }
            model.xAlign = alignment.xAlign;
            model.yAlign = alignment.yAlign;
            model.x = backgroundPoint.x;
            model.y = backgroundPoint.y;
            model.width = tooltipSize.width;
            model.height = tooltipSize.height;
            model.caretX = tooltipPosition.x;
            model.caretY = tooltipPosition.y;
            me._model = model;
            if (changed && opts.custom) {
                opts.custom.call(me, model);
            }
            return me;
        },
        drawCaret: function (tooltipPoint, size) {
            var ctx = this._chart.ctx;
            var vm = this._view;
            var caretPosition = this.getCaretPosition(tooltipPoint, size, vm);
            ctx.lineTo(caretPosition.x1, caretPosition.y1);
            ctx.lineTo(caretPosition.x2, caretPosition.y2);
            ctx.lineTo(caretPosition.x3, caretPosition.y3);
        },
        getCaretPosition: function (tooltipPoint, size, vm) {
            var x1, x2, x3, y1, y2, y3;
            var caretSize = vm.caretSize;
            var cornerRadius = vm.cornerRadius;
            var xAlign = vm.xAlign;
            var yAlign = vm.yAlign;
            var ptX = tooltipPoint.x;
            var ptY = tooltipPoint.y;
            var width = size.width;
            var height = size.height;
            if (yAlign === 'center') {
                y2 = ptY + height / 2;
                if (xAlign === 'left') {
                    x1 = ptX;
                    x2 = x1 - caretSize;
                    x3 = x1;
                    y1 = y2 + caretSize;
                    y3 = y2 - caretSize;
                } else {
                    x1 = ptX + width;
                    x2 = x1 + caretSize;
                    x3 = x1;
                    y1 = y2 - caretSize;
                    y3 = y2 + caretSize;
                }
            } else {
                if (xAlign === 'left') {
                    x2 = ptX + cornerRadius + caretSize;
                    x1 = x2 - caretSize;
                    x3 = x2 + caretSize;
                } else if (xAlign === 'right') {
                    x2 = ptX + width - cornerRadius - caretSize;
                    x1 = x2 - caretSize;
                    x3 = x2 + caretSize;
                } else {
                    x2 = vm.caretX;
                    x1 = x2 - caretSize;
                    x3 = x2 + caretSize;
                }
                if (yAlign === 'top') {
                    y1 = ptY;
                    y2 = y1 - caretSize;
                    y3 = y1;
                } else {
                    y1 = ptY + height;
                    y2 = y1 + caretSize;
                    y3 = y1;
                    var tmp = x3;
                    x3 = x1;
                    x1 = tmp;
                }
            }
            return {
                x1: x1,
                x2: x2,
                x3: x3,
                y1: y1,
                y2: y2,
                y3: y3
            };
        },
        drawTitle: function (pt, vm, ctx) {
            var title = vm.title;
            if (title.length) {
                pt.x = getAlignedX(vm, vm._titleAlign);
                ctx.textAlign = vm._titleAlign;
                ctx.textBaseline = 'top';
                var titleFontSize = vm.titleFontSize;
                var titleSpacing = vm.titleSpacing;
                ctx.fillStyle = vm.titleFontColor;
                ctx.font = helpers.fontString(titleFontSize, vm._titleFontStyle, vm._titleFontFamily);
                var i, len;
                for (i = 0, len = title.length; i < len; ++i) {
                    ctx.fillText(title[i], pt.x, pt.y);
                    pt.y += titleFontSize + titleSpacing;
                    if (i + 1 === title.length) {
                        pt.y += vm.titleMarginBottom - titleSpacing;
                    }
                }
            }
        },
        drawBody: function (pt, vm, ctx) {
            var bodyFontSize = vm.bodyFontSize;
            var bodySpacing = vm.bodySpacing;
            var bodyAlign = vm._bodyAlign;
            var body = vm.body;
            var drawColorBoxes = vm.displayColors;
            var labelColors = vm.labelColors;
            var xLinePadding = 0;
            var colorX = drawColorBoxes ? getAlignedX(vm, 'left') : 0;
            var textColor;
            ctx.textAlign = bodyAlign;
            ctx.textBaseline = 'top';
            ctx.font = helpers.fontString(bodyFontSize, vm._bodyFontStyle, vm._bodyFontFamily);
            pt.x = getAlignedX(vm, bodyAlign);
            var fillLineOfText = function (line) {
                ctx.fillText(line, pt.x + xLinePadding, pt.y);
                pt.y += bodyFontSize + bodySpacing;
            };
            ctx.fillStyle = vm.bodyFontColor;
            helpers.each(vm.beforeBody, fillLineOfText);
            xLinePadding = drawColorBoxes && bodyAlign !== 'right' ? bodyAlign === 'center' ? bodyFontSize / 2 + 1 : bodyFontSize + 2 : 0;
            helpers.each(body, function (bodyItem, i) {
                textColor = vm.labelTextColors[i];
                ctx.fillStyle = textColor;
                helpers.each(bodyItem.before, fillLineOfText);
                helpers.each(bodyItem.lines, function (line) {
                    if (drawColorBoxes) {
                        ctx.fillStyle = vm.legendColorBackground;
                        ctx.fillRect(colorX, pt.y, bodyFontSize, bodyFontSize);
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = labelColors[i].borderColor;
                        ctx.strokeRect(colorX, pt.y, bodyFontSize, bodyFontSize);
                        ctx.fillStyle = labelColors[i].backgroundColor;
                        ctx.fillRect(colorX + 1, pt.y + 1, bodyFontSize - 2, bodyFontSize - 2);
                        ctx.fillStyle = textColor;
                    }
                    fillLineOfText(line);
                });
                helpers.each(bodyItem.after, fillLineOfText);
            });
            xLinePadding = 0;
            helpers.each(vm.afterBody, fillLineOfText);
            pt.y -= bodySpacing;
        },
        drawFooter: function (pt, vm, ctx) {
            var footer = vm.footer;
            if (footer.length) {
                pt.x = getAlignedX(vm, vm._footerAlign);
                pt.y += vm.footerMarginTop;
                ctx.textAlign = vm._footerAlign;
                ctx.textBaseline = 'top';
                ctx.fillStyle = vm.footerFontColor;
                ctx.font = helpers.fontString(vm.footerFontSize, vm._footerFontStyle, vm._footerFontFamily);
                helpers.each(footer, function (line) {
                    ctx.fillText(line, pt.x, pt.y);
                    pt.y += vm.footerFontSize + vm.footerSpacing;
                });
            }
        },
        drawBackground: function (pt, vm, ctx, tooltipSize) {
            ctx.fillStyle = vm.backgroundColor;
            ctx.strokeStyle = vm.borderColor;
            ctx.lineWidth = vm.borderWidth;
            var xAlign = vm.xAlign;
            var yAlign = vm.yAlign;
            var x = pt.x;
            var y = pt.y;
            var width = tooltipSize.width;
            var height = tooltipSize.height;
            var radius = vm.cornerRadius;
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            if (yAlign === 'top') {
                this.drawCaret(pt, tooltipSize);
            }
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            if (yAlign === 'center' && xAlign === 'right') {
                this.drawCaret(pt, tooltipSize);
            }
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            if (yAlign === 'bottom') {
                this.drawCaret(pt, tooltipSize);
            }
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            if (yAlign === 'center' && xAlign === 'left') {
                this.drawCaret(pt, tooltipSize);
            }
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
            ctx.fill();
            if (vm.borderWidth > 0) {
                ctx.stroke();
            }
        },
        draw: function () {
            var ctx = this._chart.ctx;
            var vm = this._view;
            if (vm.opacity === 0) {
                return;
            }
            var tooltipSize = {
                width: vm.width,
                height: vm.height
            };
            var pt = {
                x: vm.x,
                y: vm.y
            };
            var opacity = Math.abs(vm.opacity < 0.001) ? 0 : vm.opacity;
            var hasTooltipContent = vm.title.length || vm.beforeBody.length || vm.body.length || vm.afterBody.length || vm.footer.length;
            if (this._options.enabled && hasTooltipContent) {
                ctx.save();
                ctx.globalAlpha = opacity;
                this.drawBackground(pt, vm, ctx, tooltipSize);
                pt.y += vm.yPadding;
                this.drawTitle(pt, vm, ctx);
                this.drawBody(pt, vm, ctx);
                this.drawFooter(pt, vm, ctx);
                ctx.restore();
            }
        },
        handleEvent: function (e) {
            var me = this;
            var options = me._options;
            var changed = false;
            me._lastActive = me._lastActive || [];
            if (e.type === 'mouseout') {
                me._active = [];
            } else {
                me._active = me._chart.getElementsAtEventForMode(e, options.mode, options);
            }
            changed = !helpers.arrayEquals(me._active, me._lastActive);
            if (changed) {
                me._lastActive = me._active;
                if (options.enabled || options.custom) {
                    me._eventPosition = {
                        x: e.x,
                        y: e.y
                    };
                    me.update(true);
                    me.pivot();
                }
            }
            return changed;
        }
    });
    exports.positioners = positioners;
    module.exports = exports;
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/core/core.controller',[
    './core.animation',
    './core.animations',
    '../controllers/index',
    './core.defaults',
    '../helpers/index',
    './core.interaction',
    './core.layouts',
    '../platforms/platform',
    './core.plugins',
    '../core/core.scaleService',
    './core.tooltip'
], function (__module__0, __module__1, __module__2, __module__3, __module__4, __module__5, __module__6, __module__7, __module__8, __module__9, __module__10) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var Animation = __module__0;
    var animations = __module__1;
    var controllers = __module__2;
    var defaults = __module__3;
    var helpers = __module__4;
    var Interaction = __module__5;
    var layouts = __module__6;
    var platform = __module__7;
    var plugins = __module__8;
    var scaleService = __module__9;
    var Tooltip = __module__10;
    var valueOrDefault = helpers.valueOrDefault;
    defaults._set('global', {
        elements: {},
        events: [
            'mousemove',
            'mouseout',
            'click',
            'touchstart',
            'touchmove'
        ],
        hover: {
            onHover: null,
            mode: 'nearest',
            intersect: true,
            animationDuration: 400
        },
        onClick: null,
        maintainAspectRatio: true,
        responsive: true,
        responsiveAnimationDuration: 0
    });
    function mergeScaleConfig() {
        return helpers.merge({}, [].slice.call(arguments), {
            merger: function (key, target, source, options) {
                if (key === 'xAxes' || key === 'yAxes') {
                    var slen = source[key].length;
                    var i, type, scale;
                    if (!target[key]) {
                        target[key] = [];
                    }
                    for (i = 0; i < slen; ++i) {
                        scale = source[key][i];
                        type = valueOrDefault(scale.type, key === 'xAxes' ? 'category' : 'linear');
                        if (i >= target[key].length) {
                            target[key].push({});
                        }
                        if (!target[key][i].type || scale.type && scale.type !== target[key][i].type) {
                            helpers.merge(target[key][i], [
                                scaleService.getScaleDefaults(type),
                                scale
                            ]);
                        } else {
                            helpers.merge(target[key][i], scale);
                        }
                    }
                } else {
                    helpers._merger(key, target, source, options);
                }
            }
        });
    }
    function mergeConfig() {
        return helpers.merge({}, [].slice.call(arguments), {
            merger: function (key, target, source, options) {
                var tval = target[key] || {};
                var sval = source[key];
                if (key === 'scales') {
                    target[key] = mergeScaleConfig(tval, sval);
                } else if (key === 'scale') {
                    target[key] = helpers.merge(tval, [
                        scaleService.getScaleDefaults(sval.type),
                        sval
                    ]);
                } else {
                    helpers._merger(key, target, source, options);
                }
            }
        });
    }
    function initConfig(config) {
        config = config || {};
        var data = config.data = config.data || {};
        data.datasets = data.datasets || [];
        data.labels = data.labels || [];
        config.options = mergeConfig(defaults.global, defaults[config.type], config.options || {});
        return config;
    }
    function updateConfig(chart) {
        var newOptions = chart.options;
        helpers.each(chart.scales, function (scale) {
            layouts.removeBox(chart, scale);
        });
        newOptions = mergeConfig(defaults.global, defaults[chart.config.type], newOptions);
        chart.options = chart.config.options = newOptions;
        chart.ensureScalesHaveIDs();
        chart.buildOrUpdateScales();
        chart.tooltip._options = newOptions.tooltips;
        chart.tooltip.initialize();
    }
    function positionIsHorizontal(position) {
        return position === 'top' || position === 'bottom';
    }
    var Chart = function (item, config) {
        this.construct(item, config);
        return this;
    };
    helpers.extend(Chart.prototype, {
        construct: function (item, config) {
            var me = this;
            config = initConfig(config);
            var context = platform.acquireContext(item, config);
            var canvas = context && context.canvas;
            var height = canvas && canvas.height;
            var width = canvas && canvas.width;
            me.id = helpers.uid();
            me.ctx = context;
            me.canvas = canvas;
            me.config = config;
            me.width = width;
            me.height = height;
            me.aspectRatio = height ? width / height : null;
            me.options = config.options;
            me._bufferedRender = false;
            me.chart = me;
            me.controller = me;
            Chart.instances[me.id] = me;
            Object.defineProperty(me, 'data', {
                get: function () {
                    return me.config.data;
                },
                set: function (value) {
                    me.config.data = value;
                }
            });
            if (!context || !canvas) {
                console.error("Failed to create chart: can't acquire context from the given item");
                return;
            }
            me.initialize();
            me.update();
        },
        initialize: function () {
            var me = this;
            plugins.notify(me, 'beforeInit');
            helpers.retinaScale(me, me.options.devicePixelRatio);
            me.bindEvents();
            if (me.options.responsive) {
                me.resize(true);
            }
            me.ensureScalesHaveIDs();
            me.buildOrUpdateScales();
            me.initToolTip();
            plugins.notify(me, 'afterInit');
            return me;
        },
        clear: function () {
            helpers.canvas.clear(this);
            return this;
        },
        stop: function () {
            animations.cancelAnimation(this);
            return this;
        },
        resize: function (silent) {
            var me = this;
            var options = me.options;
            var canvas = me.canvas;
            var aspectRatio = options.maintainAspectRatio && me.aspectRatio || null;
            var newWidth = Math.max(0, Math.floor(helpers.getMaximumWidth(canvas)));
            var newHeight = Math.max(0, Math.floor(aspectRatio ? newWidth / aspectRatio : helpers.getMaximumHeight(canvas)));
            if (me.width === newWidth && me.height === newHeight) {
                return;
            }
            canvas.width = me.width = newWidth;
            canvas.height = me.height = newHeight;
            canvas.style.width = newWidth + 'px';
            canvas.style.height = newHeight + 'px';
            helpers.retinaScale(me, options.devicePixelRatio);
            if (!silent) {
                var newSize = {
                    width: newWidth,
                    height: newHeight
                };
                plugins.notify(me, 'resize', [newSize]);
                if (options.onResize) {
                    options.onResize(me, newSize);
                }
                me.stop();
                me.update({ duration: options.responsiveAnimationDuration });
            }
        },
        ensureScalesHaveIDs: function () {
            var options = this.options;
            var scalesOptions = options.scales || {};
            var scaleOptions = options.scale;
            helpers.each(scalesOptions.xAxes, function (xAxisOptions, index) {
                xAxisOptions.id = xAxisOptions.id || 'x-axis-' + index;
            });
            helpers.each(scalesOptions.yAxes, function (yAxisOptions, index) {
                yAxisOptions.id = yAxisOptions.id || 'y-axis-' + index;
            });
            if (scaleOptions) {
                scaleOptions.id = scaleOptions.id || 'scale';
            }
        },
        buildOrUpdateScales: function () {
            var me = this;
            var options = me.options;
            var scales = me.scales || {};
            var items = [];
            var updated = Object.keys(scales).reduce(function (obj, id) {
                obj[id] = false;
                return obj;
            }, {});
            if (options.scales) {
                items = items.concat((options.scales.xAxes || []).map(function (xAxisOptions) {
                    return {
                        options: xAxisOptions,
                        dtype: 'category',
                        dposition: 'bottom'
                    };
                }), (options.scales.yAxes || []).map(function (yAxisOptions) {
                    return {
                        options: yAxisOptions,
                        dtype: 'linear',
                        dposition: 'left'
                    };
                }));
            }
            if (options.scale) {
                items.push({
                    options: options.scale,
                    dtype: 'radialLinear',
                    isDefault: true,
                    dposition: 'chartArea'
                });
            }
            helpers.each(items, function (item) {
                var scaleOptions = item.options;
                var id = scaleOptions.id;
                var scaleType = valueOrDefault(scaleOptions.type, item.dtype);
                if (positionIsHorizontal(scaleOptions.position) !== positionIsHorizontal(item.dposition)) {
                    scaleOptions.position = item.dposition;
                }
                updated[id] = true;
                var scale = null;
                if (id in scales && scales[id].type === scaleType) {
                    scale = scales[id];
                    scale.options = scaleOptions;
                    scale.ctx = me.ctx;
                    scale.chart = me;
                } else {
                    var scaleClass = scaleService.getScaleConstructor(scaleType);
                    if (!scaleClass) {
                        return;
                    }
                    scale = new scaleClass({
                        id: id,
                        type: scaleType,
                        options: scaleOptions,
                        ctx: me.ctx,
                        chart: me
                    });
                    scales[scale.id] = scale;
                }
                scale.mergeTicksOptions();
                if (item.isDefault) {
                    me.scale = scale;
                }
            });
            helpers.each(updated, function (hasUpdated, id) {
                if (!hasUpdated) {
                    delete scales[id];
                }
            });
            me.scales = scales;
            scaleService.addScalesToLayout(this);
        },
        buildOrUpdateControllers: function () {
            var me = this;
            var newControllers = [];
            helpers.each(me.data.datasets, function (dataset, datasetIndex) {
                var meta = me.getDatasetMeta(datasetIndex);
                var type = dataset.type || me.config.type;
                if (meta.type && meta.type !== type) {
                    me.destroyDatasetMeta(datasetIndex);
                    meta = me.getDatasetMeta(datasetIndex);
                }
                meta.type = type;
                if (meta.controller) {
                    meta.controller.updateIndex(datasetIndex);
                    meta.controller.linkScales();
                } else {
                    var ControllerClass = controllers[meta.type];
                    if (ControllerClass === undefined) {
                        throw new Error('"' + meta.type + '" is not a chart type.');
                    }
                    meta.controller = new ControllerClass(me, datasetIndex);
                    newControllers.push(meta.controller);
                }
            }, me);
            return newControllers;
        },
        resetElements: function () {
            var me = this;
            helpers.each(me.data.datasets, function (dataset, datasetIndex) {
                me.getDatasetMeta(datasetIndex).controller.reset();
            }, me);
        },
        reset: function () {
            this.resetElements();
            this.tooltip.initialize();
        },
        update: function (config) {
            var me = this;
            if (!config || typeof config !== 'object') {
                config = {
                    duration: config,
                    lazy: arguments[1]
                };
            }
            updateConfig(me);
            plugins._invalidate(me);
            if (plugins.notify(me, 'beforeUpdate') === false) {
                return;
            }
            me.tooltip._data = me.data;
            var newControllers = me.buildOrUpdateControllers();
            helpers.each(me.data.datasets, function (dataset, datasetIndex) {
                me.getDatasetMeta(datasetIndex).controller.buildOrUpdateElements();
            }, me);
            me.updateLayout();
            if (me.options.animation && me.options.animation.duration) {
                helpers.each(newControllers, function (controller) {
                    controller.reset();
                });
            }
            me.updateDatasets();
            me.tooltip.initialize();
            me.lastActive = [];
            plugins.notify(me, 'afterUpdate');
            if (me._bufferedRender) {
                me._bufferedRequest = {
                    duration: config.duration,
                    easing: config.easing,
                    lazy: config.lazy
                };
            } else {
                me.render(config);
            }
        },
        updateLayout: function () {
            var me = this;
            if (plugins.notify(me, 'beforeLayout') === false) {
                return;
            }
            layouts.update(this, this.width, this.height);
            plugins.notify(me, 'afterScaleUpdate');
            plugins.notify(me, 'afterLayout');
        },
        updateDatasets: function () {
            var me = this;
            if (plugins.notify(me, 'beforeDatasetsUpdate') === false) {
                return;
            }
            for (var i = 0, ilen = me.data.datasets.length; i < ilen; ++i) {
                me.updateDataset(i);
            }
            plugins.notify(me, 'afterDatasetsUpdate');
        },
        updateDataset: function (index) {
            var me = this;
            var meta = me.getDatasetMeta(index);
            var args = {
                meta: meta,
                index: index
            };
            if (plugins.notify(me, 'beforeDatasetUpdate', [args]) === false) {
                return;
            }
            meta.controller.update();
            plugins.notify(me, 'afterDatasetUpdate', [args]);
        },
        render: function (config) {
            var me = this;
            if (!config || typeof config !== 'object') {
                config = {
                    duration: config,
                    lazy: arguments[1]
                };
            }
            var animationOptions = me.options.animation;
            var duration = valueOrDefault(config.duration, animationOptions && animationOptions.duration);
            var lazy = config.lazy;
            if (plugins.notify(me, 'beforeRender') === false) {
                return;
            }
            var onComplete = function (animation) {
                plugins.notify(me, 'afterRender');
                helpers.callback(animationOptions && animationOptions.onComplete, [animation], me);
            };
            if (animationOptions && duration) {
                var animation = new Animation({
                    numSteps: duration / 16.66,
                    easing: config.easing || animationOptions.easing,
                    render: function (chart, animationObject) {
                        var easingFunction = helpers.easing.effects[animationObject.easing];
                        var currentStep = animationObject.currentStep;
                        var stepDecimal = currentStep / animationObject.numSteps;
                        chart.draw(easingFunction(stepDecimal), stepDecimal, currentStep);
                    },
                    onAnimationProgress: animationOptions.onProgress,
                    onAnimationComplete: onComplete
                });
                animations.addAnimation(me, animation, duration, lazy);
            } else {
                me.draw();
                onComplete(new Animation({
                    numSteps: 0,
                    chart: me
                }));
            }
            return me;
        },
        draw: function (easingValue) {
            var me = this;
            me.clear();
            if (helpers.isNullOrUndef(easingValue)) {
                easingValue = 1;
            }
            me.transition(easingValue);
            if (me.width <= 0 || me.height <= 0) {
                return;
            }
            if (plugins.notify(me, 'beforeDraw', [easingValue]) === false) {
                return;
            }
            helpers.each(me.boxes, function (box) {
                box.draw(me.chartArea);
            }, me);
            me.drawDatasets(easingValue);
            me._drawTooltip(easingValue);
            plugins.notify(me, 'afterDraw', [easingValue]);
        },
        transition: function (easingValue) {
            var me = this;
            for (var i = 0, ilen = (me.data.datasets || []).length; i < ilen; ++i) {
                if (me.isDatasetVisible(i)) {
                    me.getDatasetMeta(i).controller.transition(easingValue);
                }
            }
            me.tooltip.transition(easingValue);
        },
        drawDatasets: function (easingValue) {
            var me = this;
            if (plugins.notify(me, 'beforeDatasetsDraw', [easingValue]) === false) {
                return;
            }
            for (var i = (me.data.datasets || []).length - 1; i >= 0; --i) {
                if (me.isDatasetVisible(i)) {
                    me.drawDataset(i, easingValue);
                }
            }
            plugins.notify(me, 'afterDatasetsDraw', [easingValue]);
        },
        drawDataset: function (index, easingValue) {
            var me = this;
            var meta = me.getDatasetMeta(index);
            var args = {
                meta: meta,
                index: index,
                easingValue: easingValue
            };
            if (plugins.notify(me, 'beforeDatasetDraw', [args]) === false) {
                return;
            }
            meta.controller.draw(easingValue);
            plugins.notify(me, 'afterDatasetDraw', [args]);
        },
        _drawTooltip: function (easingValue) {
            var me = this;
            var tooltip = me.tooltip;
            var args = {
                tooltip: tooltip,
                easingValue: easingValue
            };
            if (plugins.notify(me, 'beforeTooltipDraw', [args]) === false) {
                return;
            }
            tooltip.draw();
            plugins.notify(me, 'afterTooltipDraw', [args]);
        },
        getElementAtEvent: function (e) {
            return Interaction.modes.single(this, e);
        },
        getElementsAtEvent: function (e) {
            return Interaction.modes.label(this, e, { intersect: true });
        },
        getElementsAtXAxis: function (e) {
            return Interaction.modes['x-axis'](this, e, { intersect: true });
        },
        getElementsAtEventForMode: function (e, mode, options) {
            var method = Interaction.modes[mode];
            if (typeof method === 'function') {
                return method(this, e, options);
            }
            return [];
        },
        getDatasetAtEvent: function (e) {
            return Interaction.modes.dataset(this, e, { intersect: true });
        },
        getDatasetMeta: function (datasetIndex) {
            var me = this;
            var dataset = me.data.datasets[datasetIndex];
            if (!dataset._meta) {
                dataset._meta = {};
            }
            var meta = dataset._meta[me.id];
            if (!meta) {
                meta = dataset._meta[me.id] = {
                    type: null,
                    data: [],
                    dataset: null,
                    controller: null,
                    hidden: null,
                    xAxisID: null,
                    yAxisID: null
                };
            }
            return meta;
        },
        getVisibleDatasetCount: function () {
            var count = 0;
            for (var i = 0, ilen = this.data.datasets.length; i < ilen; ++i) {
                if (this.isDatasetVisible(i)) {
                    count++;
                }
            }
            return count;
        },
        isDatasetVisible: function (datasetIndex) {
            var meta = this.getDatasetMeta(datasetIndex);
            return typeof meta.hidden === 'boolean' ? !meta.hidden : !this.data.datasets[datasetIndex].hidden;
        },
        generateLegend: function () {
            return this.options.legendCallback(this);
        },
        destroyDatasetMeta: function (datasetIndex) {
            var id = this.id;
            var dataset = this.data.datasets[datasetIndex];
            var meta = dataset._meta && dataset._meta[id];
            if (meta) {
                meta.controller.destroy();
                delete dataset._meta[id];
            }
        },
        destroy: function () {
            var me = this;
            var canvas = me.canvas;
            var i, ilen;
            me.stop();
            for (i = 0, ilen = me.data.datasets.length; i < ilen; ++i) {
                me.destroyDatasetMeta(i);
            }
            if (canvas) {
                me.unbindEvents();
                helpers.canvas.clear(me);
                platform.releaseContext(me.ctx);
                me.canvas = null;
                me.ctx = null;
            }
            plugins.notify(me, 'destroy');
            delete Chart.instances[me.id];
        },
        toBase64Image: function () {
            return this.canvas.toDataURL.apply(this.canvas, arguments);
        },
        initToolTip: function () {
            var me = this;
            me.tooltip = new Tooltip({
                _chart: me,
                _chartInstance: me,
                _data: me.data,
                _options: me.options.tooltips
            }, me);
        },
        bindEvents: function () {
            var me = this;
            var listeners = me._listeners = {};
            var listener = function () {
                me.eventHandler.apply(me, arguments);
            };
            helpers.each(me.options.events, function (type) {
                platform.addEventListener(me, type, listener);
                listeners[type] = listener;
            });
            if (me.options.responsive) {
                listener = function () {
                    me.resize();
                };
                platform.addEventListener(me, 'resize', listener);
                listeners.resize = listener;
            }
        },
        unbindEvents: function () {
            var me = this;
            var listeners = me._listeners;
            if (!listeners) {
                return;
            }
            delete me._listeners;
            helpers.each(listeners, function (listener, type) {
                platform.removeEventListener(me, type, listener);
            });
        },
        updateHoverStyle: function (elements, mode, enabled) {
            var method = enabled ? 'setHoverStyle' : 'removeHoverStyle';
            var element, i, ilen;
            for (i = 0, ilen = elements.length; i < ilen; ++i) {
                element = elements[i];
                if (element) {
                    this.getDatasetMeta(element._datasetIndex).controller[method](element);
                }
            }
        },
        eventHandler: function (e) {
            var me = this;
            var tooltip = me.tooltip;
            if (plugins.notify(me, 'beforeEvent', [e]) === false) {
                return;
            }
            me._bufferedRender = true;
            me._bufferedRequest = null;
            var changed = me.handleEvent(e);
            if (tooltip) {
                changed = tooltip._start ? tooltip.handleEvent(e) : changed | tooltip.handleEvent(e);
            }
            plugins.notify(me, 'afterEvent', [e]);
            var bufferedRequest = me._bufferedRequest;
            if (bufferedRequest) {
                me.render(bufferedRequest);
            } else if (changed && !me.animating) {
                me.stop();
                me.render({
                    duration: me.options.hover.animationDuration,
                    lazy: true
                });
            }
            me._bufferedRender = false;
            me._bufferedRequest = null;
            return me;
        },
        handleEvent: function (e) {
            var me = this;
            var options = me.options || {};
            var hoverOptions = options.hover;
            var changed = false;
            me.lastActive = me.lastActive || [];
            if (e.type === 'mouseout') {
                me.active = [];
            } else {
                me.active = me.getElementsAtEventForMode(e, hoverOptions.mode, hoverOptions);
            }
            helpers.callback(options.onHover || options.hover.onHover, [
                e.native,
                me.active
            ], me);
            if (e.type === 'mouseup' || e.type === 'click') {
                if (options.onClick) {
                    options.onClick.call(me, e.native, me.active);
                }
            }
            if (me.lastActive.length) {
                me.updateHoverStyle(me.lastActive, hoverOptions.mode, false);
            }
            if (me.active.length && hoverOptions.mode) {
                me.updateHoverStyle(me.active, hoverOptions.mode, true);
            }
            changed = !helpers.arrayEquals(me.active, me.lastActive);
            me.lastActive = me.active;
            return changed;
        }
    });
    Chart.instances = {};
    module.exports = Chart;
    Chart.Controller = Chart;
    Chart.types = {};
    helpers.configMerge = mergeConfig;
    helpers.scaleMerge = mergeScaleConfig;
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/core/core.helpers',[
    '../../packages/chartjs-color',
    './core.defaults',
    '../helpers/index'
], function (__module__0, __module__1, __module__2) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var color = __module__0;
    var defaults = __module__1;
    var helpers = __module__2;
    module.exports = function () {
        helpers.where = function (collection, filterCallback) {
            if (helpers.isArray(collection) && Array.prototype.filter) {
                return collection.filter(filterCallback);
            }
            var filtered = [];
            helpers.each(collection, function (item) {
                if (filterCallback(item)) {
                    filtered.push(item);
                }
            });
            return filtered;
        };
        helpers.findIndex = Array.prototype.findIndex ? function (array, callback, scope) {
            return array.findIndex(callback, scope);
        } : function (array, callback, scope) {
            scope = scope === undefined ? array : scope;
            for (var i = 0, ilen = array.length; i < ilen; ++i) {
                if (callback.call(scope, array[i], i, array)) {
                    return i;
                }
            }
            return -1;
        };
        helpers.findNextWhere = function (arrayToSearch, filterCallback, startIndex) {
            if (helpers.isNullOrUndef(startIndex)) {
                startIndex = -1;
            }
            for (var i = startIndex + 1; i < arrayToSearch.length; i++) {
                var currentItem = arrayToSearch[i];
                if (filterCallback(currentItem)) {
                    return currentItem;
                }
            }
        };
        helpers.findPreviousWhere = function (arrayToSearch, filterCallback, startIndex) {
            if (helpers.isNullOrUndef(startIndex)) {
                startIndex = arrayToSearch.length;
            }
            for (var i = startIndex - 1; i >= 0; i--) {
                var currentItem = arrayToSearch[i];
                if (filterCallback(currentItem)) {
                    return currentItem;
                }
            }
        };
        helpers.isNumber = function (n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        };
        helpers.almostEquals = function (x, y, epsilon) {
            return Math.abs(x - y) < epsilon;
        };
        helpers.almostWhole = function (x, epsilon) {
            var rounded = Math.round(x);
            return rounded - epsilon < x && rounded + epsilon > x;
        };
        helpers.max = function (array) {
            return array.reduce(function (max, value) {
                if (!isNaN(value)) {
                    return Math.max(max, value);
                }
                return max;
            }, Number.NEGATIVE_INFINITY);
        };
        helpers.min = function (array) {
            return array.reduce(function (min, value) {
                if (!isNaN(value)) {
                    return Math.min(min, value);
                }
                return min;
            }, Number.POSITIVE_INFINITY);
        };
        helpers.sign = Math.sign ? function (x) {
            return Math.sign(x);
        } : function (x) {
            x = +x;
            if (x === 0 || isNaN(x)) {
                return x;
            }
            return x > 0 ? 1 : -1;
        };
        helpers.log10 = Math.log10 ? function (x) {
            return Math.log10(x);
        } : function (x) {
            var exponent = Math.log(x) * Math.LOG10E;
            var powerOf10 = Math.round(exponent);
            var isPowerOf10 = x === Math.pow(10, powerOf10);
            return isPowerOf10 ? powerOf10 : exponent;
        };
        helpers.toRadians = function (degrees) {
            return degrees * (Math.PI / 180);
        };
        helpers.toDegrees = function (radians) {
            return radians * (180 / Math.PI);
        };
        helpers._decimalPlaces = function (x) {
            if (!helpers.isFinite(x)) {
                return;
            }
            var e = 1;
            var p = 0;
            while (Math.round(x * e) / e !== x) {
                e *= 10;
                p++;
            }
            return p;
        };
        helpers.getAngleFromPoint = function (centrePoint, anglePoint) {
            var distanceFromXCenter = anglePoint.x - centrePoint.x;
            var distanceFromYCenter = anglePoint.y - centrePoint.y;
            var radialDistanceFromCenter = Math.sqrt(distanceFromXCenter * distanceFromXCenter + distanceFromYCenter * distanceFromYCenter);
            var angle = Math.atan2(distanceFromYCenter, distanceFromXCenter);
            if (angle < -0.5 * Math.PI) {
                angle += 2 * Math.PI;
            }
            return {
                angle: angle,
                distance: radialDistanceFromCenter
            };
        };
        helpers.distanceBetweenPoints = function (pt1, pt2) {
            return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));
        };
        helpers.aliasPixel = function (pixelWidth) {
            return pixelWidth % 2 === 0 ? 0 : 0.5;
        };
        helpers._alignPixel = function (chart, pixel, width) {
            var devicePixelRatio = chart.currentDevicePixelRatio;
            var halfWidth = width / 2;
            return Math.round((pixel - halfWidth) * devicePixelRatio) / devicePixelRatio + halfWidth;
        };
        helpers.splineCurve = function (firstPoint, middlePoint, afterPoint, t) {
            var previous = firstPoint.skip ? middlePoint : firstPoint;
            var current = middlePoint;
            var next = afterPoint.skip ? middlePoint : afterPoint;
            var d01 = Math.sqrt(Math.pow(current.x - previous.x, 2) + Math.pow(current.y - previous.y, 2));
            var d12 = Math.sqrt(Math.pow(next.x - current.x, 2) + Math.pow(next.y - current.y, 2));
            var s01 = d01 / (d01 + d12);
            var s12 = d12 / (d01 + d12);
            s01 = isNaN(s01) ? 0 : s01;
            s12 = isNaN(s12) ? 0 : s12;
            var fa = t * s01;
            var fb = t * s12;
            return {
                previous: {
                    x: current.x - fa * (next.x - previous.x),
                    y: current.y - fa * (next.y - previous.y)
                },
                next: {
                    x: current.x + fb * (next.x - previous.x),
                    y: current.y + fb * (next.y - previous.y)
                }
            };
        };
        helpers.EPSILON = Number.EPSILON || 1e-14;
        helpers.splineCurveMonotone = function (points) {
            var pointsWithTangents = (points || []).map(function (point) {
                return {
                    model: point._model,
                    deltaK: 0,
                    mK: 0
                };
            });
            var pointsLen = pointsWithTangents.length;
            var i, pointBefore, pointCurrent, pointAfter;
            for (i = 0; i < pointsLen; ++i) {
                pointCurrent = pointsWithTangents[i];
                if (pointCurrent.model.skip) {
                    continue;
                }
                pointBefore = i > 0 ? pointsWithTangents[i - 1] : null;
                pointAfter = i < pointsLen - 1 ? pointsWithTangents[i + 1] : null;
                if (pointAfter && !pointAfter.model.skip) {
                    var slopeDeltaX = pointAfter.model.x - pointCurrent.model.x;
                    pointCurrent.deltaK = slopeDeltaX !== 0 ? (pointAfter.model.y - pointCurrent.model.y) / slopeDeltaX : 0;
                }
                if (!pointBefore || pointBefore.model.skip) {
                    pointCurrent.mK = pointCurrent.deltaK;
                } else if (!pointAfter || pointAfter.model.skip) {
                    pointCurrent.mK = pointBefore.deltaK;
                } else if (this.sign(pointBefore.deltaK) !== this.sign(pointCurrent.deltaK)) {
                    pointCurrent.mK = 0;
                } else {
                    pointCurrent.mK = (pointBefore.deltaK + pointCurrent.deltaK) / 2;
                }
            }
            var alphaK, betaK, tauK, squaredMagnitude;
            for (i = 0; i < pointsLen - 1; ++i) {
                pointCurrent = pointsWithTangents[i];
                pointAfter = pointsWithTangents[i + 1];
                if (pointCurrent.model.skip || pointAfter.model.skip) {
                    continue;
                }
                if (helpers.almostEquals(pointCurrent.deltaK, 0, this.EPSILON)) {
                    pointCurrent.mK = pointAfter.mK = 0;
                    continue;
                }
                alphaK = pointCurrent.mK / pointCurrent.deltaK;
                betaK = pointAfter.mK / pointCurrent.deltaK;
                squaredMagnitude = Math.pow(alphaK, 2) + Math.pow(betaK, 2);
                if (squaredMagnitude <= 9) {
                    continue;
                }
                tauK = 3 / Math.sqrt(squaredMagnitude);
                pointCurrent.mK = alphaK * tauK * pointCurrent.deltaK;
                pointAfter.mK = betaK * tauK * pointCurrent.deltaK;
            }
            var deltaX;
            for (i = 0; i < pointsLen; ++i) {
                pointCurrent = pointsWithTangents[i];
                if (pointCurrent.model.skip) {
                    continue;
                }
                pointBefore = i > 0 ? pointsWithTangents[i - 1] : null;
                pointAfter = i < pointsLen - 1 ? pointsWithTangents[i + 1] : null;
                if (pointBefore && !pointBefore.model.skip) {
                    deltaX = (pointCurrent.model.x - pointBefore.model.x) / 3;
                    pointCurrent.model.controlPointPreviousX = pointCurrent.model.x - deltaX;
                    pointCurrent.model.controlPointPreviousY = pointCurrent.model.y - deltaX * pointCurrent.mK;
                }
                if (pointAfter && !pointAfter.model.skip) {
                    deltaX = (pointAfter.model.x - pointCurrent.model.x) / 3;
                    pointCurrent.model.controlPointNextX = pointCurrent.model.x + deltaX;
                    pointCurrent.model.controlPointNextY = pointCurrent.model.y + deltaX * pointCurrent.mK;
                }
            }
        };
        helpers.nextItem = function (collection, index, loop) {
            if (loop) {
                return index >= collection.length - 1 ? collection[0] : collection[index + 1];
            }
            return index >= collection.length - 1 ? collection[collection.length - 1] : collection[index + 1];
        };
        helpers.previousItem = function (collection, index, loop) {
            if (loop) {
                return index <= 0 ? collection[collection.length - 1] : collection[index - 1];
            }
            return index <= 0 ? collection[0] : collection[index - 1];
        };
        helpers.niceNum = function (range, round) {
            var exponent = Math.floor(helpers.log10(range));
            var fraction = range / Math.pow(10, exponent);
            var niceFraction;
            if (round) {
                if (fraction < 1.5) {
                    niceFraction = 1;
                } else if (fraction < 3) {
                    niceFraction = 2;
                } else if (fraction < 7) {
                    niceFraction = 5;
                } else {
                    niceFraction = 10;
                }
            } else if (fraction <= 1) {
                niceFraction = 1;
            } else if (fraction <= 2) {
                niceFraction = 2;
            } else if (fraction <= 5) {
                niceFraction = 5;
            } else {
                niceFraction = 10;
            }
            return niceFraction * Math.pow(10, exponent);
        };
        helpers.requestAnimFrame = function () {
            if (typeof window === 'undefined') {
                return function (callback) {
                    callback();
                };
            }
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
                return window.setTimeout(callback, 1000 / 60);
            };
        }();
        helpers.getRelativePosition = function (evt, chart) {
            var mouseX, mouseY;
            var e = evt.originalEvent || evt;
            var canvas = evt.target || evt.srcElement;
            var boundingRect = canvas.getBoundingClientRect();
            var touches = e.touches;
            if (touches && touches.length > 0) {
                mouseX = touches[0].clientX;
                mouseY = touches[0].clientY;
            } else {
                mouseX = e.clientX;
                mouseY = e.clientY;
            }
            var paddingLeft = parseFloat(helpers.getStyle(canvas, 'padding-left'));
            var paddingTop = parseFloat(helpers.getStyle(canvas, 'padding-top'));
            var paddingRight = parseFloat(helpers.getStyle(canvas, 'padding-right'));
            var paddingBottom = parseFloat(helpers.getStyle(canvas, 'padding-bottom'));
            var width = boundingRect.right - boundingRect.left - paddingLeft - paddingRight;
            var height = boundingRect.bottom - boundingRect.top - paddingTop - paddingBottom;
            mouseX = Math.round((mouseX - boundingRect.left - paddingLeft) / width * canvas.width / chart.currentDevicePixelRatio);
            mouseY = Math.round((mouseY - boundingRect.top - paddingTop) / height * canvas.height / chart.currentDevicePixelRatio);
            return {
                x: mouseX,
                y: mouseY
            };
        };
        function parseMaxStyle(styleValue, node, parentProperty) {
            var valueInPixels;
            if (typeof styleValue === 'string') {
                valueInPixels = parseInt(styleValue, 10);
                if (styleValue.indexOf('%') !== -1) {
                    valueInPixels = valueInPixels / 100 * node.parentNode[parentProperty];
                }
            } else {
                valueInPixels = styleValue;
            }
            return valueInPixels;
        }
        function isConstrainedValue(value) {
            return value !== undefined && value !== null && value !== 'none';
        }
        function getConstraintDimension(domNode, maxStyle, percentageProperty) {
            var view = document.defaultView;
            var parentNode = helpers._getParentNode(domNode);
            var constrainedNode = view.getComputedStyle(domNode)[maxStyle];
            var constrainedContainer = view.getComputedStyle(parentNode)[maxStyle];
            var hasCNode = isConstrainedValue(constrainedNode);
            var hasCContainer = isConstrainedValue(constrainedContainer);
            var infinity = Number.POSITIVE_INFINITY;
            if (hasCNode || hasCContainer) {
                return Math.min(hasCNode ? parseMaxStyle(constrainedNode, domNode, percentageProperty) : infinity, hasCContainer ? parseMaxStyle(constrainedContainer, parentNode, percentageProperty) : infinity);
            }
            return 'none';
        }
        helpers.getConstraintWidth = function (domNode) {
            return getConstraintDimension(domNode, 'max-width', 'clientWidth');
        };
        helpers.getConstraintHeight = function (domNode) {
            return getConstraintDimension(domNode, 'max-height', 'clientHeight');
        };
        helpers._calculatePadding = function (container, padding, parentDimension) {
            padding = helpers.getStyle(container, padding);
            return padding.indexOf('%') > -1 ? parentDimension * parseInt(padding, 10) / 100 : parseInt(padding, 10);
        };
        helpers._getParentNode = function (domNode) {
            var parent = domNode.parentNode;
            if (parent && parent.toString() === '[object ShadowRoot]') {
                parent = parent.host;
            }
            return parent;
        };
        helpers.getMaximumWidth = function (domNode) {
            var container = helpers._getParentNode(domNode);
            if (!container) {
                return domNode.clientWidth;
            }
            var clientWidth = container.clientWidth;
            var paddingLeft = helpers._calculatePadding(container, 'padding-left', clientWidth);
            var paddingRight = helpers._calculatePadding(container, 'padding-right', clientWidth);
            var w = clientWidth - paddingLeft - paddingRight;
            var cw = helpers.getConstraintWidth(domNode);
            return isNaN(cw) ? w : Math.min(w, cw);
        };
        helpers.getMaximumHeight = function (domNode) {
            var container = helpers._getParentNode(domNode);
            if (!container) {
                return domNode.clientHeight;
            }
            var clientHeight = container.clientHeight;
            var paddingTop = helpers._calculatePadding(container, 'padding-top', clientHeight);
            var paddingBottom = helpers._calculatePadding(container, 'padding-bottom', clientHeight);
            var h = clientHeight - paddingTop - paddingBottom;
            var ch = helpers.getConstraintHeight(domNode);
            return isNaN(ch) ? h : Math.min(h, ch);
        };
        helpers.getStyle = function (el, property) {
            return el.currentStyle ? el.currentStyle[property] : document.defaultView.getComputedStyle(el, null).getPropertyValue(property);
        };
        helpers.retinaScale = function (chart, forceRatio) {
            var pixelRatio = chart.currentDevicePixelRatio = forceRatio || typeof window !== 'undefined' && window.devicePixelRatio || 1;
            if (pixelRatio === 1) {
                return;
            }
            var canvas = chart.canvas;
            var height = chart.height;
            var width = chart.width;
            canvas.height = height * pixelRatio;
            canvas.width = width * pixelRatio;
            chart.ctx.scale(pixelRatio, pixelRatio);
            if (!canvas.style.height && !canvas.style.width) {
                canvas.style.height = height + 'px';
                canvas.style.width = width + 'px';
            }
        };
        helpers.fontString = function (pixelSize, fontStyle, fontFamily) {
            return fontStyle + ' ' + pixelSize + 'px ' + fontFamily;
        };
        helpers.longestText = function (ctx, font, arrayOfThings, cache) {
            cache = cache || {};
            var data = cache.data = cache.data || {};
            var gc = cache.garbageCollect = cache.garbageCollect || [];
            if (cache.font !== font) {
                data = cache.data = {};
                gc = cache.garbageCollect = [];
                cache.font = font;
            }
            ctx.font = font;
            var longest = 0;
            helpers.each(arrayOfThings, function (thing) {
                if (thing !== undefined && thing !== null && helpers.isArray(thing) !== true) {
                    longest = helpers.measureText(ctx, data, gc, longest, thing);
                } else if (helpers.isArray(thing)) {
                    helpers.each(thing, function (nestedThing) {
                        if (nestedThing !== undefined && nestedThing !== null && !helpers.isArray(nestedThing)) {
                            longest = helpers.measureText(ctx, data, gc, longest, nestedThing);
                        }
                    });
                }
            });
            var gcLen = gc.length / 2;
            if (gcLen > arrayOfThings.length) {
                for (var i = 0; i < gcLen; i++) {
                    delete data[gc[i]];
                }
                gc.splice(0, gcLen);
            }
            return longest;
        };
        helpers.measureText = function (ctx, data, gc, longest, string) {
            var textWidth = data[string];
            if (!textWidth) {
                textWidth = data[string] = ctx.measureText(string).width;
                gc.push(string);
            }
            if (textWidth > longest) {
                longest = textWidth;
            }
            return longest;
        };
        helpers.numberOfLabelLines = function (arrayOfThings) {
            var numberOfLines = 1;
            helpers.each(arrayOfThings, function (thing) {
                if (helpers.isArray(thing)) {
                    if (thing.length > numberOfLines) {
                        numberOfLines = thing.length;
                    }
                }
            });
            return numberOfLines;
        };
        helpers.color = !color ? function (value) {
            console.error('Color.js not found!');
            return value;
        } : function (value) {
            if (value instanceof CanvasGradient) {
                value = defaults.global.defaultColor;
            }
            return color(value);
        };
        helpers.getHoverColor = function (colorValue) {
            return colorValue instanceof CanvasPattern || colorValue instanceof CanvasGradient ? colorValue : helpers.color(colorValue).saturate(0.5).darken(0.1).rgbString();
        };
    };
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/core/core.adapters',['../helpers/index'], function (__module__0) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var helpers = __module__0;
    function abstract() {
        throw new Error('This method is not implemented: either no adapter can ' + 'be found or an incomplete integration was provided.');
    }
    function DateAdapter(options) {
        this.options = options || {};
    }
    helpers.extend(DateAdapter.prototype, {
        formats: abstract,
        parse: abstract,
        format: abstract,
        add: abstract,
        diff: abstract,
        startOf: abstract,
        endOf: abstract,
        _create: function (value) {
            return value;
        }
    });
    DateAdapter.override = function (members) {
        helpers.extend(DateAdapter.prototype, members);
    };
    module.exports._date = DateAdapter;
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/core/core.ticks',['../helpers/index'], function (__module__0) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var helpers = __module__0;
    module.exports = {
        formatters: {
            values: function (value) {
                return helpers.isArray(value) ? value : '' + value;
            },
            linear: function (tickValue, index, ticks) {
                var delta = ticks.length > 3 ? ticks[2] - ticks[1] : ticks[1] - ticks[0];
                if (Math.abs(delta) > 1) {
                    if (tickValue !== Math.floor(tickValue)) {
                        delta = tickValue - Math.floor(tickValue);
                    }
                }
                var logDelta = helpers.log10(Math.abs(delta));
                var tickString = '';
                if (tickValue !== 0) {
                    var maxTick = Math.max(Math.abs(ticks[0]), Math.abs(ticks[ticks.length - 1]));
                    if (maxTick < 0.0001) {
                        var logTick = helpers.log10(Math.abs(tickValue));
                        tickString = tickValue.toExponential(Math.floor(logTick) - Math.floor(logDelta));
                    } else {
                        var numDecimal = -1 * Math.floor(logDelta);
                        numDecimal = Math.max(Math.min(numDecimal, 20), 0);
                        tickString = tickValue.toFixed(numDecimal);
                    }
                } else {
                    tickString = '0';
                }
                return tickString;
            },
            logarithmic: function (tickValue, index, ticks) {
                var remain = tickValue / Math.pow(10, Math.floor(helpers.log10(tickValue)));
                if (tickValue === 0) {
                    return '0';
                } else if (remain === 1 || remain === 2 || remain === 5 || index === 0 || index === ticks.length - 1) {
                    return tickValue.toExponential();
                }
                return '';
            }
        }
    };
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/core/core.scale',[
    './core.defaults',
    './core.element',
    '../helpers/index',
    './core.ticks'
], function (__module__0, __module__1, __module__2, __module__3) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var defaults = __module__0;
    var Element = __module__1;
    var helpers = __module__2;
    var Ticks = __module__3;
    var valueOrDefault = helpers.valueOrDefault;
    var valueAtIndexOrDefault = helpers.valueAtIndexOrDefault;
    defaults._set('scale', {
        display: true,
        position: 'left',
        offset: false,
        gridLines: {
            display: true,
            color: 'rgba(0, 0, 0, 0.1)',
            lineWidth: 1,
            drawBorder: true,
            drawOnChartArea: true,
            drawTicks: true,
            tickMarkLength: 10,
            zeroLineWidth: 1,
            zeroLineColor: 'rgba(0,0,0,0.25)',
            zeroLineBorderDash: [],
            zeroLineBorderDashOffset: 0,
            offsetGridLines: false,
            borderDash: [],
            borderDashOffset: 0
        },
        scaleLabel: {
            display: false,
            labelString: '',
            padding: {
                top: 4,
                bottom: 4
            }
        },
        ticks: {
            beginAtZero: false,
            minRotation: 0,
            maxRotation: 50,
            mirror: false,
            padding: 0,
            reverse: false,
            display: true,
            autoSkip: true,
            autoSkipPadding: 0,
            labelOffset: 0,
            callback: Ticks.formatters.values,
            minor: {},
            major: {}
        }
    });
    function labelsFromTicks(ticks) {
        var labels = [];
        var i, ilen;
        for (i = 0, ilen = ticks.length; i < ilen; ++i) {
            labels.push(ticks[i].label);
        }
        return labels;
    }
    function getPixelForGridLine(scale, index, offsetGridLines) {
        var lineValue = scale.getPixelForTick(index);
        if (offsetGridLines) {
            if (scale.getTicks().length === 1) {
                lineValue -= scale.isHorizontal() ? Math.max(lineValue - scale.left, scale.right - lineValue) : Math.max(lineValue - scale.top, scale.bottom - lineValue);
            } else if (index === 0) {
                lineValue -= (scale.getPixelForTick(1) - lineValue) / 2;
            } else {
                lineValue -= (lineValue - scale.getPixelForTick(index - 1)) / 2;
            }
        }
        return lineValue;
    }
    function computeTextSize(context, tick, font) {
        return helpers.isArray(tick) ? helpers.longestText(context, font, tick) : context.measureText(tick).width;
    }
    module.exports = Element.extend({
        getPadding: function () {
            var me = this;
            return {
                left: me.paddingLeft || 0,
                top: me.paddingTop || 0,
                right: me.paddingRight || 0,
                bottom: me.paddingBottom || 0
            };
        },
        getTicks: function () {
            return this._ticks;
        },
        mergeTicksOptions: function () {
            var ticks = this.options.ticks;
            if (ticks.minor === false) {
                ticks.minor = { display: false };
            }
            if (ticks.major === false) {
                ticks.major = { display: false };
            }
            for (var key in ticks) {
                if (key !== 'major' && key !== 'minor') {
                    if (typeof ticks.minor[key] === 'undefined') {
                        ticks.minor[key] = ticks[key];
                    }
                    if (typeof ticks.major[key] === 'undefined') {
                        ticks.major[key] = ticks[key];
                    }
                }
            }
        },
        beforeUpdate: function () {
            helpers.callback(this.options.beforeUpdate, [this]);
        },
        update: function (maxWidth, maxHeight, margins) {
            var me = this;
            var i, ilen, labels, label, ticks, tick;
            me.beforeUpdate();
            me.maxWidth = maxWidth;
            me.maxHeight = maxHeight;
            me.margins = helpers.extend({
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }, margins);
            me._maxLabelLines = 0;
            me.longestLabelWidth = 0;
            me.longestTextCache = me.longestTextCache || {};
            me.beforeSetDimensions();
            me.setDimensions();
            me.afterSetDimensions();
            me.beforeDataLimits();
            me.determineDataLimits();
            me.afterDataLimits();
            me.beforeBuildTicks();
            ticks = me.buildTicks() || [];
            ticks = me.afterBuildTicks(ticks) || ticks;
            me.beforeTickToLabelConversion();
            labels = me.convertTicksToLabels(ticks) || me.ticks;
            me.afterTickToLabelConversion();
            me.ticks = labels;
            for (i = 0, ilen = labels.length; i < ilen; ++i) {
                label = labels[i];
                tick = ticks[i];
                if (!tick) {
                    ticks.push(tick = {
                        label: label,
                        major: false
                    });
                } else {
                    tick.label = label;
                }
            }
            me._ticks = ticks;
            me.beforeCalculateTickRotation();
            me.calculateTickRotation();
            me.afterCalculateTickRotation();
            me.beforeFit();
            me.fit();
            me.afterFit();
            me.afterUpdate();
            return me.minSize;
        },
        afterUpdate: function () {
            helpers.callback(this.options.afterUpdate, [this]);
        },
        beforeSetDimensions: function () {
            helpers.callback(this.options.beforeSetDimensions, [this]);
        },
        setDimensions: function () {
            var me = this;
            if (me.isHorizontal()) {
                me.width = me.maxWidth;
                me.left = 0;
                me.right = me.width;
            } else {
                me.height = me.maxHeight;
                me.top = 0;
                me.bottom = me.height;
            }
            me.paddingLeft = 0;
            me.paddingTop = 0;
            me.paddingRight = 0;
            me.paddingBottom = 0;
        },
        afterSetDimensions: function () {
            helpers.callback(this.options.afterSetDimensions, [this]);
        },
        beforeDataLimits: function () {
            helpers.callback(this.options.beforeDataLimits, [this]);
        },
        determineDataLimits: helpers.noop,
        afterDataLimits: function () {
            helpers.callback(this.options.afterDataLimits, [this]);
        },
        beforeBuildTicks: function () {
            helpers.callback(this.options.beforeBuildTicks, [this]);
        },
        buildTicks: helpers.noop,
        afterBuildTicks: function (ticks) {
            var me = this;
            if (helpers.isArray(ticks) && ticks.length) {
                return helpers.callback(me.options.afterBuildTicks, [
                    me,
                    ticks
                ]);
            }
            me.ticks = helpers.callback(me.options.afterBuildTicks, [
                me,
                me.ticks
            ]) || me.ticks;
            return ticks;
        },
        beforeTickToLabelConversion: function () {
            helpers.callback(this.options.beforeTickToLabelConversion, [this]);
        },
        convertTicksToLabels: function () {
            var me = this;
            var tickOpts = me.options.ticks;
            me.ticks = me.ticks.map(tickOpts.userCallback || tickOpts.callback, this);
        },
        afterTickToLabelConversion: function () {
            helpers.callback(this.options.afterTickToLabelConversion, [this]);
        },
        beforeCalculateTickRotation: function () {
            helpers.callback(this.options.beforeCalculateTickRotation, [this]);
        },
        calculateTickRotation: function () {
            var me = this;
            var context = me.ctx;
            var tickOpts = me.options.ticks;
            var labels = labelsFromTicks(me._ticks);
            var tickFont = helpers.options._parseFont(tickOpts);
            context.font = tickFont.string;
            var labelRotation = tickOpts.minRotation || 0;
            if (labels.length && me.options.display && me.isHorizontal()) {
                var originalLabelWidth = helpers.longestText(context, tickFont.string, labels, me.longestTextCache);
                var labelWidth = originalLabelWidth;
                var cosRotation, sinRotation;
                var tickWidth = me.getPixelForTick(1) - me.getPixelForTick(0) - 6;
                while (labelWidth > tickWidth && labelRotation < tickOpts.maxRotation) {
                    var angleRadians = helpers.toRadians(labelRotation);
                    cosRotation = Math.cos(angleRadians);
                    sinRotation = Math.sin(angleRadians);
                    if (sinRotation * originalLabelWidth > me.maxHeight) {
                        labelRotation--;
                        break;
                    }
                    labelRotation++;
                    labelWidth = cosRotation * originalLabelWidth;
                }
            }
            me.labelRotation = labelRotation;
        },
        afterCalculateTickRotation: function () {
            helpers.callback(this.options.afterCalculateTickRotation, [this]);
        },
        beforeFit: function () {
            helpers.callback(this.options.beforeFit, [this]);
        },
        fit: function () {
            var me = this;
            var minSize = me.minSize = {
                width: 0,
                height: 0
            };
            var labels = labelsFromTicks(me._ticks);
            var opts = me.options;
            var tickOpts = opts.ticks;
            var scaleLabelOpts = opts.scaleLabel;
            var gridLineOpts = opts.gridLines;
            var display = me._isVisible();
            var position = opts.position;
            var isHorizontal = me.isHorizontal();
            var parseFont = helpers.options._parseFont;
            var tickFont = parseFont(tickOpts);
            var tickMarkLength = opts.gridLines.tickMarkLength;
            if (isHorizontal) {
                minSize.width = me.isFullWidth() ? me.maxWidth - me.margins.left - me.margins.right : me.maxWidth;
            } else {
                minSize.width = display && gridLineOpts.drawTicks ? tickMarkLength : 0;
            }
            if (isHorizontal) {
                minSize.height = display && gridLineOpts.drawTicks ? tickMarkLength : 0;
            } else {
                minSize.height = me.maxHeight;
            }
            if (scaleLabelOpts.display && display) {
                var scaleLabelFont = parseFont(scaleLabelOpts);
                var scaleLabelPadding = helpers.options.toPadding(scaleLabelOpts.padding);
                var deltaHeight = scaleLabelFont.lineHeight + scaleLabelPadding.height;
                if (isHorizontal) {
                    minSize.height += deltaHeight;
                } else {
                    minSize.width += deltaHeight;
                }
            }
            if (tickOpts.display && display) {
                var largestTextWidth = helpers.longestText(me.ctx, tickFont.string, labels, me.longestTextCache);
                var tallestLabelHeightInLines = helpers.numberOfLabelLines(labels);
                var lineSpace = tickFont.size * 0.5;
                var tickPadding = me.options.ticks.padding;
                me._maxLabelLines = tallestLabelHeightInLines;
                me.longestLabelWidth = largestTextWidth;
                if (isHorizontal) {
                    var angleRadians = helpers.toRadians(me.labelRotation);
                    var cosRotation = Math.cos(angleRadians);
                    var sinRotation = Math.sin(angleRadians);
                    var labelHeight = sinRotation * largestTextWidth + tickFont.lineHeight * tallestLabelHeightInLines + lineSpace;
                    minSize.height = Math.min(me.maxHeight, minSize.height + labelHeight + tickPadding);
                    me.ctx.font = tickFont.string;
                    var firstLabelWidth = computeTextSize(me.ctx, labels[0], tickFont.string);
                    var lastLabelWidth = computeTextSize(me.ctx, labels[labels.length - 1], tickFont.string);
                    var offsetLeft = me.getPixelForTick(0) - me.left;
                    var offsetRight = me.right - me.getPixelForTick(labels.length - 1);
                    var paddingLeft, paddingRight;
                    if (me.labelRotation !== 0) {
                        paddingLeft = position === 'bottom' ? cosRotation * firstLabelWidth : cosRotation * lineSpace;
                        paddingRight = position === 'bottom' ? cosRotation * lineSpace : cosRotation * lastLabelWidth;
                    } else {
                        paddingLeft = firstLabelWidth / 2;
                        paddingRight = lastLabelWidth / 2;
                    }
                    me.paddingLeft = Math.max(paddingLeft - offsetLeft, 0) + 3;
                    me.paddingRight = Math.max(paddingRight - offsetRight, 0) + 3;
                } else {
                    if (tickOpts.mirror) {
                        largestTextWidth = 0;
                    } else {
                        largestTextWidth += tickPadding + lineSpace;
                    }
                    minSize.width = Math.min(me.maxWidth, minSize.width + largestTextWidth);
                    me.paddingTop = tickFont.size / 2;
                    me.paddingBottom = tickFont.size / 2;
                }
            }
            me.handleMargins();
            me.width = minSize.width;
            me.height = minSize.height;
        },
        handleMargins: function () {
            var me = this;
            if (me.margins) {
                me.paddingLeft = Math.max(me.paddingLeft - me.margins.left, 0);
                me.paddingTop = Math.max(me.paddingTop - me.margins.top, 0);
                me.paddingRight = Math.max(me.paddingRight - me.margins.right, 0);
                me.paddingBottom = Math.max(me.paddingBottom - me.margins.bottom, 0);
            }
        },
        afterFit: function () {
            helpers.callback(this.options.afterFit, [this]);
        },
        isHorizontal: function () {
            return this.options.position === 'top' || this.options.position === 'bottom';
        },
        isFullWidth: function () {
            return this.options.fullWidth;
        },
        getRightValue: function (rawValue) {
            if (helpers.isNullOrUndef(rawValue)) {
                return NaN;
            }
            if ((typeof rawValue === 'number' || rawValue instanceof Number) && !isFinite(rawValue)) {
                return NaN;
            }
            if (rawValue) {
                if (this.isHorizontal()) {
                    if (rawValue.x !== undefined) {
                        return this.getRightValue(rawValue.x);
                    }
                } else if (rawValue.y !== undefined) {
                    return this.getRightValue(rawValue.y);
                }
            }
            return rawValue;
        },
        getLabelForIndex: helpers.noop,
        getPixelForValue: helpers.noop,
        getValueForPixel: helpers.noop,
        getPixelForTick: function (index) {
            var me = this;
            var offset = me.options.offset;
            if (me.isHorizontal()) {
                var innerWidth = me.width - (me.paddingLeft + me.paddingRight);
                var tickWidth = innerWidth / Math.max(me._ticks.length - (offset ? 0 : 1), 1);
                var pixel = tickWidth * index + me.paddingLeft;
                if (offset) {
                    pixel += tickWidth / 2;
                }
                var finalVal = me.left + pixel;
                finalVal += me.isFullWidth() ? me.margins.left : 0;
                return finalVal;
            }
            var innerHeight = me.height - (me.paddingTop + me.paddingBottom);
            return me.top + index * (innerHeight / (me._ticks.length - 1));
        },
        getPixelForDecimal: function (decimal) {
            var me = this;
            if (me.isHorizontal()) {
                var innerWidth = me.width - (me.paddingLeft + me.paddingRight);
                var valueOffset = innerWidth * decimal + me.paddingLeft;
                var finalVal = me.left + valueOffset;
                finalVal += me.isFullWidth() ? me.margins.left : 0;
                return finalVal;
            }
            return me.top + decimal * me.height;
        },
        getBasePixel: function () {
            return this.getPixelForValue(this.getBaseValue());
        },
        getBaseValue: function () {
            var me = this;
            var min = me.min;
            var max = me.max;
            return me.beginAtZero ? 0 : min < 0 && max < 0 ? max : min > 0 && max > 0 ? min : 0;
        },
        _autoSkip: function (ticks) {
            var me = this;
            var isHorizontal = me.isHorizontal();
            var optionTicks = me.options.ticks.minor;
            var tickCount = ticks.length;
            var skipRatio = false;
            var maxTicks = optionTicks.maxTicksLimit;
            var ticksLength = me._tickSize() * (tickCount - 1);
            var axisLength = isHorizontal ? me.width - (me.paddingLeft + me.paddingRight) : me.height - (me.paddingTop + me.PaddingBottom);
            var result = [];
            var i, tick;
            if (ticksLength > axisLength) {
                skipRatio = 1 + Math.floor(ticksLength / axisLength);
            }
            if (tickCount > maxTicks) {
                skipRatio = Math.max(skipRatio, 1 + Math.floor(tickCount / maxTicks));
            }
            for (i = 0; i < tickCount; i++) {
                tick = ticks[i];
                if (skipRatio > 1 && i % skipRatio > 0) {
                    delete tick.label;
                }
                result.push(tick);
            }
            return result;
        },
        _tickSize: function () {
            var me = this;
            var isHorizontal = me.isHorizontal();
            var optionTicks = me.options.ticks.minor;
            var rot = helpers.toRadians(me.labelRotation);
            var cos = Math.abs(Math.cos(rot));
            var sin = Math.abs(Math.sin(rot));
            var padding = optionTicks.autoSkipPadding || 0;
            var w = me.longestLabelWidth + padding || 0;
            var tickFont = helpers.options._parseFont(optionTicks);
            var h = me._maxLabelLines * tickFont.lineHeight + padding || 0;
            return isHorizontal ? h * cos > w * sin ? w / cos : h / sin : h * sin < w * cos ? h / cos : w / sin;
        },
        _isVisible: function () {
            var me = this;
            var chart = me.chart;
            var display = me.options.display;
            var i, ilen, meta;
            if (display !== 'auto') {
                return !!display;
            }
            for (i = 0, ilen = chart.data.datasets.length; i < ilen; ++i) {
                if (chart.isDatasetVisible(i)) {
                    meta = chart.getDatasetMeta(i);
                    if (meta.xAxisID === me.id || meta.yAxisID === me.id) {
                        return true;
                    }
                }
            }
            return false;
        },
        draw: function (chartArea) {
            var me = this;
            var options = me.options;
            if (!me._isVisible()) {
                return;
            }
            var chart = me.chart;
            var context = me.ctx;
            var globalDefaults = defaults.global;
            var defaultFontColor = globalDefaults.defaultFontColor;
            var optionTicks = options.ticks.minor;
            var optionMajorTicks = options.ticks.major || optionTicks;
            var gridLines = options.gridLines;
            var scaleLabel = options.scaleLabel;
            var position = options.position;
            var isRotated = me.labelRotation !== 0;
            var isMirrored = optionTicks.mirror;
            var isHorizontal = me.isHorizontal();
            var parseFont = helpers.options._parseFont;
            var ticks = optionTicks.display && optionTicks.autoSkip ? me._autoSkip(me.getTicks()) : me.getTicks();
            var tickFontColor = valueOrDefault(optionTicks.fontColor, defaultFontColor);
            var tickFont = parseFont(optionTicks);
            var lineHeight = tickFont.lineHeight;
            var majorTickFontColor = valueOrDefault(optionMajorTicks.fontColor, defaultFontColor);
            var majorTickFont = parseFont(optionMajorTicks);
            var tickPadding = optionTicks.padding;
            var labelOffset = optionTicks.labelOffset;
            var tl = gridLines.drawTicks ? gridLines.tickMarkLength : 0;
            var scaleLabelFontColor = valueOrDefault(scaleLabel.fontColor, defaultFontColor);
            var scaleLabelFont = parseFont(scaleLabel);
            var scaleLabelPadding = helpers.options.toPadding(scaleLabel.padding);
            var labelRotationRadians = helpers.toRadians(me.labelRotation);
            var itemsToDraw = [];
            var axisWidth = gridLines.drawBorder ? valueAtIndexOrDefault(gridLines.lineWidth, 0, 0) : 0;
            var alignPixel = helpers._alignPixel;
            var borderValue, tickStart, tickEnd;
            if (position === 'top') {
                borderValue = alignPixel(chart, me.bottom, axisWidth);
                tickStart = me.bottom - tl;
                tickEnd = borderValue - axisWidth / 2;
            } else if (position === 'bottom') {
                borderValue = alignPixel(chart, me.top, axisWidth);
                tickStart = borderValue + axisWidth / 2;
                tickEnd = me.top + tl;
            } else if (position === 'left') {
                borderValue = alignPixel(chart, me.right, axisWidth);
                tickStart = me.right - tl;
                tickEnd = borderValue - axisWidth / 2;
            } else {
                borderValue = alignPixel(chart, me.left, axisWidth);
                tickStart = borderValue + axisWidth / 2;
                tickEnd = me.left + tl;
            }
            var epsilon = 1e-7;
            helpers.each(ticks, function (tick, index) {
                if (helpers.isNullOrUndef(tick.label)) {
                    return;
                }
                var label = tick.label;
                var lineWidth, lineColor, borderDash, borderDashOffset;
                if (index === me.zeroLineIndex && options.offset === gridLines.offsetGridLines) {
                    lineWidth = gridLines.zeroLineWidth;
                    lineColor = gridLines.zeroLineColor;
                    borderDash = gridLines.zeroLineBorderDash || [];
                    borderDashOffset = gridLines.zeroLineBorderDashOffset || 0;
                } else {
                    lineWidth = valueAtIndexOrDefault(gridLines.lineWidth, index);
                    lineColor = valueAtIndexOrDefault(gridLines.color, index);
                    borderDash = gridLines.borderDash || [];
                    borderDashOffset = gridLines.borderDashOffset || 0;
                }
                var tx1, ty1, tx2, ty2, x1, y1, x2, y2, labelX, labelY, textOffset, textAlign;
                var labelCount = helpers.isArray(label) ? label.length : 1;
                var lineValue = getPixelForGridLine(me, index, gridLines.offsetGridLines);
                if (isHorizontal) {
                    var labelYOffset = tl + tickPadding;
                    if (lineValue < me.left - epsilon) {
                        lineColor = 'rgba(0,0,0,0)';
                    }
                    tx1 = tx2 = x1 = x2 = alignPixel(chart, lineValue, lineWidth);
                    ty1 = tickStart;
                    ty2 = tickEnd;
                    labelX = me.getPixelForTick(index) + labelOffset;
                    if (position === 'top') {
                        y1 = alignPixel(chart, chartArea.top, axisWidth) + axisWidth / 2;
                        y2 = chartArea.bottom;
                        textOffset = ((!isRotated ? 0.5 : 1) - labelCount) * lineHeight;
                        textAlign = !isRotated ? 'center' : 'left';
                        labelY = me.bottom - labelYOffset;
                    } else {
                        y1 = chartArea.top;
                        y2 = alignPixel(chart, chartArea.bottom, axisWidth) - axisWidth / 2;
                        textOffset = (!isRotated ? 0.5 : 0) * lineHeight;
                        textAlign = !isRotated ? 'center' : 'right';
                        labelY = me.top + labelYOffset;
                    }
                } else {
                    var labelXOffset = (isMirrored ? 0 : tl) + tickPadding;
                    if (lineValue < me.top - epsilon) {
                        lineColor = 'rgba(0,0,0,0)';
                    }
                    tx1 = tickStart;
                    tx2 = tickEnd;
                    ty1 = ty2 = y1 = y2 = alignPixel(chart, lineValue, lineWidth);
                    labelY = me.getPixelForTick(index) + labelOffset;
                    textOffset = (1 - labelCount) * lineHeight / 2;
                    if (position === 'left') {
                        x1 = alignPixel(chart, chartArea.left, axisWidth) + axisWidth / 2;
                        x2 = chartArea.right;
                        textAlign = isMirrored ? 'left' : 'right';
                        labelX = me.right - labelXOffset;
                    } else {
                        x1 = chartArea.left;
                        x2 = alignPixel(chart, chartArea.right, axisWidth) - axisWidth / 2;
                        textAlign = isMirrored ? 'right' : 'left';
                        labelX = me.left + labelXOffset;
                    }
                }
                itemsToDraw.push({
                    tx1: tx1,
                    ty1: ty1,
                    tx2: tx2,
                    ty2: ty2,
                    x1: x1,
                    y1: y1,
                    x2: x2,
                    y2: y2,
                    labelX: labelX,
                    labelY: labelY,
                    glWidth: lineWidth,
                    glColor: lineColor,
                    glBorderDash: borderDash,
                    glBorderDashOffset: borderDashOffset,
                    rotation: -1 * labelRotationRadians,
                    label: label,
                    major: tick.major,
                    textOffset: textOffset,
                    textAlign: textAlign
                });
            });
            helpers.each(itemsToDraw, function (itemToDraw) {
                var glWidth = itemToDraw.glWidth;
                var glColor = itemToDraw.glColor;
                if (gridLines.display && glWidth && glColor) {
                    context.save();
                    context.lineWidth = glWidth;
                    context.strokeStyle = glColor;
                    if (context.setLineDash) {
                        context.setLineDash(itemToDraw.glBorderDash);
                        context.lineDashOffset = itemToDraw.glBorderDashOffset;
                    }
                    context.beginPath();
                    if (gridLines.drawTicks) {
                        context.moveTo(itemToDraw.tx1, itemToDraw.ty1);
                        context.lineTo(itemToDraw.tx2, itemToDraw.ty2);
                    }
                    if (gridLines.drawOnChartArea) {
                        context.moveTo(itemToDraw.x1, itemToDraw.y1);
                        context.lineTo(itemToDraw.x2, itemToDraw.y2);
                    }
                    context.stroke();
                    context.restore();
                }
                if (optionTicks.display) {
                    context.save();
                    context.translate(itemToDraw.labelX, itemToDraw.labelY);
                    context.rotate(itemToDraw.rotation);
                    context.font = itemToDraw.major ? majorTickFont.string : tickFont.string;
                    context.fillStyle = itemToDraw.major ? majorTickFontColor : tickFontColor;
                    context.textBaseline = 'middle';
                    context.textAlign = itemToDraw.textAlign;
                    var label = itemToDraw.label;
                    var y = itemToDraw.textOffset;
                    if (helpers.isArray(label)) {
                        for (var i = 0; i < label.length; ++i) {
                            context.fillText('' + label[i], 0, y);
                            y += lineHeight;
                        }
                    } else {
                        context.fillText(label, 0, y);
                    }
                    context.restore();
                }
            });
            if (scaleLabel.display) {
                var scaleLabelX;
                var scaleLabelY;
                var rotation = 0;
                var halfLineHeight = scaleLabelFont.lineHeight / 2;
                if (isHorizontal) {
                    scaleLabelX = me.left + (me.right - me.left) / 2;
                    scaleLabelY = position === 'bottom' ? me.bottom - halfLineHeight - scaleLabelPadding.bottom : me.top + halfLineHeight + scaleLabelPadding.top;
                } else {
                    var isLeft = position === 'left';
                    scaleLabelX = isLeft ? me.left + halfLineHeight + scaleLabelPadding.top : me.right - halfLineHeight - scaleLabelPadding.top;
                    scaleLabelY = me.top + (me.bottom - me.top) / 2;
                    rotation = isLeft ? -0.5 * Math.PI : 0.5 * Math.PI;
                }
                context.save();
                context.translate(scaleLabelX, scaleLabelY);
                context.rotate(rotation);
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.fillStyle = scaleLabelFontColor;
                context.font = scaleLabelFont.string;
                context.fillText(scaleLabel.labelString, 0, 0);
                context.restore();
            }
            if (axisWidth) {
                var firstLineWidth = axisWidth;
                var lastLineWidth = valueAtIndexOrDefault(gridLines.lineWidth, ticks.length - 1, 0);
                var x1, x2, y1, y2;
                if (isHorizontal) {
                    x1 = alignPixel(chart, me.left, firstLineWidth) - firstLineWidth / 2;
                    x2 = alignPixel(chart, me.right, lastLineWidth) + lastLineWidth / 2;
                    y1 = y2 = borderValue;
                } else {
                    y1 = alignPixel(chart, me.top, firstLineWidth) - firstLineWidth / 2;
                    y2 = alignPixel(chart, me.bottom, lastLineWidth) + lastLineWidth / 2;
                    x1 = x2 = borderValue;
                }
                context.lineWidth = axisWidth;
                context.strokeStyle = valueAtIndexOrDefault(gridLines.color, 0);
                context.beginPath();
                context.moveTo(x1, y1);
                context.lineTo(x2, y2);
                context.stroke();
            }
        }
    });
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/scales/scale.category',['../core/core.scale'], function (__module__0) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var Scale = __module__0;
    var defaultConfig = { position: 'bottom' };
    module.exports = Scale.extend({
        getLabels: function () {
            var data = this.chart.data;
            return this.options.labels || (this.isHorizontal() ? data.xLabels : data.yLabels) || data.labels;
        },
        determineDataLimits: function () {
            var me = this;
            var labels = me.getLabels();
            me.minIndex = 0;
            me.maxIndex = labels.length - 1;
            var findIndex;
            if (me.options.ticks.min !== undefined) {
                findIndex = labels.indexOf(me.options.ticks.min);
                me.minIndex = findIndex !== -1 ? findIndex : me.minIndex;
            }
            if (me.options.ticks.max !== undefined) {
                findIndex = labels.indexOf(me.options.ticks.max);
                me.maxIndex = findIndex !== -1 ? findIndex : me.maxIndex;
            }
            me.min = labels[me.minIndex];
            me.max = labels[me.maxIndex];
        },
        buildTicks: function () {
            var me = this;
            var labels = me.getLabels();
            me.ticks = me.minIndex === 0 && me.maxIndex === labels.length - 1 ? labels : labels.slice(me.minIndex, me.maxIndex + 1);
        },
        getLabelForIndex: function (index, datasetIndex) {
            var me = this;
            var chart = me.chart;
            if (chart.getDatasetMeta(datasetIndex).controller._getValueScaleId() === me.id) {
                return me.getRightValue(chart.data.datasets[datasetIndex].data[index]);
            }
            return me.ticks[index - me.minIndex];
        },
        getPixelForValue: function (value, index) {
            var me = this;
            var offset = me.options.offset;
            var offsetAmt = Math.max(me.maxIndex + 1 - me.minIndex - (offset ? 0 : 1), 1);
            var valueCategory;
            if (value !== undefined && value !== null) {
                valueCategory = me.isHorizontal() ? value.x : value.y;
            }
            if (valueCategory !== undefined || value !== undefined && isNaN(index)) {
                var labels = me.getLabels();
                value = valueCategory || value;
                var idx = labels.indexOf(value);
                index = idx !== -1 ? idx : index;
            }
            if (me.isHorizontal()) {
                var valueWidth = me.width / offsetAmt;
                var widthOffset = valueWidth * (index - me.minIndex);
                if (offset) {
                    widthOffset += valueWidth / 2;
                }
                return me.left + widthOffset;
            }
            var valueHeight = me.height / offsetAmt;
            var heightOffset = valueHeight * (index - me.minIndex);
            if (offset) {
                heightOffset += valueHeight / 2;
            }
            return me.top + heightOffset;
        },
        getPixelForTick: function (index) {
            return this.getPixelForValue(this.ticks[index], index + this.minIndex, null);
        },
        getValueForPixel: function (pixel) {
            var me = this;
            var offset = me.options.offset;
            var value;
            var offsetAmt = Math.max(me._ticks.length - (offset ? 0 : 1), 1);
            var horz = me.isHorizontal();
            var valueDimension = (horz ? me.width : me.height) / offsetAmt;
            pixel -= horz ? me.left : me.top;
            if (offset) {
                pixel -= valueDimension / 2;
            }
            if (pixel <= 0) {
                value = 0;
            } else {
                value = Math.round(pixel / valueDimension);
            }
            return value + me.minIndex;
        },
        getBasePixel: function () {
            return this.bottom;
        }
    });
    module.exports._defaults = defaultConfig;
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/scales/scale.linearbase',[
    '../helpers/index',
    '../core/core.scale'
], function (__module__0, __module__1) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var helpers = __module__0;
    var Scale = __module__1;
    var noop = helpers.noop;
    var isNullOrUndef = helpers.isNullOrUndef;
    function generateTicks(generationOptions, dataRange) {
        var ticks = [];
        var MIN_SPACING = 1e-14;
        var stepSize = generationOptions.stepSize;
        var unit = stepSize || 1;
        var maxNumSpaces = generationOptions.maxTicks - 1;
        var min = generationOptions.min;
        var max = generationOptions.max;
        var precision = generationOptions.precision;
        var rmin = dataRange.min;
        var rmax = dataRange.max;
        var spacing = helpers.niceNum((rmax - rmin) / maxNumSpaces / unit) * unit;
        var factor, niceMin, niceMax, numSpaces;
        if (spacing < MIN_SPACING && isNullOrUndef(min) && isNullOrUndef(max)) {
            return [
                rmin,
                rmax
            ];
        }
        numSpaces = Math.ceil(rmax / spacing) - Math.floor(rmin / spacing);
        if (numSpaces > maxNumSpaces) {
            spacing = helpers.niceNum(numSpaces * spacing / maxNumSpaces / unit) * unit;
        }
        if (stepSize || isNullOrUndef(precision)) {
            factor = Math.pow(10, helpers._decimalPlaces(spacing));
        } else {
            factor = Math.pow(10, precision);
            spacing = Math.ceil(spacing * factor) / factor;
        }
        niceMin = Math.floor(rmin / spacing) * spacing;
        niceMax = Math.ceil(rmax / spacing) * spacing;
        if (stepSize) {
            if (!isNullOrUndef(min) && helpers.almostWhole(min / spacing, spacing / 1000)) {
                niceMin = min;
            }
            if (!isNullOrUndef(max) && helpers.almostWhole(max / spacing, spacing / 1000)) {
                niceMax = max;
            }
        }
        numSpaces = (niceMax - niceMin) / spacing;
        if (helpers.almostEquals(numSpaces, Math.round(numSpaces), spacing / 1000)) {
            numSpaces = Math.round(numSpaces);
        } else {
            numSpaces = Math.ceil(numSpaces);
        }
        niceMin = Math.round(niceMin * factor) / factor;
        niceMax = Math.round(niceMax * factor) / factor;
        ticks.push(isNullOrUndef(min) ? niceMin : min);
        for (var j = 1; j < numSpaces; ++j) {
            ticks.push(Math.round((niceMin + j * spacing) * factor) / factor);
        }
        ticks.push(isNullOrUndef(max) ? niceMax : max);
        return ticks;
    }
    module.exports = Scale.extend({
        getRightValue: function (value) {
            if (typeof value === 'string') {
                return +value;
            }
            return Scale.prototype.getRightValue.call(this, value);
        },
        handleTickRangeOptions: function () {
            var me = this;
            var opts = me.options;
            var tickOpts = opts.ticks;
            if (tickOpts.beginAtZero) {
                var minSign = helpers.sign(me.min);
                var maxSign = helpers.sign(me.max);
                if (minSign < 0 && maxSign < 0) {
                    me.max = 0;
                } else if (minSign > 0 && maxSign > 0) {
                    me.min = 0;
                }
            }
            var setMin = tickOpts.min !== undefined || tickOpts.suggestedMin !== undefined;
            var setMax = tickOpts.max !== undefined || tickOpts.suggestedMax !== undefined;
            if (tickOpts.min !== undefined) {
                me.min = tickOpts.min;
            } else if (tickOpts.suggestedMin !== undefined) {
                if (me.min === null) {
                    me.min = tickOpts.suggestedMin;
                } else {
                    me.min = Math.min(me.min, tickOpts.suggestedMin);
                }
            }
            if (tickOpts.max !== undefined) {
                me.max = tickOpts.max;
            } else if (tickOpts.suggestedMax !== undefined) {
                if (me.max === null) {
                    me.max = tickOpts.suggestedMax;
                } else {
                    me.max = Math.max(me.max, tickOpts.suggestedMax);
                }
            }
            if (setMin !== setMax) {
                if (me.min >= me.max) {
                    if (setMin) {
                        me.max = me.min + 1;
                    } else {
                        me.min = me.max - 1;
                    }
                }
            }
            if (me.min === me.max) {
                me.max++;
                if (!tickOpts.beginAtZero) {
                    me.min--;
                }
            }
        },
        getTickLimit: function () {
            var me = this;
            var tickOpts = me.options.ticks;
            var stepSize = tickOpts.stepSize;
            var maxTicksLimit = tickOpts.maxTicksLimit;
            var maxTicks;
            if (stepSize) {
                maxTicks = Math.ceil(me.max / stepSize) - Math.floor(me.min / stepSize) + 1;
            } else {
                maxTicks = me._computeTickLimit();
                maxTicksLimit = maxTicksLimit || 11;
            }
            if (maxTicksLimit) {
                maxTicks = Math.min(maxTicksLimit, maxTicks);
            }
            return maxTicks;
        },
        _computeTickLimit: function () {
            return Number.POSITIVE_INFINITY;
        },
        handleDirectionalChanges: noop,
        buildTicks: function () {
            var me = this;
            var opts = me.options;
            var tickOpts = opts.ticks;
            var maxTicks = me.getTickLimit();
            maxTicks = Math.max(2, maxTicks);
            var numericGeneratorOptions = {
                maxTicks: maxTicks,
                min: tickOpts.min,
                max: tickOpts.max,
                precision: tickOpts.precision,
                stepSize: helpers.valueOrDefault(tickOpts.fixedStepSize, tickOpts.stepSize)
            };
            var ticks = me.ticks = generateTicks(numericGeneratorOptions, me);
            me.handleDirectionalChanges();
            me.max = helpers.max(ticks);
            me.min = helpers.min(ticks);
            if (tickOpts.reverse) {
                ticks.reverse();
                me.start = me.max;
                me.end = me.min;
            } else {
                me.start = me.min;
                me.end = me.max;
            }
        },
        convertTicksToLabels: function () {
            var me = this;
            me.ticksAsNumbers = me.ticks.slice();
            me.zeroLineIndex = me.ticks.indexOf(0);
            Scale.prototype.convertTicksToLabels.call(me);
        }
    });
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/scales/scale.linear',[
    '../helpers/index',
    './scale.linearbase',
    '../core/core.ticks'
], function (__module__0, __module__1, __module__2) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var helpers = __module__0;
    var LinearScaleBase = __module__1;
    var Ticks = __module__2;
    var defaultConfig = {
        position: 'left',
        ticks: { callback: Ticks.formatters.linear }
    };
    module.exports = LinearScaleBase.extend({
        determineDataLimits: function () {
            var me = this;
            var opts = me.options;
            var chart = me.chart;
            var data = chart.data;
            var datasets = data.datasets;
            var isHorizontal = me.isHorizontal();
            var DEFAULT_MIN = 0;
            var DEFAULT_MAX = 1;
            function IDMatches(meta) {
                return isHorizontal ? meta.xAxisID === me.id : meta.yAxisID === me.id;
            }
            me.min = null;
            me.max = null;
            var hasStacks = opts.stacked;
            if (hasStacks === undefined) {
                helpers.each(datasets, function (dataset, datasetIndex) {
                    if (hasStacks) {
                        return;
                    }
                    var meta = chart.getDatasetMeta(datasetIndex);
                    if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta) && meta.stack !== undefined) {
                        hasStacks = true;
                    }
                });
            }
            if (opts.stacked || hasStacks) {
                var valuesPerStack = {};
                helpers.each(datasets, function (dataset, datasetIndex) {
                    var meta = chart.getDatasetMeta(datasetIndex);
                    var key = [
                        meta.type,
                        opts.stacked === undefined && meta.stack === undefined ? datasetIndex : '',
                        meta.stack
                    ].join('.');
                    if (valuesPerStack[key] === undefined) {
                        valuesPerStack[key] = {
                            positiveValues: [],
                            negativeValues: []
                        };
                    }
                    var positiveValues = valuesPerStack[key].positiveValues;
                    var negativeValues = valuesPerStack[key].negativeValues;
                    if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta)) {
                        helpers.each(dataset.data, function (rawValue, index) {
                            var value = +me.getRightValue(rawValue);
                            if (isNaN(value) || meta.data[index].hidden) {
                                return;
                            }
                            positiveValues[index] = positiveValues[index] || 0;
                            negativeValues[index] = negativeValues[index] || 0;
                            if (opts.relativePoints) {
                                positiveValues[index] = 100;
                            } else if (value < 0) {
                                negativeValues[index] += value;
                            } else {
                                positiveValues[index] += value;
                            }
                        });
                    }
                });
                helpers.each(valuesPerStack, function (valuesForType) {
                    var values = valuesForType.positiveValues.concat(valuesForType.negativeValues);
                    var minVal = helpers.min(values);
                    var maxVal = helpers.max(values);
                    me.min = me.min === null ? minVal : Math.min(me.min, minVal);
                    me.max = me.max === null ? maxVal : Math.max(me.max, maxVal);
                });
            } else {
                helpers.each(datasets, function (dataset, datasetIndex) {
                    var meta = chart.getDatasetMeta(datasetIndex);
                    if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta)) {
                        helpers.each(dataset.data, function (rawValue, index) {
                            var value = +me.getRightValue(rawValue);
                            if (isNaN(value) || meta.data[index].hidden) {
                                return;
                            }
                            if (me.min === null) {
                                me.min = value;
                            } else if (value < me.min) {
                                me.min = value;
                            }
                            if (me.max === null) {
                                me.max = value;
                            } else if (value > me.max) {
                                me.max = value;
                            }
                        });
                    }
                });
            }
            me.min = isFinite(me.min) && !isNaN(me.min) ? me.min : DEFAULT_MIN;
            me.max = isFinite(me.max) && !isNaN(me.max) ? me.max : DEFAULT_MAX;
            this.handleTickRangeOptions();
        },
        _computeTickLimit: function () {
            var me = this;
            var tickFont;
            if (me.isHorizontal()) {
                return Math.ceil(me.width / 40);
            }
            tickFont = helpers.options._parseFont(me.options.ticks);
            return Math.ceil(me.height / tickFont.lineHeight);
        },
        handleDirectionalChanges: function () {
            if (!this.isHorizontal()) {
                this.ticks.reverse();
            }
        },
        getLabelForIndex: function (index, datasetIndex) {
            return +this.getRightValue(this.chart.data.datasets[datasetIndex].data[index]);
        },
        getPixelForValue: function (value) {
            var me = this;
            var start = me.start;
            var rightValue = +me.getRightValue(value);
            var pixel;
            var range = me.end - start;
            if (me.isHorizontal()) {
                pixel = me.left + me.width / range * (rightValue - start);
            } else {
                pixel = me.bottom - me.height / range * (rightValue - start);
            }
            return pixel;
        },
        getValueForPixel: function (pixel) {
            var me = this;
            var isHorizontal = me.isHorizontal();
            var innerDimension = isHorizontal ? me.width : me.height;
            var offset = (isHorizontal ? pixel - me.left : me.bottom - pixel) / innerDimension;
            return me.start + (me.end - me.start) * offset;
        },
        getPixelForTick: function (index) {
            return this.getPixelForValue(this.ticksAsNumbers[index]);
        }
    });
    module.exports._defaults = defaultConfig;
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/scales/scale.logarithmic',[
    '../core/core.defaults',
    '../helpers/index',
    '../core/core.scale',
    '../core/core.ticks'
], function (__module__0, __module__1, __module__2, __module__3) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var defaults = __module__0;
    var helpers = __module__1;
    var Scale = __module__2;
    var Ticks = __module__3;
    var valueOrDefault = helpers.valueOrDefault;
    function generateTicks(generationOptions, dataRange) {
        var ticks = [];
        var tickVal = valueOrDefault(generationOptions.min, Math.pow(10, Math.floor(helpers.log10(dataRange.min))));
        var endExp = Math.floor(helpers.log10(dataRange.max));
        var endSignificand = Math.ceil(dataRange.max / Math.pow(10, endExp));
        var exp, significand;
        if (tickVal === 0) {
            exp = Math.floor(helpers.log10(dataRange.minNotZero));
            significand = Math.floor(dataRange.minNotZero / Math.pow(10, exp));
            ticks.push(tickVal);
            tickVal = significand * Math.pow(10, exp);
        } else {
            exp = Math.floor(helpers.log10(tickVal));
            significand = Math.floor(tickVal / Math.pow(10, exp));
        }
        var precision = exp < 0 ? Math.pow(10, Math.abs(exp)) : 1;
        do {
            ticks.push(tickVal);
            ++significand;
            if (significand === 10) {
                significand = 1;
                ++exp;
                precision = exp >= 0 ? 1 : precision;
            }
            tickVal = Math.round(significand * Math.pow(10, exp) * precision) / precision;
        } while (exp < endExp || exp === endExp && significand < endSignificand);
        var lastTick = valueOrDefault(generationOptions.max, tickVal);
        ticks.push(lastTick);
        return ticks;
    }
    var defaultConfig = {
        position: 'left',
        ticks: { callback: Ticks.formatters.logarithmic }
    };
    function nonNegativeOrDefault(value, defaultValue) {
        return helpers.isFinite(value) && value >= 0 ? value : defaultValue;
    }
    module.exports = Scale.extend({
        determineDataLimits: function () {
            var me = this;
            var opts = me.options;
            var chart = me.chart;
            var data = chart.data;
            var datasets = data.datasets;
            var isHorizontal = me.isHorizontal();
            function IDMatches(meta) {
                return isHorizontal ? meta.xAxisID === me.id : meta.yAxisID === me.id;
            }
            me.min = null;
            me.max = null;
            me.minNotZero = null;
            var hasStacks = opts.stacked;
            if (hasStacks === undefined) {
                helpers.each(datasets, function (dataset, datasetIndex) {
                    if (hasStacks) {
                        return;
                    }
                    var meta = chart.getDatasetMeta(datasetIndex);
                    if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta) && meta.stack !== undefined) {
                        hasStacks = true;
                    }
                });
            }
            if (opts.stacked || hasStacks) {
                var valuesPerStack = {};
                helpers.each(datasets, function (dataset, datasetIndex) {
                    var meta = chart.getDatasetMeta(datasetIndex);
                    var key = [
                        meta.type,
                        opts.stacked === undefined && meta.stack === undefined ? datasetIndex : '',
                        meta.stack
                    ].join('.');
                    if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta)) {
                        if (valuesPerStack[key] === undefined) {
                            valuesPerStack[key] = [];
                        }
                        helpers.each(dataset.data, function (rawValue, index) {
                            var values = valuesPerStack[key];
                            var value = +me.getRightValue(rawValue);
                            if (isNaN(value) || meta.data[index].hidden || value < 0) {
                                return;
                            }
                            values[index] = values[index] || 0;
                            values[index] += value;
                        });
                    }
                });
                helpers.each(valuesPerStack, function (valuesForType) {
                    if (valuesForType.length > 0) {
                        var minVal = helpers.min(valuesForType);
                        var maxVal = helpers.max(valuesForType);
                        me.min = me.min === null ? minVal : Math.min(me.min, minVal);
                        me.max = me.max === null ? maxVal : Math.max(me.max, maxVal);
                    }
                });
            } else {
                helpers.each(datasets, function (dataset, datasetIndex) {
                    var meta = chart.getDatasetMeta(datasetIndex);
                    if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta)) {
                        helpers.each(dataset.data, function (rawValue, index) {
                            var value = +me.getRightValue(rawValue);
                            if (isNaN(value) || meta.data[index].hidden || value < 0) {
                                return;
                            }
                            if (me.min === null) {
                                me.min = value;
                            } else if (value < me.min) {
                                me.min = value;
                            }
                            if (me.max === null) {
                                me.max = value;
                            } else if (value > me.max) {
                                me.max = value;
                            }
                            if (value !== 0 && (me.minNotZero === null || value < me.minNotZero)) {
                                me.minNotZero = value;
                            }
                        });
                    }
                });
            }
            this.handleTickRangeOptions();
        },
        handleTickRangeOptions: function () {
            var me = this;
            var tickOpts = me.options.ticks;
            var DEFAULT_MIN = 1;
            var DEFAULT_MAX = 10;
            me.min = nonNegativeOrDefault(tickOpts.min, me.min);
            me.max = nonNegativeOrDefault(tickOpts.max, me.max);
            if (me.min === me.max) {
                if (me.min !== 0 && me.min !== null) {
                    me.min = Math.pow(10, Math.floor(helpers.log10(me.min)) - 1);
                    me.max = Math.pow(10, Math.floor(helpers.log10(me.max)) + 1);
                } else {
                    me.min = DEFAULT_MIN;
                    me.max = DEFAULT_MAX;
                }
            }
            if (me.min === null) {
                me.min = Math.pow(10, Math.floor(helpers.log10(me.max)) - 1);
            }
            if (me.max === null) {
                me.max = me.min !== 0 ? Math.pow(10, Math.floor(helpers.log10(me.min)) + 1) : DEFAULT_MAX;
            }
            if (me.minNotZero === null) {
                if (me.min > 0) {
                    me.minNotZero = me.min;
                } else if (me.max < 1) {
                    me.minNotZero = Math.pow(10, Math.floor(helpers.log10(me.max)));
                } else {
                    me.minNotZero = DEFAULT_MIN;
                }
            }
        },
        buildTicks: function () {
            var me = this;
            var tickOpts = me.options.ticks;
            var reverse = !me.isHorizontal();
            var generationOptions = {
                min: nonNegativeOrDefault(tickOpts.min),
                max: nonNegativeOrDefault(tickOpts.max)
            };
            var ticks = me.ticks = generateTicks(generationOptions, me);
            me.max = helpers.max(ticks);
            me.min = helpers.min(ticks);
            if (tickOpts.reverse) {
                reverse = !reverse;
                me.start = me.max;
                me.end = me.min;
            } else {
                me.start = me.min;
                me.end = me.max;
            }
            if (reverse) {
                ticks.reverse();
            }
        },
        convertTicksToLabels: function () {
            this.tickValues = this.ticks.slice();
            Scale.prototype.convertTicksToLabels.call(this);
        },
        getLabelForIndex: function (index, datasetIndex) {
            return +this.getRightValue(this.chart.data.datasets[datasetIndex].data[index]);
        },
        getPixelForTick: function (index) {
            return this.getPixelForValue(this.tickValues[index]);
        },
        _getFirstTickValue: function (value) {
            var exp = Math.floor(helpers.log10(value));
            var significand = Math.floor(value / Math.pow(10, exp));
            return significand * Math.pow(10, exp);
        },
        getPixelForValue: function (value) {
            var me = this;
            var tickOpts = me.options.ticks;
            var reverse = tickOpts.reverse;
            var log10 = helpers.log10;
            var firstTickValue = me._getFirstTickValue(me.minNotZero);
            var offset = 0;
            var innerDimension, pixel, start, end, sign;
            value = +me.getRightValue(value);
            if (reverse) {
                start = me.end;
                end = me.start;
                sign = -1;
            } else {
                start = me.start;
                end = me.end;
                sign = 1;
            }
            if (me.isHorizontal()) {
                innerDimension = me.width;
                pixel = reverse ? me.right : me.left;
            } else {
                innerDimension = me.height;
                sign *= -1;
                pixel = reverse ? me.top : me.bottom;
            }
            if (value !== start) {
                if (start === 0) {
                    offset = valueOrDefault(tickOpts.fontSize, defaults.global.defaultFontSize);
                    innerDimension -= offset;
                    start = firstTickValue;
                }
                if (value !== 0) {
                    offset += innerDimension / (log10(end) - log10(start)) * (log10(value) - log10(start));
                }
                pixel += sign * offset;
            }
            return pixel;
        },
        getValueForPixel: function (pixel) {
            var me = this;
            var tickOpts = me.options.ticks;
            var reverse = tickOpts.reverse;
            var log10 = helpers.log10;
            var firstTickValue = me._getFirstTickValue(me.minNotZero);
            var innerDimension, start, end, value;
            if (reverse) {
                start = me.end;
                end = me.start;
            } else {
                start = me.start;
                end = me.end;
            }
            if (me.isHorizontal()) {
                innerDimension = me.width;
                value = reverse ? me.right - pixel : pixel - me.left;
            } else {
                innerDimension = me.height;
                value = reverse ? pixel - me.top : me.bottom - pixel;
            }
            if (value !== start) {
                if (start === 0) {
                    var offset = valueOrDefault(tickOpts.fontSize, defaults.global.defaultFontSize);
                    value -= offset;
                    innerDimension -= offset;
                    start = firstTickValue;
                }
                value *= log10(end) - log10(start);
                value /= innerDimension;
                value = Math.pow(10, log10(start) + value);
            }
            return value;
        }
    });
    module.exports._defaults = defaultConfig;
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/scales/scale.radialLinear',[
    '../core/core.defaults',
    '../helpers/index',
    './scale.linearbase',
    '../core/core.ticks'
], function (__module__0, __module__1, __module__2, __module__3) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var defaults = __module__0;
    var helpers = __module__1;
    var LinearScaleBase = __module__2;
    var Ticks = __module__3;
    var valueOrDefault = helpers.valueOrDefault;
    var valueAtIndexOrDefault = helpers.valueAtIndexOrDefault;
    var resolve = helpers.options.resolve;
    var defaultConfig = {
        display: true,
        animate: true,
        position: 'chartArea',
        angleLines: {
            display: true,
            color: 'rgba(0, 0, 0, 0.1)',
            lineWidth: 1,
            borderDash: [],
            borderDashOffset: 0
        },
        gridLines: { circular: false },
        ticks: {
            showLabelBackdrop: true,
            backdropColor: 'rgba(255,255,255,0.75)',
            backdropPaddingY: 2,
            backdropPaddingX: 2,
            callback: Ticks.formatters.linear
        },
        pointLabels: {
            display: true,
            fontSize: 10,
            callback: function (label) {
                return label;
            }
        }
    };
    function getValueCount(scale) {
        var opts = scale.options;
        return opts.angleLines.display || opts.pointLabels.display ? scale.chart.data.labels.length : 0;
    }
    function getTickBackdropHeight(opts) {
        var tickOpts = opts.ticks;
        if (tickOpts.display && opts.display) {
            return valueOrDefault(tickOpts.fontSize, defaults.global.defaultFontSize) + tickOpts.backdropPaddingY * 2;
        }
        return 0;
    }
    function measureLabelSize(ctx, lineHeight, label) {
        if (helpers.isArray(label)) {
            return {
                w: helpers.longestText(ctx, ctx.font, label),
                h: label.length * lineHeight
            };
        }
        return {
            w: ctx.measureText(label).width,
            h: lineHeight
        };
    }
    function determineLimits(angle, pos, size, min, max) {
        if (angle === min || angle === max) {
            return {
                start: pos - size / 2,
                end: pos + size / 2
            };
        } else if (angle < min || angle > max) {
            return {
                start: pos - size,
                end: pos
            };
        }
        return {
            start: pos,
            end: pos + size
        };
    }
    function fitWithPointLabels(scale) {
        var plFont = helpers.options._parseFont(scale.options.pointLabels);
        var furthestLimits = {
            l: 0,
            r: scale.width,
            t: 0,
            b: scale.height - scale.paddingTop
        };
        var furthestAngles = {};
        var i, textSize, pointPosition;
        scale.ctx.font = plFont.string;
        scale._pointLabelSizes = [];
        var valueCount = getValueCount(scale);
        for (i = 0; i < valueCount; i++) {
            pointPosition = scale.getPointPosition(i, scale.drawingArea + 5);
            textSize = measureLabelSize(scale.ctx, plFont.lineHeight, scale.pointLabels[i] || '');
            scale._pointLabelSizes[i] = textSize;
            var angleRadians = scale.getIndexAngle(i);
            var angle = helpers.toDegrees(angleRadians) % 360;
            var hLimits = determineLimits(angle, pointPosition.x, textSize.w, 0, 180);
            var vLimits = determineLimits(angle, pointPosition.y, textSize.h, 90, 270);
            if (hLimits.start < furthestLimits.l) {
                furthestLimits.l = hLimits.start;
                furthestAngles.l = angleRadians;
            }
            if (hLimits.end > furthestLimits.r) {
                furthestLimits.r = hLimits.end;
                furthestAngles.r = angleRadians;
            }
            if (vLimits.start < furthestLimits.t) {
                furthestLimits.t = vLimits.start;
                furthestAngles.t = angleRadians;
            }
            if (vLimits.end > furthestLimits.b) {
                furthestLimits.b = vLimits.end;
                furthestAngles.b = angleRadians;
            }
        }
        scale.setReductions(scale.drawingArea, furthestLimits, furthestAngles);
    }
    function getTextAlignForAngle(angle) {
        if (angle === 0 || angle === 180) {
            return 'center';
        } else if (angle < 180) {
            return 'left';
        }
        return 'right';
    }
    function fillText(ctx, text, position, lineHeight) {
        var y = position.y + lineHeight / 2;
        var i, ilen;
        if (helpers.isArray(text)) {
            for (i = 0, ilen = text.length; i < ilen; ++i) {
                ctx.fillText(text[i], position.x, y);
                y += lineHeight;
            }
        } else {
            ctx.fillText(text, position.x, y);
        }
    }
    function adjustPointPositionForLabelHeight(angle, textSize, position) {
        if (angle === 90 || angle === 270) {
            position.y -= textSize.h / 2;
        } else if (angle > 270 || angle < 90) {
            position.y -= textSize.h;
        }
    }
    function drawPointLabels(scale) {
        var ctx = scale.ctx;
        var opts = scale.options;
        var angleLineOpts = opts.angleLines;
        var gridLineOpts = opts.gridLines;
        var pointLabelOpts = opts.pointLabels;
        var lineWidth = valueOrDefault(angleLineOpts.lineWidth, gridLineOpts.lineWidth);
        var lineColor = valueOrDefault(angleLineOpts.color, gridLineOpts.color);
        var tickBackdropHeight = getTickBackdropHeight(opts);
        ctx.save();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = lineColor;
        if (ctx.setLineDash) {
            ctx.setLineDash(resolve([
                angleLineOpts.borderDash,
                gridLineOpts.borderDash,
                []
            ]));
            ctx.lineDashOffset = resolve([
                angleLineOpts.borderDashOffset,
                gridLineOpts.borderDashOffset,
                0
            ]);
        }
        var outerDistance = scale.getDistanceFromCenterForValue(opts.ticks.reverse ? scale.min : scale.max);
        var plFont = helpers.options._parseFont(pointLabelOpts);
        ctx.font = plFont.string;
        ctx.textBaseline = 'middle';
        for (var i = getValueCount(scale) - 1; i >= 0; i--) {
            if (angleLineOpts.display && lineWidth && lineColor) {
                var outerPosition = scale.getPointPosition(i, outerDistance);
                ctx.beginPath();
                ctx.moveTo(scale.xCenter, scale.yCenter);
                ctx.lineTo(outerPosition.x, outerPosition.y);
                ctx.stroke();
            }
            if (pointLabelOpts.display) {
                var extra = i === 0 ? tickBackdropHeight / 2 : 0;
                var pointLabelPosition = scale.getPointPosition(i, outerDistance + extra + 5);
                var pointLabelFontColor = valueAtIndexOrDefault(pointLabelOpts.fontColor, i, defaults.global.defaultFontColor);
                ctx.fillStyle = pointLabelFontColor;
                var angleRadians = scale.getIndexAngle(i);
                var angle = helpers.toDegrees(angleRadians);
                ctx.textAlign = getTextAlignForAngle(angle);
                adjustPointPositionForLabelHeight(angle, scale._pointLabelSizes[i], pointLabelPosition);
                fillText(ctx, scale.pointLabels[i] || '', pointLabelPosition, plFont.lineHeight);
            }
        }
        ctx.restore();
    }
    function drawRadiusLine(scale, gridLineOpts, radius, index) {
        var ctx = scale.ctx;
        var circular = gridLineOpts.circular;
        var valueCount = getValueCount(scale);
        var lineColor = valueAtIndexOrDefault(gridLineOpts.color, index - 1);
        var lineWidth = valueAtIndexOrDefault(gridLineOpts.lineWidth, index - 1);
        var pointPosition;
        if (!circular && !valueCount || !lineColor || !lineWidth) {
            return;
        }
        ctx.save();
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineWidth;
        if (ctx.setLineDash) {
            ctx.setLineDash(gridLineOpts.borderDash || []);
            ctx.lineDashOffset = gridLineOpts.borderDashOffset || 0;
        }
        ctx.beginPath();
        if (circular) {
            ctx.arc(scale.xCenter, scale.yCenter, radius, 0, Math.PI * 2);
        } else {
            pointPosition = scale.getPointPosition(0, radius);
            ctx.moveTo(pointPosition.x, pointPosition.y);
            for (var i = 1; i < valueCount; i++) {
                pointPosition = scale.getPointPosition(i, radius);
                ctx.lineTo(pointPosition.x, pointPosition.y);
            }
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
    function numberOrZero(param) {
        return helpers.isNumber(param) ? param : 0;
    }
    module.exports = LinearScaleBase.extend({
        setDimensions: function () {
            var me = this;
            me.width = me.maxWidth;
            me.height = me.maxHeight;
            me.paddingTop = getTickBackdropHeight(me.options) / 2;
            me.xCenter = Math.floor(me.width / 2);
            me.yCenter = Math.floor((me.height - me.paddingTop) / 2);
            me.drawingArea = Math.min(me.height - me.paddingTop, me.width) / 2;
        },
        determineDataLimits: function () {
            var me = this;
            var chart = me.chart;
            var min = Number.POSITIVE_INFINITY;
            var max = Number.NEGATIVE_INFINITY;
            helpers.each(chart.data.datasets, function (dataset, datasetIndex) {
                if (chart.isDatasetVisible(datasetIndex)) {
                    var meta = chart.getDatasetMeta(datasetIndex);
                    helpers.each(dataset.data, function (rawValue, index) {
                        var value = +me.getRightValue(rawValue);
                        if (isNaN(value) || meta.data[index].hidden) {
                            return;
                        }
                        min = Math.min(value, min);
                        max = Math.max(value, max);
                    });
                }
            });
            me.min = min === Number.POSITIVE_INFINITY ? 0 : min;
            me.max = max === Number.NEGATIVE_INFINITY ? 0 : max;
            me.handleTickRangeOptions();
        },
        _computeTickLimit: function () {
            return Math.ceil(this.drawingArea / getTickBackdropHeight(this.options));
        },
        convertTicksToLabels: function () {
            var me = this;
            LinearScaleBase.prototype.convertTicksToLabels.call(me);
            me.pointLabels = me.chart.data.labels.map(me.options.pointLabels.callback, me);
        },
        getLabelForIndex: function (index, datasetIndex) {
            return +this.getRightValue(this.chart.data.datasets[datasetIndex].data[index]);
        },
        fit: function () {
            var me = this;
            var opts = me.options;
            if (opts.display && opts.pointLabels.display) {
                fitWithPointLabels(me);
            } else {
                me.setCenterPoint(0, 0, 0, 0);
            }
        },
        setReductions: function (largestPossibleRadius, furthestLimits, furthestAngles) {
            var me = this;
            var radiusReductionLeft = furthestLimits.l / Math.sin(furthestAngles.l);
            var radiusReductionRight = Math.max(furthestLimits.r - me.width, 0) / Math.sin(furthestAngles.r);
            var radiusReductionTop = -furthestLimits.t / Math.cos(furthestAngles.t);
            var radiusReductionBottom = -Math.max(furthestLimits.b - (me.height - me.paddingTop), 0) / Math.cos(furthestAngles.b);
            radiusReductionLeft = numberOrZero(radiusReductionLeft);
            radiusReductionRight = numberOrZero(radiusReductionRight);
            radiusReductionTop = numberOrZero(radiusReductionTop);
            radiusReductionBottom = numberOrZero(radiusReductionBottom);
            me.drawingArea = Math.min(Math.floor(largestPossibleRadius - (radiusReductionLeft + radiusReductionRight) / 2), Math.floor(largestPossibleRadius - (radiusReductionTop + radiusReductionBottom) / 2));
            me.setCenterPoint(radiusReductionLeft, radiusReductionRight, radiusReductionTop, radiusReductionBottom);
        },
        setCenterPoint: function (leftMovement, rightMovement, topMovement, bottomMovement) {
            var me = this;
            var maxRight = me.width - rightMovement - me.drawingArea;
            var maxLeft = leftMovement + me.drawingArea;
            var maxTop = topMovement + me.drawingArea;
            var maxBottom = me.height - me.paddingTop - bottomMovement - me.drawingArea;
            me.xCenter = Math.floor((maxLeft + maxRight) / 2 + me.left);
            me.yCenter = Math.floor((maxTop + maxBottom) / 2 + me.top + me.paddingTop);
        },
        getIndexAngle: function (index) {
            var angleMultiplier = Math.PI * 2 / getValueCount(this);
            var startAngle = this.chart.options && this.chart.options.startAngle ? this.chart.options.startAngle : 0;
            var startAngleRadians = startAngle * Math.PI * 2 / 360;
            return index * angleMultiplier + startAngleRadians;
        },
        getDistanceFromCenterForValue: function (value) {
            var me = this;
            if (value === null) {
                return 0;
            }
            var scalingFactor = me.drawingArea / (me.max - me.min);
            if (me.options.ticks.reverse) {
                return (me.max - value) * scalingFactor;
            }
            return (value - me.min) * scalingFactor;
        },
        getPointPosition: function (index, distanceFromCenter) {
            var me = this;
            var thisAngle = me.getIndexAngle(index) - Math.PI / 2;
            return {
                x: Math.cos(thisAngle) * distanceFromCenter + me.xCenter,
                y: Math.sin(thisAngle) * distanceFromCenter + me.yCenter
            };
        },
        getPointPositionForValue: function (index, value) {
            return this.getPointPosition(index, this.getDistanceFromCenterForValue(value));
        },
        getBasePosition: function () {
            var me = this;
            var min = me.min;
            var max = me.max;
            return me.getPointPositionForValue(0, me.beginAtZero ? 0 : min < 0 && max < 0 ? max : min > 0 && max > 0 ? min : 0);
        },
        draw: function () {
            var me = this;
            var opts = me.options;
            var gridLineOpts = opts.gridLines;
            var tickOpts = opts.ticks;
            if (opts.display) {
                var ctx = me.ctx;
                var startAngle = this.getIndexAngle(0);
                var tickFont = helpers.options._parseFont(tickOpts);
                if (opts.angleLines.display || opts.pointLabels.display) {
                    drawPointLabels(me);
                }
                helpers.each(me.ticks, function (label, index) {
                    if (index > 0 || tickOpts.reverse) {
                        var yCenterOffset = me.getDistanceFromCenterForValue(me.ticksAsNumbers[index]);
                        if (gridLineOpts.display && index !== 0) {
                            drawRadiusLine(me, gridLineOpts, yCenterOffset, index);
                        }
                        if (tickOpts.display) {
                            var tickFontColor = valueOrDefault(tickOpts.fontColor, defaults.global.defaultFontColor);
                            ctx.font = tickFont.string;
                            ctx.save();
                            ctx.translate(me.xCenter, me.yCenter);
                            ctx.rotate(startAngle);
                            if (tickOpts.showLabelBackdrop) {
                                var labelWidth = ctx.measureText(label).width;
                                ctx.fillStyle = tickOpts.backdropColor;
                                ctx.fillRect(-labelWidth / 2 - tickOpts.backdropPaddingX, -yCenterOffset - tickFont.size / 2 - tickOpts.backdropPaddingY, labelWidth + tickOpts.backdropPaddingX * 2, tickFont.size + tickOpts.backdropPaddingY * 2);
                            }
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillStyle = tickFontColor;
                            ctx.fillText(label, 0, -yCenterOffset);
                            ctx.restore();
                        }
                    }
                });
            }
        }
    });
    module.exports._defaults = defaultConfig;
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/scales/scale.time',[
    '../core/core.adapters',
    '../core/core.defaults',
    '../helpers/index',
    '../core/core.scale'
], function (__module__0, __module__1, __module__2, __module__3) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var adapters = __module__0;
    var defaults = __module__1;
    var helpers = __module__2;
    var Scale = __module__3;
    var valueOrDefault = helpers.valueOrDefault;
    var MIN_INTEGER = Number.MIN_SAFE_INTEGER || -9007199254740991;
    var MAX_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;
    var INTERVALS = {
        millisecond: {
            common: true,
            size: 1,
            steps: [
                1,
                2,
                5,
                10,
                20,
                50,
                100,
                250,
                500
            ]
        },
        second: {
            common: true,
            size: 1000,
            steps: [
                1,
                2,
                5,
                10,
                15,
                30
            ]
        },
        minute: {
            common: true,
            size: 60000,
            steps: [
                1,
                2,
                5,
                10,
                15,
                30
            ]
        },
        hour: {
            common: true,
            size: 3600000,
            steps: [
                1,
                2,
                3,
                6,
                12
            ]
        },
        day: {
            common: true,
            size: 86400000,
            steps: [
                1,
                2,
                5
            ]
        },
        week: {
            common: false,
            size: 604800000,
            steps: [
                1,
                2,
                3,
                4
            ]
        },
        month: {
            common: true,
            size: 2628000000,
            steps: [
                1,
                2,
                3
            ]
        },
        quarter: {
            common: false,
            size: 7884000000,
            steps: [
                1,
                2,
                3,
                4
            ]
        },
        year: {
            common: true,
            size: 31540000000
        }
    };
    var UNITS = Object.keys(INTERVALS);
    function sorter(a, b) {
        return a - b;
    }
    function arrayUnique(items) {
        var hash = {};
        var out = [];
        var i, ilen, item;
        for (i = 0, ilen = items.length; i < ilen; ++i) {
            item = items[i];
            if (!hash[item]) {
                hash[item] = true;
                out.push(item);
            }
        }
        return out;
    }
    function buildLookupTable(timestamps, min, max, distribution) {
        if (distribution === 'linear' || !timestamps.length) {
            return [
                {
                    time: min,
                    pos: 0
                },
                {
                    time: max,
                    pos: 1
                }
            ];
        }
        var table = [];
        var items = [min];
        var i, ilen, prev, curr, next;
        for (i = 0, ilen = timestamps.length; i < ilen; ++i) {
            curr = timestamps[i];
            if (curr > min && curr < max) {
                items.push(curr);
            }
        }
        items.push(max);
        for (i = 0, ilen = items.length; i < ilen; ++i) {
            next = items[i + 1];
            prev = items[i - 1];
            curr = items[i];
            if (prev === undefined || next === undefined || Math.round((next + prev) / 2) !== curr) {
                table.push({
                    time: curr,
                    pos: i / (ilen - 1)
                });
            }
        }
        return table;
    }
    function lookup(table, key, value) {
        var lo = 0;
        var hi = table.length - 1;
        var mid, i0, i1;
        while (lo >= 0 && lo <= hi) {
            mid = lo + hi >> 1;
            i0 = table[mid - 1] || null;
            i1 = table[mid];
            if (!i0) {
                return {
                    lo: null,
                    hi: i1
                };
            } else if (i1[key] < value) {
                lo = mid + 1;
            } else if (i0[key] > value) {
                hi = mid - 1;
            } else {
                return {
                    lo: i0,
                    hi: i1
                };
            }
        }
        return {
            lo: i1,
            hi: null
        };
    }
    function interpolate(table, skey, sval, tkey) {
        var range = lookup(table, skey, sval);
        var prev = !range.lo ? table[0] : !range.hi ? table[table.length - 2] : range.lo;
        var next = !range.lo ? table[1] : !range.hi ? table[table.length - 1] : range.hi;
        var span = next[skey] - prev[skey];
        var ratio = span ? (sval - prev[skey]) / span : 0;
        var offset = (next[tkey] - prev[tkey]) * ratio;
        return prev[tkey] + offset;
    }
    function toTimestamp(scale, input) {
        var adapter = scale._adapter;
        var options = scale.options.time;
        var parser = options.parser;
        var format = parser || options.format;
        var value = input;
        if (typeof parser === 'function') {
            value = parser(value);
        }
        if (!helpers.isFinite(value)) {
            value = typeof format === 'string' ? adapter.parse(value, format) : adapter.parse(value);
        }
        if (value !== null) {
            return +value;
        }
        if (!parser && typeof format === 'function') {
            value = format(input);
            if (!helpers.isFinite(value)) {
                value = adapter.parse(value);
            }
        }
        return value;
    }
    function parse(scale, input) {
        if (helpers.isNullOrUndef(input)) {
            return null;
        }
        var options = scale.options.time;
        var value = toTimestamp(scale, scale.getRightValue(input));
        if (value === null) {
            return value;
        }
        if (options.round) {
            value = +scale._adapter.startOf(value, options.round);
        }
        return value;
    }
    function determineStepSize(min, max, unit, capacity) {
        var range = max - min;
        var interval = INTERVALS[unit];
        var milliseconds = interval.size;
        var steps = interval.steps;
        var i, ilen, factor;
        if (!steps) {
            return Math.ceil(range / (capacity * milliseconds));
        }
        for (i = 0, ilen = steps.length; i < ilen; ++i) {
            factor = steps[i];
            if (Math.ceil(range / (milliseconds * factor)) <= capacity) {
                break;
            }
        }
        return factor;
    }
    function determineUnitForAutoTicks(minUnit, min, max, capacity) {
        var ilen = UNITS.length;
        var i, interval, factor;
        for (i = UNITS.indexOf(minUnit); i < ilen - 1; ++i) {
            interval = INTERVALS[UNITS[i]];
            factor = interval.steps ? interval.steps[interval.steps.length - 1] : MAX_INTEGER;
            if (interval.common && Math.ceil((max - min) / (factor * interval.size)) <= capacity) {
                return UNITS[i];
            }
        }
        return UNITS[ilen - 1];
    }
    function determineUnitForFormatting(scale, ticks, minUnit, min, max) {
        var ilen = UNITS.length;
        var i, unit;
        for (i = ilen - 1; i >= UNITS.indexOf(minUnit); i--) {
            unit = UNITS[i];
            if (INTERVALS[unit].common && scale._adapter.diff(max, min, unit) >= ticks.length) {
                return unit;
            }
        }
        return UNITS[minUnit ? UNITS.indexOf(minUnit) : 0];
    }
    function determineMajorUnit(unit) {
        for (var i = UNITS.indexOf(unit) + 1, ilen = UNITS.length; i < ilen; ++i) {
            if (INTERVALS[UNITS[i]].common) {
                return UNITS[i];
            }
        }
    }
    function generate(scale, min, max, capacity) {
        var adapter = scale._adapter;
        var options = scale.options;
        var timeOpts = options.time;
        var minor = timeOpts.unit || determineUnitForAutoTicks(timeOpts.minUnit, min, max, capacity);
        var major = determineMajorUnit(minor);
        var stepSize = valueOrDefault(timeOpts.stepSize, timeOpts.unitStepSize);
        var weekday = minor === 'week' ? timeOpts.isoWeekday : false;
        var majorTicksEnabled = options.ticks.major.enabled;
        var interval = INTERVALS[minor];
        var first = min;
        var last = max;
        var ticks = [];
        var time;
        if (!stepSize) {
            stepSize = determineStepSize(min, max, minor, capacity);
        }
        if (weekday) {
            first = +adapter.startOf(first, 'isoWeek', weekday);
            last = +adapter.startOf(last, 'isoWeek', weekday);
        }
        first = +adapter.startOf(first, weekday ? 'day' : minor);
        last = +adapter.startOf(last, weekday ? 'day' : minor);
        if (last < max) {
            last = +adapter.add(last, 1, minor);
        }
        time = first;
        if (majorTicksEnabled && major && !weekday && !timeOpts.round) {
            time = +adapter.startOf(time, major);
            time = +adapter.add(time, ~~((first - time) / (interval.size * stepSize)) * stepSize, minor);
        }
        for (; time < last; time = +adapter.add(time, stepSize, minor)) {
            ticks.push(+time);
        }
        ticks.push(+time);
        return ticks;
    }
    function computeOffsets(table, ticks, min, max, options) {
        var start = 0;
        var end = 0;
        var first, last;
        if (options.offset && ticks.length) {
            if (!options.time.min) {
                first = interpolate(table, 'time', ticks[0], 'pos');
                if (ticks.length === 1) {
                    start = 1 - first;
                } else {
                    start = (interpolate(table, 'time', ticks[1], 'pos') - first) / 2;
                }
            }
            if (!options.time.max) {
                last = interpolate(table, 'time', ticks[ticks.length - 1], 'pos');
                if (ticks.length === 1) {
                    end = last;
                } else {
                    end = (last - interpolate(table, 'time', ticks[ticks.length - 2], 'pos')) / 2;
                }
            }
        }
        return {
            start: start,
            end: end
        };
    }
    function ticksFromTimestamps(scale, values, majorUnit) {
        var ticks = [];
        var i, ilen, value, major;
        for (i = 0, ilen = values.length; i < ilen; ++i) {
            value = values[i];
            major = majorUnit ? value === +scale._adapter.startOf(value, majorUnit) : false;
            ticks.push({
                value: value,
                major: major
            });
        }
        return ticks;
    }
    var defaultConfig = {
        position: 'bottom',
        distribution: 'linear',
        bounds: 'data',
        adapters: {},
        time: {
            parser: false,
            format: false,
            unit: false,
            round: false,
            displayFormat: false,
            isoWeekday: false,
            minUnit: 'millisecond',
            displayFormats: {}
        },
        ticks: {
            autoSkip: false,
            source: 'auto',
            major: { enabled: false }
        }
    };
    module.exports = Scale.extend({
        initialize: function () {
            this.mergeTicksOptions();
            Scale.prototype.initialize.call(this);
        },
        update: function () {
            var me = this;
            var options = me.options;
            var time = options.time || (options.time = {});
            var adapter = me._adapter = new adapters._date(options.adapters.date);
            if (time.format) {
                console.warn('options.time.format is deprecated and replaced by options.time.parser.');
            }
            helpers.mergeIf(time.displayFormats, adapter.formats());
            return Scale.prototype.update.apply(me, arguments);
        },
        getRightValue: function (rawValue) {
            if (rawValue && rawValue.t !== undefined) {
                rawValue = rawValue.t;
            }
            return Scale.prototype.getRightValue.call(this, rawValue);
        },
        determineDataLimits: function () {
            var me = this;
            var chart = me.chart;
            var adapter = me._adapter;
            var timeOpts = me.options.time;
            var unit = timeOpts.unit || 'day';
            var min = MAX_INTEGER;
            var max = MIN_INTEGER;
            var timestamps = [];
            var datasets = [];
            var labels = [];
            var i, j, ilen, jlen, data, timestamp;
            var dataLabels = chart.data.labels || [];
            for (i = 0, ilen = dataLabels.length; i < ilen; ++i) {
                labels.push(parse(me, dataLabels[i]));
            }
            for (i = 0, ilen = (chart.data.datasets || []).length; i < ilen; ++i) {
                if (chart.isDatasetVisible(i)) {
                    data = chart.data.datasets[i].data;
                    if (helpers.isObject(data[0])) {
                        datasets[i] = [];
                        for (j = 0, jlen = data.length; j < jlen; ++j) {
                            timestamp = parse(me, data[j]);
                            timestamps.push(timestamp);
                            datasets[i][j] = timestamp;
                        }
                    } else {
                        for (j = 0, jlen = labels.length; j < jlen; ++j) {
                            timestamps.push(labels[j]);
                        }
                        datasets[i] = labels.slice(0);
                    }
                } else {
                    datasets[i] = [];
                }
            }
            if (labels.length) {
                labels = arrayUnique(labels).sort(sorter);
                min = Math.min(min, labels[0]);
                max = Math.max(max, labels[labels.length - 1]);
            }
            if (timestamps.length) {
                timestamps = arrayUnique(timestamps).sort(sorter);
                min = Math.min(min, timestamps[0]);
                max = Math.max(max, timestamps[timestamps.length - 1]);
            }
            min = parse(me, timeOpts.min) || min;
            max = parse(me, timeOpts.max) || max;
            min = min === MAX_INTEGER ? +adapter.startOf(Date.now(), unit) : min;
            max = max === MIN_INTEGER ? +adapter.endOf(Date.now(), unit) + 1 : max;
            me.min = Math.min(min, max);
            me.max = Math.max(min + 1, max);
            me._horizontal = me.isHorizontal();
            me._table = [];
            me._timestamps = {
                data: timestamps,
                datasets: datasets,
                labels: labels
            };
        },
        buildTicks: function () {
            var me = this;
            var min = me.min;
            var max = me.max;
            var options = me.options;
            var timeOpts = options.time;
            var timestamps = [];
            var ticks = [];
            var i, ilen, timestamp;
            switch (options.ticks.source) {
            case 'data':
                timestamps = me._timestamps.data;
                break;
            case 'labels':
                timestamps = me._timestamps.labels;
                break;
            case 'auto':
            default:
                timestamps = generate(me, min, max, me.getLabelCapacity(min), options);
            }
            if (options.bounds === 'ticks' && timestamps.length) {
                min = timestamps[0];
                max = timestamps[timestamps.length - 1];
            }
            min = parse(me, timeOpts.min) || min;
            max = parse(me, timeOpts.max) || max;
            for (i = 0, ilen = timestamps.length; i < ilen; ++i) {
                timestamp = timestamps[i];
                if (timestamp >= min && timestamp <= max) {
                    ticks.push(timestamp);
                }
            }
            me.min = min;
            me.max = max;
            me._unit = timeOpts.unit || determineUnitForFormatting(me, ticks, timeOpts.minUnit, me.min, me.max);
            me._majorUnit = determineMajorUnit(me._unit);
            me._table = buildLookupTable(me._timestamps.data, min, max, options.distribution);
            me._offsets = computeOffsets(me._table, ticks, min, max, options);
            if (options.ticks.reverse) {
                ticks.reverse();
            }
            return ticksFromTimestamps(me, ticks, me._majorUnit);
        },
        getLabelForIndex: function (index, datasetIndex) {
            var me = this;
            var adapter = me._adapter;
            var data = me.chart.data;
            var timeOpts = me.options.time;
            var label = data.labels && index < data.labels.length ? data.labels[index] : '';
            var value = data.datasets[datasetIndex].data[index];
            if (helpers.isObject(value)) {
                label = me.getRightValue(value);
            }
            if (timeOpts.tooltipFormat) {
                return adapter.format(toTimestamp(me, label), timeOpts.tooltipFormat);
            }
            if (typeof label === 'string') {
                return label;
            }
            return adapter.format(toTimestamp(me, label), timeOpts.displayFormats.datetime);
        },
        tickFormatFunction: function (time, index, ticks, format) {
            var me = this;
            var adapter = me._adapter;
            var options = me.options;
            var formats = options.time.displayFormats;
            var minorFormat = formats[me._unit];
            var majorUnit = me._majorUnit;
            var majorFormat = formats[majorUnit];
            var majorTime = +adapter.startOf(time, majorUnit);
            var majorTickOpts = options.ticks.major;
            var major = majorTickOpts.enabled && majorUnit && majorFormat && time === majorTime;
            var label = adapter.format(time, format ? format : major ? majorFormat : minorFormat);
            var tickOpts = major ? majorTickOpts : options.ticks.minor;
            var formatter = valueOrDefault(tickOpts.callback, tickOpts.userCallback);
            return formatter ? formatter(label, index, ticks) : label;
        },
        convertTicksToLabels: function (ticks) {
            var labels = [];
            var i, ilen;
            for (i = 0, ilen = ticks.length; i < ilen; ++i) {
                labels.push(this.tickFormatFunction(ticks[i].value, i, ticks));
            }
            return labels;
        },
        getPixelForOffset: function (time) {
            var me = this;
            var isReverse = me.options.ticks.reverse;
            var size = me._horizontal ? me.width : me.height;
            var start = me._horizontal ? isReverse ? me.right : me.left : isReverse ? me.bottom : me.top;
            var pos = interpolate(me._table, 'time', time, 'pos');
            var offset = size * (me._offsets.start + pos) / (me._offsets.start + 1 + me._offsets.end);
            return isReverse ? start - offset : start + offset;
        },
        getPixelForValue: function (value, index, datasetIndex) {
            var me = this;
            var time = null;
            if (index !== undefined && datasetIndex !== undefined) {
                time = me._timestamps.datasets[datasetIndex][index];
            }
            if (time === null) {
                time = parse(me, value);
            }
            if (time !== null) {
                return me.getPixelForOffset(time);
            }
        },
        getPixelForTick: function (index) {
            var ticks = this.getTicks();
            return index >= 0 && index < ticks.length ? this.getPixelForOffset(ticks[index].value) : null;
        },
        getValueForPixel: function (pixel) {
            var me = this;
            var size = me._horizontal ? me.width : me.height;
            var start = me._horizontal ? me.left : me.top;
            var pos = (size ? (pixel - start) / size : 0) * (me._offsets.start + 1 + me._offsets.start) - me._offsets.end;
            var time = interpolate(me._table, 'pos', pos, 'time');
            return me._adapter._create(time);
        },
        getLabelWidth: function (label) {
            var me = this;
            var ticksOpts = me.options.ticks;
            var tickLabelWidth = me.ctx.measureText(label).width;
            var angle = helpers.toRadians(ticksOpts.maxRotation);
            var cosRotation = Math.cos(angle);
            var sinRotation = Math.sin(angle);
            var tickFontSize = valueOrDefault(ticksOpts.fontSize, defaults.global.defaultFontSize);
            return tickLabelWidth * cosRotation + tickFontSize * sinRotation;
        },
        getLabelCapacity: function (exampleTime) {
            var me = this;
            var format = me.options.time.displayFormats.millisecond;
            var exampleLabel = me.tickFormatFunction(exampleTime, 0, [], format);
            var tickLabelWidth = me.getLabelWidth(exampleLabel);
            var innerWidth = me.isHorizontal() ? me.width : me.height;
            var capacity = Math.floor(innerWidth / tickLabelWidth);
            return capacity > 0 ? capacity : 1;
        }
    });
    module.exports._defaults = defaultConfig;
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/scales/index',[
    './scale.category',
    './scale.linear',
    './scale.logarithmic',
    './scale.radialLinear',
    './scale.time'
], function (__module__0, __module__1, __module__2, __module__3, __module__4) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var category = __module__0;
    var linear = __module__1;
    var logarithmic = __module__2;
    var radialLinear = __module__3;
    var time = __module__4;
    module.exports = {
        category: category,
        linear: linear,
        logarithmic: logarithmic,
        radialLinear: radialLinear,
        time: time
    };
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/adapters/adapter.moment',[
//    'moment',
    '../core/core.adapters'
], function (__module__0, __module__1) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var moment = __module__0;
    var adapters = __module__1;
    var FORMATS = {
        datetime: 'MMM D, YYYY, h:mm:ss a',
        millisecond: 'h:mm:ss.SSS a',
        second: 'h:mm:ss a',
        minute: 'h:mm a',
        hour: 'hA',
        day: 'MMM D',
        week: 'll',
        month: 'MMM YYYY',
        quarter: '[Q]Q - YYYY',
        year: 'YYYY'
    };
    adapters._date.override(typeof moment === 'function' ? {
        _id: 'moment',
        formats: function () {
            return FORMATS;
        },
        parse: function (value, format) {
            if (typeof value === 'string' && typeof format === 'string') {
                value = moment(value, format);
            } else if (!(value instanceof moment)) {
                value = moment(value);
            }
            return value.isValid() ? value.valueOf() : null;
        },
        format: function (time, format) {
            return moment(time).format(format);
        },
        add: function (time, amount, unit) {
            return moment(time).add(amount, unit).valueOf();
        },
        diff: function (max, min, unit) {
            return moment.duration(moment(max).diff(moment(min))).as(unit);
        },
        startOf: function (time, unit, weekday) {
            time = moment(time);
            if (unit === 'isoWeek') {
                return time.isoWeekday(weekday).valueOf();
            }
            return time.startOf(unit).valueOf();
        },
        endOf: function (time, unit) {
            return moment(time).endOf(unit).valueOf();
        },
        _create: function (time) {
            return moment(time);
        }
    } : {});
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/adapters/index',['./adapter.moment'], function (__module__0) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    __module__0;
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/plugins/plugin.filler',[
    '../core/core.defaults',
    '../elements/index',
    '../helpers/index'
], function (__module__0, __module__1, __module__2) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var defaults = __module__0;
    var elements = __module__1;
    var helpers = __module__2;
    defaults._set('global', { plugins: { filler: { propagate: true } } });
    var mappers = {
        dataset: function (source) {
            var index = source.fill;
            var chart = source.chart;
            var meta = chart.getDatasetMeta(index);
            var visible = meta && chart.isDatasetVisible(index);
            var points = visible && meta.dataset._children || [];
            var length = points.length || 0;
            return !length ? null : function (point, i) {
                return i < length && points[i]._view || null;
            };
        },
        boundary: function (source) {
            var boundary = source.boundary;
            var x = boundary ? boundary.x : null;
            var y = boundary ? boundary.y : null;
            return function (point) {
                return {
                    x: x === null ? point.x : x,
                    y: y === null ? point.y : y
                };
            };
        }
    };
    function decodeFill(el, index, count) {
        var model = el._model || {};
        var fill = model.fill;
        var target;
        if (fill === undefined) {
            fill = !!model.backgroundColor;
        }
        if (fill === false || fill === null) {
            return false;
        }
        if (fill === true) {
            return 'origin';
        }
        target = parseFloat(fill, 10);
        if (isFinite(target) && Math.floor(target) === target) {
            if (fill[0] === '-' || fill[0] === '+') {
                target = index + target;
            }
            if (target === index || target < 0 || target >= count) {
                return false;
            }
            return target;
        }
        switch (fill) {
        case 'bottom':
            return 'start';
        case 'top':
            return 'end';
        case 'zero':
            return 'origin';
        case 'origin':
        case 'start':
        case 'end':
            return fill;
        default:
            return false;
        }
    }
    function computeBoundary(source) {
        var model = source.el._model || {};
        var scale = source.el._scale || {};
        var fill = source.fill;
        var target = null;
        var horizontal;
        if (isFinite(fill)) {
            return null;
        }
        if (fill === 'start') {
            target = model.scaleBottom === undefined ? scale.bottom : model.scaleBottom;
        } else if (fill === 'end') {
            target = model.scaleTop === undefined ? scale.top : model.scaleTop;
        } else if (model.scaleZero !== undefined) {
            target = model.scaleZero;
        } else if (scale.getBasePosition) {
            target = scale.getBasePosition();
        } else if (scale.getBasePixel) {
            target = scale.getBasePixel();
        }
        if (target !== undefined && target !== null) {
            if (target.x !== undefined && target.y !== undefined) {
                return target;
            }
            if (helpers.isFinite(target)) {
                horizontal = scale.isHorizontal();
                return {
                    x: horizontal ? target : null,
                    y: horizontal ? null : target
                };
            }
        }
        return null;
    }
    function resolveTarget(sources, index, propagate) {
        var source = sources[index];
        var fill = source.fill;
        var visited = [index];
        var target;
        if (!propagate) {
            return fill;
        }
        while (fill !== false && visited.indexOf(fill) === -1) {
            if (!isFinite(fill)) {
                return fill;
            }
            target = sources[fill];
            if (!target) {
                return false;
            }
            if (target.visible) {
                return fill;
            }
            visited.push(fill);
            fill = target.fill;
        }
        return false;
    }
    function createMapper(source) {
        var fill = source.fill;
        var type = 'dataset';
        if (fill === false) {
            return null;
        }
        if (!isFinite(fill)) {
            type = 'boundary';
        }
        return mappers[type](source);
    }
    function isDrawable(point) {
        return point && !point.skip;
    }
    function drawArea(ctx, curve0, curve1, len0, len1) {
        var i;
        if (!len0 || !len1) {
            return;
        }
        ctx.moveTo(curve0[0].x, curve0[0].y);
        for (i = 1; i < len0; ++i) {
            helpers.canvas.lineTo(ctx, curve0[i - 1], curve0[i]);
        }
        ctx.lineTo(curve1[len1 - 1].x, curve1[len1 - 1].y);
        for (i = len1 - 1; i > 0; --i) {
            helpers.canvas.lineTo(ctx, curve1[i], curve1[i - 1], true);
        }
    }
    function doFill(ctx, points, mapper, view, color, loop) {
        var count = points.length;
        var span = view.spanGaps;
        var curve0 = [];
        var curve1 = [];
        var len0 = 0;
        var len1 = 0;
        var i, ilen, index, p0, p1, d0, d1;
        ctx.beginPath();
        for (i = 0, ilen = count + !!loop; i < ilen; ++i) {
            index = i % count;
            p0 = points[index]._view;
            p1 = mapper(p0, index, view);
            d0 = isDrawable(p0);
            d1 = isDrawable(p1);
            if (d0 && d1) {
                len0 = curve0.push(p0);
                len1 = curve1.push(p1);
            } else if (len0 && len1) {
                if (!span) {
                    drawArea(ctx, curve0, curve1, len0, len1);
                    len0 = len1 = 0;
                    curve0 = [];
                    curve1 = [];
                } else {
                    if (d0) {
                        curve0.push(p0);
                    }
                    if (d1) {
                        curve1.push(p1);
                    }
                }
            }
        }
        drawArea(ctx, curve0, curve1, len0, len1);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }
    module.exports = {
        id: 'filler',
        afterDatasetsUpdate: function (chart, options) {
            var count = (chart.data.datasets || []).length;
            var propagate = options.propagate;
            var sources = [];
            var meta, i, el, source;
            for (i = 0; i < count; ++i) {
                meta = chart.getDatasetMeta(i);
                el = meta.dataset;
                source = null;
                if (el && el._model && el instanceof elements.Line) {
                    source = {
                        visible: chart.isDatasetVisible(i),
                        fill: decodeFill(el, i, count),
                        chart: chart,
                        el: el
                    };
                }
                meta.$filler = source;
                sources.push(source);
            }
            for (i = 0; i < count; ++i) {
                source = sources[i];
                if (!source) {
                    continue;
                }
                source.fill = resolveTarget(sources, i, propagate);
                source.boundary = computeBoundary(source);
                source.mapper = createMapper(source);
            }
        },
        beforeDatasetDraw: function (chart, args) {
            var meta = args.meta.$filler;
            if (!meta) {
                return;
            }
            var ctx = chart.ctx;
            var el = meta.el;
            var view = el._view;
            var points = el._children || [];
            var mapper = meta.mapper;
            var color = view.backgroundColor || defaults.global.defaultColor;
            if (mapper && color && points.length) {
                helpers.canvas.clipArea(ctx, chart.chartArea);
                doFill(ctx, points, mapper, view, color, el._loop);
                helpers.canvas.unclipArea(ctx);
            }
        }
    };
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/plugins/plugin.legend',[
    '../core/core.defaults',
    '../core/core.element',
    '../helpers/index',
    '../core/core.layouts'
], function (__module__0, __module__1, __module__2, __module__3) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var defaults = __module__0;
    var Element = __module__1;
    var helpers = __module__2;
    var layouts = __module__3;
    var noop = helpers.noop;
    var valueOrDefault = helpers.valueOrDefault;
    defaults._set('global', {
        legend: {
            display: true,
            position: 'top',
            fullWidth: true,
            reverse: false,
            weight: 1000,
            onClick: function (e, legendItem) {
                var index = legendItem.datasetIndex;
                var ci = this.chart;
                var meta = ci.getDatasetMeta(index);
                meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
                ci.update();
            },
            onHover: null,
            onLeave: null,
            labels: {
                boxWidth: 40,
                padding: 10,
                generateLabels: function (chart) {
                    var data = chart.data;
                    return helpers.isArray(data.datasets) ? data.datasets.map(function (dataset, i) {
                        return {
                            text: dataset.label,
                            fillStyle: !helpers.isArray(dataset.backgroundColor) ? dataset.backgroundColor : dataset.backgroundColor[0],
                            hidden: !chart.isDatasetVisible(i),
                            lineCap: dataset.borderCapStyle,
                            lineDash: dataset.borderDash,
                            lineDashOffset: dataset.borderDashOffset,
                            lineJoin: dataset.borderJoinStyle,
                            lineWidth: dataset.borderWidth,
                            strokeStyle: dataset.borderColor,
                            pointStyle: dataset.pointStyle,
                            datasetIndex: i
                        };
                    }, this) : [];
                }
            }
        },
        legendCallback: function (chart) {
            var text = [];
            text.push('<ul class="' + chart.id + '-legend">');
            for (var i = 0; i < chart.data.datasets.length; i++) {
                text.push('<li><span style="background-color:' + chart.data.datasets[i].backgroundColor + '"></span>');
                if (chart.data.datasets[i].label) {
                    text.push(chart.data.datasets[i].label);
                }
                text.push('</li>');
            }
            text.push('</ul>');
            return text.join('');
        }
    });
    function getBoxWidth(labelOpts, fontSize) {
        return labelOpts.usePointStyle && labelOpts.boxWidth > fontSize ? fontSize : labelOpts.boxWidth;
    }
    var Legend = Element.extend({
        initialize: function (config) {
            helpers.extend(this, config);
            this.legendHitBoxes = [];
            this._hoveredItem = null;
            this.doughnutMode = false;
        },
        beforeUpdate: noop,
        update: function (maxWidth, maxHeight, margins) {
            var me = this;
            me.beforeUpdate();
            me.maxWidth = maxWidth;
            me.maxHeight = maxHeight;
            me.margins = margins;
            me.beforeSetDimensions();
            me.setDimensions();
            me.afterSetDimensions();
            me.beforeBuildLabels();
            me.buildLabels();
            me.afterBuildLabels();
            me.beforeFit();
            me.fit();
            me.afterFit();
            me.afterUpdate();
            return me.minSize;
        },
        afterUpdate: noop,
        beforeSetDimensions: noop,
        setDimensions: function () {
            var me = this;
            if (me.isHorizontal()) {
                me.width = me.maxWidth;
                me.left = 0;
                me.right = me.width;
            } else {
                me.height = me.maxHeight;
                me.top = 0;
                me.bottom = me.height;
            }
            me.paddingLeft = 0;
            me.paddingTop = 0;
            me.paddingRight = 0;
            me.paddingBottom = 0;
            me.minSize = {
                width: 0,
                height: 0
            };
        },
        afterSetDimensions: noop,
        beforeBuildLabels: noop,
        buildLabels: function () {
            var me = this;
            var labelOpts = me.options.labels || {};
            var legendItems = helpers.callback(labelOpts.generateLabels, [me.chart], me) || [];
            if (labelOpts.filter) {
                legendItems = legendItems.filter(function (item) {
                    return labelOpts.filter(item, me.chart.data);
                });
            }
            if (me.options.reverse) {
                legendItems.reverse();
            }
            me.legendItems = legendItems;
        },
        afterBuildLabels: noop,
        beforeFit: noop,
        fit: function () {
            var me = this;
            var opts = me.options;
            var labelOpts = opts.labels;
            var display = opts.display;
            var ctx = me.ctx;
            var labelFont = helpers.options._parseFont(labelOpts);
            var fontSize = labelFont.size;
            var hitboxes = me.legendHitBoxes = [];
            var minSize = me.minSize;
            var isHorizontal = me.isHorizontal();
            if (isHorizontal) {
                minSize.width = me.maxWidth;
                minSize.height = display ? 10 : 0;
            } else {
                minSize.width = display ? 10 : 0;
                minSize.height = me.maxHeight;
            }
            if (display) {
                ctx.font = labelFont.string;
                if (isHorizontal) {
                    var lineWidths = me.lineWidths = [0];
                    var totalHeight = 0;
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'top';
                    helpers.each(me.legendItems, function (legendItem, i) {
                        var boxWidth = getBoxWidth(labelOpts, fontSize);
                        var width = boxWidth + fontSize / 2 + ctx.measureText(legendItem.text).width;
                        if (i === 0 || lineWidths[lineWidths.length - 1] + width + labelOpts.padding > minSize.width) {
                            totalHeight += fontSize + labelOpts.padding;
                            lineWidths[lineWidths.length - (i > 0 ? 0 : 1)] = labelOpts.padding;
                        }
                        hitboxes[i] = {
                            left: 0,
                            top: 0,
                            width: width,
                            height: fontSize
                        };
                        lineWidths[lineWidths.length - 1] += width + labelOpts.padding;
                    });
                    minSize.height += totalHeight;
                } else {
                    var vPadding = labelOpts.padding;
                    var columnWidths = me.columnWidths = [];
                    var totalWidth = labelOpts.padding;
                    var currentColWidth = 0;
                    var currentColHeight = 0;
                    var itemHeight = fontSize + vPadding;
                    helpers.each(me.legendItems, function (legendItem, i) {
                        var boxWidth = getBoxWidth(labelOpts, fontSize);
                        var itemWidth = boxWidth + fontSize / 2 + ctx.measureText(legendItem.text).width;
                        if (i > 0 && currentColHeight + itemHeight > minSize.height - vPadding) {
                            totalWidth += currentColWidth + labelOpts.padding;
                            columnWidths.push(currentColWidth);
                            currentColWidth = 0;
                            currentColHeight = 0;
                        }
                        currentColWidth = Math.max(currentColWidth, itemWidth);
                        currentColHeight += itemHeight;
                        hitboxes[i] = {
                            left: 0,
                            top: 0,
                            width: itemWidth,
                            height: fontSize
                        };
                    });
                    totalWidth += currentColWidth;
                    columnWidths.push(currentColWidth);
                    minSize.width += totalWidth;
                }
            }
            me.width = minSize.width;
            me.height = minSize.height;
        },
        afterFit: noop,
        isHorizontal: function () {
            return this.options.position === 'top' || this.options.position === 'bottom';
        },
        draw: function () {
            var me = this;
            var opts = me.options;
            var labelOpts = opts.labels;
            var globalDefaults = defaults.global;
            var defaultColor = globalDefaults.defaultColor;
            var lineDefault = globalDefaults.elements.line;
            var legendWidth = me.width;
            var lineWidths = me.lineWidths;
            if (opts.display) {
                var ctx = me.ctx;
                var fontColor = valueOrDefault(labelOpts.fontColor, globalDefaults.defaultFontColor);
                var labelFont = helpers.options._parseFont(labelOpts);
                var fontSize = labelFont.size;
                var cursor;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                ctx.lineWidth = 0.5;
                ctx.strokeStyle = fontColor;
                ctx.fillStyle = fontColor;
                ctx.font = labelFont.string;
                var boxWidth = getBoxWidth(labelOpts, fontSize);
                var hitboxes = me.legendHitBoxes;
                var drawLegendBox = function (x, y, legendItem) {
                    if (isNaN(boxWidth) || boxWidth <= 0) {
                        return;
                    }
                    ctx.save();
                    var lineWidth = valueOrDefault(legendItem.lineWidth, lineDefault.borderWidth);
                    ctx.fillStyle = valueOrDefault(legendItem.fillStyle, defaultColor);
                    ctx.lineCap = valueOrDefault(legendItem.lineCap, lineDefault.borderCapStyle);
                    ctx.lineDashOffset = valueOrDefault(legendItem.lineDashOffset, lineDefault.borderDashOffset);
                    ctx.lineJoin = valueOrDefault(legendItem.lineJoin, lineDefault.borderJoinStyle);
                    ctx.lineWidth = lineWidth;
                    ctx.strokeStyle = valueOrDefault(legendItem.strokeStyle, defaultColor);
                    if (ctx.setLineDash) {
                        ctx.setLineDash(valueOrDefault(legendItem.lineDash, lineDefault.borderDash));
                    }
                    if (opts.labels && opts.labels.usePointStyle) {
                        var radius = boxWidth * Math.SQRT2 / 2;
                        var centerX = x + boxWidth / 2;
                        var centerY = y + fontSize / 2;
                        helpers.canvas.drawPoint(ctx, legendItem.pointStyle, radius, centerX, centerY);
                    } else {
                        if (lineWidth !== 0) {
                            ctx.strokeRect(x, y, boxWidth, fontSize);
                        }
                        ctx.fillRect(x, y, boxWidth, fontSize);
                    }
                    ctx.restore();
                };
                var fillText = function (x, y, legendItem, textWidth) {
                    var halfFontSize = fontSize / 2;
                    var xLeft = boxWidth + halfFontSize + x;
                    var yMiddle = y + halfFontSize;
                    ctx.fillText(legendItem.text, xLeft, yMiddle);
                    if (legendItem.hidden) {
                        ctx.beginPath();
                        ctx.lineWidth = 2;
                        ctx.moveTo(xLeft, yMiddle);
                        ctx.lineTo(xLeft + textWidth, yMiddle);
                        ctx.stroke();
                    }
                };
                var isHorizontal = me.isHorizontal();
                if (isHorizontal) {
                    cursor = {
                        x: me.left + (legendWidth - lineWidths[0]) / 2 + labelOpts.padding,
                        y: me.top + labelOpts.padding,
                        line: 0
                    };
                } else {
                    cursor = {
                        x: me.left + labelOpts.padding,
                        y: me.top + labelOpts.padding,
                        line: 0
                    };
                }
                var itemHeight = fontSize + labelOpts.padding;
                helpers.each(me.legendItems, function (legendItem, i) {
                    var textWidth = ctx.measureText(legendItem.text).width;
                    var width = boxWidth + fontSize / 2 + textWidth;
                    var x = cursor.x;
                    var y = cursor.y;
                    if (isHorizontal) {
                        if (i > 0 && x + width + labelOpts.padding > me.left + me.minSize.width) {
                            y = cursor.y += itemHeight;
                            cursor.line++;
                            x = cursor.x = me.left + (legendWidth - lineWidths[cursor.line]) / 2 + labelOpts.padding;
                        }
                    } else if (i > 0 && y + itemHeight > me.top + me.minSize.height) {
                        x = cursor.x = x + me.columnWidths[cursor.line] + labelOpts.padding;
                        y = cursor.y = me.top + labelOpts.padding;
                        cursor.line++;
                    }
                    drawLegendBox(x, y, legendItem);
                    hitboxes[i].left = x;
                    hitboxes[i].top = y;
                    fillText(x, y, legendItem, textWidth);
                    if (isHorizontal) {
                        cursor.x += width + labelOpts.padding;
                    } else {
                        cursor.y += itemHeight;
                    }
                });
            }
        },
        _getLegendItemAt: function (x, y) {
            var me = this;
            var i, hitBox, lh;
            if (x >= me.left && x <= me.right && y >= me.top && y <= me.bottom) {
                lh = me.legendHitBoxes;
                for (i = 0; i < lh.length; ++i) {
                    hitBox = lh[i];
                    if (x >= hitBox.left && x <= hitBox.left + hitBox.width && y >= hitBox.top && y <= hitBox.top + hitBox.height) {
                        return me.legendItems[i];
                    }
                }
            }
            return null;
        },
        handleEvent: function (e) {
            var me = this;
            var opts = me.options;
            var type = e.type === 'mouseup' ? 'click' : e.type;
            var hoveredItem;
            if (type === 'mousemove') {
                if (!opts.onHover && !opts.onLeave) {
                    return;
                }
            } else if (type === 'click') {
                if (!opts.onClick) {
                    return;
                }
            } else {
                return;
            }
            hoveredItem = me._getLegendItemAt(e.x, e.y);
            if (type === 'click') {
                if (hoveredItem && opts.onClick) {
                    opts.onClick.call(me, e.native, hoveredItem);
                }
            } else {
                if (opts.onLeave && hoveredItem !== me._hoveredItem) {
                    if (me._hoveredItem) {
                        opts.onLeave.call(me, e.native, me._hoveredItem);
                    }
                    me._hoveredItem = hoveredItem;
                }
                if (opts.onHover && hoveredItem) {
                    opts.onHover.call(me, e.native, hoveredItem);
                }
            }
        }
    });
    function createNewLegendAndAttach(chart, legendOpts) {
        var legend = new Legend({
            ctx: chart.ctx,
            options: legendOpts,
            chart: chart
        });
        layouts.configure(chart, legend, legendOpts);
        layouts.addBox(chart, legend);
        chart.legend = legend;
    }
    module.exports = {
        id: 'legend',
        _element: Legend,
        beforeInit: function (chart) {
            var legendOpts = chart.options.legend;
            if (legendOpts) {
                createNewLegendAndAttach(chart, legendOpts);
            }
        },
        beforeUpdate: function (chart) {
            var legendOpts = chart.options.legend;
            var legend = chart.legend;
            if (legendOpts) {
                helpers.mergeIf(legendOpts, defaults.global.legend);
                if (legend) {
                    layouts.configure(chart, legend, legendOpts);
                    legend.options = legendOpts;
                } else {
                    createNewLegendAndAttach(chart, legendOpts);
                }
            } else if (legend) {
                layouts.removeBox(chart, legend);
                delete chart.legend;
            }
        },
        afterEvent: function (chart, e) {
            var legend = chart.legend;
            if (legend) {
                legend.handleEvent(e);
            }
        }
    };
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/plugins/plugin.title',[
    '../core/core.defaults',
    '../core/core.element',
    '../helpers/index',
    '../core/core.layouts'
], function (__module__0, __module__1, __module__2, __module__3) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var defaults = __module__0;
    var Element = __module__1;
    var helpers = __module__2;
    var layouts = __module__3;
    var noop = helpers.noop;
    defaults._set('global', {
        title: {
            display: false,
            fontStyle: 'bold',
            fullWidth: true,
            padding: 10,
            position: 'top',
            text: '',
            weight: 2000
        }
    });
    var Title = Element.extend({
        initialize: function (config) {
            var me = this;
            helpers.extend(me, config);
            me.legendHitBoxes = [];
        },
        beforeUpdate: noop,
        update: function (maxWidth, maxHeight, margins) {
            var me = this;
            me.beforeUpdate();
            me.maxWidth = maxWidth;
            me.maxHeight = maxHeight;
            me.margins = margins;
            me.beforeSetDimensions();
            me.setDimensions();
            me.afterSetDimensions();
            me.beforeBuildLabels();
            me.buildLabels();
            me.afterBuildLabels();
            me.beforeFit();
            me.fit();
            me.afterFit();
            me.afterUpdate();
            return me.minSize;
        },
        afterUpdate: noop,
        beforeSetDimensions: noop,
        setDimensions: function () {
            var me = this;
            if (me.isHorizontal()) {
                me.width = me.maxWidth;
                me.left = 0;
                me.right = me.width;
            } else {
                me.height = me.maxHeight;
                me.top = 0;
                me.bottom = me.height;
            }
            me.paddingLeft = 0;
            me.paddingTop = 0;
            me.paddingRight = 0;
            me.paddingBottom = 0;
            me.minSize = {
                width: 0,
                height: 0
            };
        },
        afterSetDimensions: noop,
        beforeBuildLabels: noop,
        buildLabels: noop,
        afterBuildLabels: noop,
        beforeFit: noop,
        fit: function () {
            var me = this;
            var opts = me.options;
            var display = opts.display;
            var minSize = me.minSize;
            var lineCount = helpers.isArray(opts.text) ? opts.text.length : 1;
            var fontOpts = helpers.options._parseFont(opts);
            var textSize = display ? lineCount * fontOpts.lineHeight + opts.padding * 2 : 0;
            if (me.isHorizontal()) {
                minSize.width = me.maxWidth;
                minSize.height = textSize;
            } else {
                minSize.width = textSize;
                minSize.height = me.maxHeight;
            }
            me.width = minSize.width;
            me.height = minSize.height;
        },
        afterFit: noop,
        isHorizontal: function () {
            var pos = this.options.position;
            return pos === 'top' || pos === 'bottom';
        },
        draw: function () {
            var me = this;
            var ctx = me.ctx;
            var opts = me.options;
            if (opts.display) {
                var fontOpts = helpers.options._parseFont(opts);
                var lineHeight = fontOpts.lineHeight;
                var offset = lineHeight / 2 + opts.padding;
                var rotation = 0;
                var top = me.top;
                var left = me.left;
                var bottom = me.bottom;
                var right = me.right;
                var maxWidth, titleX, titleY;
                ctx.fillStyle = helpers.valueOrDefault(opts.fontColor, defaults.global.defaultFontColor);
                ctx.font = fontOpts.string;
                if (me.isHorizontal()) {
                    titleX = left + (right - left) / 2;
                    titleY = top + offset;
                    maxWidth = right - left;
                } else {
                    titleX = opts.position === 'left' ? left + offset : right - offset;
                    titleY = top + (bottom - top) / 2;
                    maxWidth = bottom - top;
                    rotation = Math.PI * (opts.position === 'left' ? -0.5 : 0.5);
                }
                ctx.save();
                ctx.translate(titleX, titleY);
                ctx.rotate(rotation);
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                var text = opts.text;
                if (helpers.isArray(text)) {
                    var y = 0;
                    for (var i = 0; i < text.length; ++i) {
                        ctx.fillText(text[i], 0, y, maxWidth);
                        y += lineHeight;
                    }
                } else {
                    ctx.fillText(text, 0, 0, maxWidth);
                }
                ctx.restore();
            }
        }
    });
    function createNewTitleBlockAndAttach(chart, titleOpts) {
        var title = new Title({
            ctx: chart.ctx,
            options: titleOpts,
            chart: chart
        });
        layouts.configure(chart, title, titleOpts);
        layouts.addBox(chart, title);
        chart.titleBlock = title;
    }
    module.exports = {
        id: 'title',
        _element: Title,
        beforeInit: function (chart) {
            var titleOpts = chart.options.title;
            if (titleOpts) {
                createNewTitleBlockAndAttach(chart, titleOpts);
            }
        },
        beforeUpdate: function (chart) {
            var titleOpts = chart.options.title;
            var titleBlock = chart.titleBlock;
            if (titleOpts) {
                helpers.mergeIf(titleOpts, defaults.global.title);
                if (titleBlock) {
                    layouts.configure(chart, titleBlock, titleOpts);
                    titleBlock.options = titleOpts;
                } else {
                    createNewTitleBlockAndAttach(chart, titleOpts);
                }
            } else if (titleBlock) {
                layouts.removeBox(chart, titleBlock);
                delete chart.titleBlock;
            }
        }
    };
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/plugins/index',[
    './plugin.filler',
    './plugin.legend',
    './plugin.title'
], function (__module__0, __module__1, __module__2) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    module.exports = {};
    module.exports.filler = __module__0;
    module.exports.legend = __module__1;
    module.exports.title = __module__2;
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs/main',[
    './core/core.controller',
    './helpers/index',
    './core/core.helpers',
    './core/core.adapters',
    './core/core.animation',
    './core/core.animations',
    './controllers/index',
    './core/core.datasetController',
    './core/core.defaults',
    './core/core.element',
    './elements/index',
    './core/core.interaction',
    './core/core.layouts',
    './platforms/platform',
    './core/core.plugins',
    './core/core.scale',
    './core/core.scaleService',
    './core/core.ticks',
    './core/core.tooltip',
    './scales/index',
    './adapters/index',
    './plugins/index',
    './scales/scale.linearbase'
], function (__module__0, __module__1, __module__2, __module__3, __module__4, __module__5, __module__6, __module__7, __module__8, __module__9, __module__10, __module__11, __module__12, __module__13, __module__14, __module__15, __module__16, __module__17, __module__18, __module__19, __module__20, __module__21, __module__22) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var Chart = __module__0;
    Chart.helpers = __module__1;
    __module__2(Chart);
    Chart._adapters = __module__3;
    Chart.Animation = __module__4;
    Chart.animationService = __module__5;
    Chart.controllers = __module__6;
    Chart.DatasetController = __module__7;
    Chart.defaults = __module__8;
    Chart.Element = __module__9;
    Chart.elements = __module__10;
    Chart.Interaction = __module__11;
    Chart.layouts = __module__12;
    Chart.platform = __module__13;
    Chart.plugins = __module__14;
    Chart.Scale = __module__15;
    Chart.scaleService = __module__16;
    Chart.Ticks = __module__17;
    Chart.Tooltip = __module__18;
    var scales = __module__19;
    Chart.helpers.each(scales, function (scale, type) {
        Chart.scaleService.registerScaleType(type, scale, scale._defaults);
    });
    __module__20;
    var plugins = __module__21;
    for (var k in plugins) {
        if (plugins.hasOwnProperty(k)) {
            Chart.plugins.register(plugins[k]);
        }
    }
    Chart.platform.initialize();
    module.exports = Chart;
    if (typeof window !== 'undefined') {
        window.Chart = Chart;
    }
    Chart.Chart = Chart;
    Chart.Legend = plugins.legend._element;
    Chart.Title = plugins.title._element;
    Chart.pluginService = Chart.plugins;
    Chart.PluginBase = Chart.Element.extend({});
    Chart.canvasHelpers = Chart.helpers.canvas;
    Chart.layoutService = Chart.layouts;
    Chart.LinearScaleBase = __module__22;
    Chart.helpers.each([
        'Bar',
        'Bubble',
        'Doughnut',
        'Line',
        'PolarArea',
        'Radar',
        'Scatter'
    ], function (klass) {
        Chart[klass] = function (ctx, cfg) {
            return new Chart(ctx, Chart.helpers.merge(cfg || {}, { type: klass.charAt(0).toLowerCase() + klass.slice(1) }));
        };
    });
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define('skylark-chartjs', ['skylark-chartjs/main'], function (main) { return main; });


},this);
/**
 * skylark-chartjs - A version of chartjs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.2
 * @link https://github.com/skylarkui/skylark-chartjs/
 * @license MIT
 */
define(["./color-convert/index","./chartjs-color-string"],function(t,e){var s=function(t){return t instanceof s?t:this instanceof s?(this.valid=!1,this.values={rgb:[0,0,0],hsl:[0,0,0],hsv:[0,0,0],hwb:[0,0,0],cmyk:[0,0,0,0],alpha:1},void("string"==typeof t?(n=e.getRgba(t))?this.setValues("rgb",n):(n=e.getHsla(t))?this.setValues("hsl",n):(n=e.getHwb(t))&&this.setValues("hwb",n):"object"==typeof t&&(void 0!==(n=t).r||void 0!==n.red?this.setValues("rgb",n):void 0!==n.l||void 0!==n.lightness?this.setValues("hsl",n):void 0!==n.v||void 0!==n.value?this.setValues("hsv",n):void 0!==n.w||void 0!==n.whiteness?this.setValues("hwb",n):void 0===n.c&&void 0===n.cyan||this.setValues("cmyk",n)))):new s(t);var n};return s.prototype={isValid:function(){return this.valid},rgb:function(){return this.setSpace("rgb",arguments)},hsl:function(){return this.setSpace("hsl",arguments)},hsv:function(){return this.setSpace("hsv",arguments)},hwb:function(){return this.setSpace("hwb",arguments)},cmyk:function(){return this.setSpace("cmyk",arguments)},rgbArray:function(){return this.values.rgb},hslArray:function(){return this.values.hsl},hsvArray:function(){return this.values.hsv},hwbArray:function(){var t=this.values;return 1!==t.alpha?t.hwb.concat([t.alpha]):t.hwb},cmykArray:function(){return this.values.cmyk},rgbaArray:function(){var t=this.values;return t.rgb.concat([t.alpha])},hslaArray:function(){var t=this.values;return t.hsl.concat([t.alpha])},alpha:function(t){return void 0===t?this.values.alpha:(this.setValues("alpha",t),this)},red:function(t){return this.setChannel("rgb",0,t)},green:function(t){return this.setChannel("rgb",1,t)},blue:function(t){return this.setChannel("rgb",2,t)},hue:function(t){return t&&(t=(t%=360)<0?360+t:t),this.setChannel("hsl",0,t)},saturation:function(t){return this.setChannel("hsl",1,t)},lightness:function(t){return this.setChannel("hsl",2,t)},saturationv:function(t){return this.setChannel("hsv",1,t)},whiteness:function(t){return this.setChannel("hwb",1,t)},blackness:function(t){return this.setChannel("hwb",2,t)},value:function(t){return this.setChannel("hsv",2,t)},cyan:function(t){return this.setChannel("cmyk",0,t)},magenta:function(t){return this.setChannel("cmyk",1,t)},yellow:function(t){return this.setChannel("cmyk",2,t)},black:function(t){return this.setChannel("cmyk",3,t)},hexString:function(){return e.hexString(this.values.rgb)},rgbString:function(){return e.rgbString(this.values.rgb,this.values.alpha)},rgbaString:function(){return e.rgbaString(this.values.rgb,this.values.alpha)},percentString:function(){return e.percentString(this.values.rgb,this.values.alpha)},hslString:function(){return e.hslString(this.values.hsl,this.values.alpha)},hslaString:function(){return e.hslaString(this.values.hsl,this.values.alpha)},hwbString:function(){return e.hwbString(this.values.hwb,this.values.alpha)},keyword:function(){return e.keyword(this.values.rgb,this.values.alpha)},rgbNumber:function(){var t=this.values.rgb;return t[0]<<16|t[1]<<8|t[2]},luminosity:function(){for(var t=this.values.rgb,e=[],s=0;s<t.length;s++){var n=t[s]/255;e[s]=n<=.03928?n/12.92:Math.pow((n+.055)/1.055,2.4)}return.2126*e[0]+.7152*e[1]+.0722*e[2]},contrast:function(t){var e=this.luminosity(),s=t.luminosity();return e>s?(e+.05)/(s+.05):(s+.05)/(e+.05)},level:function(t){var e=this.contrast(t);return e>=7.1?"AAA":e>=4.5?"AA":""},dark:function(){var t=this.values.rgb;return(299*t[0]+587*t[1]+114*t[2])/1e3<128},light:function(){return!this.dark()},negate:function(){for(var t=[],e=0;e<3;e++)t[e]=255-this.values.rgb[e];return this.setValues("rgb",t),this},lighten:function(t){var e=this.values.hsl;return e[2]+=e[2]*t,this.setValues("hsl",e),this},darken:function(t){var e=this.values.hsl;return e[2]-=e[2]*t,this.setValues("hsl",e),this},saturate:function(t){var e=this.values.hsl;return e[1]+=e[1]*t,this.setValues("hsl",e),this},desaturate:function(t){var e=this.values.hsl;return e[1]-=e[1]*t,this.setValues("hsl",e),this},whiten:function(t){var e=this.values.hwb;return e[1]+=e[1]*t,this.setValues("hwb",e),this},blacken:function(t){var e=this.values.hwb;return e[2]+=e[2]*t,this.setValues("hwb",e),this},greyscale:function(){var t=this.values.rgb,e=.3*t[0]+.59*t[1]+.11*t[2];return this.setValues("rgb",[e,e,e]),this},clearer:function(t){var e=this.values.alpha;return this.setValues("alpha",e-e*t),this},opaquer:function(t){var e=this.values.alpha;return this.setValues("alpha",e+e*t),this},rotate:function(t){var e=this.values.hsl,s=(e[0]+t)%360;return e[0]=s<0?360+s:s,this.setValues("hsl",e),this},mix:function(t,e){var s=t,n=void 0===e?.5:e,r=2*n-1,a=this.alpha()-s.alpha(),h=((r*a==-1?r:(r+a)/(1+r*a))+1)/2,i=1-h;return this.rgb(h*this.red()+i*s.red(),h*this.green()+i*s.green(),h*this.blue()+i*s.blue()).alpha(this.alpha()*n+s.alpha()*(1-n))},toJSON:function(){return this.rgb()},clone:function(){var t,e,n=new s,r=this.values,a=n.values;for(var h in r)r.hasOwnProperty(h)&&(t=r[h],"[object Array]"===(e={}.toString.call(t))?a[h]=t.slice(0):"[object Number]"===e?a[h]=t:console.error("unexpected color value:",t));return n}},s.prototype.spaces={rgb:["red","green","blue"],hsl:["hue","saturation","lightness"],hsv:["hue","saturation","value"],hwb:["hue","whiteness","blackness"],cmyk:["cyan","magenta","yellow","black"]},s.prototype.maxes={rgb:[255,255,255],hsl:[360,100,100],hsv:[360,100,100],hwb:[360,100,100],cmyk:[100,100,100,100]},s.prototype.getValues=function(t){for(var e=this.values,s={},n=0;n<t.length;n++)s[t.charAt(n)]=e[t][n];return 1!==e.alpha&&(s.a=e.alpha),s},s.prototype.setValues=function(e,s){var n,r,a=this.values,h=this.spaces,i=this.maxes,u=1;if(this.valid=!0,"alpha"===e)u=s;else if(s.length)a[e]=s.slice(0,e.length),u=s[e.length];else if(void 0!==s[e.charAt(0)]){for(n=0;n<e.length;n++)a[e][n]=s[e.charAt(n)];u=s.a}else if(void 0!==s[h[e][0]]){var l=h[e];for(n=0;n<e.length;n++)a[e][n]=s[l[n]];u=s.alpha}if(a.alpha=Math.max(0,Math.min(1,void 0===u?a.alpha:u)),"alpha"===e)return!1;for(n=0;n<e.length;n++)r=Math.max(0,Math.min(i[e][n],a[e][n])),a[e][n]=Math.round(r);for(var o in h)o!==e&&(a[o]=t[e][o](a[e]));return!0},s.prototype.setSpace=function(t,e){var s=e[0];return void 0===s?this.getValues(t):("number"==typeof s&&(s=Array.prototype.slice.call(e)),this.setValues(t,s),this)},s.prototype.setChannel=function(t,e,s){var n=this.values[t];return void 0===s?n[e]:s===n[e]?this:(n[e]=s,this.setValues(t,n),this)},s});
//# sourceMappingURL=../sourcemaps/packages/chartjs-color.js.map

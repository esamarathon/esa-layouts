/*! For license information please see transition.js.LICENSE.txt */
(()=>{"use strict";var e,t={848:(e,t,r)=>{var n=r(5803),o=r(5925);r(4807),r(7023),r(5654),r(779),r(8793);var i,a,c=r(2727),f=r(3144),u=function(){return i||"undefined"!=typeof window&&(i=window.gsap)&&i.registerPlugin&&i},s=function(e,t){return!!(void 0===e?t:e&&!~(e+"").indexOf("false"))},p=function(e){if(i=e||u()){a=i.registerEase;var t,r=i.parseEase(),n=function(e){return function(t){var r=.5+t/2;e.config=function(t){return e(2*(1-t)*t*r+t*t)}}};for(t in r)r[t].config||n(r[t]);for(t in a("slow",y),a("expoScale",h),a("rough",b),m)"version"!==t&&i.core.globals(t,m[t])}},l=function(e,t,r){var n=(e=Math.min(1,e||.7))<1?t||0===t?t:.7:0,o=(1-e)/2,i=o+e,a=s(r);return function(e){var t=e+(.5-e)*n;return e<o?a?1-(e=1-e/o)*e:t-(e=1-e/o)*e*e*e*t:e>i?a?1===e?0:1-(e=(e-i)/o)*e:t+(e-t)*(e=(e-i)/o)*e*e*e:a?1:t}},d=function(e,t,r){var n=Math.log(t/e),o=t-e;return r&&(r=i.parseEase(r)),function(t){return(e*Math.exp(n*(r?r(t):t))-e)/o}},v=function(e,t,r){this.t=e,this.v=t,r&&(this.next=r,r.prev=this,this.c=r.v-t,this.gap=r.t-e)},g=function(e){"object"!=typeof e&&(e={points:+e||20});for(var t,r,n,o,a,c,f,u=e.taper||"none",p=[],l=0,d=0|(+e.points||20),g=d,y=s(e.randomize,!0),h=s(e.clamp),b=i?i.parseEase(e.template):0,m=.4*(+e.strength||1);--g>-1;)t=y?Math.random():1/d*g,r=b?b(t):t,n="none"===u?m:"out"===u?(o=1-t)*o*m:"in"===u?t*t*m:t<.5?(o=2*t)*o*.5*m:(o=2*(1-t))*o*.5*m,y?r+=Math.random()*n-.5*n:g%2?r+=.5*n:r-=.5*n,h&&(r>1?r=1:r<0&&(r=0)),p[l++]={x:t,y:r};for(p.sort((function(e,t){return e.x-t.x})),c=new v(1,1,null),g=d;g--;)a=p[g],c=new v(a.x,a.y,c);return f=new v(0,0,c.t?c:c.next),function(e){var t=f;if(e>t.t){for(;t.next&&e>=t.t;)t=t.next;t=t.prev}else for(;t.prev&&e<=t.t;)t=t.prev;return f=t,t.v+(e-t.t)/t.gap*t.c}},y=l(.7);y.ease=y,y.config=l;var h=d(1,2);h.config=d;var b=g();b.ease=b,b.config=g;var m={SlowMo:y,RoughEase:b,ExpoScaleEase:h};for(var w in m)m[w].register=p,m[w].version="3.9.1";u()&&i.registerPlugin(y);var O=function(e,t,r,n){var o,i=arguments.length,a=i<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var c=e.length-1;c>=0;c--)(o=e[c])&&(a=(i<3?o(a):i>3?o(t,r,a):o(t,r))||a);return i>3&&a&&Object.defineProperty(t,r,a),a};f.ZP.registerPlugin(y);let x=class extends n.Z{constructor(){super(...arguments),this.timeline=f.ZP.timeline({paused:!0})}mounted(){this.timeline.to(this.transitionBlock,{x:"-210vw",duration:1.2,ease:"slow(0.1, 0.8, false)"},0),this.timeline.to(this.leftBox,{width:"75px",duration:.6},0),this.timeline.to(this.rightBox,{width:"150px",duration:.6},.6),nodecg.listenFor("showTransition",(()=>{this.timeline.restart()}))}};O([(0,c.R)("TransitionBlock")],x.prototype,"transitionBlock",void 0),O([(0,c.R)("LeftBox")],x.prototype,"leftBox",void 0),O([(0,c.R)("RightBox")],x.prototype,"rightBox",void 0),x=O([o.ZP],x);const _=x,j=(0,r(5440).Z)(_,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{ref:"TransitionBlock",style:{position:"fixed",display:"flex","justify-content":"space-between",left:"100vw",width:"110vw",height:"100vh","background-color":"#734e9e"}},[n("div",{ref:"LeftBox",style:{background:"#fdbb1c",width:"150px"}}),e._v(" "),n("img",{style:{width:"75vw"},attrs:{src:r(7775)}}),e._v(" "),n("div",{ref:"RightBox",style:{background:"#fdbb1c",width:"75px"}})])}),[],!1,null,null,null).exports;new n.Z({el:"#App",render:e=>e(j)})},5925:(e,t,r)=>{r.d(t,{ZP:()=>h,yh:()=>s});var n=r(5803);function o(e){return o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},o(e)}function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(){return"undefined"!=typeof Reflect&&Reflect.defineMetadata&&Reflect.getOwnMetadataKeys}function c(e,t){f(e,t),Object.getOwnPropertyNames(t.prototype).forEach((function(r){f(e.prototype,t.prototype,r)})),Object.getOwnPropertyNames(t).forEach((function(r){f(e,t,r)}))}function f(e,t,r){(r?Reflect.getOwnMetadataKeys(t,r):Reflect.getOwnMetadataKeys(t)).forEach((function(n){var o=r?Reflect.getOwnMetadata(n,t,r):Reflect.getOwnMetadata(n,t);r?Reflect.defineMetadata(n,o,e,r):Reflect.defineMetadata(n,o,e)}))}var u={__proto__:[]}instanceof Array;function s(e){return function(t,r,n){var o="function"==typeof t?t:t.constructor;o.__decorators__||(o.__decorators__=[]),"number"!=typeof n&&(n=void 0),o.__decorators__.push((function(t){return e(t,r,n)}))}}function p(e,t){var r=t.prototype._init;t.prototype._init=function(){var t=this,r=Object.getOwnPropertyNames(e);if(e.$options.props)for(var n in e.$options.props)e.hasOwnProperty(n)||r.push(n);r.forEach((function(r){Object.defineProperty(t,r,{get:function(){return e[r]},set:function(t){e[r]=t},configurable:!0})}))};var n=new t;t.prototype._init=r;var o={};return Object.keys(n).forEach((function(e){void 0!==n[e]&&(o[e]=n[e])})),o}var l=["data","beforeCreate","created","beforeMount","mounted","beforeDestroy","destroyed","beforeUpdate","updated","activated","deactivated","render","errorCaptured","serverPrefetch"];function d(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};t.name=t.name||e._componentTag||e.name;var r=e.prototype;Object.getOwnPropertyNames(r).forEach((function(e){if("constructor"!==e)if(l.indexOf(e)>-1)t[e]=r[e];else{var n=Object.getOwnPropertyDescriptor(r,e);void 0!==n.value?"function"==typeof n.value?(t.methods||(t.methods={}))[e]=n.value:(t.mixins||(t.mixins=[])).push({data:function(){return i({},e,n.value)}}):(n.get||n.set)&&((t.computed||(t.computed={}))[e]={get:n.get,set:n.set})}})),(t.mixins||(t.mixins=[])).push({data:function(){return p(this,e)}});var o=e.__decorators__;o&&(o.forEach((function(e){return e(t)})),delete e.__decorators__);var f=Object.getPrototypeOf(e.prototype),u=f instanceof n.Z?f.constructor:n.Z,s=u.extend(t);return g(s,e,u),a()&&c(s,e),s}var v={prototype:!0,arguments:!0,callee:!0,caller:!0};function g(e,t,r){Object.getOwnPropertyNames(t).forEach((function(n){if(!v[n]){var i=Object.getOwnPropertyDescriptor(e,n);if(!i||i.configurable){var a,c,f=Object.getOwnPropertyDescriptor(t,n);if(!u){if("cid"===n)return;var s=Object.getOwnPropertyDescriptor(r,n);if(c=o(a=f.value),null!=a&&("object"===c||"function"===c)&&s&&s.value===f.value)return}Object.defineProperty(e,n,f)}}}))}function y(e){return"function"==typeof e?d(e):function(t){return d(t,e)}}y.registerHooks=function(e){var t;l.push.apply(l,function(e){if(Array.isArray(e)){for(var t=0,r=new Array(e.length);t<e.length;t++)r[t]=e[t];return r}}(t=e)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}())};const h=y},779:(e,t,r)=>{"undefined"!=typeof Reflect&&Reflect.getMetadata},7775:(e,t,r)=>{e.exports=r.p+"img/esa-big-logo-2-summer-aa7dca67a9779d924f8b.svg"}},r={};function n(e){var o=r[e];if(void 0!==o)return o.exports;var i=r[e]={exports:{}};return t[e](i,i.exports,n),i.exports}n.m=t,e=[],n.O=(t,r,o,i)=>{if(!r){var a=1/0;for(s=0;s<e.length;s++){for(var[r,o,i]=e[s],c=!0,f=0;f<r.length;f++)(!1&i||a>=i)&&Object.keys(n.O).every((e=>n.O[e](r[f])))?r.splice(f--,1):(c=!1,i<a&&(a=i));if(c){e.splice(s--,1);var u=o();void 0!==u&&(t=u)}}return t}i=i||0;for(var s=e.length;s>0&&e[s-1][2]>i;s--)e[s]=e[s-1];e[s]=[r,o,i]},n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e;n.g.importScripts&&(e=n.g.location+"");var t=n.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var r=t.getElementsByTagName("script");r.length&&(e=r[r.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),n.p=e+"../"})(),(()=>{var e={414:0};n.O.j=t=>0===e[t];var t=(t,r)=>{var o,i,[a,c,f]=r,u=0;if(a.some((t=>0!==e[t]))){for(o in c)n.o(c,o)&&(n.m[o]=c[o]);if(f)var s=f(n)}for(t&&t(r);u<a.length;u++)i=a[u],n.o(e,i)&&e[i]&&e[i][0](),e[i]=0;return n.O(s)},r=self.webpackChunk=self.webpackChunk||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))})();var o=n.O(void 0,[835,729,144],(()=>n(848)));o=n.O(o)})();
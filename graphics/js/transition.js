/*! For license information please see transition.js.LICENSE.txt */
(()=>{"use strict";var t,e={2396:(t,e,r)=>{var o=r(5803),n=r(5925);r(4807),r(7023),r(5654),r(779),r(8793);var i,a,c=r(2727),f=r(4902),s=function(){return i||"undefined"!=typeof window&&(i=window.gsap)&&i.registerPlugin&&i},u=function(t,e){return!!(void 0===t?e:t&&!~(t+"").indexOf("false"))},p=function(t){if(i=t||s()){a=i.registerEase;var e,r=i.parseEase(),o=function(t){return function(e){var r=.5+e/2;t.config=function(e){return t(2*(1-e)*e*r+e*e)}}};for(e in r)r[e].config||o(r[e]);for(e in a("slow",g),a("expoScale",y),a("rough",b),m)"version"!==e&&i.core.globals(e,m[e])}},l=function(t,e,r){var o=(t=Math.min(1,t||.7))<1?e||0===e?e:.7:0,n=(1-t)/2,i=n+t,a=u(r);return function(t){var e=t+(.5-t)*o;return t<n?a?1-(t=1-t/n)*t:e-(t=1-t/n)*t*t*t*e:t>i?a?1===t?0:1-(t=(t-i)/n)*t:e+(t-e)*(t=(t-i)/n)*t*t*t:a?1:e}},d=function(t,e,r){var o=Math.log(e/t),n=e-t;return r&&(r=i.parseEase(r)),function(e){return(t*Math.exp(o*(r?r(e):e))-t)/n}},v=function(t,e,r){this.t=t,this.v=e,r&&(this.next=r,r.prev=this,this.c=r.v-e,this.gap=r.t-t)},h=function(t){"object"!=typeof t&&(t={points:+t||20});for(var e,r,o,n,a,c,f,s=t.taper||"none",p=[],l=0,d=0|(+t.points||20),h=d,g=u(t.randomize,!0),y=u(t.clamp),b=i?i.parseEase(t.template):0,m=.4*(+t.strength||1);--h>-1;)e=g?Math.random():1/d*h,r=b?b(e):e,o="none"===s?m:"out"===s?(n=1-e)*n*m:"in"===s?e*e*m:e<.5?(n=2*e)*n*.5*m:(n=2*(1-e))*n*.5*m,g?r+=Math.random()*o-.5*o:h%2?r+=.5*o:r-=.5*o,y&&(r>1?r=1:r<0&&(r=0)),p[l++]={x:e,y:r};for(p.sort((function(t,e){return t.x-e.x})),c=new v(1,1,null),h=d;h--;)a=p[h],c=new v(a.x,a.y,c);return f=new v(0,0,c.t?c:c.next),function(t){var e=f;if(t>e.t){for(;e.next&&t>=e.t;)e=e.next;e=e.prev}else for(;e.prev&&t<=e.t;)e=e.prev;return f=e,e.v+(t-e.t)/e.gap*e.c}},g=l(.7);g.ease=g,g.config=l;var y=d(1,2);y.config=d;var b=h();b.ease=b,b.config=h;var m={SlowMo:g,RoughEase:b,ExpoScaleEase:y};for(var w in m)m[w].register=p,m[w].version="3.11.4";s()&&i.registerPlugin(g);const O=nodecg.bundleConfig;var x=function(t,e,r,o){var n,i=arguments.length,a=i<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,r,o);else for(var c=t.length-1;c>=0;c--)(n=t[c])&&(a=(i<3?n(a):i>3?n(e,r,a):n(e,r))||a);return i>3&&a&&Object.defineProperty(e,r,a),a};f.ZP.registerPlugin(g);let _=class extends o.ZP{constructor(){super(...arguments),this.timeline=f.ZP.timeline({paused:!0}),this.zoom=O.obs.canvasResolution.height/1080}mounted(){this.timeline.to(this.transitionBlock,{x:"-210vw",duration:1.2,ease:"slow(0.1, 0.8, false)"},0),this.timeline.to(this.leftBox,{width:75*this.zoom+"px",duration:.6},0),this.timeline.to(this.rightBox,{width:150*this.zoom+"px",duration:.6},.6),nodecg.listenFor("showTransition",(()=>{this.timeline.restart()}))}};x([(0,c.R)("TransitionBlock")],_.prototype,"transitionBlock",void 0),x([(0,c.R)("LeftBox")],_.prototype,"leftBox",void 0),x([(0,c.R)("RightBox")],_.prototype,"rightBox",void 0),_=x([n.ZP],_);const P=_,j=(0,r(5440).Z)(P,(function(){var t=this,e=t._self._c;return t._self._setupProxy,e("div",{ref:"TransitionBlock",style:{position:"fixed",display:"flex","justify-content":"space-between",left:"100vw",width:"110vw",height:"100vh","background-color":"#734e9e"}},[e("div",{ref:"LeftBox",style:{background:"#fdbb1c",width:150*t.zoom+"px"}}),t._v(" "),e("img",{style:{width:"75vw"},attrs:{src:r(7775)}}),t._v(" "),e("div",{ref:"RightBox",style:{background:"#fdbb1c",width:75*t.zoom+"px"}})])}),[],!1,null,null,null).exports;new o.ZP({el:"#App",render:t=>t(j)})},5925:(t,e,r)=>{r.d(e,{ZP:()=>y,yh:()=>u});var o=r(5803);function n(t){return n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},n(t)}function i(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function a(){return"undefined"!=typeof Reflect&&Reflect.defineMetadata&&Reflect.getOwnMetadataKeys}function c(t,e){f(t,e),Object.getOwnPropertyNames(e.prototype).forEach((function(r){f(t.prototype,e.prototype,r)})),Object.getOwnPropertyNames(e).forEach((function(r){f(t,e,r)}))}function f(t,e,r){(r?Reflect.getOwnMetadataKeys(e,r):Reflect.getOwnMetadataKeys(e)).forEach((function(o){var n=r?Reflect.getOwnMetadata(o,e,r):Reflect.getOwnMetadata(o,e);r?Reflect.defineMetadata(o,n,t,r):Reflect.defineMetadata(o,n,t)}))}var s={__proto__:[]}instanceof Array;function u(t){return function(e,r,o){var n="function"==typeof e?e:e.constructor;n.__decorators__||(n.__decorators__=[]),"number"!=typeof o&&(o=void 0),n.__decorators__.push((function(e){return t(e,r,o)}))}}function p(t,e){var r=e.prototype._init;e.prototype._init=function(){var e=this,r=Object.getOwnPropertyNames(t);if(t.$options.props)for(var o in t.$options.props)t.hasOwnProperty(o)||r.push(o);r.forEach((function(r){Object.defineProperty(e,r,{get:function(){return t[r]},set:function(e){t[r]=e},configurable:!0})}))};var o=new e;e.prototype._init=r;var n={};return Object.keys(o).forEach((function(t){void 0!==o[t]&&(n[t]=o[t])})),n}var l=["data","beforeCreate","created","beforeMount","mounted","beforeDestroy","destroyed","beforeUpdate","updated","activated","deactivated","render","errorCaptured","serverPrefetch"];function d(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};e.name=e.name||t._componentTag||t.name;var r=t.prototype;Object.getOwnPropertyNames(r).forEach((function(t){if("constructor"!==t)if(l.indexOf(t)>-1)e[t]=r[t];else{var o=Object.getOwnPropertyDescriptor(r,t);void 0!==o.value?"function"==typeof o.value?(e.methods||(e.methods={}))[t]=o.value:(e.mixins||(e.mixins=[])).push({data:function(){return i({},t,o.value)}}):(o.get||o.set)&&((e.computed||(e.computed={}))[t]={get:o.get,set:o.set})}})),(e.mixins||(e.mixins=[])).push({data:function(){return p(this,t)}});var n=t.__decorators__;n&&(n.forEach((function(t){return t(e)})),delete t.__decorators__);var f=Object.getPrototypeOf(t.prototype),s=f instanceof o.ZP?f.constructor:o.ZP,u=s.extend(e);return h(u,t,s),a()&&c(u,t),u}var v={prototype:!0,arguments:!0,callee:!0,caller:!0};function h(t,e,r){Object.getOwnPropertyNames(e).forEach((function(o){if(!v[o]){var i=Object.getOwnPropertyDescriptor(t,o);if(!i||i.configurable){var a,c,f=Object.getOwnPropertyDescriptor(e,o);if(!s){if("cid"===o)return;var u=Object.getOwnPropertyDescriptor(r,o);if(c=n(a=f.value),null!=a&&("object"===c||"function"===c)&&u&&u.value===f.value)return}Object.defineProperty(t,o,f)}}}))}function g(t){return"function"==typeof t?d(t):function(e){return d(e,t)}}g.registerHooks=function(t){var e;l.push.apply(l,function(t){if(Array.isArray(t)){for(var e=0,r=new Array(t.length);e<t.length;e++)r[e]=t[e];return r}}(e=t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}())};const y=g},779:(t,e,r)=>{"undefined"!=typeof Reflect&&Reflect.getMetadata},7775:(t,e,r)=>{t.exports=r.p+"img/esa-big-logo-2-summer-aa7dca67a9779d924f8b.svg"}},r={};function o(t){var n=r[t];if(void 0!==n)return n.exports;var i=r[t]={exports:{}};return e[t](i,i.exports,o),i.exports}o.m=e,t=[],o.O=(e,r,n,i)=>{if(!r){var a=1/0;for(u=0;u<t.length;u++){for(var[r,n,i]=t[u],c=!0,f=0;f<r.length;f++)(!1&i||a>=i)&&Object.keys(o.O).every((t=>o.O[t](r[f])))?r.splice(f--,1):(c=!1,i<a&&(a=i));if(c){t.splice(u--,1);var s=n();void 0!==s&&(e=s)}}return e}i=i||0;for(var u=t.length;u>0&&t[u-1][2]>i;u--)t[u]=t[u-1];t[u]=[r,n,i]},o.d=(t,e)=>{for(var r in e)o.o(e,r)&&!o.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},o.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),o.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),(()=>{var t;o.g.importScripts&&(t=o.g.location+"");var e=o.g.document;if(!t&&e&&(e.currentScript&&(t=e.currentScript.src),!t)){var r=e.getElementsByTagName("script");r.length&&(t=r[r.length-1].src)}if(!t)throw new Error("Automatic publicPath is not supported in this browser");t=t.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),o.p=t+"../"})(),(()=>{var t={414:0,455:0};o.O.j=e=>0===t[e];var e=(e,r)=>{var n,i,[a,c,f]=r,s=0;if(a.some((e=>0!==t[e]))){for(n in c)o.o(c,n)&&(o.m[n]=c[n]);if(f)var u=f(o)}for(e&&e(r);s<a.length;s++)i=a[s],o.o(t,i)&&t[i]&&t[i][0](),t[i]=0;return o.O(u)},r=self.webpackChunk=self.webpackChunk||[];r.forEach(e.bind(null,0)),r.push=e.bind(null,r.push.bind(r))})();var n=o.O(void 0,[835,455,527],(()=>o(2396)));n=o.O(n)})();
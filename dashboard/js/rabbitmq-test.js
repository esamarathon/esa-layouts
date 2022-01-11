/*! For license information please see rabbitmq-test.js.LICENSE.txt */
(()=>{"use strict";var e,t={6751:(e,t,n)=>{var r=n(5803);function o(e){return o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},o(e)}function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(){return"undefined"!=typeof Reflect&&Reflect.defineMetadata&&Reflect.getOwnMetadataKeys}function c(e,t){s(e,t),Object.getOwnPropertyNames(t.prototype).forEach((function(n){s(e.prototype,t.prototype,n)})),Object.getOwnPropertyNames(t).forEach((function(n){s(e,t,n)}))}function s(e,t,n){(n?Reflect.getOwnMetadataKeys(t,n):Reflect.getOwnMetadataKeys(t)).forEach((function(r){var o=n?Reflect.getOwnMetadata(r,t,n):Reflect.getOwnMetadata(r,t);n?Reflect.defineMetadata(r,o,e,n):Reflect.defineMetadata(r,o,e)}))}var u={__proto__:[]}instanceof Array;function f(e,t){var n=t.prototype._init;t.prototype._init=function(){var t=this,n=Object.getOwnPropertyNames(e);if(e.$options.props)for(var r in e.$options.props)e.hasOwnProperty(r)||n.push(r);n.forEach((function(n){Object.defineProperty(t,n,{get:function(){return e[n]},set:function(t){e[n]=t},configurable:!0})}))};var r=new t;t.prototype._init=n;var o={};return Object.keys(r).forEach((function(e){void 0!==r[e]&&(o[e]=r[e])})),o}var l=["data","beforeCreate","created","beforeMount","mounted","beforeDestroy","destroyed","beforeUpdate","updated","activated","deactivated","render","errorCaptured","serverPrefetch"];function p(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};t.name=t.name||e._componentTag||e.name;var n=e.prototype;Object.getOwnPropertyNames(n).forEach((function(e){if("constructor"!==e)if(l.indexOf(e)>-1)t[e]=n[e];else{var r=Object.getOwnPropertyDescriptor(n,e);void 0!==r.value?"function"==typeof r.value?(t.methods||(t.methods={}))[e]=r.value:(t.mixins||(t.mixins=[])).push({data:function(){return a({},e,r.value)}}):(r.get||r.set)&&((t.computed||(t.computed={}))[e]={get:r.get,set:r.set})}})),(t.mixins||(t.mixins=[])).push({data:function(){return f(this,e)}});var o=e.__decorators__;o&&(o.forEach((function(e){return e(t)})),delete e.__decorators__);var s=Object.getPrototypeOf(e.prototype),u=s instanceof r.Z?s.constructor:r.Z,p=u.extend(t);return v(p,e,u),i()&&c(p,e),p}var d={prototype:!0,arguments:!0,callee:!0,caller:!0};function v(e,t,n){Object.getOwnPropertyNames(t).forEach((function(r){if(!d[r]){var a=Object.getOwnPropertyDescriptor(e,r);if(!a||a.configurable){var i,c,s=Object.getOwnPropertyDescriptor(t,r);if(!u){if("cid"===r)return;var f=Object.getOwnPropertyDescriptor(n,r);if(c=o(i=s.value),null!=i&&("object"===c||"function"===c)&&f&&f.value===s.value)return}Object.defineProperty(e,r,s)}}}))}function y(e){return"function"==typeof e?p(e):function(t){return p(t,e)}}y.registerHooks=function(e){var t;l.push.apply(l,function(e){if(Array.isArray(e)){for(var t=0,n=new Array(e.length);t<e.length;t++)n[t]=e[t];return n}}(t=e)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}())};const b=y;n(4807),n(7023),n(5654);var h=n(779);function g(e){return void 0===e&&(e={}),function(t,n){var r;(0,h.l)(e,t,n),(r=function(t,n){(t.props||(t.props={}))[n]=e},function(e,t,n){var o="function"==typeof e?e:e.constructor;o.__decorators__||(o.__decorators__=[]),"number"!=typeof n&&(n=void 0),o.__decorators__.push((function(e){return r(e,t)}))})(t,n)}}n(8793);var m=function(e,t,n,r){var o,a=arguments.length,i=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,n,r);else for(var c=e.length-1;c>=0;c--)(o=e[c])&&(i=(a<3?o(i):a>3?o(t,n,i):o(t,n))||i);return a>3&&i&&Object.defineProperty(t,n,i),i};let O=class extends r.Z{donation(){nodecg.sendMessage("testRabbitMQ","donationFullyProcessed")}subscription(){nodecg.sendMessage("testRabbitMQ","newScreenedSub")}cheer(){nodecg.sendMessage("testRabbitMQ","newScreenedCheer")}};m([g(Boolean)],O.prototype,"enabled",void 0),m([g(Boolean)],O.prototype,"useTestData",void 0),O=m([b],O);const w=O;var _=n(5440),j=n(7618),k=n.n(j),P=n(1883),D=n(6255),M=(0,_.Z)(w,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.useTestData?e.enabled?n("v-app",[n("v-btn",{on:{click:e.donation}},[e._v("\n    Donation\n  ")]),e._v(" "),n("v-btn",{on:{click:e.subscription}},[e._v("\n    Subscription\n  ")]),e._v(" "),n("v-btn",{on:{click:e.cheer}},[e._v("\n    Cheer\n  ")])],1):n("v-app",{style:{"font-style":"italic"}},[e._v("\n  RabbitMQ not enabled.\n")]):n("v-app",{style:{"font-style":"italic"}},[e._v("\n  Not using test data.\n")])}),[],!1,null,null,null);const R=M.exports;k()(M,{VApp:P.Z,VBtn:D.Z});const S=R;var x=n(9459);const E=nodecg.bundleConfig;new r.Z({vuetify:x.Z,el:"#App",render:e=>e(S,{props:{enabled:E.rabbitmq.enabled,useTestData:E.useTestData}})})},779:(e,t,n)=>{n.d(t,{l:()=>o});var r="undefined"!=typeof Reflect&&void 0!==Reflect.getMetadata;function o(e,t,n){if(r&&!Array.isArray(e)&&"function"!=typeof e&&!e.hasOwnProperty("type")&&void 0===e.type){var o=Reflect.getMetadata("design:type",t,n);o!==Object&&(e.type=o)}}},9405:(e,t,n)=>{n.d(t,{Z:()=>r});const r=n(5803).Z.extend().extend({name:"themeable",provide(){return{theme:this.themeableProvide}},inject:{theme:{default:{isDark:!1}}},props:{dark:{type:Boolean,default:null},light:{type:Boolean,default:null}},data:()=>({themeableProvide:{isDark:!1}}),computed:{appIsDark(){return this.$vuetify.theme.dark||!1},isDark(){return!0===this.dark||!0!==this.light&&this.theme.isDark},themeClasses(){return{"theme--dark":this.isDark,"theme--light":!this.isDark}},rootIsDark(){return!0===this.dark||!0!==this.light&&this.appIsDark},rootThemeClasses(){return{"theme--dark":this.rootIsDark,"theme--light":!this.rootIsDark}}},watch:{isDark:{handler(e,t){e!==t&&(this.themeableProvide.isDark=this.isDark)},immediate:!0}}})},2377:(e,t,n)=>{n.d(t,{qw:()=>o,vO:()=>a,ji:()=>i,kb:()=>c,Do:()=>u,XP:()=>f,uZ:()=>l,Ee:()=>p});let r=!1;try{if("undefined"!=typeof window){const e=Object.defineProperty({},"passive",{get:()=>{r=!0}});window.addEventListener("testListener",e,e),window.removeEventListener("testListener",e,e)}}catch(e){console.warn(e)}function o(e,t,n){const r=t.length-1;if(r<0)return void 0===e?n:e;for(let o=0;o<r;o++){if(null==e)return n;e=e[t[o]]}return null==e||void 0===e[t[r]]?n:e[t[r]]}function a(e,t,n){return null!=e&&t&&"string"==typeof t?void 0!==e[t]?e[t]:o(e,(t=(t=t.replace(/\[(\w+)\]/g,".$1")).replace(/^\./,"")).split("."),n):n}function i(e,t){const n={};for(let r=0;r<t.length;r++){const o=t[r];void 0!==e[o]&&(n[o]=e[o])}return n}function c(e,t="px"){return null==e||""===e?void 0:isNaN(+e)?String(e):`${Number(e)}${t}`}function s(e){return null!==e&&"object"==typeof e}const u=Object.freeze({enter:13,tab:9,delete:46,esc:27,space:32,up:38,down:40,left:37,right:39,end:35,home:36,del:46,backspace:8,insert:45,pageup:33,pagedown:34,shift:16});function f(e){return Object.keys(e)}function l(e,t=0,n=1){return Math.max(t,Math.min(n,e))}function p(e={},t={}){for(const n in t){const r=e[n],o=t[n];s(r)&&s(o)?e[n]=p(r,o):e[n]=o}return e}}},n={};function r(e){var o=n[e];if(void 0!==o)return o.exports;var a=n[e]={exports:{}};return t[e](a,a.exports,r),a.exports}r.m=t,e=[],r.O=(t,n,o,a)=>{if(!n){var i=1/0;for(f=0;f<e.length;f++){for(var[n,o,a]=e[f],c=!0,s=0;s<n.length;s++)(!1&a||i>=a)&&Object.keys(r.O).every((e=>r.O[e](n[s])))?n.splice(s--,1):(c=!1,a<i&&(i=a));if(c){e.splice(f--,1);var u=o();void 0!==u&&(t=u)}}return t}a=a||0;for(var f=e.length;f>0&&e[f-1][2]>a;f--)e[f]=e[f-1];e[f]=[n,o,a]},r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},r.d=(e,t)=>{for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e={931:0};r.O.j=t=>0===e[t];var t=(t,n)=>{var o,a,[i,c,s]=n,u=0;if(i.some((t=>0!==e[t]))){for(o in c)r.o(c,o)&&(r.m[o]=c[o]);if(s)var f=s(r)}for(t&&t(n);u<i.length;u++)a=i[u],r.o(e,a)&&e[a]&&e[a][0](),e[i[u]]=0;return r.O(f)},n=self.webpackChunk=self.webpackChunk||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})();var o=r.O(void 0,[515,291],(()=>r(6751)));o=r.O(o)})();
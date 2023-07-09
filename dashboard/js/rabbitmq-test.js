/*! For license information please see rabbitmq-test.js.LICENSE.txt */
(()=>{"use strict";var e,t={404:(e,t,n)=>{var r=n(936),o=n(6255),a=n(5803);function i(e){return i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},i(e)}function c(e,t,n){(n?Reflect.getOwnMetadataKeys(t,n):Reflect.getOwnMetadataKeys(t)).forEach((function(r){var o=n?Reflect.getOwnMetadata(r,t,n):Reflect.getOwnMetadata(r,t);n?Reflect.defineMetadata(r,o,e,n):Reflect.defineMetadata(r,o,e)}))}var s={__proto__:[]}instanceof Array,u=["data","beforeCreate","created","beforeMount","mounted","beforeDestroy","destroyed","beforeUpdate","updated","activated","deactivated","render","errorCaptured","serverPrefetch"];function l(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};t.name=t.name||e._componentTag||e.name;var n=e.prototype;Object.getOwnPropertyNames(n).forEach((function(e){if("constructor"!==e)if(u.indexOf(e)>-1)t[e]=n[e];else{var r=Object.getOwnPropertyDescriptor(n,e);void 0!==r.value?"function"==typeof r.value?(t.methods||(t.methods={}))[e]=r.value:(t.mixins||(t.mixins=[])).push({data:function(){return function(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}({},e,r.value)}}):(r.get||r.set)&&((t.computed||(t.computed={}))[e]={get:r.get,set:r.set})}})),(t.mixins||(t.mixins=[])).push({data:function(){return function(e,t){var n=t.prototype._init;t.prototype._init=function(){var t=this,n=Object.getOwnPropertyNames(e);if(e.$options.props)for(var r in e.$options.props)e.hasOwnProperty(r)||n.push(r);n.forEach((function(n){Object.defineProperty(t,n,{get:function(){return e[n]},set:function(t){e[n]=t},configurable:!0})}))};var r=new t;t.prototype._init=n;var o={};return Object.keys(r).forEach((function(e){void 0!==r[e]&&(o[e]=r[e])})),o}(this,e)}});var r=e.__decorators__;r&&(r.forEach((function(e){return e(t)})),delete e.__decorators__);var o,l,d=Object.getPrototypeOf(e.prototype),p=d instanceof a.ZP?d.constructor:a.ZP,v=p.extend(t);return function(e,t,n){Object.getOwnPropertyNames(t).forEach((function(r){if(!f[r]){var o=Object.getOwnPropertyDescriptor(e,r);if(!o||o.configurable){var a,c,u=Object.getOwnPropertyDescriptor(t,r);if(!s){if("cid"===r)return;var l=Object.getOwnPropertyDescriptor(n,r);if(c=i(a=u.value),null!=a&&("object"===c||"function"===c)&&l&&l.value===u.value)return}Object.defineProperty(e,r,u)}}}))}(v,e,p),"undefined"!=typeof Reflect&&Reflect.defineMetadata&&Reflect.getOwnMetadataKeys&&(c(o=v,l=e),Object.getOwnPropertyNames(l.prototype).forEach((function(e){c(o.prototype,l.prototype,e)})),Object.getOwnPropertyNames(l).forEach((function(e){c(o,l,e)}))),v}var f={prototype:!0,arguments:!0,callee:!0,caller:!0};function d(e){return"function"==typeof e?l(e):function(t){return l(t,e)}}d.registerHooks=function(e){var t;u.push.apply(u,function(e){if(Array.isArray(e)){for(var t=0,n=new Array(e.length);t<e.length;t++)n[t]=e[t];return n}}(t=e)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}())};const p=d;n(4807),n(7023),n(5654);var v=n(779);function g(e){return void 0===e&&(e={}),function(t,n){var r;(0,v.l)(e,t,n),(r=function(t,n){(t.props||(t.props={}))[n]=e},function(e,t,n){var o="function"==typeof e?e:e.constructor;o.__decorators__||(o.__decorators__=[]),"number"!=typeof n&&(n=void 0),o.__decorators__.push((function(e){return r(e,t)}))})(t,n)}}n(8793);var y=function(e,t,n,r){var o,a=arguments.length,i=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,n,r);else for(var c=e.length-1;c>=0;c--)(o=e[c])&&(i=(a<3?o(i):a>3?o(t,n,i):o(t,n))||i);return a>3&&i&&Object.defineProperty(t,n,i),i};let b=class extends a.ZP{donation(){nodecg.sendMessage("testRabbitMQ",{msgType:"donationFullyProcessed"})}subscription(){nodecg.sendMessage("testRabbitMQ",{msgType:"newScreenedSub"})}cheer(){nodecg.sendMessage("testRabbitMQ",{msgType:"newScreenedCheer"})}tweet(){nodecg.sendMessage("testRabbitMQ",{msgType:"newScreenedTweet"})}crowdControl(){nodecg.sendMessage("testRabbitMQ",{msgType:"newScreenedCrowdControl"})}scanTag(e,t){nodecg.sendMessage("testRabbitMQ",{msgType:"bigbuttonTagScanned",data:{tag:e,id:t}})}pressBtn(e){nodecg.sendMessage("testRabbitMQ",{msgType:"bigbuttonPressed",data:{id:e}})}};y([g(Boolean)],b.prototype,"enabled",void 0),y([g(Boolean)],b.prototype,"useTestData",void 0),b=y([p],b);const h=b,_=(0,n(5440).Z)(h,(function(){var e=this,t=e._self._c;return e._self._setupProxy,e.useTestData?e.enabled?t(r.Z,[t(o.Z,{on:{click:e.donation}},[e._v("\n    Donation\n  ")]),e._v(" "),t(o.Z,{on:{click:e.subscription}},[e._v("\n    Subscription\n  ")]),e._v(" "),t(o.Z,{on:{click:e.cheer}},[e._v("\n    Cheer\n  ")]),e._v(" "),t(o.Z,{on:{click:e.tweet}},[e._v("\n    Tweet\n  ")]),e._v(" "),t(o.Z,{on:{click:e.crowdControl}},[e._v("\n    Crowd Control\n  ")]),e._v(" "),t("div",{staticClass:"d-flex align-center"},[t("span",{attrs:{title:"ExampleUser1, he/him, exampleuser1, DE"}},[e._v("Scan Tag 1:")]),e._v(" "),t(o.Z,{on:{click:function(t){return e.scanTag(1,"1")}}},[e._v("B.1")]),e._v(" "),t(o.Z,{on:{click:function(t){return e.scanTag(1,"2")}}},[e._v("B.2")]),e._v(" "),t(o.Z,{on:{click:function(t){return e.scanTag(1,"3")}}},[e._v("B.3")])],1),e._v(" "),t("div",{staticClass:"d-flex align-center"},[t("span",{attrs:{title:"ExampleUser2, she/her, exampleuser2, SE"}},[e._v("Scan Tag 2:")]),e._v(" "),t(o.Z,{on:{click:function(t){return e.scanTag(2,"1")}}},[e._v("B.1")]),e._v(" "),t(o.Z,{on:{click:function(t){return e.scanTag(2,"2")}}},[e._v("B.2")]),e._v(" "),t(o.Z,{on:{click:function(t){return e.scanTag(2,"3")}}},[e._v("B.3")])],1),e._v(" "),t("div",{staticClass:"d-flex align-center"},[t("span",{attrs:{title:"ExampleUser3, they/them, exampleuser3, FI"}},[e._v("Scan Tag 3:")]),e._v(" "),t(o.Z,{on:{click:function(t){return e.scanTag(3,"1")}}},[e._v("B.1")]),e._v(" "),t(o.Z,{on:{click:function(t){return e.scanTag(3,"2")}}},[e._v("B.2")]),e._v(" "),t(o.Z,{on:{click:function(t){return e.scanTag(3,"3")}}},[e._v("B.3")])],1),e._v(" "),t("div",{staticClass:"d-flex align-center"},[t("span",{attrs:{title:"ExampleUser, no pronouns, no Twitch, no country"}},[e._v("Scan Tag 4:")]),e._v(" "),t(o.Z,{on:{click:function(t){return e.scanTag(4,"1")}}},[e._v("B.1")]),e._v(" "),t(o.Z,{on:{click:function(t){return e.scanTag(4,"2")}}},[e._v("B.2")]),e._v(" "),t(o.Z,{on:{click:function(t){return e.scanTag(4,"3")}}},[e._v("B.3")])],1),e._v(" "),t("div",{staticClass:"d-flex align-center"},[e._v("\n    Press Button:\n    "),t(o.Z,{on:{click:function(t){return e.pressBtn(1)}}},[e._v("B.1")]),e._v(" "),t(o.Z,{on:{click:function(t){return e.pressBtn(2)}}},[e._v("B.2")]),e._v(" "),t(o.Z,{on:{click:function(t){return e.pressBtn(3)}}},[e._v("B.3")])],1)],1):t(r.Z,{style:{"font-style":"italic"}},[e._v("\n  RabbitMQ not enabled.\n")]):t(r.Z,{style:{"font-style":"italic"}},[e._v("\n  Not using test data.\n")])}),[],!1,null,null,null).exports;var m=n(3687);const w=nodecg.bundleConfig;new a.ZP({vuetify:m.Z,el:"#App",render:e=>e(_,{props:{enabled:w.rabbitmq.enabled,useTestData:w.useTestData}})})},779:(e,t,n)=>{n.d(t,{l:()=>o});var r="undefined"!=typeof Reflect&&void 0!==Reflect.getMetadata;function o(e,t,n){if(r&&!Array.isArray(e)&&"function"!=typeof e&&!e.hasOwnProperty("type")&&void 0===e.type){var o=Reflect.getMetadata("design:type",t,n);o!==Object&&(e.type=o)}}},9405:(e,t,n)=>{n.d(t,{Z:()=>r});const r=n(5803).ZP.extend().extend({name:"themeable",provide(){return{theme:this.themeableProvide}},inject:{theme:{default:{isDark:!1}}},props:{dark:{type:Boolean,default:null},light:{type:Boolean,default:null}},data:()=>({themeableProvide:{isDark:!1}}),computed:{appIsDark(){return this.$vuetify.theme.dark||!1},isDark(){return!0===this.dark||!0!==this.light&&this.theme.isDark},themeClasses(){return{"theme--dark":this.isDark,"theme--light":!this.isDark}},rootIsDark(){return!0===this.dark||!0!==this.light&&this.appIsDark},rootThemeClasses(){return{"theme--dark":this.rootIsDark,"theme--light":!this.rootIsDark}}},watch:{isDark:{handler(e,t){e!==t&&(this.themeableProvide.isDark=this.isDark)},immediate:!0}}})},9085:(e,t,n)=>{n.d(t,{d:()=>o});var r=n(5803);function o(e="value",t="input"){return r.ZP.extend({name:"toggleable",model:{prop:e,event:t},props:{[e]:{required:!1}},data(){return{isActive:!!this[e]}},watch:{[e](e){this.isActive=!!e},isActive(n){!!n!==this[e]&&this.$emit(t,n)}}})}o()},2377:(e,t,n)=>{n.d(t,{Do:()=>u,Ee:()=>d,XP:()=>l,ji:()=>i,kb:()=>c,qw:()=>o,uZ:()=>f,vO:()=>a});let r=!1;try{if("undefined"!=typeof window){const e=Object.defineProperty({},"passive",{get:()=>{r=!0}});window.addEventListener("testListener",e,e),window.removeEventListener("testListener",e,e)}}catch(e){console.warn(e)}function o(e,t,n){const r=t.length-1;if(r<0)return void 0===e?n:e;for(let o=0;o<r;o++){if(null==e)return n;e=e[t[o]]}return null==e||void 0===e[t[r]]?n:e[t[r]]}function a(e,t,n){return null!=e&&t&&"string"==typeof t?void 0!==e[t]?e[t]:o(e,(t=(t=t.replace(/\[(\w+)\]/g,".$1")).replace(/^\./,"")).split("."),n):n}function i(e,t){const n={};for(let r=0;r<t.length;r++){const o=t[r];void 0!==e[o]&&(n[o]=e[o])}return n}function c(e,t="px"){return null==e||""===e?void 0:isNaN(+e)?String(e):`${Number(e)}${t}`}function s(e){return null!==e&&"object"==typeof e}const u=Object.freeze({enter:13,tab:9,delete:46,esc:27,space:32,up:38,down:40,left:37,right:39,end:35,home:36,del:46,backspace:8,insert:45,pageup:33,pagedown:34,shift:16});function l(e){return Object.keys(e)}function f(e,t=0,n=1){return Math.max(t,Math.min(n,e))}function d(e={},t={}){for(const n in t){const r=e[n],o=t[n];s(r)&&s(o)?e[n]=d(r,o):e[n]=o}return e}}},n={};function r(e){var o=n[e];if(void 0!==o)return o.exports;var a=n[e]={exports:{}};return t[e](a,a.exports,r),a.exports}r.m=t,e=[],r.O=(t,n,o,a)=>{if(!n){var i=1/0;for(l=0;l<e.length;l++){for(var[n,o,a]=e[l],c=!0,s=0;s<n.length;s++)(!1&a||i>=a)&&Object.keys(r.O).every((e=>r.O[e](n[s])))?n.splice(s--,1):(c=!1,a<i&&(i=a));if(c){e.splice(l--,1);var u=o();void 0!==u&&(t=u)}}return t}a=a||0;for(var l=e.length;l>0&&e[l-1][2]>a;l--)e[l]=e[l-1];e[l]=[n,o,a]},r.d=(e,t)=>{for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e={931:0};r.O.j=t=>0===e[t];var t=(t,n)=>{var o,a,[i,c,s]=n,u=0;if(i.some((t=>0!==e[t]))){for(o in c)r.o(c,o)&&(r.m[o]=c[o]);if(s)var l=s(r)}for(t&&t(n);u<i.length;u++)a=i[u],r.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return r.O(l)},n=self.webpackChunk=self.webpackChunk||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})();var o=r.O(void 0,[965,291],(()=>r(404)));o=r.O(o)})();
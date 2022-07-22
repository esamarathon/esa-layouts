(()=>{"use strict";var e,t={9108:(e,t,n)=>{var r=n(2725),o=n(5803),i=n(3687),l=n(936),c=n(6255),s=n(8019),a=n(2404),u=n(5925);n(4807),n(7023),n(5654),n(779),n(8793);var d=n(8586),p=n(4170),f=function(e,t,n,r){var o,i=arguments.length,l=i<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(e,t,n,r);else for(var c=e.length-1;c>=0;c--)(o=e[c])&&(l=(i<3?o(l):i>3?o(t,n,l):o(t,n))||l);return i>3&&l&&Object.defineProperty(t,n,l),l};o.ZP.use(d.ZP);let v=class extends p.g4{get reps(){return this.context.rootState.ReplicantModule.reps}updateSelectedVoice(e){r.OV.setReplicant({name:"ttsVoices",val:Object.assign(Object.assign({},r.OV.repsTyped.ttsVoices),{selected:e})})}};f([p.mm],v.prototype,"updateSelectedVoice",null),v=f([(0,p.Yl)({name:"OurModule"})],v);const y=new d.yh({strict:!1,state:{},modules:{ReplicantModule:r.np,OurModule:v}}),h=y,g=(0,p.rT)(v,y);var b=function(e,t,n,r){var o,i=arguments.length,l=i<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(e,t,n,r);else for(var c=e.length-1;c>=0;c--)(o=e[c])&&(l=(i<3?o(l):i>3?o(t,n,l):o(t,n))||l);return i>3&&l&&Object.defineProperty(t,n,l),l};let m=class extends o.ZP{constructor(){super(...arguments),this.config=nodecg.bundleConfig.tts}get selected(){return this.voices.selected}set selected(e){g.updateSelectedVoice(e)}scrollToSelectedVoice(){this.config.enabled&&this.$vuetify.goTo(`#${this.voices.selected}`,{container:"#VoiceList",offset:25})}playExample(){nodecg.sendMessage("ttsExample")}mounted(){this.scrollToSelectedVoice()}};b([r.Nz.State((e=>e.reps.ttsVoices))],m.prototype,"voices",void 0),b([function(e,t){void 0===t&&(t={});var n=t.deep,r=void 0!==n&&n,o=t.immediate,i=void 0!==o&&o;return(0,u.createDecorator)((function(t,n){"object"!=typeof t.watch&&(t.watch=Object.create(null));var o=t.watch;"object"!=typeof o[e]||Array.isArray(o[e])?void 0===o[e]&&(o[e]=[]):o[e]=[o[e]],o[e].push({handler:n,deep:r,immediate:i})}))}("voices")],m.prototype,"scrollToSelectedVoice",null),m=b([u.default],m);const O=m,w=(0,n(5440).Z)(O,(function(){var e=this,t=e._self._c;return e._self._setupProxy,t(l.Z,[e.config.enabled?[t("div",{style:{"max-height":"250px","overflow-y":"auto"},attrs:{id:"VoiceList"}},[t(a.Z,{style:{margin:"0px",padding:"10px"},attrs:{"hide-details":""},model:{value:e.selected,callback:function(t){e.selected=t},expression:"selected"}},e._l(e.voices.available,(function(e){return t(s.Z,{key:e.code,attrs:{id:e.code,value:e.code,label:e.name}})})),1)],1),e._v(" "),t(c.Z,{on:{click:e.playExample}},[e._v("\n      Play Example Donation\n    ")])]:t("div",{style:{"font-style":"italic"}},[e._v("\n    This feature is not enabled.\n  ")])],2)}),[],!1,null,null,null).exports;(0,r.rl)(h).then((()=>{new o.ZP({vuetify:i.Z,store:h,el:"#App",render:e=>e(w)})}))},779:(e,t,n)=>{"undefined"!=typeof Reflect&&Reflect.getMetadata},312:(e,t,n)=>{n.d(t,{Z:()=>o});var r=n(5803);const o=function(e="value",t="change"){return r.ZP.extend({name:"proxyable",model:{prop:e,event:t},props:{[e]:{required:!1}},data(){return{internalLazyValue:this[e]}},computed:{internalValue:{get(){return this.internalLazyValue},set(e){e!==this.internalLazyValue&&(this.internalLazyValue=e,this.$emit(t,e))}}},watch:{[e](e){this.internalLazyValue=e}}})}()},9085:(e,t,n)=>{n.d(t,{d:()=>o});var r=n(5803);function o(e="value",t="input"){return r.ZP.extend({name:"toggleable",model:{prop:e,event:t},props:{[e]:{required:!1}},data(){return{isActive:!!this[e]}},watch:{[e](e){this.isActive=!!e},isActive(n){!!n!==this[e]&&this.$emit(t,n)}}})}o()},2377:(e,t,n)=>{n.d(t,{Do:()=>d,Ee:()=>m,GL:()=>a,RB:()=>p,TI:()=>h,XP:()=>f,_A:()=>y,ji:()=>c,kb:()=>s,qw:()=>o,uZ:()=>b,vO:()=>l,vZ:()=>i,z9:()=>g});let r=!1;try{if("undefined"!=typeof window){const e=Object.defineProperty({},"passive",{get:()=>{r=!0}});window.addEventListener("testListener",e,e),window.removeEventListener("testListener",e,e)}}catch(e){console.warn(e)}function o(e,t,n){const r=t.length-1;if(r<0)return void 0===e?n:e;for(let o=0;o<r;o++){if(null==e)return n;e=e[t[o]]}return null==e||void 0===e[t[r]]?n:e[t[r]]}function i(e,t){if(e===t)return!0;if(e instanceof Date&&t instanceof Date&&e.getTime()!==t.getTime())return!1;if(e!==Object(e)||t!==Object(t))return!1;const n=Object.keys(e);return n.length===Object.keys(t).length&&n.every((n=>i(e[n],t[n])))}function l(e,t,n){return null!=e&&t&&"string"==typeof t?void 0!==e[t]?e[t]:o(e,(t=(t=t.replace(/\[(\w+)\]/g,".$1")).replace(/^\./,"")).split("."),n):n}function c(e,t){const n={};for(let r=0;r<t.length;r++){const o=t[r];void 0!==e[o]&&(n[o]=e[o])}return n}function s(e,t="px"){return null==e||""===e?void 0:isNaN(+e)?String(e):`${Number(e)}${t}`}function a(e){return(e||"").replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}function u(e){return null!==e&&"object"==typeof e}const d=Object.freeze({enter:13,tab:9,delete:46,esc:27,space:32,up:38,down:40,left:37,right:39,end:35,home:36,del:46,backspace:8,insert:45,pageup:33,pagedown:34,shift:16});function p(e,t){const n=e.$vuetify.icons.component;if(t.startsWith("$")){const n=l(e,`$vuetify.icons.values.${t.split("$").pop().split(".").pop()}`,t);if("string"!=typeof n)return n;t=n}return null==n?t:{component:n,props:{icon:t}}}function f(e){return Object.keys(e)}const v=/-(\w)/g,y=e=>e.replace(v,((e,t)=>t?t.toUpperCase():""));function h(e){return null!=e?Array.isArray(e)?e:[e]:[]}function g(e,t="default",n,r=!1){return e.$scopedSlots.hasOwnProperty(t)?e.$scopedSlots[t](n instanceof Function?n():n):!e.$slots.hasOwnProperty(t)||n&&!r?void 0:e.$slots[t]}function b(e,t=0,n=1){return Math.max(t,Math.min(n,e))}function m(e={},t={}){for(const n in t){const r=e[n],o=t[n];u(r)&&u(o)?e[n]=m(r,o):e[n]=o}return e}}},n={};function r(e){var o=n[e];if(void 0!==o)return o.exports;var i=n[e]={exports:{}};return t[e].call(i.exports,i,i.exports,r),i.exports}r.m=t,e=[],r.O=(t,n,o,i)=>{if(!n){var l=1/0;for(u=0;u<e.length;u++){for(var[n,o,i]=e[u],c=!0,s=0;s<n.length;s++)(!1&i||l>=i)&&Object.keys(r.O).every((e=>r.O[e](n[s])))?n.splice(s--,1):(c=!1,i<l&&(l=i));if(c){e.splice(u--,1);var a=o();void 0!==a&&(t=a)}}return t}i=i||0;for(var u=e.length;u>0&&e[u-1][2]>i;u--)e[u]=e[u-1];e[u]=[n,o,i]},r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},r.d=(e,t)=>{for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e={702:0};r.O.j=t=>0===e[t];var t=(t,n)=>{var o,i,[l,c,s]=n,a=0;if(l.some((t=>0!==e[t]))){for(o in c)r.o(c,o)&&(r.m[o]=c[o]);if(s)var u=s(r)}for(t&&t(n);a<l.length;a++)i=l[a],r.o(e,i)&&e[i]&&e[i][0](),e[i]=0;return r.O(u)},n=self.webpackChunk=self.webpackChunk||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})();var o=r.O(void 0,[979,821,62,291,902],(()=>r(9108)));o=r.O(o)})();
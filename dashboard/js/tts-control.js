(()=>{"use strict";var e,t={3788:(e,t,n)=>{var r=n(7604),o=n(5803),i=n(9459),l=n(5925);n(4807),n(7023),n(5654),n(779),n(8793);var c=n(8586),a=n(4170),s=function(e,t,n,r){var o,i=arguments.length,l=i<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(e,t,n,r);else for(var c=e.length-1;c>=0;c--)(o=e[c])&&(l=(i<3?o(l):i>3?o(t,n,l):o(t,n))||l);return i>3&&l&&Object.defineProperty(t,n,l),l};o.Z.use(c.ZP);let u=class extends a.g4{get reps(){return this.context.rootState.ReplicantModule.reps}updateSelectedVoice(e){r.OV.setReplicant({name:"ttsVoices",val:Object.assign(Object.assign({},r.OV.repsTyped.ttsVoices),{selected:e})})}};s([a.mm],u.prototype,"updateSelectedVoice",null),u=s([(0,a.Yl)({name:"OurModule"})],u);const d=new c.yh({strict:!1,state:{},modules:{ReplicantModule:r.np,OurModule:u}}),p=d,f=(0,a.rT)(u,d);var v=function(e,t,n,r){var o,i=arguments.length,l=i<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(e,t,n,r);else for(var c=e.length-1;c>=0;c--)(o=e[c])&&(l=(i<3?o(l):i>3?o(t,n,l):o(t,n))||l);return i>3&&l&&Object.defineProperty(t,n,l),l};let y=class extends o.Z{constructor(){super(...arguments),this.config=nodecg.bundleConfig.tts}get selected(){return this.voices.selected}set selected(e){f.updateSelectedVoice(e)}scrollToSelectedVoice(){this.config.enabled&&this.$vuetify.goTo(`#${this.voices.selected}`,{container:"#VoiceList",offset:25})}playExample(){nodecg.sendMessage("ttsExample")}mounted(){this.scrollToSelectedVoice()}};v([r.Nz.State((e=>e.reps.ttsVoices))],y.prototype,"voices",void 0),v([function(e,t){void 0===t&&(t={});var n=t.deep,r=void 0!==n&&n,o=t.immediate,i=void 0!==o&&o;return(0,l.createDecorator)((function(t,n){"object"!=typeof t.watch&&(t.watch=Object.create(null));var o=t.watch;"object"!=typeof o[e]||Array.isArray(o[e])?void 0===o[e]&&(o[e]=[]):o[e]=[o[e]],o[e].push({handler:n,deep:r,immediate:i})}))}("voices")],y.prototype,"scrollToSelectedVoice",null),y=v([l.default],y);const h=y;var g=n(5440),b=n(7618),m=n.n(b),O=n(1883),w=n(6255),j=n(3335),V=n(6123),x=(0,g.Z)(h,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-app",[e.config.enabled?[n("div",{style:{"max-height":"250px","overflow-y":"auto"},attrs:{id:"VoiceList"}},[n("v-radio-group",{style:{margin:"0px",padding:"10px"},attrs:{"hide-details":""},model:{value:e.selected,callback:function(t){e.selected=t},expression:"selected"}},e._l(e.voices.available,(function(e){return n("v-radio",{key:e.code,attrs:{id:e.code,value:e.code,label:e.name}})})),1)],1),e._v(" "),n("v-btn",{on:{click:e.playExample}},[e._v("\n      Play Example Donation\n    ")])]:n("div",{style:{"font-style":"italic"}},[e._v("\n    This feature is not enabled.\n  ")])],2)}),[],!1,null,null,null);const $=x.exports;m()(x,{VApp:O.Z,VBtn:w.Z,VRadio:j.Z,VRadioGroup:V.Z}),(0,r.rl)(p).then((()=>{new o.Z({vuetify:i.Z,store:p,el:"#App",render:e=>e($)})}))},779:(e,t,n)=>{"undefined"!=typeof Reflect&&Reflect.getMetadata},312:(e,t,n)=>{n.d(t,{Z:()=>o});var r=n(5803);const o=function(e="value",t="change"){return r.Z.extend({name:"proxyable",model:{prop:e,event:t},props:{[e]:{required:!1}},data(){return{internalLazyValue:this[e]}},computed:{internalValue:{get(){return this.internalLazyValue},set(e){e!==this.internalLazyValue&&(this.internalLazyValue=e,this.$emit(t,e))}}},watch:{[e](e){this.internalLazyValue=e}}})}()},2377:(e,t,n)=>{n.d(t,{qw:()=>o,vZ:()=>i,vO:()=>l,ji:()=>c,kb:()=>a,GL:()=>s,Do:()=>d,RB:()=>p,XP:()=>f,_A:()=>y,TI:()=>h,z9:()=>g,uZ:()=>b,Ee:()=>m});let r=!1;try{if("undefined"!=typeof window){const e=Object.defineProperty({},"passive",{get:()=>{r=!0}});window.addEventListener("testListener",e,e),window.removeEventListener("testListener",e,e)}}catch(e){console.warn(e)}function o(e,t,n){const r=t.length-1;if(r<0)return void 0===e?n:e;for(let o=0;o<r;o++){if(null==e)return n;e=e[t[o]]}return null==e||void 0===e[t[r]]?n:e[t[r]]}function i(e,t){if(e===t)return!0;if(e instanceof Date&&t instanceof Date&&e.getTime()!==t.getTime())return!1;if(e!==Object(e)||t!==Object(t))return!1;const n=Object.keys(e);return n.length===Object.keys(t).length&&n.every((n=>i(e[n],t[n])))}function l(e,t,n){return null!=e&&t&&"string"==typeof t?void 0!==e[t]?e[t]:o(e,(t=(t=t.replace(/\[(\w+)\]/g,".$1")).replace(/^\./,"")).split("."),n):n}function c(e,t){const n={};for(let r=0;r<t.length;r++){const o=t[r];void 0!==e[o]&&(n[o]=e[o])}return n}function a(e,t="px"){return null==e||""===e?void 0:isNaN(+e)?String(e):`${Number(e)}${t}`}function s(e){return(e||"").replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}function u(e){return null!==e&&"object"==typeof e}const d=Object.freeze({enter:13,tab:9,delete:46,esc:27,space:32,up:38,down:40,left:37,right:39,end:35,home:36,del:46,backspace:8,insert:45,pageup:33,pagedown:34,shift:16});function p(e,t){const n=e.$vuetify.icons.component;if(t.startsWith("$")){const n=l(e,`$vuetify.icons.values.${t.split("$").pop().split(".").pop()}`,t);if("string"!=typeof n)return n;t=n}return null==n?t:{component:n,props:{icon:t}}}function f(e){return Object.keys(e)}const v=/-(\w)/g,y=e=>e.replace(v,((e,t)=>t?t.toUpperCase():""));function h(e){return null!=e?Array.isArray(e)?e:[e]:[]}function g(e,t="default",n,r=!1){return e.$scopedSlots.hasOwnProperty(t)?e.$scopedSlots[t](n instanceof Function?n():n):!e.$slots.hasOwnProperty(t)||n&&!r?void 0:e.$slots[t]}function b(e,t=0,n=1){return Math.max(t,Math.min(n,e))}function m(e={},t={}){for(const n in t){const r=e[n],o=t[n];u(r)&&u(o)?e[n]=m(r,o):e[n]=o}return e}}},n={};function r(e){var o=n[e];if(void 0!==o)return o.exports;var i=n[e]={exports:{}};return t[e].call(i.exports,i,i.exports,r),i.exports}r.m=t,e=[],r.O=(t,n,o,i)=>{if(!n){var l=1/0;for(u=0;u<e.length;u++){for(var[n,o,i]=e[u],c=!0,a=0;a<n.length;a++)(!1&i||l>=i)&&Object.keys(r.O).every((e=>r.O[e](n[a])))?n.splice(a--,1):(c=!1,i<l&&(l=i));if(c){e.splice(u--,1);var s=o();void 0!==s&&(t=s)}}return t}i=i||0;for(var u=e.length;u>0&&e[u-1][2]>i;u--)e[u]=e[u-1];e[u]=[n,o,i]},r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},r.d=(e,t)=>{for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e={702:0};r.O.j=t=>0===e[t];var t=(t,n)=>{var o,i,[l,c,a]=n,s=0;if(l.some((t=>0!==e[t]))){for(o in c)r.o(c,o)&&(r.m[o]=c[o]);if(a)var u=a(r)}for(t&&t(n);s<l.length;s++)i=l[s],r.o(e,i)&&e[i]&&e[i][0](),e[i]=0;return r.O(u)},n=self.webpackChunk=self.webpackChunk||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})();var o=r.O(void 0,[515,873,821,291,946],(()=>r(3788)));o=r.O(o)})();
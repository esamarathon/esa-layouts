(()=>{"use strict";var e,t={297:(e,t,n)=>{var o=n(298),r=n(9340),a=n(3825),i=n(9357),s=n(9247),l=n(4124),c=n(305);function u(e,t){void 0===t&&(t={});var n=t.deep,o=void 0!==n&&n,r=t.immediate,a=void 0!==r&&r;return(0,c.createDecorator)((function(t,n){"object"!=typeof t.watch&&(t.watch=Object.create(null));var r=t.watch;"object"!=typeof r[e]||Array.isArray(r[e])?void 0===r[e]&&(r[e]=[]):r[e]=[r[e]],r[e].push({handler:n,deep:o,immediate:a})}))}n(5716),n(9906),n(2633),n(3889),n(5757);var d=n(3578),f=n(899),p=function(e,t,n,o){var r,a=arguments.length,i=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,n,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(i=(a<3?r(i):a>3?r(t,n,i):r(t,n))||i);return a>3&&i&&Object.defineProperty(t,n,i),i};r.Ay.use(d.Ay);let y=class extends f.hw{get reps(){return this.context.rootState.ReplicantModule.reps}updateSelected(e){o.PH.setReplicant({name:"gameLayouts",val:Object.assign(Object.assign({},o.PH.repsTyped.gameLayouts),{selected:e})})}toggleCrowdCamera(e){o.PH.setReplicant({name:"gameLayouts",val:Object.assign(Object.assign({},o.PH.repsTyped.gameLayouts),{crowdCamera:e})})}};p([f.sM],y.prototype,"updateSelected",null),p([f.sM],y.prototype,"toggleCrowdCamera",null),y=p([(0,f.nV)({name:"OurModule"})],y);const g=new d.il({strict:!1,state:{},modules:{ReplicantModule:o.h0,OurModule:y}}),h=g,v=(0,f.f_)(y,g);var m=function(e,t,n,o){var r,a=arguments.length,i=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,n,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(i=(a<3?r(i):a>3?r(t,n,i):r(t,n))||i);return a>3&&i&&Object.defineProperty(t,n,i),i};let b=class extends r.Ay{constructor(){super(...arguments),this.online=nodecg.bundleConfig.event.online}get selected(){return this.gameLayouts.selected}set selected(e){v.updateSelected(e)}get crowdCamera(){return this.gameLayouts.crowdCamera}set crowdCamera(e){v.toggleCrowdCamera(e)}scrollToSelectedLayout(){return e=this,t=void 0,o=function*(){try{yield r.Ay.nextTick(),this.selected?this.$vuetify.goTo(`#layout-${this.selected}`,{container:"#LayoutList",offset:25}):this.$vuetify.goTo(0,{container:"#LayoutList"})}catch(e){}},new((n=void 0)||(n=Promise))((function(r,a){function i(e){try{l(o.next(e))}catch(e){a(e)}}function s(e){try{l(o.throw(e))}catch(e){a(e)}}function l(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(i,s)}l((o=o.apply(e,t||[])).next())}));var e,t,n,o}onGameLayoutsChange(){this.gameLayouts.available.length&&this.scrollToSelectedLayout()}mounted(){this.scrollToSelectedLayout()}};m([o.ok.State((e=>e.reps.gameLayouts))],b.prototype,"gameLayouts",void 0),m([u("selected")],b.prototype,"scrollToSelectedLayout",null),m([u("gameLayouts")],b.prototype,"onGameLayoutsChange",null),b=m([c.default],b);const w=b,$=(0,n(7270).A)(w,(function(){var e=this,t=e._self._c;return e._self._setupProxy,t(i.A,[e.gameLayouts.available.length?[t("div",{style:{"max-height":"250px","overflow-y":"auto"},attrs:{id:"LayoutList"}},[t(l.A,{style:{margin:"0px",padding:"10px"},attrs:{"hide-details":""},model:{value:e.selected,callback:function(t){e.selected=t},expression:"selected"}},e._l(e.gameLayouts.available,(function(e){return t(s.A,{key:e.code,attrs:{id:`layout-${e.code}`,value:e.code,label:e.name}})})),1)],1)]:t("div",{style:{"font-style":"italic"}},[e._v('\n    "Game Layout" graphic must be open.\n  ')])],2)}),[],!1,null,null,null).exports;(0,o.tg)(h).then((()=>{new r.Ay({vuetify:a.A,store:h,el:"#App",render:e=>e($)})}))},3889:(e,t,n)=>{"undefined"!=typeof Reflect&&Reflect.getMetadata},9078:(e,t,n)=>{n.d(t,{A:()=>r});var o=n(9340);const r=function(e="value",t="change"){return o.Ay.extend({name:"proxyable",model:{prop:e,event:t},props:{[e]:{required:!1}},data(){return{internalLazyValue:this[e]}},computed:{internalValue:{get(){return this.internalLazyValue},set(e){e!==this.internalLazyValue&&(this.internalLazyValue=e,this.$emit(t,e))}}},watch:{[e](e){this.internalLazyValue=e}}})}()},4442:(e,t,n)=>{n.d(t,{W:()=>i});var o=n(9340),r=n(7098);function a(e,t){return()=>(0,r.OP)(`The ${e} component must be used inside a ${t}`)}function i(e,t,n){const r=t&&n?{register:a(t,n),unregister:a(t,n)}:null;return o.Ay.extend({name:"registrable-inject",inject:{[e]:{default:r}}})}},7098:(e,t,n)=>{n.d(t,{OP:()=>a,yA:()=>i});var o=n(1874);function r(e,t,n){if(!o.A.config.silent){if(n&&(t={_isVue:!0,$parent:n,$options:t}),t){if(t.$_alreadyWarned=t.$_alreadyWarned||[],t.$_alreadyWarned.includes(e))return;t.$_alreadyWarned.push(e)}return`[Vuetify] ${e}`+(t?function(e){if(e._isVue&&e.$parent){const t=[];let n=0;for(;e;){if(t.length>0){const o=t[t.length-1];if(o.constructor===e.constructor){n++,e=e.$parent;continue}n>0&&(t[t.length-1]=[o,n],n=0)}t.push(e),e=e.$parent}return"\n\nfound in\n\n"+t.map(((e,t)=>`${0===t?"---\x3e ":" ".repeat(5+2*t)}${Array.isArray(e)?`${c(e[0])}... (${e[1]} recursive calls)`:c(e)}`)).join("\n")}return`\n\n(found in ${c(e)})`}(t):"")}}function a(e,t,n){const o=r(e,t,n);null!=o&&console.warn(o)}function i(e,t,n){const o=r(e,t,n);null!=o&&console.error(o)}const s=/(?:^|[-_])(\w)/g,l=e=>e.replace(s,(e=>e.toUpperCase())).replace(/[-_]/g,"");function c(e,t){if(e.$root===e)return"<Root>";const n="function"==typeof e&&null!=e.cid?e.options:e._isVue?e.$options||e.constructor.options:e||{};let o=n.name||n._componentTag;const r=n.__file;if(!o&&r){const e=r.match(/([^/\\]+)\.vue$/);o=e&&e[1]}return(o?`<${l(o)}>`:"<Anonymous>")+(r&&!1!==t?` at ${r}`:"")}},7290:(e,t,n)=>{n.d(t,{$c:()=>h,BN:()=>g,D9:()=>m,Dg:()=>s,HP:()=>f,LJ:()=>r,PT:()=>y,bD:()=>a,g8:()=>d,kW:()=>l,no:()=>i,qE:()=>v,uP:()=>u});let o=!1;try{if("undefined"!=typeof window){const e=Object.defineProperty({},"passive",{get:()=>{o=!0}});window.addEventListener("testListener",e,e),window.removeEventListener("testListener",e,e)}}catch(e){console.warn(e)}function r(e,t,n){const o=t.length-1;if(o<0)return void 0===e?n:e;for(let r=0;r<o;r++){if(null==e)return n;e=e[t[r]]}return null==e||void 0===e[t[o]]?n:e[t[o]]}function a(e,t){if(e===t)return!0;if(e instanceof Date&&t instanceof Date&&e.getTime()!==t.getTime())return!1;if(e!==Object(e)||t!==Object(t))return!1;const n=Object.keys(e);return n.length===Object.keys(t).length&&n.every((n=>a(e[n],t[n])))}function i(e,t,n){return null!=e&&t&&"string"==typeof t?void 0!==e[t]?e[t]:r(e,(t=(t=t.replace(/\[(\w+)\]/g,".$1")).replace(/^\./,"")).split("."),n):n}function s(e,t="px"){return null==e||""===e?void 0:isNaN(+e)?String(e):`${Number(e)}${t}`}function l(e){return(e||"").replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}function c(e){return null!==e&&"object"==typeof e}const u=Object.freeze({enter:13,tab:9,delete:46,esc:27,space:32,up:38,down:40,left:37,right:39,end:35,home:36,del:46,backspace:8,insert:45,pageup:33,pagedown:34,shift:16});function d(e,t){const n=e.$vuetify.icons.component;if(t.startsWith("$")){const n=i(e,`$vuetify.icons.values.${t.split("$").pop().split(".").pop()}`,t);if("string"!=typeof n)return n;t=n}return null==n?t:{component:n,props:{icon:t}}}function f(e){return Object.keys(e)}const p=/-(\w)/g,y=e=>e.replace(p,((e,t)=>t?t.toUpperCase():""));function g(e){return null!=e?Array.isArray(e)?e:[e]:[]}function h(e,t="default",n,o=!1){const r=l(t);return e.$scopedSlots.hasOwnProperty(t)?e.$scopedSlots[t](n instanceof Function?n():n):e.$scopedSlots.hasOwnProperty(r)?e.$scopedSlots[r](n instanceof Function?n():n):!e.$slots.hasOwnProperty(t)||n&&!o?!e.$slots.hasOwnProperty(r)||n&&!o?void 0:e.$slots[r]:e.$slots[t]}function v(e,t=0,n=1){return Math.max(t,Math.min(n,e))}function m(e={},t={}){for(const n in t){const o=e[n],r=t[n];c(o)&&c(r)?e[n]=m(o,r):e[n]=r}return e}}},n={};function o(e){var r=n[e];if(void 0!==r)return r.exports;var a=n[e]={exports:{}};return t[e].call(a.exports,a,a.exports,o),a.exports}o.m=t,e=[],o.O=(t,n,r,a)=>{if(!n){var i=1/0;for(u=0;u<e.length;u++){for(var[n,r,a]=e[u],s=!0,l=0;l<n.length;l++)(!1&a||i>=a)&&Object.keys(o.O).every((e=>o.O[e](n[l])))?n.splice(l--,1):(s=!1,a<i&&(i=a));if(s){e.splice(u--,1);var c=r();void 0!==c&&(t=c)}}return t}a=a||0;for(var u=e.length;u>0&&e[u-1][2]>a;u--)e[u]=e[u-1];e[u]=[n,r,a]},o.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return o.d(t,{a:t}),t},o.d=(e,t)=>{for(var n in t)o.o(t,n)&&!o.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},o.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e={797:0};o.O.j=t=>0===e[t];var t=(t,n)=>{var r,a,[i,s,l]=n,c=0;if(i.some((t=>0!==e[t]))){for(r in s)o.o(s,r)&&(o.m[r]=s[r]);if(l)var u=l(o)}for(t&&t(n);c<i.length;c++)a=i[c],o.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return o.O(u)},n=self.webpackChunk=self.webpackChunk||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})();var r=o.O(void 0,[294,857,842,611],(()=>o(297)));r=o.O(r)})();
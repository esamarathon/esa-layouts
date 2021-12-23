(()=>{"use strict";var e,t={49:(e,t,n)=>{var o=n(5803),r=n(9459),a=n(2659),i=n(708),c=n(5043),s=n(9054),l=function(e,t,n,o){var r,a=arguments.length,i=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,n,o);else for(var c=e.length-1;c>=0;c--)(r=e[c])&&(i=(a<3?r(i):a>3?r(t,n,i):r(t,n))||i);return a>3&&i&&Object.defineProperty(t,n,i),i};let u=class extends a.w3{scrollToSelectedLayout(){return e=this,t=void 0,o=function*(){try{yield a.w3.nextTick(),this.selected?(0,s.ZP)(`#layout-${this.selected}`,{container:"#LayoutList",offset:25}):(0,s.ZP)(0,{container:"#LayoutList"})}catch(e){}},new((n=void 0)||(n=Promise))((function(r,a){function i(e){try{s(o.next(e))}catch(e){a(e)}}function c(e){try{s(o.throw(e))}catch(e){a(e)}}function s(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(i,c)}s((o=o.apply(e,t||[])).next())}));var e,t,n,o}onGameLayoutsChange(){this.gameLayouts.available.length&&this.scrollToSelectedLayout()}mounted(){this.scrollToSelectedLayout()}};l([i.ZM],u.prototype,"gameLayouts",void 0),l([(0,c.H)("updateSelected","gameLayouts.selected")],u.prototype,"selected",void 0),l([(0,a.RL)("selected")],u.prototype,"scrollToSelectedLayout",null),l([(0,a.RL)("gameLayouts")],u.prototype,"onGameLayoutsChange",null),u=l([a.wA],u);const f=u;var p=n(5440),d=n(7618),y=n.n(d),v=n(1883),h=n(3335),g=n(6123),m=(0,p.Z)(f,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-app",[e.gameLayouts.available.length?n("div",{style:{"max-height":"250px","overflow-y":"auto"},attrs:{id:"LayoutList"}},[n("v-radio-group",{style:{margin:"0px",padding:"10px"},attrs:{"hide-details":""},model:{value:e.selected,callback:function(t){e.selected=t},expression:"selected"}},e._l(e.gameLayouts.available,(function(e){return n("v-radio",{key:e.code,attrs:{id:"layout-"+e.code,value:e.code,label:e.name}})})),1)],1):n("div",{style:{"font-style":"italic"}},[e._v('\n    "Game Layout" graphic must be open.\n  ')])])}),[],!1,null,null,null);const b=m.exports;y()(m,{VApp:v.Z,VRadio:h.Z,VRadioGroup:g.Z});var w=n(8138),$=n.n(w),L=n(8586);o.Z.use(L.ZP);const O={gameLayouts:nodecg.Replicant("gameLayouts")},j=new L.ZP.Store({state:{},mutations:{setState(e,{name:t,val:n}){o.Z.set(e,t,n)},updateSelected(e,t){void 0!==O.gameLayouts.value&&(O.gameLayouts.value.selected=t)}}});var _,x,S,Z;Object.keys(O).forEach((e=>{O[e].on("change",(t=>{j.commit("setState",{name:e,val:$()(t)})}))})),(_=void 0,x=void 0,S=void 0,Z=function*(){return yield NodeCG.waitForReplicants(...Object.keys(O).map((e=>O[e]))),j},new(S||(S=Promise))((function(e,t){function n(e){try{r(Z.next(e))}catch(e){t(e)}}function o(e){try{r(Z.throw(e))}catch(e){t(e)}}function r(t){var r;t.done?e(t.value):(r=t.value,r instanceof S?r:new S((function(e){e(r)}))).then(n,o)}r((Z=Z.apply(_,x||[])).next())}))).then((e=>{new o.Z({vuetify:r.Z,store:e,el:"#App",render:e=>e(b)})}))},8298:(e,t,n)=>{n.d(t,{Kd:()=>a,N6:()=>i});var o=n(9721);function r(e,t,n){if(!o.Z.config.silent){if(n&&(t={_isVue:!0,$parent:n,$options:t}),t){if(t.$_alreadyWarned=t.$_alreadyWarned||[],t.$_alreadyWarned.includes(e))return;t.$_alreadyWarned.push(e)}return`[Vuetify] ${e}`+(t?function(e){if(e._isVue&&e.$parent){const t=[];let n=0;for(;e;){if(t.length>0){const o=t[t.length-1];if(o.constructor===e.constructor){n++,e=e.$parent;continue}n>0&&(t[t.length-1]=[o,n],n=0)}t.push(e),e=e.$parent}return"\n\nfound in\n\n"+t.map(((e,t)=>`${0===t?"---\x3e ":" ".repeat(5+2*t)}${Array.isArray(e)?`${s(e[0])}... (${e[1]} recursive calls)`:s(e)}`)).join("\n")}return`\n\n(found in ${s(e)})`}(t):"")}}function a(e,t,n){const o=r(e,t,n);null!=o&&console.warn(o)}function i(e,t,n){const o=r(e,t,n);null!=o&&console.error(o)}const c=/(?:^|[-_])(\w)/g;function s(e,t){if(e.$root===e)return"<Root>";const n="function"==typeof e&&null!=e.cid?e.options:e._isVue?e.$options||e.constructor.options:e||{};let o=n.name||n._componentTag;const r=n.__file;if(!o&&r){const e=r.match(/([^/\\]+)\.vue$/);o=e&&e[1]}return(o?`<${a=o,a.replace(c,(e=>e.toUpperCase())).replace(/[-_]/g,"")}>`:"<Anonymous>")+(r&&!1!==t?` at ${r}`:"");var a}},2377:(e,t,n)=>{n.d(t,{qw:()=>r,vZ:()=>a,vO:()=>i,kb:()=>c,GL:()=>s,Do:()=>u,RB:()=>f,XP:()=>p,_A:()=>y,TI:()=>v,z9:()=>h,uZ:()=>g,Ee:()=>m});let o=!1;try{if("undefined"!=typeof window){const e=Object.defineProperty({},"passive",{get:()=>{o=!0}});window.addEventListener("testListener",e,e),window.removeEventListener("testListener",e,e)}}catch(e){console.warn(e)}function r(e,t,n){const o=t.length-1;if(o<0)return void 0===e?n:e;for(let r=0;r<o;r++){if(null==e)return n;e=e[t[r]]}return null==e||void 0===e[t[o]]?n:e[t[o]]}function a(e,t){if(e===t)return!0;if(e instanceof Date&&t instanceof Date&&e.getTime()!==t.getTime())return!1;if(e!==Object(e)||t!==Object(t))return!1;const n=Object.keys(e);return n.length===Object.keys(t).length&&n.every((n=>a(e[n],t[n])))}function i(e,t,n){return null!=e&&t&&"string"==typeof t?void 0!==e[t]?e[t]:r(e,(t=(t=t.replace(/\[(\w+)\]/g,".$1")).replace(/^\./,"")).split("."),n):n}function c(e,t="px"){return null==e||""===e?void 0:isNaN(+e)?String(e):`${Number(e)}${t}`}function s(e){return(e||"").replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}function l(e){return null!==e&&"object"==typeof e}const u=Object.freeze({enter:13,tab:9,delete:46,esc:27,space:32,up:38,down:40,left:37,right:39,end:35,home:36,del:46,backspace:8,insert:45,pageup:33,pagedown:34,shift:16});function f(e,t){const n=e.$vuetify.icons.component;if(t.startsWith("$")){const n=i(e,`$vuetify.icons.values.${t.split("$").pop().split(".").pop()}`,t);if("string"!=typeof n)return n;t=n}return null==n?t:{component:n,props:{icon:t}}}function p(e){return Object.keys(e)}const d=/-(\w)/g,y=e=>e.replace(d,((e,t)=>t?t.toUpperCase():""));function v(e){return null!=e?Array.isArray(e)?e:[e]:[]}function h(e,t="default",n,o=!1){return e.$scopedSlots.hasOwnProperty(t)?e.$scopedSlots[t](n instanceof Function?n():n):!e.$slots.hasOwnProperty(t)||n&&!o?void 0:e.$slots[t]}function g(e,t=0,n=1){return Math.max(t,Math.min(n,e))}function m(e={},t={}){for(const n in t){const o=e[n],r=t[n];l(o)&&l(r)?e[n]=m(o,r):e[n]=r}return e}}},n={};function o(e){var r=n[e];if(void 0!==r)return r.exports;var a=n[e]={exports:{}};return t[e](a,a.exports,o),a.exports}o.m=t,e=[],o.O=(t,n,r,a)=>{if(!n){var i=1/0;for(u=0;u<e.length;u++){for(var[n,r,a]=e[u],c=!0,s=0;s<n.length;s++)(!1&a||i>=a)&&Object.keys(o.O).every((e=>o.O[e](n[s])))?n.splice(s--,1):(c=!1,a<i&&(i=a));if(c){e.splice(u--,1);var l=r();void 0!==l&&(t=l)}}return t}a=a||0;for(var u=e.length;u>0&&e[u-1][2]>a;u--)e[u]=e[u-1];e[u]=[n,r,a]},o.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return o.d(t,{a:t}),t},o.d=(e,t)=>{for(var n in t)o.o(t,n)&&!o.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},o.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e={183:0};o.O.j=t=>0===e[t];var t=(t,n)=>{var r,a,[i,c,s]=n,l=0;if(i.some((t=>0!==e[t]))){for(r in c)o.o(c,r)&&(o.m[r]=c[r]);if(s)var u=s(o)}for(t&&t(n);l<i.length;l++)a=i[l],o.o(e,a)&&e[a]&&e[a][0](),e[i[l]]=0;return o.O(u)},n=self.webpackChunk=self.webpackChunk||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})();var r=o.O(void 0,[515,873,13,327,789],(()=>o(49)));r=o.O(r)})();
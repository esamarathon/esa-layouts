"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[112],{7508:(e,t,n)=>{n.d(t,{Cg:()=>y,Gg:()=>g,SW:()=>m});var o=n(4168),r=n.n(o),a=n(7940),s=n(3072),c=n(6136),i=n(9844),l=function(e,t,n,o){var r,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,n,o);else for(var c=e.length-1;c>=0;c--)(r=e[c])&&(s=(a<3?r(s):a>3?r(t,n,s):r(t,n))||s);return a>3&&s&&Object.defineProperty(t,n,s),s},u=function(e,t,n,o){return new(n||(n=Promise))((function(r,a){function s(e){try{i(o.next(e))}catch(e){a(e)}}function c(e){try{i(o.throw(e))}catch(e){a(e)}}function i(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,c)}i((o=o.apply(e,t||[])).next())}))};const p=new a.SpeedcontrolUtilBrowser(nodecg),d={assetsDonationAlertAssets:nodecg.Replicant("assets:donation-alert-assets"),assetsIntermissionSlides:nodecg.Replicant("assets:intermission-slides"),assetsReaderIntroductionImages:nodecg.Replicant("assets:reader-introduction-images"),bids:nodecg.Replicant("bids"),bigbuttonPlayerMap:nodecg.Replicant("bigbuttonPlayerMap"),commentators:nodecg.Replicant("commentators"),countdown:nodecg.Replicant("countdown"),currentRunDelay:nodecg.Replicant("currentRunDelay"),donationAlerts:nodecg.Replicant("donationAlerts"),donationReader:nodecg.Replicant("donationReader"),donationsToRead:nodecg.Replicant("donationsToRead"),donationTotal:nodecg.Replicant("donationTotal"),donationTotalMilestones:nodecg.Replicant("donationTotalMilestones"),gameLayouts:nodecg.Replicant("gameLayouts"),intermissionSlides:nodecg.Replicant("intermissionSlides"),musicData:nodecg.Replicant("musicData"),obsData:nodecg.Replicant("obsData"),omnibar:nodecg.Replicant("omnibar"),otherStreamData:nodecg.Replicant("otherStreamData"),prizes:nodecg.Replicant("prizes"),readerIntroduction:nodecg.Replicant("readerIntroduction"),runDataActiveRun:p.runDataActiveRun,runDataActiveRunSurrounding:p.runDataActiveRunSurrounding,runDataArray:p.runDataArray,serverTimestamp:nodecg.Replicant("serverTimestamp"),streamDeckData:nodecg.Replicant("streamDeckData"),timer:p.timer,ttsVoices:nodecg.Replicant("ttsVoices"),upcomingRunID:nodecg.Replicant("upcomingRunID"),videoPlayer:nodecg.Replicant("videoPlayer")};let f,g=class extends i.y6{constructor(){super(...arguments),this.reps={}}get repsTyped(){return this.reps}setState({name:e,val:t}){s.cp.set(this.reps,e,r()(t))}setReplicant({name:e,val:t}){s.cp.set(this.reps,e,r()(t)),d[e].value=r()(t)}};l([i.eU],g.prototype,"setState",null),l([i.eU],g.prototype,"setReplicant",null),g=l([(0,i.gB)({name:"ReplicantModule",namespaced:!0})],g);const m=(0,c.eK)("ReplicantModule");function y(e){return u(this,void 0,void 0,(function*(){Object.keys(d).forEach((t=>{d[t].on("change",(n=>{e.commit("ReplicantModule/setState",{name:t,val:n})}))})),yield NodeCG.waitForReplicants(...Object.keys(d).map((e=>d[e]))),f=(0,i.GM)(g,e)}))}},476:(e,t,n)=>{n(5492)},5492:(e,t,n)=>{"undefined"!=typeof Reflect&&Reflect.getMetadata},8432:(e,t,n)=>{n.d(t,{i:()=>r});var o=n(3072);function r(e="value",t="input"){return o.cp.extend({name:"toggleable",model:{prop:e,event:t},props:{[e]:{required:!1}},data(){return{isActive:!!this[e]}},watch:{[e](e){this.isActive=!!e},isActive(n){!!n!==this[e]&&this.$emit(t,n)}}})}r()},148:(e,t,n)=>{n.d(t,{AX:()=>m,C_:()=>f,Cm:()=>r,IN:()=>a,Mv:()=>c,OI:()=>s,Qv:()=>l,WE:()=>R,__:()=>y,ag:()=>v,cJ:()=>p,m6:()=>i,qk:()=>h,um:()=>d,yC:()=>b});let o=!1;try{if("undefined"!=typeof window){const e=Object.defineProperty({},"passive",{get:()=>{o=!0}});window.addEventListener("testListener",e,e),window.removeEventListener("testListener",e,e)}}catch(e){console.warn(e)}function r(e,t,n){const o=t.length-1;if(o<0)return void 0===e?n:e;for(let r=0;r<o;r++){if(null==e)return n;e=e[t[r]]}return null==e||void 0===e[t[o]]?n:e[t[o]]}function a(e,t){if(e===t)return!0;if(e instanceof Date&&t instanceof Date&&e.getTime()!==t.getTime())return!1;if(e!==Object(e)||t!==Object(t))return!1;const n=Object.keys(e);return n.length===Object.keys(t).length&&n.every((n=>a(e[n],t[n])))}function s(e,t,n){return null!=e&&t&&"string"==typeof t?void 0!==e[t]?e[t]:r(e,(t=(t=t.replace(/\[(\w+)\]/g,".$1")).replace(/^\./,"")).split("."),n):n}function c(e,t){const n={};for(let o=0;o<t.length;o++){const r=t[o];void 0!==e[r]&&(n[r]=e[r])}return n}function i(e,t="px"){return null==e||""===e?void 0:isNaN(+e)?String(e):`${Number(e)}${t}`}function l(e){return(e||"").replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}function u(e){return null!==e&&"object"==typeof e}const p=Object.freeze({enter:13,tab:9,delete:46,esc:27,space:32,up:38,down:40,left:37,right:39,end:35,home:36,del:46,backspace:8,insert:45,pageup:33,pagedown:34,shift:16});function d(e,t){const n=e.$vuetify.icons.component;if(t.startsWith("$")){const n=s(e,`$vuetify.icons.values.${t.split("$").pop().split(".").pop()}`,t);if("string"!=typeof n)return n;t=n}return null==n?t:{component:n,props:{icon:t}}}function f(e){return Object.keys(e)}const g=/-(\w)/g,m=e=>e.replace(g,((e,t)=>t?t.toUpperCase():""));function y(e){return e.charAt(0).toUpperCase()+e.slice(1)}function R(e){return null!=e?Array.isArray(e)?e:[e]:[]}function v(e,t="default",n,o=!1){const r=l(t);return e.$scopedSlots.hasOwnProperty(t)?e.$scopedSlots[t](n instanceof Function?n():n):e.$scopedSlots.hasOwnProperty(r)?e.$scopedSlots[r](n instanceof Function?n():n):!e.$slots.hasOwnProperty(t)||n&&!o?!e.$slots.hasOwnProperty(r)||n&&!o?void 0:e.$slots[r]:e.$slots[t]}function h(e,t=0,n=1){return Math.max(t,Math.min(n,e))}function b(e={},t={}){for(const n in t){const o=e[n],r=t[n];u(o)&&u(r)?e[n]=b(o,r):e[n]=r}return e}},9448:(e,t,n)=>{n.d(t,{cp:()=>s});var o=n(148);const r={styleList:/;(?![^(]*\))/g,styleProp:/:(.*)/};function a(e){const t={};for(const n of e.split(r.styleList)){let[e,a]=n.split(r.styleProp);e=e.trim(),e&&("string"==typeof a&&(a=a.trim()),t[(0,o.AX)(e)]=a)}return t}function s(){const e={};let t,n=arguments.length;for(;n--;)for(t of Object.keys(arguments[n]))switch(t){case"class":case"directives":arguments[n][t]&&(e[t]=(r=e[t],(a=arguments[n][t])?r&&r?(0,o.WE)(r).concat(a):a:r));break;case"style":arguments[n][t]&&(e[t]=c(e[t],arguments[n][t]));break;case"staticClass":if(!arguments[n][t])break;void 0===e[t]&&(e[t]=""),e[t]&&(e[t]+=" "),e[t]+=arguments[n][t].trim();break;case"on":case"nativeOn":arguments[n][t]&&(e[t]=i(e[t],arguments[n][t]));break;case"attrs":case"props":case"domProps":case"scopedSlots":case"staticStyle":case"hook":case"transition":if(!arguments[n][t])break;e[t]||(e[t]={}),e[t]={...arguments[n][t],...e[t]};break;default:e[t]||(e[t]=arguments[n][t])}var r,a;return e}function c(e,t){return e?t?(e=(0,o.WE)("string"==typeof e?a(e):e)).concat("string"==typeof t?a(t):t):e:t}function i(...e){if(!e[0])return e[1];if(!e[1])return e[0];const t={};for(let n=2;n--;){const o=e[n];for(const e in o)o[e]&&(t[e]?t[e]=[].concat(o[e],t[e]):t[e]=o[e])}return t}}}]);
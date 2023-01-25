"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[566],{2725:(e,t,n)=>{n.d(t,{Nz:()=>g,np:()=>f,rl:()=>m});var o=n(8138),r=n.n(o),a=n(829),c=n(5803),i=n(708),s=n(4170),u=function(e,t,n,o){var r,a=arguments.length,c=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(e,t,n,o);else for(var i=e.length-1;i>=0;i--)(r=e[i])&&(c=(a<3?r(c):a>3?r(t,n,c):r(t,n))||c);return a>3&&c&&Object.defineProperty(t,n,c),c};const l=new a.SpeedcontrolUtilBrowser(nodecg),p={assetsReaderIntroductionImages:nodecg.Replicant("assets:reader-introduction-images"),bids:nodecg.Replicant("bids"),bigbuttonPlayerMap:nodecg.Replicant("bigbuttonPlayerMap"),commentators:nodecg.Replicant("commentators"),countdown:nodecg.Replicant("countdown"),currentRunDelay:nodecg.Replicant("currentRunDelay"),donationReader:nodecg.Replicant("donationReader"),donationsToRead:nodecg.Replicant("donationsToRead"),donationTotal:nodecg.Replicant("donationTotal"),donationTotalMilestones:nodecg.Replicant("donationTotalMilestones"),gameLayouts:nodecg.Replicant("gameLayouts"),obsData:nodecg.Replicant("obsData"),omnibar:nodecg.Replicant("omnibar"),otherStreamData:nodecg.Replicant("otherStreamData"),prizes:nodecg.Replicant("prizes"),readerIntroduction:nodecg.Replicant("readerIntroduction"),runDataActiveRun:l.runDataActiveRun,runDataActiveRunSurrounding:l.runDataActiveRunSurrounding,runDataArray:l.runDataArray,serverTimestamp:nodecg.Replicant("serverTimestamp"),streamDeckData:nodecg.Replicant("streamDeckData"),timer:l.timer,ttsVoices:nodecg.Replicant("ttsVoices"),upcomingRunID:nodecg.Replicant("upcomingRunID"),videoPlayer:nodecg.Replicant("videoPlayer")};let d,f=class extends s.g4{constructor(){super(...arguments),this.reps={}}get repsTyped(){return this.reps}setState({name:e,val:t}){c.ZP.set(this.reps,e,r()(t))}setReplicant({name:e,val:t}){c.ZP.set(this.reps,e,r()(t)),p[e].value=r()(t)}};u([s.mm],f.prototype,"setState",null),u([s.mm],f.prototype,"setReplicant",null),f=u([(0,s.Yl)({name:"ReplicantModule",namespaced:!0})],f);const g=(0,i.uD)("ReplicantModule");function m(e){return t=this,n=void 0,r=function*(){Object.keys(p).forEach((t=>{p[t].on("change",(n=>{e.commit("ReplicantModule/setState",{name:t,val:n})}))})),yield NodeCG.waitForReplicants(...Object.keys(p).map((e=>p[e]))),d=(0,s.rT)(f,e)},new((o=void 0)||(o=Promise))((function(e,a){function c(e){try{s(r.next(e))}catch(e){a(e)}}function i(e){try{s(r.throw(e))}catch(e){a(e)}}function s(t){var n;t.done?e(t.value):(n=t.value,n instanceof o?n:new o((function(e){e(n)}))).then(c,i)}s((r=r.apply(t,n||[])).next())}));var t,n,o,r}},6070:(e,t,n)=>{n(779)},779:(e,t,n)=>{"undefined"!=typeof Reflect&&Reflect.getMetadata},9085:(e,t,n)=>{n.d(t,{d:()=>r});var o=n(5803);function r(e="value",t="input"){return o.ZP.extend({name:"toggleable",model:{prop:e,event:t},props:{[e]:{required:!1}},data(){return{isActive:!!this[e]}},watch:{[e](e){this.isActive=!!e},isActive(n){!!n!==this[e]&&this.$emit(t,n)}}})}r()},2377:(e,t,n)=>{n.d(t,{Do:()=>p,Ee:()=>b,GL:()=>u,RB:()=>d,TI:()=>y,XP:()=>f,_A:()=>m,jC:()=>v,ji:()=>i,kb:()=>s,qw:()=>r,uZ:()=>h,vO:()=>c,vZ:()=>a,z9:()=>R});let o=!1;try{if("undefined"!=typeof window){const e=Object.defineProperty({},"passive",{get:()=>{o=!0}});window.addEventListener("testListener",e,e),window.removeEventListener("testListener",e,e)}}catch(e){console.warn(e)}function r(e,t,n){const o=t.length-1;if(o<0)return void 0===e?n:e;for(let r=0;r<o;r++){if(null==e)return n;e=e[t[r]]}return null==e||void 0===e[t[o]]?n:e[t[o]]}function a(e,t){if(e===t)return!0;if(e instanceof Date&&t instanceof Date&&e.getTime()!==t.getTime())return!1;if(e!==Object(e)||t!==Object(t))return!1;const n=Object.keys(e);return n.length===Object.keys(t).length&&n.every((n=>a(e[n],t[n])))}function c(e,t,n){return null!=e&&t&&"string"==typeof t?void 0!==e[t]?e[t]:r(e,(t=(t=t.replace(/\[(\w+)\]/g,".$1")).replace(/^\./,"")).split("."),n):n}function i(e,t){const n={};for(let o=0;o<t.length;o++){const r=t[o];void 0!==e[r]&&(n[r]=e[r])}return n}function s(e,t="px"){return null==e||""===e?void 0:isNaN(+e)?String(e):`${Number(e)}${t}`}function u(e){return(e||"").replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}function l(e){return null!==e&&"object"==typeof e}const p=Object.freeze({enter:13,tab:9,delete:46,esc:27,space:32,up:38,down:40,left:37,right:39,end:35,home:36,del:46,backspace:8,insert:45,pageup:33,pagedown:34,shift:16});function d(e,t){const n=e.$vuetify.icons.component;if(t.startsWith("$")){const n=c(e,`$vuetify.icons.values.${t.split("$").pop().split(".").pop()}`,t);if("string"!=typeof n)return n;t=n}return null==n?t:{component:n,props:{icon:t}}}function f(e){return Object.keys(e)}const g=/-(\w)/g,m=e=>e.replace(g,((e,t)=>t?t.toUpperCase():""));function v(e){return e.charAt(0).toUpperCase()+e.slice(1)}function y(e){return null!=e?Array.isArray(e)?e:[e]:[]}function R(e,t="default",n,o=!1){return e.$scopedSlots.hasOwnProperty(t)?e.$scopedSlots[t](n instanceof Function?n():n):!e.$slots.hasOwnProperty(t)||n&&!o?void 0:e.$slots[t]}function h(e,t=0,n=1){return Math.max(t,Math.min(n,e))}function b(e={},t={}){for(const n in t){const o=e[n],r=t[n];l(o)&&l(r)?e[n]=b(o,r):e[n]=r}return e}},2138:(e,t,n)=>{n.d(t,{ZP:()=>i});var o=n(2377);const r=/;(?![^(]*\))/g,a=/:(.*)/;function c(e){const t={};for(const n of e.split(r)){let[e,r]=n.split(a);e=e.trim(),e&&("string"==typeof r&&(r=r.trim()),t[(0,o._A)(e)]=r)}return t}function i(){const e={};let t,n=arguments.length;for(;n--;)for(t of Object.keys(arguments[n]))switch(t){case"class":case"directives":arguments[n][t]&&(e[t]=u(e[t],arguments[n][t]));break;case"style":arguments[n][t]&&(e[t]=s(e[t],arguments[n][t]));break;case"staticClass":if(!arguments[n][t])break;void 0===e[t]&&(e[t]=""),e[t]&&(e[t]+=" "),e[t]+=arguments[n][t].trim();break;case"on":case"nativeOn":arguments[n][t]&&(e[t]=l(e[t],arguments[n][t]));break;case"attrs":case"props":case"domProps":case"scopedSlots":case"staticStyle":case"hook":case"transition":if(!arguments[n][t])break;e[t]||(e[t]={}),e[t]={...arguments[n][t],...e[t]};break;default:e[t]||(e[t]=arguments[n][t])}return e}function s(e,t){return e?t?(e=(0,o.TI)("string"==typeof e?c(e):e)).concat("string"==typeof t?c(t):t):e:t}function u(e,t){return t?e&&e?(0,o.TI)(e).concat(t):t:e}function l(...e){if(!e[0])return e[1];if(!e[1])return e[0];const t={};for(let n=2;n--;){const o=e[n];for(const e in o)o[e]&&(t[e]?t[e]=[].concat(o[e],t[e]):t[e]=o[e])}return t}}}]);
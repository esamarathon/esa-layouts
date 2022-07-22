(()=>{"use strict";var e,t={4145:(e,t,n)=>{var r=n(8138),o=n.n(r),a=n(829),i=n(5803),c=n(708),s=n(4170),u=function(e,t,n,r){var o,a=arguments.length,i=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,n,r);else for(var c=e.length-1;c>=0;c--)(o=e[c])&&(i=(a<3?o(i):a>3?o(t,n,i):o(t,n))||i);return a>3&&i&&Object.defineProperty(t,n,i),i};const l=new a.SpeedcontrolUtilBrowser(nodecg),d={assetsReaderIntroductionImages:nodecg.Replicant("assets:reader-introduction-images"),bids:nodecg.Replicant("bids"),bigbuttonPlayerMap:nodecg.Replicant("bigbuttonPlayerMap"),commentators:nodecg.Replicant("commentators"),countdown:nodecg.Replicant("countdown"),currentRunDelay:nodecg.Replicant("currentRunDelay"),donationReader:nodecg.Replicant("donationReader"),donationsToRead:nodecg.Replicant("donationsToRead"),donationTotal:nodecg.Replicant("donationTotal"),donationTotalMilestones:nodecg.Replicant("donationTotalMilestones"),gameLayouts:nodecg.Replicant("gameLayouts"),obsData:nodecg.Replicant("obsData"),omnibar:nodecg.Replicant("omnibar"),otherStreamData:nodecg.Replicant("otherStreamData"),prizes:nodecg.Replicant("prizes"),readerIntroduction:nodecg.Replicant("readerIntroduction"),runDataActiveRun:l.runDataActiveRun,runDataActiveRunSurrounding:l.runDataActiveRunSurrounding,runDataArray:l.runDataArray,serverTimestamp:nodecg.Replicant("serverTimestamp"),streamDeckData:nodecg.Replicant("streamDeckData"),timer:l.timer,ttsVoices:nodecg.Replicant("ttsVoices"),upcomingRunID:nodecg.Replicant("upcomingRunID"),videoPlayer:nodecg.Replicant("videoPlayer")};let p,f=class extends s.g4{constructor(){super(...arguments),this.reps={}}get repsTyped(){return this.reps}setState({name:e,val:t}){i.ZP.set(this.reps,e,o()(t))}setReplicant({name:e,val:t}){i.ZP.set(this.reps,e,o()(t)),d[e].value=o()(t)}};u([s.mm],f.prototype,"setState",null),u([s.mm],f.prototype,"setReplicant",null),f=u([(0,s.Yl)({name:"ReplicantModule",namespaced:!0})],f);const g=(0,c.uD)("ReplicantModule");var v=n(3687),h=n(936),m=n(6255),y=n(5925);n(4807),n(7023),n(5654),n(779),n(8793);var R=function(e,t,n,r){var o,a=arguments.length,i=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,n,r);else for(var c=e.length-1;c>=0;c--)(o=e[c])&&(i=(a<3?o(i):a>3?o(t,n,i):o(t,n))||i);return a>3&&i&&Object.defineProperty(t,n,i),i};let b=class extends i.ZP{forceUpcomingRun(e){nodecg.sendMessage("forceUpcomingRun",e)}getRunStr(e){const t=this.runDataArray.find((t=>t.id===e));return t?[t.game||"?",t.category].filter(Boolean).join(" - "):"?"}};R([g.State((e=>e.reps.runDataArray))],b.prototype,"runDataArray",void 0),R([g.State((e=>e.reps.runDataActiveRunSurrounding))],b.prototype,"runDataActiveRunSurrounding",void 0),R([g.State((e=>e.reps.upcomingRunID))],b.prototype,"upcomingRunID",void 0),b=R([y.default],b);const D=b,w=(0,n(5440).Z)(D,(function(){var e=this,t=e._self._c;return e._self._setupProxy,t(h.Z,[t("div",{style:{"font-style":"italic","margin-bottom":"5px"}},[e._v("\n    This should only need to be used if the automatically set one is incorrect.\n  ")]),e._v(" "),t("div",{style:{overflow:"hidden","white-space":"nowrap"}},[t("span",{style:{"font-weight":"bold"}},[e._v("\n      Currently Set:\n    ")]),e._v(" "),e.upcomingRunID?t("span",{attrs:{title:e.getRunStr(e.upcomingRunID)}},[e._v("\n      "+e._s(e.getRunStr(e.upcomingRunID))+"\n    ")]):t("span",[e._v("\n      none\n    ")])]),e._v(" "),e._l(["previous","current","next"],(function(n,r){return t("div",{key:r,style:{"margin-top":"5px"}},[e.runDataActiveRunSurrounding[n]?t(m.Z,{staticClass:"ForceUpcomingRunBtn",attrs:{width:"100%",block:"",title:e.getRunStr(e.runDataActiveRunSurrounding[n])},on:{click:function(t){return e.forceUpcomingRun(e.runDataActiveRunSurrounding[n])}}},[t("div",{staticClass:"d-flex justify-center",style:{width:"100%"}},[t("div",{style:{overflow:"hidden"}},[e._v("\n          Force to "+e._s(n)+" ("+e._s(e.getRunStr(e.runDataActiveRunSurrounding[n]))+")\n        ")])])]):t(m.Z,{attrs:{width:"100%",block:"",disabled:""}},[e._v("\n      "+e._s(n)+" not available\n    ")])],1)})),e._v(" "),t(m.Z,{style:{"margin-top":"5px"},on:{click:function(t){return e.forceUpcomingRun()}}},[e._v("\n    Force to nothing\n  ")])],2)}),[],!1,null,null,null).exports;var k=n(8586);i.ZP.use(k.ZP);let O=class extends s.g4{get reps(){return this.context.rootState.ReplicantModule.reps}};O=function(e,t,n,r){var o,a=arguments.length,i=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,n,r);else for(var c=e.length-1;c>=0;c--)(o=e[c])&&(i=(a<3?o(i):a>3?o(t,n,i):o(t,n))||i);return a>3&&i&&Object.defineProperty(t,n,i),i}([(0,s.Yl)({name:"OurModule"})],O);const S=new k.yh({strict:!1,state:{},modules:{ReplicantModule:f,OurModule:O}}),P=S;(0,s.rT)(O,S),function(e){return t=this,n=void 0,o=function*(){Object.keys(d).forEach((t=>{d[t].on("change",(n=>{e.commit("ReplicantModule/setState",{name:t,val:n})}))})),yield NodeCG.waitForReplicants(...Object.keys(d).map((e=>d[e]))),p=(0,s.rT)(f,e)},new((r=void 0)||(r=Promise))((function(e,a){function i(e){try{s(o.next(e))}catch(e){a(e)}}function c(e){try{s(o.throw(e))}catch(e){a(e)}}function s(t){var n;t.done?e(t.value):(n=t.value,n instanceof r?n:new r((function(e){e(n)}))).then(i,c)}s((o=o.apply(t,n||[])).next())}));var t,n,r,o}(P).then((()=>{new i.ZP({vuetify:v.Z,store:P,el:"#App",render:e=>e(w)})}))},779:(e,t,n)=>{"undefined"!=typeof Reflect&&Reflect.getMetadata},9405:(e,t,n)=>{n.d(t,{Z:()=>r});const r=n(5803).ZP.extend().extend({name:"themeable",provide(){return{theme:this.themeableProvide}},inject:{theme:{default:{isDark:!1}}},props:{dark:{type:Boolean,default:null},light:{type:Boolean,default:null}},data:()=>({themeableProvide:{isDark:!1}}),computed:{appIsDark(){return this.$vuetify.theme.dark||!1},isDark(){return!0===this.dark||!0!==this.light&&this.theme.isDark},themeClasses(){return{"theme--dark":this.isDark,"theme--light":!this.isDark}},rootIsDark(){return!0===this.dark||!0!==this.light&&this.appIsDark},rootThemeClasses(){return{"theme--dark":this.rootIsDark,"theme--light":!this.rootIsDark}}},watch:{isDark:{handler(e,t){e!==t&&(this.themeableProvide.isDark=this.isDark)},immediate:!0}}})},9085:(e,t,n)=>{n.d(t,{d:()=>o});var r=n(5803);function o(e="value",t="input"){return r.ZP.extend({name:"toggleable",model:{prop:e,event:t},props:{[e]:{required:!1}},data(){return{isActive:!!this[e]}},watch:{[e](e){this.isActive=!!e},isActive(n){!!n!==this[e]&&this.$emit(t,n)}}})}o()},2377:(e,t,n)=>{n.d(t,{Do:()=>u,Ee:()=>p,XP:()=>l,ji:()=>i,kb:()=>c,qw:()=>o,uZ:()=>d,vO:()=>a});let r=!1;try{if("undefined"!=typeof window){const e=Object.defineProperty({},"passive",{get:()=>{r=!0}});window.addEventListener("testListener",e,e),window.removeEventListener("testListener",e,e)}}catch(e){console.warn(e)}function o(e,t,n){const r=t.length-1;if(r<0)return void 0===e?n:e;for(let o=0;o<r;o++){if(null==e)return n;e=e[t[o]]}return null==e||void 0===e[t[r]]?n:e[t[r]]}function a(e,t,n){return null!=e&&t&&"string"==typeof t?void 0!==e[t]?e[t]:o(e,(t=(t=t.replace(/\[(\w+)\]/g,".$1")).replace(/^\./,"")).split("."),n):n}function i(e,t){const n={};for(let r=0;r<t.length;r++){const o=t[r];void 0!==e[o]&&(n[o]=e[o])}return n}function c(e,t="px"){return null==e||""===e?void 0:isNaN(+e)?String(e):`${Number(e)}${t}`}function s(e){return null!==e&&"object"==typeof e}const u=Object.freeze({enter:13,tab:9,delete:46,esc:27,space:32,up:38,down:40,left:37,right:39,end:35,home:36,del:46,backspace:8,insert:45,pageup:33,pagedown:34,shift:16});function l(e){return Object.keys(e)}function d(e,t=0,n=1){return Math.max(t,Math.min(n,e))}function p(e={},t={}){for(const n in t){const r=e[n],o=t[n];s(r)&&s(o)?e[n]=p(r,o):e[n]=o}return e}}},n={};function r(e){var o=n[e];if(void 0!==o)return o.exports;var a=n[e]={exports:{}};return t[e].call(a.exports,a,a.exports,r),a.exports}r.m=t,e=[],r.O=(t,n,o,a)=>{if(!n){var i=1/0;for(l=0;l<e.length;l++){for(var[n,o,a]=e[l],c=!0,s=0;s<n.length;s++)(!1&a||i>=a)&&Object.keys(r.O).every((e=>r.O[e](n[s])))?n.splice(s--,1):(c=!1,a<i&&(i=a));if(c){e.splice(l--,1);var u=o();void 0!==u&&(t=u)}}return t}a=a||0;for(var l=e.length;l>0&&e[l-1][2]>a;l--)e[l]=e[l-1];e[l]=[n,o,a]},r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},r.d=(e,t)=>{for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e={356:0};r.O.j=t=>0===e[t];var t=(t,n)=>{var o,a,[i,c,s]=n,u=0;if(i.some((t=>0!==e[t]))){for(o in c)r.o(c,o)&&(r.m[o]=c[o]);if(s)var l=s(r)}for(t&&t(n);u<i.length;u++)a=i[u],r.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return r.O(l)},n=self.webpackChunk=self.webpackChunk||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})();var o=r.O(void 0,[979,821,291],(()=>r(4145)));o=r.O(o)})();
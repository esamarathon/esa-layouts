(()=>{"use strict";var e,t={4803:(e,t,n)=>{var r=n(8138),o=n.n(r),a=n(829),i=n(5803),c=n(5925),s=n(8586),l=f("computed",s.rn),u=f("computed",s.Se),p=f("methods",s.nv),d=f("methods",s.OI);function f(e,t){function n(n,r){return(0,c.yh)((function(o,a){o[e]||(o[e]={});var i,c=((i={})[a]=n,i);o[e][a]=void 0!==r?t(r,c)[a]:t(c)[a]}))}return function(e,t){if("string"==typeof t){var r=t,o=e;return n(r,void 0)(o,r)}return n(e,function(e){var t=e&&e.namespace;if("string"==typeof t)return"/"!==t[t.length-1]?t+"/":t}(t))}}var g=n(4170),m=function(e,t,n,r){var o,a=arguments.length,i=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,n,r);else for(var c=e.length-1;c>=0;c--)(o=e[c])&&(i=(a<3?o(i):a>3?o(t,n,i):o(t,n))||i);return a>3&&i&&Object.defineProperty(t,n,i),i};const v=new a.SpeedcontrolUtilBrowser(nodecg),R={assetsReaderIntroductionImages:nodecg.Replicant("assets:reader-introduction-images"),bids:nodecg.Replicant("bids"),bigbuttonPlayerMap:nodecg.Replicant("bigbuttonPlayerMap"),commentators:nodecg.Replicant("commentators"),countdown:nodecg.Replicant("countdown"),currentRunDelay:nodecg.Replicant("currentRunDelay"),donationReader:nodecg.Replicant("donationReader"),donationsToRead:nodecg.Replicant("donationsToRead"),donationTotal:nodecg.Replicant("donationTotal"),donationTotalMilestones:nodecg.Replicant("donationTotalMilestones"),gameLayouts:nodecg.Replicant("gameLayouts"),obsData:nodecg.Replicant("obsData"),omnibar:nodecg.Replicant("omnibar"),otherStreamData:nodecg.Replicant("otherStreamData"),prizes:nodecg.Replicant("prizes"),readerIntroduction:nodecg.Replicant("readerIntroduction"),runDataActiveRun:v.runDataActiveRun,runDataActiveRunSurrounding:v.runDataActiveRunSurrounding,runDataArray:v.runDataArray,serverTimestamp:nodecg.Replicant("serverTimestamp"),streamDeckData:nodecg.Replicant("streamDeckData"),timer:v.timer,ttsVoices:nodecg.Replicant("ttsVoices"),upcomingRunID:nodecg.Replicant("upcomingRunID"),videoPlayer:nodecg.Replicant("videoPlayer")};let y,h=class extends g.g4{constructor(){super(...arguments),this.reps={}}get repsTyped(){return this.reps}setState({name:e,val:t}){i.ZP.set(this.reps,e,o()(t))}setReplicant({name:e,val:t}){i.ZP.set(this.reps,e,o()(t)),R[e].value=o()(t)}};m([g.mm],h.prototype,"setState",null),m([g.mm],h.prototype,"setReplicant",null),h=m([(0,g.Yl)({name:"ReplicantModule",namespaced:!0})],h),function(e,t){function n(t){return function(n,r){if("string"==typeof r){var o=r,a=n;return t(o,{namespace:e})(a,o)}var i=n,c=function(e,t){var n={};return[e,t].forEach((function(e){Object.keys(e).forEach((function(t){n[t]=e[t]}))})),n}(r||{},{namespace:e});return t(i,c)}}n(l),n(u),n(d),n(p)}("ReplicantModule"),n(4485),n(4807),n(7023),n(5654),n(779),n(8793);var x=function(e,t,n,r){var o,a=arguments.length,i=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,n,r);else for(var c=e.length-1;c>=0;c--)(o=e[c])&&(i=(a<3?o(i):a>3?o(t,n,i):o(t,n))||i);return a>3&&i&&Object.defineProperty(t,n,i),i};i.ZP.use(s.ZP);let b=class extends g.g4{constructor(){super(...arguments),this.nextRun=null}get reps(){return this.context.rootState.ReplicantModule.reps}setNextRun(e){i.ZP.set(this,"nextRun",e)}};x([g.mm],b.prototype,"setNextRun",null),b=x([(0,g.Yl)({name:"OurModule"})],b);const w=new s.yh({strict:!1,state:{},modules:{ReplicantModule:h,OurModule:b}}),P=w,O=(0,g.rT)(b,w),_=nodecg.bundleConfig;let j=class extends i.ZP{constructor(){super(...arguments),this.getRunTotalPlayers=a.SpeedcontrolUtilBrowser.getRunTotalPlayers,this.zoom=`calc(${_.obs.canvasResolution.height}/1080)`}get nextRun(){return O.nextRun}formPlayerNamesStr(e){return e.teams.map((e=>e.name||e.players.map((e=>e.name)).join(", "))).join(" vs. ")||"N/A"}};j=function(e,t,n,r){var o,a=arguments.length,i=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,n,r);else for(var c=e.length-1;c>=0;c--)(o=e[c])&&(i=(a<3?o(i):a>3?o(t,n,i):o(t,n))||i);return a>3&&i&&Object.defineProperty(t,n,i),i}([c.ZP],j);const D=j,S=(0,n(5440).Z)(D,(function(){var e=this,t=e._self._c;return e._self._setupProxy,t("div",{style:{width:"1920px",height:"1080px",position:"fixed",zoom:e.zoom},attrs:{id:"IntermissionPlayer"}},[t("div",{staticClass:"Fixed",style:{left:"209px",top:"25px",width:"1503px",height:"845px","background-color":"black"}}),e._v(" "),t("div",{staticClass:"Fixed Flex UpcomingBar",style:{left:"25px",top:"895px",width:"1870px",height:"80px"}},[t("div",{staticClass:"Flex Header",style:{color:"white","text-transform":"uppercase",height:"100%",padding:"0 25px","font-size":"45px","font-weight":500}},[e._v("\n      Setting Up For\n    ")]),e._v(" "),t("div",{staticClass:"Flex",style:{flex:1,"background-color":"rgba(0, 0, 0, 0.3)",height:"100%","font-size":"40px","justify-content":"space-between",padding:"0 27px"}},[e.nextRun?[e._v("\n        "+e._s(e.nextRun.game)+"\n        "),t("span",{staticClass:"RunInfoExtra",style:{"font-size":"33px"}},[e.nextRun.category?t("span",[e._v("\n            "+e._s(e.nextRun.category)+"\n          ")]):e._e(),e._v(" "),e.nextRun.system?t("span",[e._v("\n            "+e._s(e.nextRun.system)+"\n          ")]):e._e(),e._v(" "),e.getRunTotalPlayers(e.nextRun)>0?t("span",[e._v("\n            "+e._s(e.formPlayerNamesStr(e.nextRun))+"\n          ")]):e._e(),e._v(" "),e.nextRun.estimate?t("span",[e._v("\n            "+e._s(e.nextRun.estimate)+"\n          ")]):e._e()])]:[t("div",{staticClass:"Flex"},[e._v("\n          No More Runs\n          "),t("img",{style:{height:"1.4em","margin-left":"10px"},attrs:{src:n(3776)}})])]],2)])])}),[],!1,null,"667a5ea4",null).exports,T=new a.SpeedcontrolUtilBrowser(nodecg);(function(e){return t=this,n=void 0,o=function*(){Object.keys(R).forEach((t=>{R[t].on("change",(n=>{e.commit("ReplicantModule/setState",{name:t,val:n})}))})),yield NodeCG.waitForReplicants(...Object.keys(R).map((e=>R[e]))),y=(0,g.rT)(h,e)},new((r=void 0)||(r=Promise))((function(e,a){function i(e){try{s(o.next(e))}catch(e){a(e)}}function c(e){try{s(o.throw(e))}catch(e){a(e)}}function s(t){var n;t.done?e(t.value):(n=t.value,n instanceof r?n:new r((function(e){e(n)}))).then(i,c)}s((o=o.apply(t,n||[])).next())}));var t,n,r,o})(P).then((()=>{P.watch((()=>P.state.ReplicantModule.reps.upcomingRunID),(e=>{P.commit("setNextRun",function(e){var t;const n=T.findRunIndex(e);return n>=0&&null!==(t=T.getRunDataArray()[n])&&void 0!==t?t:null}(e))}),{immediate:!0}),new i.ZP({store:P,el:"#App",render:e=>e(S)})}))},779:(e,t,n)=>{"undefined"!=typeof Reflect&&Reflect.getMetadata},3776:(e,t,n)=>{e.exports=n.p+"img/esaOhNo-9591ab044d41ec3de73d.png"}},n={};function r(e){var o=n[e];if(void 0!==o)return o.exports;var a=n[e]={id:e,exports:{}};return t[e].call(a.exports,a,a.exports,r),a.exports}r.m=t,e=[],r.O=(t,n,o,a)=>{if(!n){var i=1/0;for(u=0;u<e.length;u++){for(var[n,o,a]=e[u],c=!0,s=0;s<n.length;s++)(!1&a||i>=a)&&Object.keys(r.O).every((e=>r.O[e](n[s])))?n.splice(s--,1):(c=!1,a<i&&(i=a));if(c){e.splice(u--,1);var l=o();void 0!==l&&(t=l)}}return t}a=a||0;for(var u=e.length;u>0&&e[u-1][2]>a;u--)e[u]=e[u-1];e[u]=[n,o,a]},r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},r.d=(e,t)=>{for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e;r.g.importScripts&&(e=r.g.location+"");var t=r.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var n=t.getElementsByTagName("script");n.length&&(e=n[n.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),r.p=e+"../"})(),(()=>{var e={633:0,455:0};r.O.j=t=>0===e[t];var t=(t,n)=>{var o,a,[i,c,s]=n,l=0;if(i.some((t=>0!==e[t]))){for(o in c)r.o(c,o)&&(r.m[o]=c[o]);if(s)var u=s(r)}for(t&&t(n);l<i.length;l++)a=i[l],r.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return r.O(u)},n=self.webpackChunk=self.webpackChunk||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})(),r.nc=void 0;var o=r.O(void 0,[835,455,797,485],(()=>r(4803)));o=r.O(o)})();
(()=>{"use strict";var e,t={231:(e,t,n)=>{var o=n(8138),r=n.n(o),a=n(829),i=n(5803),c=n(5925),s=n(8586),l=f("computed",s.rn),u=f("computed",s.Se),p=f("methods",s.nv),d=f("methods",s.OI);function f(e,t){function n(n,o){return(0,c.yh)((function(r,a){r[e]||(r[e]={});var i,c=((i={})[a]=n,i);r[e][a]=void 0!==o?t(o,c)[a]:t(c)[a]}))}return function(e,t){if("string"==typeof t){var o=t,r=e;return n(o,void 0)(r,o)}return n(e,function(e){var t=e&&e.namespace;if("string"==typeof t)return"/"!==t[t.length-1]?t+"/":t}(t))}}var g=n(4170),m=function(e,t,n,o){var r,a=arguments.length,i=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,n,o);else for(var c=e.length-1;c>=0;c--)(r=e[c])&&(i=(a<3?r(i):a>3?r(t,n,i):r(t,n))||i);return a>3&&i&&Object.defineProperty(t,n,i),i};const v=new a.SpeedcontrolUtilBrowser(nodecg),R={bids:nodecg.Replicant("bids"),commentators:nodecg.Replicant("commentators"),countdown:nodecg.Replicant("countdown"),currentRunDelay:nodecg.Replicant("currentRunDelay"),donationReader:nodecg.Replicant("donationReader"),donationsToRead:nodecg.Replicant("donationsToRead"),donationTotal:nodecg.Replicant("donationTotal"),donationTotalMilestones:nodecg.Replicant("donationTotalMilestones"),gameLayouts:nodecg.Replicant("gameLayouts"),obsData:nodecg.Replicant("obsData"),omnibar:nodecg.Replicant("omnibar"),otherStreamData:nodecg.Replicant("otherStreamData"),prizes:nodecg.Replicant("prizes"),runDataActiveRun:v.runDataActiveRun,runDataActiveRunSurrounding:v.runDataActiveRunSurrounding,runDataArray:v.runDataArray,serverTimestamp:nodecg.Replicant("serverTimestamp"),streamDeckData:nodecg.Replicant("streamDeckData"),ttsVoices:nodecg.Replicant("ttsVoices"),upcomingRunID:nodecg.Replicant("upcomingRunID"),videoPlayer:nodecg.Replicant("videoPlayer")};let h,y=class extends g.g4{constructor(){super(...arguments),this.reps={}}get repsTyped(){return this.reps}setState({name:e,val:t}){i.Z.set(this.reps,e,r()(t))}setReplicant({name:e,val:t}){i.Z.set(this.reps,e,r()(t)),R[e].value=r()(t)}};m([g.mm],y.prototype,"setState",null),m([g.mm],y.prototype,"setReplicant",null),y=m([(0,g.Yl)({name:"ReplicantModule",namespaced:!0})],y),function(e,t){function n(t){return function(n,o){if("string"==typeof o){var r=o,a=n;return t(r,{namespace:e})(a,r)}var i=n,c=function(e,t){var n={};return[e,t].forEach((function(e){Object.keys(e).forEach((function(t){n[t]=e[t]}))})),n}(o||{},{namespace:e});return t(i,c)}}n(l),n(u),n(d),n(p)}("ReplicantModule"),n(6479),n(4807),n(7023),n(5654),n(779),n(8793);var x=function(e,t,n,o){var r,a=arguments.length,i=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,n,o);else for(var c=e.length-1;c>=0;c--)(r=e[c])&&(i=(a<3?r(i):a>3?r(t,n,i):r(t,n))||i);return a>3&&i&&Object.defineProperty(t,n,i),i};i.Z.use(s.ZP);let b=class extends g.g4{constructor(){super(...arguments),this.nextRun=null}get reps(){return this.context.rootState.ReplicantModule.reps}setNextRun(e){i.Z.set(this,"nextRun",e)}};x([g.mm],b.prototype,"setNextRun",null),b=x([(0,g.Yl)({name:"OurModule"})],b);const w=new s.yh({strict:!1,state:{},modules:{ReplicantModule:y,OurModule:b}}),O=w,_=(0,g.rT)(b,w),j=nodecg.bundleConfig;let D=class extends i.Z{constructor(){super(...arguments),this.getRunTotalPlayers=a.SpeedcontrolUtilBrowser.getRunTotalPlayers,this.zoom=`calc(${j.obs.canvasResolution.height}/1080)`}get nextRun(){return _.nextRun}formPlayerNamesStr(e){return e.teams.map((e=>e.name||e.players.map((e=>e.name)).join(", "))).join(" vs. ")||"N/A"}};D=function(e,t,n,o){var r,a=arguments.length,i=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,n,o);else for(var c=e.length-1;c>=0;c--)(r=e[c])&&(i=(a<3?r(i):a>3?r(t,n,i):r(t,n))||i);return a>3&&i&&Object.defineProperty(t,n,i),i}([c.ZP],D);const S=D,P=(0,n(5440).Z)(S,(function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{style:{width:"1920px",height:"1080px",position:"fixed",zoom:e.zoom}},[o("div",{staticClass:"Fixed",style:{left:"209px",top:"25px",width:"1503px",height:"845px","background-color":"black"}}),e._v(" "),o("div",{staticClass:"Fixed Flex",style:{left:"25px",top:"895px",width:"1870px",height:"80px"}},[o("div",{staticClass:"Flex",style:{"background-color":"#41245b",color:"white","text-transform":"uppercase",height:"100%",padding:"0 25px","font-size":"45px","font-weight":500}},[e._v("\n      Setting Up For\n    ")]),e._v(" "),o("div",{staticClass:"Flex",style:{flex:1,"background-color":"rgba(0, 0, 0, 0.3)",height:"100%","font-size":"40px","justify-content":"space-between",padding:"0 27px"}},[e.nextRun?[e._v("\n        "+e._s(e.nextRun.game)+"\n        "),o("span",{staticClass:"RunInfoExtra",style:{"font-size":"33px"}},[e.nextRun.category?o("span",[e._v("\n            "+e._s(e.nextRun.category)+"\n          ")]):e._e(),e._v(" "),e.nextRun.system?o("span",[e._v("\n            "+e._s(e.nextRun.system)+"\n          ")]):e._e(),e._v(" "),e.getRunTotalPlayers(e.nextRun)>0?o("span",[e._v("\n            "+e._s(e.formPlayerNamesStr(e.nextRun))+"\n          ")]):e._e(),e._v(" "),e.nextRun.estimate?o("span",[e._v("\n            "+e._s(e.nextRun.estimate)+"\n          ")]):e._e()])]:[o("div",{staticClass:"Flex"},[e._v("\n          No More Runs\n          "),o("img",{style:{height:"1.4em","margin-left":"10px"},attrs:{src:n(3776)}})])]],2)])])}),[],!1,null,"6aa5b728",null).exports,T=new a.SpeedcontrolUtilBrowser(nodecg);(function(e){return t=this,n=void 0,r=function*(){Object.keys(R).forEach((t=>{R[t].on("change",(n=>{e.commit("ReplicantModule/setState",{name:t,val:n})}))})),yield NodeCG.waitForReplicants(...Object.keys(R).map((e=>R[e]))),h=(0,g.rT)(y,e)},new((o=void 0)||(o=Promise))((function(e,a){function i(e){try{s(r.next(e))}catch(e){a(e)}}function c(e){try{s(r.throw(e))}catch(e){a(e)}}function s(t){var n;t.done?e(t.value):(n=t.value,n instanceof o?n:new o((function(e){e(n)}))).then(i,c)}s((r=r.apply(t,n||[])).next())}));var t,n,o,r})(O).then((()=>{O.watch((()=>O.state.ReplicantModule.reps.upcomingRunID),(e=>{O.commit("setNextRun",function(e){var t;const n=T.findRunIndex(e);return n>=0&&null!==(t=T.getRunDataArray()[n])&&void 0!==t?t:null}(e))}),{immediate:!0}),new i.Z({store:O,el:"#App",render:e=>e(P)})}))},779:(e,t,n)=>{"undefined"!=typeof Reflect&&Reflect.getMetadata},3776:(e,t,n)=>{e.exports=n.p+"img/esaOhNo-9591ab044d41ec3de73d.png"}},n={};function o(e){var r=n[e];if(void 0!==r)return r.exports;var a=n[e]={id:e,exports:{}};return t[e].call(a.exports,a,a.exports,o),a.exports}o.m=t,e=[],o.O=(t,n,r,a)=>{if(!n){var i=1/0;for(u=0;u<e.length;u++){for(var[n,r,a]=e[u],c=!0,s=0;s<n.length;s++)(!1&a||i>=a)&&Object.keys(o.O).every((e=>o.O[e](n[s])))?n.splice(s--,1):(c=!1,a<i&&(i=a));if(c){e.splice(u--,1);var l=r();void 0!==l&&(t=l)}}return t}a=a||0;for(var u=e.length;u>0&&e[u-1][2]>a;u--)e[u]=e[u-1];e[u]=[n,r,a]},o.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return o.d(t,{a:t}),t},o.d=(e,t)=>{for(var n in t)o.o(t,n)&&!o.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},o.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e;o.g.importScripts&&(e=o.g.location+"");var t=o.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var n=t.getElementsByTagName("script");n.length&&(e=n[n.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),o.p=e+"../"})(),(()=>{var e={633:0,155:0};o.O.j=t=>0===e[t];var t=(t,n)=>{var r,a,[i,c,s]=n,l=0;if(i.some((t=>0!==e[t]))){for(r in c)o.o(c,r)&&(o.m[r]=c[r]);if(s)var u=s(o)}for(t&&t(n);l<i.length;l++)a=i[l],o.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return o.O(u)},n=self.webpackChunk=self.webpackChunk||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})();var r=o.O(void 0,[835,155,797,479],(()=>o(231)));r=o.O(r)})();
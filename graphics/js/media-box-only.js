(()=>{"use strict";var e,t={9648:(e,t,n)=>{n.d(t,{Cg:()=>g,Gg:()=>d,SW:()=>f});var o=n(2236),r=n.n(o),a=n(3072),c=n(6136),i=n(9844),s=function(e,t,n,o){var r,a=arguments.length,c=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(e,t,n,o);else for(var i=e.length-1;i>=0;i--)(r=e[i])&&(c=(a<3?r(c):a>3?r(t,n,c):r(t,n))||c);return a>3&&c&&Object.defineProperty(t,n,c),c},l=function(e,t,n,o){return new(n||(n=Promise))((function(r,a){function c(e){try{s(o.next(e))}catch(e){a(e)}}function i(e){try{s(o.throw(e))}catch(e){a(e)}}function s(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(c,i)}s((o=o.apply(e,t||[])).next())}))};const u={assetsMediaBoxImages:nodecg.Replicant("assets:media-box-images"),countdown:nodecg.Replicant("countdown"),mediaBox:nodecg.Replicant("mediaBox"),prizes:nodecg.Replicant("prizes")};let p,d=class extends i.y6{constructor(){super(...arguments),this.reps={}}setState({name:e,val:t}){a.cp.set(this.reps,e,r()(t))}setReplicant({name:e,val:t}){a.cp.set(this.reps,e,r()(t)),u[e].value=r()(t)}};s([i.eU],d.prototype,"setState",null),s([i.eU],d.prototype,"setReplicant",null),d=s([(0,i.gB)({name:"ReplicantModule",namespaced:!0})],d);const f=(0,c.eK)("ReplicantModule");function g(e){return l(this,void 0,void 0,(function*(){Object.keys(u).forEach((t=>{u[t].on("change",(n=>{e.commit("ReplicantModule/setState",{name:t,val:n})}))})),yield NodeCG.waitForReplicants(...Object.keys(u).map((e=>u[e]))),p=(0,i.GM)(d,e)}))}},7480:(e,t,n)=>{n.d(t,{c:()=>l});var o=n(3072),r=n(4368),a=n(9844),c=n(9648);o.cp.use(r.cp);let i=class extends a.y6{get reps(){return this.context.rootState.ReplicantModule.reps}};i=function(e,t,n,o){var r,a=arguments.length,c=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(e,t,n,o);else for(var i=e.length-1;i>=0;i--)(r=e[i])&&(c=(a<3?r(c):a>3?r(t,n,c):r(t,n))||c);return a>3&&c&&Object.defineProperty(t,n,c),c}([(0,a.gB)({name:"OurModule"})],i);const s=new r.m_({strict:!1,state:{},modules:{ReplicantModule:c.Gg}}),l=s;(0,a.GM)(i,s)},1884:(e,t,n)=>{var o=n(4168),r=n.n(o),a=n(7940),c=n(3072),i=n(6136),s=n(9844),l=function(e,t,n,o){var r,a=arguments.length,c=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(e,t,n,o);else for(var i=e.length-1;i>=0;i--)(r=e[i])&&(c=(a<3?r(c):a>3?r(t,n,c):r(t,n))||c);return a>3&&c&&Object.defineProperty(t,n,c),c};const u=new a.SpeedcontrolUtilBrowser(nodecg),p={assetsDonationAlertAssets:nodecg.Replicant("assets:donation-alert-assets"),assetsIntermissionSlides:nodecg.Replicant("assets:intermission-slides"),assetsReaderIntroductionImages:nodecg.Replicant("assets:reader-introduction-images"),bids:nodecg.Replicant("bids"),bigbuttonPlayerMap:nodecg.Replicant("bigbuttonPlayerMap"),commentators:nodecg.Replicant("commentators"),countdown:nodecg.Replicant("countdown"),currentRunDelay:nodecg.Replicant("currentRunDelay"),donationAlerts:nodecg.Replicant("donationAlerts"),donationReader:nodecg.Replicant("donationReader"),donationsToRead:nodecg.Replicant("donationsToRead"),donationTotal:nodecg.Replicant("donationTotal"),donationTotalMilestones:nodecg.Replicant("donationTotalMilestones"),gameLayouts:nodecg.Replicant("gameLayouts"),intermissionSlides:nodecg.Replicant("intermissionSlides"),musicData:nodecg.Replicant("musicData"),obsData:nodecg.Replicant("obsData"),omnibar:nodecg.Replicant("omnibar"),otherStreamData:nodecg.Replicant("otherStreamData"),prizes:nodecg.Replicant("prizes"),readerIntroduction:nodecg.Replicant("readerIntroduction"),runDataActiveRun:u.runDataActiveRun,runDataActiveRunSurrounding:u.runDataActiveRunSurrounding,runDataArray:u.runDataArray,serverTimestamp:nodecg.Replicant("serverTimestamp"),streamDeckData:nodecg.Replicant("streamDeckData"),timer:u.timer,ttsVoices:nodecg.Replicant("ttsVoices"),upcomingRunID:nodecg.Replicant("upcomingRunID"),videoPlayer:nodecg.Replicant("videoPlayer")};let d,f=class extends s.y6{constructor(){super(...arguments),this.reps={}}get repsTyped(){return this.reps}setState({name:e,val:t}){c.cp.set(this.reps,e,r()(t))}setReplicant({name:e,val:t}){c.cp.set(this.reps,e,r()(t)),p[e].value=r()(t)}};l([s.eU],f.prototype,"setState",null),l([s.eU],f.prototype,"setReplicant",null),f=l([(0,s.gB)({name:"ReplicantModule",namespaced:!0})],f),(0,i.eK)("ReplicantModule");var g=n(9648),v=n(5096),m=n(884),y=n(4296);const h=(0,y.c)(m.c,v.a,v.M,!1,null,"6a5b5a40",null).exports;var R=n(7480);const b=h;n(3724);var w=n(1295);let x=class extends w.cr{};x=function(e,t,n,o){var r,a=arguments.length,c=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(e,t,n,o);else for(var i=e.length-1;i>=0;i--)(r=e[i])&&(c=(a<3?r(c):a>3?r(t,n,c):r(t,n))||c);return a>3&&c&&Object.defineProperty(t,n,c),c}([(0,w.Yl)({components:{MediaBox:b}})],x);const O=x,j=(0,y.c)(O,(function(){var e=this,t=e._self._c;return e._self._setupProxy,t("div",[t("div",{attrs:{id:"Background"}}),e._v(" "),t("div",{staticClass:"Flex",style:{"flex-direction":"column"},attrs:{id:"Layout"}},[t("media-box",{style:{left:"0px",top:"0px",width:"100vw",height:"100vh",padding:"0 200px","box-sizing":"border-box"},attrs:{"font-size":130}})],1)])}),[],!1,null,null,null).exports;var M=n(4368);c.cp.use(M.cp);let D=class extends s.y6{get reps(){return this.context.rootState.ReplicantModule.reps}};D=function(e,t,n,o){var r,a=arguments.length,c=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(e,t,n,o);else for(var i=e.length-1;i>=0;i--)(r=e[i])&&(c=(a<3?r(c):a>3?r(t,n,c):r(t,n))||c);return a>3&&c&&Object.defineProperty(t,n,c),c}([(0,s.gB)({name:"OurModule"})],D);const S=new M.m_({strict:!1,state:{},modules:{ReplicantModule:f,OurModule:D}}),P=S;(0,s.GM)(D,S);(function(e){return t=this,n=void 0,r=function*(){Object.keys(p).forEach((t=>{p[t].on("change",(n=>{e.commit("ReplicantModule/setState",{name:t,val:n})}))})),yield NodeCG.waitForReplicants(...Object.keys(p).map((e=>p[e]))),d=(0,s.GM)(f,e)},new((o=void 0)||(o=Promise))((function(e,a){function c(e){try{s(r.next(e))}catch(e){a(e)}}function i(e){try{s(r.throw(e))}catch(e){a(e)}}function s(t){var n;t.done?e(t.value):(n=t.value,n instanceof o?n:new o((function(e){e(n)}))).then(c,i)}s((r=r.apply(t,n||[])).next())}));var t,n,o,r})(P).then((()=>{return e=void 0,t=void 0,o=function*(){yield function(){return e=this,t=void 0,o=function*(){yield(0,g.Cg)(R.c)},new((n=void 0)||(n=Promise))((function(r,a){function c(e){try{s(o.next(e))}catch(e){a(e)}}function i(e){try{s(o.throw(e))}catch(e){a(e)}}function s(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(c,i)}s((o=o.apply(e,t||[])).next())}));var e,t,n,o}(),new c.cp({store:P,el:"#App",render:e=>e(j)})},new((n=void 0)||(n=Promise))((function(r,a){function c(e){try{s(o.next(e))}catch(e){a(e)}}function i(e){try{s(o.throw(e))}catch(e){a(e)}}function s(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(c,i)}s((o=o.apply(e,t||[])).next())}));var e,t,n,o}))},8316:(e,t,n)=>{n.d(t,{eK:()=>l});var o=n(2240),r=n(4368),a=u("computed",r.ys),c=u("computed",r.gV),i=u("methods",r.ae),s=u("methods",r.sR);function l(e,t){function n(t){return function(n,o){if("string"==typeof o){var r=o,a=n;return t(r,{namespace:e})(a,r)}var c=n,i=function(e,t){var n={};return[e,t].forEach((function(e){Object.keys(e).forEach((function(t){n[t]=e[t]}))})),n}(o||{},{namespace:e});return t(c,i)}}return t?(console.warn("[vuex-class] passing the 2nd argument to `namespace` function is deprecated. pass only namespace string instead."),n(t)):{State:n(a),Getter:n(c),Mutation:n(s),Action:n(i)}}function u(e,t){function n(n,r){return(0,o.eA)((function(o,a){o[e]||(o[e]={});var c,i=((c={})[a]=n,c);o[e][a]=void 0!==r?t(r,i)[a]:t(i)[a]}))}return function(e,t){if("string"==typeof t){var o=t,r=e;return n(o,void 0)(r,o)}return n(e,function(e){var t=e&&e.namespace;if("string"==typeof t)return"/"!==t[t.length-1]?t+"/":t}(t))}}},6136:(e,t,n)=>{n.d(t,{eK:()=>o.eK});var o=n(8316)}},n={};function o(e){var r=n[e];if(void 0!==r)return r.exports;var a=n[e]={id:e,exports:{}};return t[e].call(a.exports,a,a.exports,o),a.exports}o.m=t,e=[],o.O=(t,n,r,a)=>{if(!n){var c=1/0;for(u=0;u<e.length;u++){for(var[n,r,a]=e[u],i=!0,s=0;s<n.length;s++)(!1&a||c>=a)&&Object.keys(o.O).every((e=>o.O[e](n[s])))?n.splice(s--,1):(i=!1,a<c&&(c=a));if(i){e.splice(u--,1);var l=r();void 0!==l&&(t=l)}}return t}a=a||0;for(var u=e.length;u>0&&e[u-1][2]>a;u--)e[u]=e[u-1];e[u]=[n,r,a]},o.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return o.d(t,{a:t}),t},o.d=(e,t)=>{for(var n in t)o.o(t,n)&&!o.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},o.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e;o.g.importScripts&&(e=o.g.location+"");var t=o.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var n=t.getElementsByTagName("script");if(n.length)for(var r=n.length-1;r>-1&&!e;)e=n[r--].src}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),o.p=e+"../"})(),(()=>{var e={284:0,872:0};o.O.j=t=>0===e[t];var t=(t,n)=>{var r,a,[c,i,s]=n,l=0;if(c.some((t=>0!==e[t]))){for(r in i)o.o(i,r)&&(o.m[r]=i[r]);if(s)var u=s(o)}for(t&&t(n);l<c.length;l++)a=c[l],o.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return o.O(u)},n=self.webpackChunk=self.webpackChunk||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})(),o.nc=void 0;var r=o.O(void 0,[528,872,472,724,168],(()=>o(1884)));r=o.O(r)})();
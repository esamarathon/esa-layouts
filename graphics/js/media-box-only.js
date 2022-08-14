(()=>{"use strict";var e,t={2875:(e,t,n)=>{n.d(t,{Nz:()=>p,np:()=>d,rl:()=>f});var o=n(9299),r=n.n(o),a=n(5803),c=n(708),i=n(4170),l=function(e,t,n,o){var r,a=arguments.length,c=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(e,t,n,o);else for(var i=e.length-1;i>=0;i--)(r=e[i])&&(c=(a<3?r(c):a>3?r(t,n,c):r(t,n))||c);return a>3&&c&&Object.defineProperty(t,n,c),c};const s={assetsMediaBoxImages:nodecg.Replicant("assets:media-box-images"),countdown:nodecg.Replicant("countdown"),mediaBox:nodecg.Replicant("mediaBox"),prizes:nodecg.Replicant("prizes")};let u,d=class extends i.g4{constructor(){super(...arguments),this.reps={}}setState({name:e,val:t}){a.ZP.set(this.reps,e,r()(t))}setReplicant({name:e,val:t}){a.ZP.set(this.reps,e,r()(t)),s[e].value=r()(t)}};l([i.mm],d.prototype,"setState",null),l([i.mm],d.prototype,"setReplicant",null),d=l([(0,i.Yl)({name:"ReplicantModule",namespaced:!0})],d);const p=(0,c.uD)("ReplicantModule");function f(e){return t=this,n=void 0,r=function*(){Object.keys(s).forEach((t=>{s[t].on("change",(n=>{e.commit("ReplicantModule/setState",{name:t,val:n})}))})),yield NodeCG.waitForReplicants(...Object.keys(s).map((e=>s[e]))),u=(0,i.rT)(d,e)},new((o=void 0)||(o=Promise))((function(e,a){function c(e){try{l(r.next(e))}catch(e){a(e)}}function i(e){try{l(r.throw(e))}catch(e){a(e)}}function l(t){var n;t.done?e(t.value):(n=t.value,n instanceof o?n:new o((function(e){e(n)}))).then(c,i)}l((r=r.apply(t,n||[])).next())}));var t,n,o,r}},9839:(e,t,n)=>{n.d(t,{Z:()=>s});var o=n(5803),r=n(8586),a=n(4170),c=n(2875);o.ZP.use(r.ZP);let i=class extends a.g4{get reps(){return this.context.rootState.ReplicantModule.reps}};i=function(e,t,n,o){var r,a=arguments.length,c=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(e,t,n,o);else for(var i=e.length-1;i>=0;i--)(r=e[i])&&(c=(a<3?r(c):a>3?r(t,n,c):r(t,n))||c);return a>3&&c&&Object.defineProperty(t,n,c),c}([(0,a.Yl)({name:"OurModule"})],i);const l=new r.yh({strict:!1,state:{},modules:{ReplicantModule:c.np}}),s=l;(0,a.rT)(i,l)},2075:(e,t,n)=>{var o=n(8138),r=n.n(o),a=n(829),c=n(5803),i=n(708),l=n(4170),s=function(e,t,n,o){var r,a=arguments.length,c=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(e,t,n,o);else for(var i=e.length-1;i>=0;i--)(r=e[i])&&(c=(a<3?r(c):a>3?r(t,n,c):r(t,n))||c);return a>3&&c&&Object.defineProperty(t,n,c),c};const u=new a.SpeedcontrolUtilBrowser(nodecg),d={assetsReaderIntroductionImages:nodecg.Replicant("assets:reader-introduction-images"),bids:nodecg.Replicant("bids"),bigbuttonPlayerMap:nodecg.Replicant("bigbuttonPlayerMap"),commentators:nodecg.Replicant("commentators"),countdown:nodecg.Replicant("countdown"),currentRunDelay:nodecg.Replicant("currentRunDelay"),donationReader:nodecg.Replicant("donationReader"),donationsToRead:nodecg.Replicant("donationsToRead"),donationTotal:nodecg.Replicant("donationTotal"),donationTotalMilestones:nodecg.Replicant("donationTotalMilestones"),gameLayouts:nodecg.Replicant("gameLayouts"),obsData:nodecg.Replicant("obsData"),omnibar:nodecg.Replicant("omnibar"),otherStreamData:nodecg.Replicant("otherStreamData"),prizes:nodecg.Replicant("prizes"),readerIntroduction:nodecg.Replicant("readerIntroduction"),runDataActiveRun:u.runDataActiveRun,runDataActiveRunSurrounding:u.runDataActiveRunSurrounding,runDataArray:u.runDataArray,serverTimestamp:nodecg.Replicant("serverTimestamp"),streamDeckData:nodecg.Replicant("streamDeckData"),timer:u.timer,ttsVoices:nodecg.Replicant("ttsVoices"),upcomingRunID:nodecg.Replicant("upcomingRunID"),videoPlayer:nodecg.Replicant("videoPlayer")};let p,f=class extends l.g4{constructor(){super(...arguments),this.reps={}}get repsTyped(){return this.reps}setState({name:e,val:t}){c.ZP.set(this.reps,e,r()(t))}setReplicant({name:e,val:t}){c.ZP.set(this.reps,e,r()(t)),d[e].value=r()(t)}};s([l.mm],f.prototype,"setState",null),s([l.mm],f.prototype,"setReplicant",null),f=s([(0,l.Yl)({name:"ReplicantModule",namespaced:!0})],f),(0,i.uD)("ReplicantModule");var v=n(2875),g=n(6077),m=n(499),y=n(5440);const h=(0,y.Z)(m.Z,g.s,g.x,!1,null,"35f8c604",null).exports;var R=n(9839);const b=h;n(4485);var w=n(2659);let x=class extends w.w3{};x=function(e,t,n,o){var r,a=arguments.length,c=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(e,t,n,o);else for(var i=e.length-1;i>=0;i--)(r=e[i])&&(c=(a<3?r(c):a>3?r(t,n,c):r(t,n))||c);return a>3&&c&&Object.defineProperty(t,n,c),c}([(0,w.wA)({components:{MediaBox:b}})],x);const O=x,P=(0,y.Z)(O,(function(){var e=this,t=e._self._c;return e._self._setupProxy,t("div",[t("div",{attrs:{id:"Background"}}),e._v(" "),t("div",{staticClass:"Flex",style:{"flex-direction":"column"},attrs:{id:"Layout"}},[t("media-box",{style:{left:"0px",top:"0px",width:"100vw",height:"100vh",padding:"0 200px","box-sizing":"border-box"},attrs:{"font-size":130}})],1)])}),[],!1,null,null,null).exports;var j=n(8586);c.ZP.use(j.ZP);let D=class extends l.g4{get reps(){return this.context.rootState.ReplicantModule.reps}};D=function(e,t,n,o){var r,a=arguments.length,c=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(e,t,n,o);else for(var i=e.length-1;i>=0;i--)(r=e[i])&&(c=(a<3?r(c):a>3?r(t,n,c):r(t,n))||c);return a>3&&c&&Object.defineProperty(t,n,c),c}([(0,l.Yl)({name:"OurModule"})],D);const M=new j.yh({strict:!1,state:{},modules:{ReplicantModule:f,OurModule:D}}),S=M;(0,l.rT)(D,M);(function(e){return t=this,n=void 0,r=function*(){Object.keys(d).forEach((t=>{d[t].on("change",(n=>{e.commit("ReplicantModule/setState",{name:t,val:n})}))})),yield NodeCG.waitForReplicants(...Object.keys(d).map((e=>d[e]))),p=(0,l.rT)(f,e)},new((o=void 0)||(o=Promise))((function(e,a){function c(e){try{l(r.next(e))}catch(e){a(e)}}function i(e){try{l(r.throw(e))}catch(e){a(e)}}function l(t){var n;t.done?e(t.value):(n=t.value,n instanceof o?n:new o((function(e){e(n)}))).then(c,i)}l((r=r.apply(t,n||[])).next())}));var t,n,o,r})(S).then((()=>{return e=void 0,t=void 0,o=function*(){yield function(){return e=this,t=void 0,o=function*(){yield(0,v.rl)(R.Z)},new((n=void 0)||(n=Promise))((function(r,a){function c(e){try{l(o.next(e))}catch(e){a(e)}}function i(e){try{l(o.throw(e))}catch(e){a(e)}}function l(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(c,i)}l((o=o.apply(e,t||[])).next())}));var e,t,n,o}(),new c.ZP({store:S,el:"#App",render:e=>e(P)})},new((n=void 0)||(n=Promise))((function(r,a){function c(e){try{l(o.next(e))}catch(e){a(e)}}function i(e){try{l(o.throw(e))}catch(e){a(e)}}function l(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(c,i)}l((o=o.apply(e,t||[])).next())}));var e,t,n,o}))},2659:(e,t,n)=>{n.d(t,{fI:()=>a.f,w3:()=>o.ZP,wA:()=>r.ZP});var o=n(5803),r=n(5925),a=(n(4807),n(7023),n(5654),n(6070));n(8793)},5243:(e,t,n)=>{n.d(t,{uD:()=>s});var o=n(5925),r=n(8586),a=u("computed",r.rn),c=u("computed",r.Se),i=u("methods",r.nv),l=u("methods",r.OI);function s(e,t){function n(t){return function(n,o){if("string"==typeof o){var r=o,a=n;return t(r,{namespace:e})(a,r)}var c=n,i=function(e,t){var n={};return[e,t].forEach((function(e){Object.keys(e).forEach((function(t){n[t]=e[t]}))})),n}(o||{},{namespace:e});return t(c,i)}}return t?(console.warn("[vuex-class] passing the 2nd argument to `namespace` function is deprecated. pass only namespace string instead."),n(t)):{State:n(a),Getter:n(c),Mutation:n(l),Action:n(i)}}function u(e,t){function n(n,r){return(0,o.yh)((function(o,a){o[e]||(o[e]={});var c,i=((c={})[a]=n,c);o[e][a]=void 0!==r?t(r,i)[a]:t(i)[a]}))}return function(e,t){if("string"==typeof t){var o=t,r=e;return n(o,void 0)(r,o)}return n(e,function(e){var t=e&&e.namespace;if("string"==typeof t)return"/"!==t[t.length-1]?t+"/":t}(t))}}},708:(e,t,n)=>{n.d(t,{uD:()=>o.uD});var o=n(5243)}},n={};function o(e){var r=n[e];if(void 0!==r)return r.exports;var a=n[e]={id:e,exports:{}};return t[e].call(a.exports,a,a.exports,o),a.exports}o.m=t,e=[],o.O=(t,n,r,a)=>{if(!n){var c=1/0;for(u=0;u<e.length;u++){for(var[n,r,a]=e[u],i=!0,l=0;l<n.length;l++)(!1&a||c>=a)&&Object.keys(o.O).every((e=>o.O[e](n[l])))?n.splice(l--,1):(i=!1,a<c&&(c=a));if(i){e.splice(u--,1);var s=r();void 0!==s&&(t=s)}}return t}a=a||0;for(var u=e.length;u>0&&e[u-1][2]>a;u--)e[u]=e[u-1];e[u]=[n,r,a]},o.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return o.d(t,{a:t}),t},o.d=(e,t)=>{for(var n in t)o.o(t,n)&&!o.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},o.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e;o.g.importScripts&&(e=o.g.location+"");var t=o.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var n=t.getElementsByTagName("script");n.length&&(e=n[n.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),o.p=e+"../"})(),(()=>{var e={234:0,455:0};o.O.j=t=>0===e[t];var t=(t,n)=>{var r,a,[c,i,l]=n,s=0;if(c.some((t=>0!==e[t]))){for(r in i)o.o(i,r)&&(o.m[r]=i[r]);if(l)var u=l(o)}for(t&&t(n);s<c.length;s++)a=c[s],o.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return o.O(u)},n=self.webpackChunk=self.webpackChunk||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})(),o.nc=void 0;var r=o.O(void 0,[835,455,797,485,453],(()=>o(2075)));r=o.O(r)})();
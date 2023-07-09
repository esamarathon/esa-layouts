(()=>{"use strict";var e,t={5326:(e,t,n)=>{var o=n(8138),r=n.n(o),a=n(829),i=n(5803),c=n(5925),s=n(8586),l=f("computed",s.rn),d=f("computed",s.Se),u=f("methods",s.nv),p=f("methods",s.OI);function f(e,t){function n(n,o){return(0,c.yh)((function(r,a){r[e]||(r[e]={});var i,c=((i={})[a]=n,i);r[e][a]=void 0!==o?t(o,c)[a]:t(c)[a]}))}return function(e,t){if("string"==typeof t){var o=t,r=e;return n(o,void 0)(r,o)}return n(e,function(e){var t=e&&e.namespace;if("string"==typeof t)return"/"!==t[t.length-1]?t+"/":t}(t))}}var v=n(4170),y=function(e,t,n,o){var r,a=arguments.length,i=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,n,o);else for(var c=e.length-1;c>=0;c--)(r=e[c])&&(i=(a<3?r(i):a>3?r(t,n,i):r(t,n))||i);return a>3&&i&&Object.defineProperty(t,n,i),i};const g=new a.SpeedcontrolUtilBrowser(nodecg),R={assetsIntermissionSlides:nodecg.Replicant("assets:intermission-slides"),assetsReaderIntroductionImages:nodecg.Replicant("assets:reader-introduction-images"),bids:nodecg.Replicant("bids"),bigbuttonPlayerMap:nodecg.Replicant("bigbuttonPlayerMap"),commentators:nodecg.Replicant("commentators"),countdown:nodecg.Replicant("countdown"),currentRunDelay:nodecg.Replicant("currentRunDelay"),donationReader:nodecg.Replicant("donationReader"),donationsToRead:nodecg.Replicant("donationsToRead"),donationTotal:nodecg.Replicant("donationTotal"),donationTotalMilestones:nodecg.Replicant("donationTotalMilestones"),gameLayouts:nodecg.Replicant("gameLayouts"),intermissionSlides:nodecg.Replicant("intermissionSlides"),obsData:nodecg.Replicant("obsData"),omnibar:nodecg.Replicant("omnibar"),otherStreamData:nodecg.Replicant("otherStreamData"),prizes:nodecg.Replicant("prizes"),readerIntroduction:nodecg.Replicant("readerIntroduction"),runDataActiveRun:g.runDataActiveRun,runDataActiveRunSurrounding:g.runDataActiveRunSurrounding,runDataArray:g.runDataArray,serverTimestamp:nodecg.Replicant("serverTimestamp"),streamDeckData:nodecg.Replicant("streamDeckData"),timer:g.timer,ttsVoices:nodecg.Replicant("ttsVoices"),upcomingRunID:nodecg.Replicant("upcomingRunID"),videoPlayer:nodecg.Replicant("videoPlayer")};let m,h=class extends v.g4{constructor(){super(...arguments),this.reps={}}get repsTyped(){return this.reps}setState({name:e,val:t}){i.ZP.set(this.reps,e,r()(t))}setReplicant({name:e,val:t}){i.ZP.set(this.reps,e,r()(t)),R[e].value=r()(t)}};y([v.mm],h.prototype,"setState",null),y([v.mm],h.prototype,"setReplicant",null),h=y([(0,v.Yl)({name:"ReplicantModule",namespaced:!0})],h);const b=function(e,t){function n(t){return function(n,o){if("string"==typeof o){var r=o,a=n;return t(r,{namespace:e})(a,r)}var i=n,c=function(e,t){var n={};return[e,t].forEach((function(e){Object.keys(e).forEach((function(t){n[t]=e[t]}))})),n}(o||{},{namespace:e});return t(i,c)}}return{State:n(l),Getter:n(d),Mutation:n(p),Action:n(u)}}("ReplicantModule");n(4807),n(7023),n(5654);var O=n(779);function P(e){return void 0===e&&(e={}),function(t,n){(0,O.l)(e,t,n),(0,c.yh)((function(t,n){(t.props||(t.props={}))[n]=e}))(t,n)}}n(8793);var w=function(e,t,n,o){var r,a=arguments.length,i=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,n,o);else for(var c=e.length-1;c>=0;c--)(r=e[c])&&(i=(a<3?r(i):a>3?r(t,n,i):r(t,n))||i);return a>3&&i&&Object.defineProperty(t,n,i),i};let x=class extends i.ZP{};w([P(Object)],x.prototype,"data",void 0),w([P({default:0})],x.prototype,"index",void 0),x=w([c.ZP],x);const D=x;var _=n(5440);const j=(0,_.Z)(D,(function(){var e=this,t=e._self._c;return e._self._setupProxy,t("div",{style:{padding:"20px 0","border-top":"3px solid white"}},[t("div",{style:{"font-size":"35px"}},[e._v("\n    #"+e._s(e.index+1)+": "+e._s(e.data.name)+" donated $"+e._s(e.data.amount.toFixed(2))+"\n  ")]),e._v(" "),e.data.comment?t("div",{style:{"font-size":"25px"}},[e._v("\n    "+e._s(e.data.comment)+"\n  ")]):e._e()])}),[],!1,null,null,null).exports;var T=function(e,t,n,o){var r,a=arguments.length,i=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,n,o);else for(var c=e.length-1;c>=0;c--)(r=e[c])&&(i=(a<3?r(i):a>3?r(t,n,i):r(t,n))||i);return a>3&&i&&Object.defineProperty(t,n,i),i};let M=class extends i.ZP{};T([b.State((e=>e.reps.donationsToRead))],M.prototype,"donationsToRead",void 0),M=T([(0,c.ZP)({components:{Donation:j}})],M);const S=M,k=(0,_.Z)(S,(function(){var e=this,t=e._self._c;return e._self._setupProxy,t("div",[t("h1",[e._v("Unread Donations")]),e._v(" "),e.donationsToRead.length?e._e():t("div",{style:{"font-size":"30px","font-style":"italic"}},[e._v("\n    None right now!\n  ")]),e._v(" "),e._l(e.donationsToRead,(function(e,n){return t("donation",{key:e.id,attrs:{data:e,index:n}})}))],2)}),[],!1,null,null,null).exports;i.ZP.use(s.ZP);let Z=class extends v.g4{get reps(){return this.context.rootState.ReplicantModule.reps}};Z=function(e,t,n,o){var r,a=arguments.length,i=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,n,o);else for(var c=e.length-1;c>=0;c--)(r=e[c])&&(i=(a<3?r(i):a>3?r(t,n,i):r(t,n))||i);return a>3&&i&&Object.defineProperty(t,n,i),i}([(0,v.Yl)({name:"OurModule"})],Z);const A=new s.yh({strict:!1,state:{},modules:{ReplicantModule:h,OurModule:Z}}),I=A;(0,v.rT)(Z,A),function(e){return t=this,n=void 0,r=function*(){Object.keys(R).forEach((t=>{R[t].on("change",(n=>{e.commit("ReplicantModule/setState",{name:t,val:n})}))})),yield NodeCG.waitForReplicants(...Object.keys(R).map((e=>R[e]))),m=(0,v.rT)(h,e)},new((o=void 0)||(o=Promise))((function(e,a){function i(e){try{s(r.next(e))}catch(e){a(e)}}function c(e){try{s(r.throw(e))}catch(e){a(e)}}function s(t){var n;t.done?e(t.value):(n=t.value,n instanceof o?n:new o((function(e){e(n)}))).then(i,c)}s((r=r.apply(t,n||[])).next())}));var t,n,o,r}(I).then((()=>{new i.ZP({store:I,el:"#App",render:e=>e(k)})}))},779:(e,t,n)=>{n.d(t,{l:()=>r});var o="undefined"!=typeof Reflect&&void 0!==Reflect.getMetadata;function r(e,t,n){if(o&&!Array.isArray(e)&&"function"!=typeof e&&!e.hasOwnProperty("type")&&void 0===e.type){var r=Reflect.getMetadata("design:type",t,n);r!==Object&&(e.type=r)}}}},n={};function o(e){var r=n[e];if(void 0!==r)return r.exports;var a=n[e]={exports:{}};return t[e].call(a.exports,a,a.exports,o),a.exports}o.m=t,e=[],o.O=(t,n,r,a)=>{if(!n){var i=1/0;for(d=0;d<e.length;d++){for(var[n,r,a]=e[d],c=!0,s=0;s<n.length;s++)(!1&a||i>=a)&&Object.keys(o.O).every((e=>o.O[e](n[s])))?n.splice(s--,1):(c=!1,a<i&&(i=a));if(c){e.splice(d--,1);var l=r();void 0!==l&&(t=l)}}return t}a=a||0;for(var d=e.length;d>0&&e[d-1][2]>a;d--)e[d]=e[d-1];e[d]=[n,r,a]},o.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return o.d(t,{a:t}),t},o.d=(e,t)=>{for(var n in t)o.o(t,n)&&!o.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},o.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={614:0};o.O.j=t=>0===e[t];var t=(t,n)=>{var r,a,[i,c,s]=n,l=0;if(i.some((t=>0!==e[t]))){for(r in c)o.o(c,r)&&(o.m[r]=c[r]);if(s)var d=s(o)}for(t&&t(n);l<i.length;l++)a=i[l],o.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return o.O(d)},n=self.webpackChunk=self.webpackChunk||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})();var r=o.O(void 0,[835,797],(()=>o(5326)));r=o.O(r)})();
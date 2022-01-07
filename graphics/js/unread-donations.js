(()=>{"use strict";var e,t={3528:(e,t,n)=>{var o=n(8138),r=n.n(o),a=n(829),c=n(5803),i=n(5925),l=n(8586),s=f("computed",l.rn),u=f("computed",l.Se),d=f("methods",l.nv),p=f("methods",l.OI);function f(e,t){function n(n,o){return(0,i.yh)((function(r,a){r[e]||(r[e]={});var c,i=((c={})[a]=n,c);r[e][a]=void 0!==o?t(o,i)[a]:t(i)[a]}))}return function(e,t){if("string"==typeof t){var o=t,r=e;return n(o,void 0)(r,o)}return n(e,function(e){var t=e&&e.namespace;if("string"==typeof t)return"/"!==t[t.length-1]?t+"/":t}(t))}}var v=n(4170),y=function(e,t,n,o){var r,a=arguments.length,c=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(e,t,n,o);else for(var i=e.length-1;i>=0;i--)(r=e[i])&&(c=(a<3?r(c):a>3?r(t,n,c):r(t,n))||c);return a>3&&c&&Object.defineProperty(t,n,c),c};const g=new a.SpeedcontrolUtilBrowser(nodecg),R={bids:nodecg.Replicant("bids"),commentators:nodecg.Replicant("commentators"),countdown:nodecg.Replicant("countdown"),currentRunDelay:nodecg.Replicant("currentRunDelay"),donationReader:nodecg.Replicant("donationReader"),donationsToRead:nodecg.Replicant("donationsToRead"),donationTotal:nodecg.Replicant("donationTotal"),donationTotalMilestones:nodecg.Replicant("donationTotalMilestones"),gameLayouts:nodecg.Replicant("gameLayouts"),obsData:nodecg.Replicant("obsData"),omnibarPin:nodecg.Replicant("omnibarPin"),runDataActiveRunSurrounding:g.runDataActiveRunSurrounding,runDataArray:g.runDataArray,serverTimestamp:nodecg.Replicant("serverTimestamp"),streamDeckData:nodecg.Replicant("streamDeckData"),ttsVoices:nodecg.Replicant("ttsVoices"),upcomingRunID:nodecg.Replicant("upcomingRunID"),videoPlayer:nodecg.Replicant("videoPlayer")};let h,m=class extends v.g4{constructor(){super(...arguments),this.reps={}}get repsTyped(){return this.reps}setState({name:e,val:t}){c.Z.set(this.reps,e,r()(t))}setReplicant({name:e,val:t}){c.Z.set(this.reps,e,r()(t)),R[e].value=r()(t)}};y([v.mm],m.prototype,"setState",null),y([v.mm],m.prototype,"setReplicant",null),m=y([(0,v.Yl)({name:"ReplicantModule",namespaced:!0})],m);const b=function(e,t){function n(t){return function(n,o){if("string"==typeof o){var r=o,a=n;return t(r,{namespace:e})(a,r)}var c=n,i=function(e,t){var n={};return[e,t].forEach((function(e){Object.keys(e).forEach((function(t){n[t]=e[t]}))})),n}(o||{},{namespace:e});return t(c,i)}}return{State:n(s),Getter:n(u),Mutation:n(p),Action:n(d)}}("ReplicantModule");n(4807),n(7023),n(5654);var O=n(779);function w(e){return void 0===e&&(e={}),function(t,n){(0,O.l)(e,t,n),(0,i.yh)((function(t,n){(t.props||(t.props={}))[n]=e}))(t,n)}}n(8793);var j=function(e,t,n,o){var r,a=arguments.length,c=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(e,t,n,o);else for(var i=e.length-1;i>=0;i--)(r=e[i])&&(c=(a<3?r(c):a>3?r(t,n,c):r(t,n))||c);return a>3&&c&&Object.defineProperty(t,n,c),c};let x=class extends c.Z{};j([w(Object)],x.prototype,"data",void 0),j([w({default:0})],x.prototype,"index",void 0),x=j([i.ZP],x);const D=x;var _=n(5440);const P=(0,_.Z)(D,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{style:{padding:"20px 0","border-top":"3px solid white"}},[n("div",{style:{"font-size":"35px"}},[e._v("\n    #"+e._s(e.index+1)+": "+e._s(e.data.name)+" donated $"+e._s(e.data.amount.toFixed(2))+"\n  ")]),e._v(" "),e.data.comment?n("div",{style:{"font-size":"25px"}},[e._v("\n    "+e._s(e.data.comment)+"\n  ")]):e._e()])}),[],!1,null,null,null).exports;var T=function(e,t,n,o){var r,a=arguments.length,c=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(e,t,n,o);else for(var i=e.length-1;i>=0;i--)(r=e[i])&&(c=(a<3?r(c):a>3?r(t,n,c):r(t,n))||c);return a>3&&c&&Object.defineProperty(t,n,c),c};let M=class extends c.Z{};T([b.State((e=>e.reps.donationsToRead))],M.prototype,"donationsToRead",void 0),M=T([(0,i.ZP)({components:{Donation:P}})],M);const k=M,Z=(0,_.Z)(k,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("h1",[e._v("Unread Donations")]),e._v(" "),e.toRead.length?e._e():n("div",{style:{"font-size":"30px","font-style":"italic"}},[e._v("\n    None right now!\n  ")]),e._v(" "),e._l(e.toRead,(function(e,t){return n("donation",{key:e.id,attrs:{data:e,index:t}})}))],2)}),[],!1,null,null,null).exports;c.Z.use(l.ZP);let S=class extends v.g4{get reps(){return this.context.rootState.ReplicantModule.reps}};S=function(e,t,n,o){var r,a=arguments.length,c=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(e,t,n,o);else for(var i=e.length-1;i>=0;i--)(r=e[i])&&(c=(a<3?r(c):a>3?r(t,n,c):r(t,n))||c);return a>3&&c&&Object.defineProperty(t,n,c),c}([(0,v.Yl)({name:"OurModule"})],S);const A=new l.yh({strict:!1,state:{},modules:{ReplicantModule:m,OurModule:S}}),E=A;(0,v.rT)(S,A),function(e){return t=this,n=void 0,r=function*(){Object.keys(R).forEach((t=>{R[t].on("change",(n=>{e.commit("ReplicantModule/setState",{name:t,val:n})}))})),yield NodeCG.waitForReplicants(...Object.keys(R).map((e=>R[e]))),h=(0,v.rT)(m,e)},new((o=void 0)||(o=Promise))((function(e,a){function c(e){try{l(r.next(e))}catch(e){a(e)}}function i(e){try{l(r.throw(e))}catch(e){a(e)}}function l(t){var n;t.done?e(t.value):(n=t.value,n instanceof o?n:new o((function(e){e(n)}))).then(c,i)}l((r=r.apply(t,n||[])).next())}));var t,n,o,r}(E).then((()=>{new c.Z({store:E,el:"#App",render:e=>e(Z)})}))},779:(e,t,n)=>{n.d(t,{l:()=>r});var o="undefined"!=typeof Reflect&&void 0!==Reflect.getMetadata;function r(e,t,n){if(o&&!Array.isArray(e)&&"function"!=typeof e&&!e.hasOwnProperty("type")&&void 0===e.type){var r=Reflect.getMetadata("design:type",t,n);r!==Object&&(e.type=r)}}}},n={};function o(e){var r=n[e];if(void 0!==r)return r.exports;var a=n[e]={exports:{}};return t[e].call(a.exports,a,a.exports,o),a.exports}o.m=t,e=[],o.O=(t,n,r,a)=>{if(!n){var c=1/0;for(u=0;u<e.length;u++){for(var[n,r,a]=e[u],i=!0,l=0;l<n.length;l++)(!1&a||c>=a)&&Object.keys(o.O).every((e=>o.O[e](n[l])))?n.splice(l--,1):(i=!1,a<c&&(c=a));if(i){e.splice(u--,1);var s=r();void 0!==s&&(t=s)}}return t}a=a||0;for(var u=e.length;u>0&&e[u-1][2]>a;u--)e[u]=e[u-1];e[u]=[n,r,a]},o.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return o.d(t,{a:t}),t},o.d=(e,t)=>{for(var n in t)o.o(t,n)&&!o.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},o.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={614:0};o.O.j=t=>0===e[t];var t=(t,n)=>{var r,a,[c,i,l]=n,s=0;if(c.some((t=>0!==e[t]))){for(r in i)o.o(i,r)&&(o.m[r]=i[r]);if(l)var u=l(o)}for(t&&t(n);s<c.length;s++)a=c[s],o.o(e,a)&&e[a]&&e[a][0](),e[c[s]]=0;return o.O(u)},n=self.webpackChunk=self.webpackChunk||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})();var r=o.O(void 0,[835,797],(()=>o(3528)));r=o.O(r)})();
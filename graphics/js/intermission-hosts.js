(()=>{"use strict";var e,t={5605:(e,t,n)=>{var o=n(9804),r=n.n(o),a=n(7795),i=n(9340),s=n(305),c=n(3578),p=f("computed",c.aH),l=f("computed",c.L8),d=f("methods",c.i0),u=f("methods",c.PY);function f(e,t){function n(n,o){return(0,s.u1)((function(r,a){r[e]||(r[e]={});var i,s=((i={})[a]=n,i);r[e][a]=void 0!==o?t(o,s)[a]:t(s)[a]}))}return function(e,t){if("string"==typeof t){var o=t,r=e;return n(o,void 0)(r,o)}return n(e,function(e){var t=e&&e.namespace;if("string"==typeof t)return"/"!==t[t.length-1]?t+"/":t}(t))}}var g=n(899),y=function(e,t,n,o){var r,a=arguments.length,i=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,n,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(i=(a<3?r(i):a>3?r(t,n,i):r(t,n))||i);return a>3&&i&&Object.defineProperty(t,n,i),i};const m=new a.SpeedcontrolUtilBrowser(nodecg),v={assetsDonationAlertAssets:nodecg.Replicant("assets:donation-alert-assets"),assetsIntermissionSlides:nodecg.Replicant("assets:intermission-slides"),assetsReaderIntroductionImages:nodecg.Replicant("assets:reader-introduction-images"),bids:nodecg.Replicant("bids"),bigbuttonPlayerMap:nodecg.Replicant("bigbuttonPlayerMap"),commentators:nodecg.Replicant("commentators"),commentatorsNew:nodecg.Replicant("commentatorsNew"),countdown:nodecg.Replicant("countdown"),currentRunDelay:nodecg.Replicant("currentRunDelay"),donationAlerts:nodecg.Replicant("donationAlerts"),donationReader:nodecg.Replicant("donationReader"),donationReaderNew:nodecg.Replicant("donationReaderNew"),donationsToRead:nodecg.Replicant("donationsToRead"),donationTotal:nodecg.Replicant("donationTotal"),donationTotalMilestones:nodecg.Replicant("donationTotalMilestones"),gameLayouts:nodecg.Replicant("gameLayouts"),intermissionSlides:nodecg.Replicant("intermissionSlides"),musicData:nodecg.Replicant("musicData"),obsData:nodecg.Replicant("obsData"),omnibar:nodecg.Replicant("omnibar"),otherStreamData:nodecg.Replicant("otherStreamData"),prizes:nodecg.Replicant("prizes"),readerIntroduction:nodecg.Replicant("readerIntroduction"),runDataActiveRun:m.runDataActiveRun,runDataActiveRunSurrounding:m.runDataActiveRunSurrounding,runDataArray:m.runDataArray,serverTimestamp:nodecg.Replicant("serverTimestamp"),streamDeckData:nodecg.Replicant("streamDeckData"),timer:m.timer,ttsVoices:nodecg.Replicant("ttsVoices"),upcomingRunID:nodecg.Replicant("upcomingRunID"),videoPlayer:nodecg.Replicant("videoPlayer")};let x,h=class extends g.hw{constructor(){super(...arguments),this.reps={}}get repsTyped(){return this.reps}setState({name:e,val:t}){i.Ay.set(this.reps,e,r()(t))}setReplicant({name:e,val:t}){i.Ay.set(this.reps,e,r()(t)),v[e].value=r()(t)}};y([g.sM],h.prototype,"setState",null),y([g.sM],h.prototype,"setReplicant",null),h=y([(0,g.nV)({name:"ReplicantModule",namespaced:!0})],h),function(e,t){function n(t){return function(n,o){if("string"==typeof o){var r=o,a=n;return t(r,{namespace:e})(a,r)}var i=n,s=function(e,t){var n={};return[e,t].forEach((function(e){Object.keys(e).forEach((function(t){n[t]=e[t]}))})),n}(o||{},{namespace:e});return t(i,s)}}n(p),n(l),n(u),n(d)}("ReplicantModule"),n(7378),n(5716),n(9906),n(2633);var R=n(3889);function b(e){return void 0===e&&(e={}),function(t,n){(0,R.A)(e,t,n),(0,s.u1)((function(t,n){(t.props||(t.props={}))[n]=e}))(t,n)}}n(5757);var w=function(e,t,n,o){var r,a=arguments.length,i=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,n,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(i=(a<3?r(i):a>3?r(t,n,i):r(t,n))||i);return a>3&&i&&Object.defineProperty(t,n,i),i};let _=class extends i.Ay{};w([b({type:String,required:!0})],_.prototype,"type",void 0),w([b({type:String,required:!0})],_.prototype,"name",void 0),w([b({type:String,required:!1})],_.prototype,"pronouns",void 0),w([b({type:String,required:!1})],_.prototype,"country",void 0),_=w([s.Ay],_);const O=_;var A=n(7270);const S=(0,A.A)(O,(function(){var e=this,t=e._self._c;return e._self._setupProxy,t("div",{staticClass:"Flex bg--darkpurple text--barlowc text--offwhite",style:{"box-sizing":"border-box",height:"50px","font-size":"25px",padding:"4px"}},[t("div",{staticClass:"Flex bg--halfgradient",style:{"box-sizing":"border-box",height:"100%","padding-right":e.pronouns?"8px":"14px","padding-left":"6px","border-radius":"4px 0 0 4px","clip-path":"\n        polygon(0% 0%, calc(100% - 6px) 0, 100% 50%,\n        calc(100% - 6px) 100%, 0% 100%)\n      ",overflow:"hidden"}},["player"===e.type?t("img",{staticClass:"Icon",style:{filter:"invert(1) drop-shadow(2px 2px 2px black)"},attrs:{src:n(985)}}):"commentator"===e.type?t("img",{staticClass:"Icon",attrs:{src:n(7979)}}):"reader"===e.type?t("img",{staticClass:"Icon",attrs:{src:n(2654)}}):e._e(),e._v(" "),t("div",{staticClass:"text--shadow",style:{overflow:"hidden","text-overflow":"ellipsis","margin-top":"-0.12em"}},[e._v("\n      "+e._s(e.name)+"\n    ")]),e._v(" "),e.pronouns?t("div",{staticClass:"bg--darkgrey",style:{"text-transform":"lowercase","border-radius":"6px 0 0 6px",padding:"4px 10px 4px 6px","margin-left":"7px","font-size":"0.7em","clip-path":"\n          polygon(0% 0%, calc(100% - 5px) 0, 100% 50%,\n          calc(100% - 5px) 100%, 0% 100%)\n        "}},[t("div",{style:{"margin-top":"-0.17em"}},[e._v("\n        "+e._s(e.pronouns)+"\n      ")])]):e._e()]),e._v(" "),t("div",{directives:[{name:"show",rawName:"v-show",value:e.country,expression:"country"}],staticClass:"Flex bg--darkgrey",style:{height:"100%","font-size":"0.9em","margin-left":"2px",padding:"0 8px 0 12px","border-radius":"0 4px 4px 0","clip-path":"polygon(100% 0, 100% 50%, 100% 100%, 0% 100%, 6px 50%, 0% 0%)"}},[e.country?t("img",{style:{height:"1em","border-radius":"4px","margin-left":"2px",filter:"\n          drop-shadow(0 -2px 0 white)\n          drop-shadow(0 2px 0 white)\n          drop-shadow(-2px 0 0 white)\n          drop-shadow(2px 0 0 white)\n        "},attrs:{src:`/bundles/esa-layouts/flags/${e.country}.png`}}):e._e()])])}),[],!1,null,"427e9688",null).exports,P=nodecg.bundleConfig;var j=function(e,t,n,o){var r,a=arguments.length,i=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,n,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(i=(a<3?r(i):a>3?r(t,n,i):r(t,n))||i);return a>3&&i&&Object.defineProperty(t,n,i),i};i.Ay.use(c.Ay);let D=class extends g.hw{constructor(){super(...arguments),this.nextRun=null}get reps(){return this.context.rootState.ReplicantModule.reps}setNextRun(e){i.Ay.set(this,"nextRun",e)}};j([g.sM],D.prototype,"setNextRun",null),D=j([(0,g.nV)({name:"OurModule"})],D);const M=new c.il({strict:!1,state:{},modules:{ReplicantModule:h,OurModule:D}}),C=M,T=(0,g.f_)(D,M);let I=class extends i.Ay{constructor(){super(...arguments),this.getRunTotalPlayers=a.SpeedcontrolUtilBrowser.getRunTotalPlayers,this.zoom=`calc(${P.obs.canvasResolution.height}/1080)`}get donationReader(){return x.repsTyped.donationReaderNew}get nextRun(){return T.nextRun}formPlayerNamesStr(e){return e.teams.map((e=>e.name||e.players.map((e=>e.name)).join(", "))).join(" vs. ")||"N/A"}};I=function(e,t,n,o){var r,a=arguments.length,i=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,n,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(i=(a<3?r(i):a>3?r(t,n,i):r(t,n))||i);return a>3&&i&&Object.defineProperty(t,n,i),i}([(0,s.Ay)({components:{ParticipantInfo:S}})],I);const N=I,k=(0,A.A)(N,(function(){var e=this,t=e._self._c;return e._self._setupProxy,t("div",{staticClass:"Layout FlexColumn",style:{"box-sizing":"border-box",height:"1000px","justify-content":"flex-end","align-items":"center",padding:"50px",gap:"20px",zoom:e.zoom},attrs:{id:"IntermissionHosts"}},[e.donationReader?t("participant-info",{style:{zoom:"1.5"},attrs:{type:"reader",name:e.donationReader.name,pronouns:e.donationReader.pronouns,country:e.donationReader.country}}):e._e(),e._v(" "),t("div",{staticClass:"Flex UpcomingBar",style:{width:"100%",height:"80px"}},[t("div",{staticClass:"Flex Header",style:{color:"white","text-transform":"uppercase",height:"100%",padding:"0 25px","font-size":"45px","font-weight":500}},[e._v("\n      Setting Up For\n    ")]),e._v(" "),t("div",{staticClass:"Flex",style:{flex:1,"background-color":"rgba(0, 0, 0, 0.3)",height:"100%","font-size":"40px","justify-content":"space-between",padding:"0 27px"}},[e.nextRun?[e._v("\n        "+e._s(e.nextRun.game)+"\n        "),t("span",{staticClass:"RunInfoExtra",style:{"font-size":"33px"}},[e.nextRun.category?t("span",[e._v("\n            "+e._s(e.nextRun.category)+"\n          ")]):e._e(),e._v(" "),e.nextRun.system?t("span",[e._v("\n            "+e._s(e.nextRun.system)+"\n          ")]):e._e(),e._v(" "),e.getRunTotalPlayers(e.nextRun)>0?t("span",[e._v("\n            "+e._s(e.formPlayerNamesStr(e.nextRun))+"\n          ")]):e._e(),e._v(" "),e.nextRun.estimate?t("span",[e._v("\n            "+e._s(e.nextRun.estimate)+"\n          ")]):e._e()])]:[t("div",{staticClass:"Flex"},[e._v("\n          No More Runs\n          "),t("img",{style:{height:"1.4em","margin-left":"10px"},attrs:{src:n(580)}})])]],2)])],1)}),[],!1,null,"62a034be",null).exports,z=new a.SpeedcontrolUtilBrowser(nodecg);(function(e){return t=this,n=void 0,r=function*(){Object.keys(v).forEach((t=>{v[t].on("change",(n=>{e.commit("ReplicantModule/setState",{name:t,val:n})}))})),yield NodeCG.waitForReplicants(...Object.keys(v).map((e=>v[e]))),x=(0,g.f_)(h,e)},new((o=void 0)||(o=Promise))((function(e,a){function i(e){try{c(r.next(e))}catch(e){a(e)}}function s(e){try{c(r.throw(e))}catch(e){a(e)}}function c(t){var n;t.done?e(t.value):(n=t.value,n instanceof o?n:new o((function(e){e(n)}))).then(i,s)}c((r=r.apply(t,n||[])).next())}));var t,n,o,r})(C).then((()=>{C.watch((()=>C.state.ReplicantModule.reps.upcomingRunID),(e=>{C.commit("setNextRun",function(e){var t;const n=z.findRunIndex(e);return n>=0&&null!==(t=z.getRunDataArray()[n])&&void 0!==t?t:null}(e))}),{immediate:!0}),new i.Ay({store:C,el:"#App",render:e=>e(k)})}))},3889:(e,t,n)=>{n.d(t,{A:()=>r});var o="undefined"!=typeof Reflect&&void 0!==Reflect.getMetadata;function r(e,t,n){if(o&&!Array.isArray(e)&&"function"!=typeof e&&!e.hasOwnProperty("type")&&void 0===e.type){var r=Reflect.getMetadata("design:type",t,n);r!==Object&&(e.type=r)}}},2654:(e,t,n)=>{e.exports=n.p+"img/ESALogo-b45c2d681be816f021ef.png"},7979:(e,t,n)=>{e.exports=n.p+"img/Mic-b7d53b758f04f73984d4.png"},985:(e,t,n)=>{e.exports=n.p+"img/PlayerIconSolo-3cb9bc626ac88f856ad4.png"},580:(e,t,n)=>{e.exports=n.p+"img/esaOhNo-9591ab044d41ec3de73d.png"}},n={};function o(e){var r=n[e];if(void 0!==r)return r.exports;var a=n[e]={id:e,exports:{}};return t[e].call(a.exports,a,a.exports,o),a.exports}o.m=t,e=[],o.O=(t,n,r,a)=>{if(!n){var i=1/0;for(l=0;l<e.length;l++){for(var[n,r,a]=e[l],s=!0,c=0;c<n.length;c++)(!1&a||i>=a)&&Object.keys(o.O).every((e=>o.O[e](n[c])))?n.splice(c--,1):(s=!1,a<i&&(i=a));if(s){e.splice(l--,1);var p=r();void 0!==p&&(t=p)}}return t}a=a||0;for(var l=e.length;l>0&&e[l-1][2]>a;l--)e[l]=e[l-1];e[l]=[n,r,a]},o.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return o.d(t,{a:t}),t},o.d=(e,t)=>{for(var n in t)o.o(t,n)&&!o.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},o.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e;o.g.importScripts&&(e=o.g.location+"");var t=o.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var n=t.getElementsByTagName("script");if(n.length)for(var r=n.length-1;r>-1&&(!e||!/^http(s?):/.test(e));)e=n[r--].src}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),o.p=e+"../"})(),(()=>{var e={121:0,935:0};o.O.j=t=>0===e[t];var t=(t,n)=>{var r,a,[i,s,c]=n,p=0;if(i.some((t=>0!==e[t]))){for(r in s)o.o(s,r)&&(o.m[r]=s[r]);if(c)var l=c(o)}for(t&&t(n);p<i.length;p++)a=i[p],o.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return o.O(l)},n=self.webpackChunk=self.webpackChunk||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})(),o.nc=void 0;var r=o.O(void 0,[537,342,935,378],(()=>o(5605)));r=o.O(r)})();
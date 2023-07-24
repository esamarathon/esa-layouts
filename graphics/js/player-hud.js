(()=>{"use strict";var e,t={1746:(e,t,n)=>{var a=n(8138),o=n.n(a),r=n(829),s=n(5803),i=n(5925),c=n(8586),l=p("computed",c.rn),d=p("computed",c.Se),u=p("methods",c.nv),g=p("methods",c.OI);function p(e,t){function n(n,a){return(0,i.yh)((function(o,r){o[e]||(o[e]={});var s,i=((s={})[r]=n,s);o[e][r]=void 0!==a?t(a,i)[r]:t(i)[r]}))}return function(e,t){if("string"==typeof t){var a=t,o=e;return n(a,void 0)(o,a)}return n(e,function(e){var t=e&&e.namespace;if("string"==typeof t)return"/"!==t[t.length-1]?t+"/":t}(t))}}var v=n(4170),f=function(e,t,n,a){var o,r=arguments.length,s=r<3?t:null===a?a=Object.getOwnPropertyDescriptor(t,n):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,n,a);else for(var i=e.length-1;i>=0;i--)(o=e[i])&&(s=(r<3?o(s):r>3?o(t,n,s):o(t,n))||s);return r>3&&s&&Object.defineProperty(t,n,s),s};const h=new r.SpeedcontrolUtilBrowser(nodecg),m={assetsIntermissionSlides:nodecg.Replicant("assets:intermission-slides"),assetsReaderIntroductionImages:nodecg.Replicant("assets:reader-introduction-images"),bids:nodecg.Replicant("bids"),bigbuttonPlayerMap:nodecg.Replicant("bigbuttonPlayerMap"),commentators:nodecg.Replicant("commentators"),countdown:nodecg.Replicant("countdown"),currentRunDelay:nodecg.Replicant("currentRunDelay"),donationReader:nodecg.Replicant("donationReader"),donationsToRead:nodecg.Replicant("donationsToRead"),donationTotal:nodecg.Replicant("donationTotal"),donationTotalMilestones:nodecg.Replicant("donationTotalMilestones"),gameLayouts:nodecg.Replicant("gameLayouts"),intermissionSlides:nodecg.Replicant("intermissionSlides"),obsData:nodecg.Replicant("obsData"),omnibar:nodecg.Replicant("omnibar"),otherStreamData:nodecg.Replicant("otherStreamData"),prizes:nodecg.Replicant("prizes"),readerIntroduction:nodecg.Replicant("readerIntroduction"),runDataActiveRun:h.runDataActiveRun,runDataActiveRunSurrounding:h.runDataActiveRunSurrounding,runDataArray:h.runDataArray,serverTimestamp:nodecg.Replicant("serverTimestamp"),streamDeckData:nodecg.Replicant("streamDeckData"),timer:h.timer,ttsVoices:nodecg.Replicant("ttsVoices"),upcomingRunID:nodecg.Replicant("upcomingRunID"),videoPlayer:nodecg.Replicant("videoPlayer")};let y,R=class extends v.g4{constructor(){super(...arguments),this.reps={}}get repsTyped(){return this.reps}setState({name:e,val:t}){s.ZP.set(this.reps,e,o()(t))}setReplicant({name:e,val:t}){s.ZP.set(this.reps,e,o()(t)),m[e].value=o()(t)}};f([v.mm],R.prototype,"setState",null),f([v.mm],R.prototype,"setReplicant",null),R=f([(0,v.Yl)({name:"ReplicantModule",namespaced:!0})],R);const b=function(e,t){function n(t){return function(n,a){if("string"==typeof a){var o=a,r=n;return t(o,{namespace:e})(r,o)}var s=n,i=function(e,t){var n={};return[e,t].forEach((function(e){Object.keys(e).forEach((function(t){n[t]=e[t]}))})),n}(a||{},{namespace:e});return t(s,i)}}return{State:n(l),Getter:n(d),Mutation:n(g),Action:n(u)}}("ReplicantModule");n(4807),n(7023),n(5654),n(779),n(8793);var D=function(e,t,n,a){var o,r=arguments.length,s=r<3?t:null===a?a=Object.getOwnPropertyDescriptor(t,n):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,n,a);else for(var i=e.length-1;i>=0;i--)(o=e[i])&&(s=(r<3?o(s):r>3?o(t,n,s):o(t,n))||s);return r>3&&s&&Object.defineProperty(t,n,s),s};let _=class extends s.ZP{constructor(){super(...arguments),this.donationsToReadTO=0,this.tagScanned=!1,this.scannedData=null,this.therunggMessage=null}get largestDonation(){return`$${this.donationsToRead.reduce(((e,t)=>e>t.amount?e:t.amount),0).toFixed(2)}`}get tagDisplayName(){return this.scannedData?this.scannedData.raw.pronouns?`${this.scannedData.user.displayName} (${this.scannedData.raw.pronouns})`:this.scannedData.user.displayName:""}get buttonId(){var e;return(null===(e=this.scannedData)||void 0===e?void 0:e.flagcarrier.id)||""}get alertClass(){if(this.tagScanned)switch(this.tagScanned){case"success_comm":case"success_player":return"TagSuccess";case"fail_player":return"TagFail";default:return"TagNothing"}return"message"===this.streamDeckData.playerHUDTriggerType?"MessageToRead":this.donationsToRead.length?"DonationsToRead":""}mounted(){nodecg.listenFor("bigbuttonTagScanned",(({state:e,data:t})=>{window.clearTimeout(this.messageTimeout),this.therunggMessage=null,this.tagScanned=e||!0,this.scannedData=t,this.messageTimeout=window.setTimeout((()=>{this.tagScanned=!1,this.scannedData=null}),7e3)})),nodecg.listenFor("therunggMessage",(e=>{window.clearTimeout(this.messageTimeout),this.tagScanned=!1,this.scannedData=null,this.therunggMessage=e,this.messageTimeout=window.setTimeout((()=>{this.therunggMessage=null}),1e4)}))}};D([b.State((e=>e.reps.timer))],_.prototype,"timer",void 0),D([b.State((e=>e.reps.donationsToRead))],_.prototype,"donationsToRead",void 0),D([b.State((e=>e.reps.streamDeckData))],_.prototype,"streamDeckData",void 0),_=D([i.ZP],_);const w=_,T=(0,n(5440).Z)(w,(function(){var e=this,t=e._self._c;return e._self._setupProxy,t("div",{staticClass:"Flex",style:{"flex-direction":"column",width:"100vw",height:"100vh"}},[t("div",{class:`PlayerHUD Flex ${e.alertClass}`,style:{width:"100%","flex-grow":1,"flex-direction":"column","box-sizing":"border-box",padding:"0 5vw",transition:"background-color 1s","text-align":"center","font-size":"15vh"}},[e.therunggMessage?[t("span",{style:{"font-size":"0.6em"}},[e._v("therun.gg Message:")]),e._v("\n      "+e._s(e.therunggMessage)+"\n    ")]:e.tagScanned?["success_comm"===e.tagScanned?[t("div",[e._v("✔")]),e._v(" "),t("div",[t("span",{style:{"font-weight":600}},[e._v(e._s(e.tagDisplayName))]),e._v("\n          scanned in as commentator\n        ")])]:"success_player"===e.tagScanned?[t("div",[e._v("✔")]),e._v(" "),t("div",[t("span",{style:{"font-weight":600}},[e._v(e._s(e.tagDisplayName))]),e._v("\n          scanned in as player on\n          "),t("span",{style:{"white-space":"nowrap"}},[e._v("button "+e._s(e.buttonId)+"!")])])]:"fail_player"===e.tagScanned?[t("div",[e._v("❌")]),e._v(" "),t("div",[t("span",{style:{"font-weight":600}},[e._v(e._s(e.tagDisplayName))]),e._v("\n          cannot scan in as player on\n          "),t("span",{style:{"white-space":"nowrap"}},[e._v("button "+e._s(e.buttonId)+"!")])])]:[t("div",[e._v("❔")]),e._v(" "),t("div",[e._v("Tag was scanned but not needed")])]]:"message"===e.streamDeckData.playerHUDTriggerType?[e._v("\n      Any time\n      "),t("br"),e._v("for messages?\n    ")]:e.donationsToRead.length?[e._v("\n      Donations Pending:\n      "),t("br"),e._v(e._s(e.donationsToRead.length)+"\n      "),t("br"),e._v("Largest Unread Donation: "+e._s(e.largestDonation)+"\n    ")]:[e._v("\n      Nothing currently\n      "),t("br"),e._v("to be read\n    ")]],2),e._v(" "),t("div",{style:{background:"black",color:"white",width:"100%","text-align":"center","font-size":"15vh","padding-bottom":"2vh"}},[e._v("\n    "+e._s(e.timer.time)+"\n  ")])])}),[],!1,null,null,null).exports;s.ZP.use(c.ZP);let S=class extends v.g4{get reps(){return this.context.rootState.ReplicantModule.reps}};S=function(e,t,n,a){var o,r=arguments.length,s=r<3?t:null===a?a=Object.getOwnPropertyDescriptor(t,n):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,n,a);else for(var i=e.length-1;i>=0;i--)(o=e[i])&&(s=(r<3?o(s):r>3?o(t,n,s):o(t,n))||s);return r>3&&s&&Object.defineProperty(t,n,s),s}([(0,v.Yl)({name:"OurModule"})],S);const O=new c.yh({strict:!1,state:{},modules:{ReplicantModule:R,OurModule:S}}),x=O;(0,v.rT)(S,O),function(e){return t=this,n=void 0,o=function*(){Object.keys(m).forEach((t=>{m[t].on("change",(n=>{e.commit("ReplicantModule/setState",{name:t,val:n})}))})),yield NodeCG.waitForReplicants(...Object.keys(m).map((e=>m[e]))),y=(0,v.rT)(R,e)},new((a=void 0)||(a=Promise))((function(e,r){function s(e){try{c(o.next(e))}catch(e){r(e)}}function i(e){try{c(o.throw(e))}catch(e){r(e)}}function c(t){var n;t.done?e(t.value):(n=t.value,n instanceof a?n:new a((function(e){e(n)}))).then(s,i)}c((o=o.apply(t,n||[])).next())}));var t,n,a,o}(x).then((()=>{new s.ZP({store:x,el:"#App",render:e=>e(T)})}))},779:(e,t,n)=>{"undefined"!=typeof Reflect&&Reflect.getMetadata}},n={};function a(e){var o=n[e];if(void 0!==o)return o.exports;var r=n[e]={exports:{}};return t[e].call(r.exports,r,r.exports,a),r.exports}a.m=t,e=[],a.O=(t,n,o,r)=>{if(!n){var s=1/0;for(d=0;d<e.length;d++){for(var[n,o,r]=e[d],i=!0,c=0;c<n.length;c++)(!1&r||s>=r)&&Object.keys(a.O).every((e=>a.O[e](n[c])))?n.splice(c--,1):(i=!1,r<s&&(s=r));if(i){e.splice(d--,1);var l=o();void 0!==l&&(t=l)}}return t}r=r||0;for(var d=e.length;d>0&&e[d-1][2]>r;d--)e[d]=e[d-1];e[d]=[n,o,r]},a.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return a.d(t,{a:t}),t},a.d=(e,t)=>{for(var n in t)a.o(t,n)&&!a.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},a.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),a.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={823:0,699:0};a.O.j=t=>0===e[t];var t=(t,n)=>{var o,r,[s,i,c]=n,l=0;if(s.some((t=>0!==e[t]))){for(o in i)a.o(i,o)&&(a.m[o]=i[o]);if(c)var d=c(a)}for(t&&t(n);l<s.length;l++)r=s[l],a.o(e,r)&&e[r]&&e[r][0](),e[r]=0;return a.O(d)},n=self.webpackChunk=self.webpackChunk||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})();var o=a.O(void 0,[835,699,797],(()=>a(1746)));o=a.O(o)})();
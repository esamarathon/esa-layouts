(()=>{"use strict";var e,t={1773:(e,t,n)=>{var s=n(8138),a=n.n(s),i=n(829),r=n(5803),o=n(708),l=n(4170),c=function(e,t,n,s){var a,i=arguments.length,r=i<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,n):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,n,s);else for(var o=e.length-1;o>=0;o--)(a=e[o])&&(r=(i<3?a(r):i>3?a(t,n,r):a(t,n))||r);return i>3&&r&&Object.defineProperty(t,n,r),r};const d=new i.SpeedcontrolUtilBrowser(nodecg),u={assetsDonationAlertAssets:nodecg.Replicant("assets:donation-alert-assets"),assetsIntermissionSlides:nodecg.Replicant("assets:intermission-slides"),assetsReaderIntroductionImages:nodecg.Replicant("assets:reader-introduction-images"),bids:nodecg.Replicant("bids"),bigbuttonPlayerMap:nodecg.Replicant("bigbuttonPlayerMap"),commentators:nodecg.Replicant("commentators"),countdown:nodecg.Replicant("countdown"),currentRunDelay:nodecg.Replicant("currentRunDelay"),donationAlerts:nodecg.Replicant("donationAlerts"),donationReader:nodecg.Replicant("donationReader"),donationsToRead:nodecg.Replicant("donationsToRead"),donationTotal:nodecg.Replicant("donationTotal"),donationTotalMilestones:nodecg.Replicant("donationTotalMilestones"),gameLayouts:nodecg.Replicant("gameLayouts"),intermissionSlides:nodecg.Replicant("intermissionSlides"),musicData:nodecg.Replicant("musicData"),obsData:nodecg.Replicant("obsData"),omnibar:nodecg.Replicant("omnibar"),otherStreamData:nodecg.Replicant("otherStreamData"),prizes:nodecg.Replicant("prizes"),readerIntroduction:nodecg.Replicant("readerIntroduction"),runDataActiveRun:d.runDataActiveRun,runDataActiveRunSurrounding:d.runDataActiveRunSurrounding,runDataArray:d.runDataArray,serverTimestamp:nodecg.Replicant("serverTimestamp"),streamDeckData:nodecg.Replicant("streamDeckData"),timer:d.timer,ttsVoices:nodecg.Replicant("ttsVoices"),upcomingRunID:nodecg.Replicant("upcomingRunID"),videoPlayer:nodecg.Replicant("videoPlayer")};let p,h=class extends l.g4{constructor(){super(...arguments),this.reps={}}get repsTyped(){return this.reps}setState({name:e,val:t}){r.ZP.set(this.reps,e,a()(t))}setReplicant({name:e,val:t}){r.ZP.set(this.reps,e,a()(t)),u[e].value=a()(t)}};c([l.mm],h.prototype,"setState",null),c([l.mm],h.prototype,"setReplicant",null),h=c([(0,l.Yl)({name:"ReplicantModule",namespaced:!0})],h);const g=(0,o.uD)("ReplicantModule");var v=n(3687),m=n(690),f=n(6255);const y=f.Z;var b,_=n(7653),S=n(1954),R=n(5010),D=n(9405),w=n(2377),C=n(6248);!function(e){e.xSmall="12px",e.small="16px",e.default="24px",e.medium="28px",e.large="36px",e.xLarge="40px"}(b||(b={}));const k=(0,C.Z)(_.Z,S.Z,R.Z,D.Z).extend({name:"v-icon",props:{dense:Boolean,disabled:Boolean,left:Boolean,right:Boolean,size:[Number,String],tag:{type:String,required:!1,default:"i"}},computed:{medium:()=>!1,hasClickListener(){return Boolean(this.listeners$.click||this.listeners$["!click"])}},methods:{getIcon(){let e="";return this.$slots.default&&(e=this.$slots.default[0].text.trim()),(0,w.RB)(this,e)},getSize(){const e={xSmall:this.xSmall,small:this.small,medium:this.medium,large:this.large,xLarge:this.xLarge},t=(0,w.XP)(e).find((t=>e[t]));return t&&b[t]||(0,w.kb)(this.size)},getDefaultData(){return{staticClass:"v-icon notranslate",class:{"v-icon--disabled":this.disabled,"v-icon--left":this.left,"v-icon--link":this.hasClickListener,"v-icon--right":this.right,"v-icon--dense":this.dense},attrs:{"aria-hidden":!this.hasClickListener,disabled:this.hasClickListener&&this.disabled,type:this.hasClickListener?"button":void 0,...this.attrs$},on:this.listeners$}},getSvgWrapperData(){const e=this.getSize(),t={...this.getDefaultData(),style:e?{fontSize:e,height:e,width:e}:void 0};return this.applyColors(t),t},applyColors(e){e.class={...e.class,...this.themeClasses},this.setTextColor(this.color,e)},renderFontIcon(e,t){const n=[],s=this.getDefaultData();let a="material-icons";const i=e.indexOf("-"),r=i<=-1;r?n.push(e):(a=e.slice(0,i),function(e){return["fas","far","fal","fab","fad","fak"].some((t=>e.includes(t)))}(a)&&(a="")),s.class[a]=!0,s.class[e]=!r;const o=this.getSize();return o&&(s.style={fontSize:o}),this.applyColors(s),t(this.hasClickListener?"button":this.tag,s,n)},renderSvgIcon(e,t){const n={class:"v-icon__svg",attrs:{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",role:"img","aria-hidden":!0}},s=this.getSize();return s&&(n.style={fontSize:s,height:s,width:s}),t(this.hasClickListener?"button":"span",this.getSvgWrapperData(),[t("svg",n,[t("path",{attrs:{d:e}})])])},renderSvgIconComponent(e,t){const n={class:{"v-icon__component":!0}},s=this.getSize();s&&(n.style={fontSize:s,height:s,width:s}),this.applyColors(n);const a=e.component;return n.props=e.props,n.nativeOn=n.on,t(this.hasClickListener?"button":"span",this.getSvgWrapperData(),[t(a,n)])}},render(e){const t=this.getIcon();return"string"==typeof t?function(e){return/^[mzlhvcsqta]\s*[-+.0-9][^mlhvzcsqta]+/i.test(e)&&/[\dz]$/i.test(e)&&e.length>4}(t)?this.renderSvgIcon(t,e):this.renderFontIcon(t,e):this.renderSvgIconComponent(t,e)}}),x=r.ZP.extend({name:"v-icon",$_wrapperFor:k,functional:!0,render(e,{data:t,children:n}){let s="";return t.domProps&&(s=t.domProps.textContent||t.domProps.innerHTML||s,delete t.domProps.textContent,delete t.domProps.innerHTML),e(k,t,s?[s]:n)}});var P=n(9085);const $=r.ZP.extend({name:"transitionable",props:{mode:String,origin:String,transition:String}});var A=n(8298);const O=(0,C.Z)(m.Z,P.Z,$).extend({name:"v-alert",props:{border:{type:String,validator:e=>["top","right","bottom","left"].includes(e)},closeLabel:{type:String,default:"$vuetify.close"},coloredBorder:Boolean,dense:Boolean,dismissible:Boolean,closeIcon:{type:String,default:"$cancel"},icon:{default:"",type:[Boolean,String],validator:e=>"string"==typeof e||!1===e},outlined:Boolean,prominent:Boolean,text:Boolean,type:{type:String,validator:e=>["info","error","success","warning"].includes(e)},value:{type:Boolean,default:!0}},computed:{__cachedBorder(){if(!this.border)return null;let e={staticClass:"v-alert__border",class:{[`v-alert__border--${this.border}`]:!0}};return this.coloredBorder&&(e=this.setBackgroundColor(this.computedColor,e),e.class["v-alert__border--has-color"]=!0),this.$createElement("div",e)},__cachedDismissible(){if(!this.dismissible)return null;const e=this.iconColor;return this.$createElement(y,{staticClass:"v-alert__dismissible",props:{color:e,icon:!0,small:!0},attrs:{"aria-label":this.$vuetify.lang.t(this.closeLabel)},on:{click:()=>this.isActive=!1}},[this.$createElement(x,{props:{color:e}},this.closeIcon)])},__cachedIcon(){return this.computedIcon?this.$createElement(x,{staticClass:"v-alert__icon",props:{color:this.iconColor}},this.computedIcon):null},classes(){const e={...m.Z.options.computed.classes.call(this),"v-alert--border":Boolean(this.border),"v-alert--dense":this.dense,"v-alert--outlined":this.outlined,"v-alert--prominent":this.prominent,"v-alert--text":this.text};return this.border&&(e[`v-alert--border-${this.border}`]=!0),e},computedColor(){return this.color||this.type},computedIcon(){return!1!==this.icon&&("string"==typeof this.icon&&this.icon?this.icon:!!["error","info","success","warning"].includes(this.type)&&`$${this.type}`)},hasColoredIcon(){return this.hasText||Boolean(this.border)&&this.coloredBorder},hasText(){return this.text||this.outlined},iconColor(){return this.hasColoredIcon?this.computedColor:void 0},isDark(){return!(!this.type||this.coloredBorder||this.outlined)||D.Z.options.computed.isDark.call(this)}},created(){this.$attrs.hasOwnProperty("outline")&&(0,A.fK)("outline","outlined",this)},methods:{genWrapper(){const e=[this.$slots.prepend||this.__cachedIcon,this.genContent(),this.__cachedBorder,this.$slots.append,this.$scopedSlots.close?this.$scopedSlots.close({toggle:this.toggle}):this.__cachedDismissible];return this.$createElement("div",{staticClass:"v-alert__wrapper"},e)},genContent(){return this.$createElement("div",{staticClass:"v-alert__content"},this.$slots.default)},genAlert(){let e={staticClass:"v-alert",attrs:{role:"alert"},on:this.listeners$,class:this.classes,style:this.styles,directives:[{name:"show",value:this.isActive}]};return this.coloredBorder||(e=(this.hasText?this.setTextColor:this.setBackgroundColor)(this.computedColor,e)),this.$createElement("div",e,[this.genWrapper()])},toggle(){this.isActive=!this.isActive}},render(e){const t=this.genAlert();return this.transition?e("transition",{props:{name:this.transition,origin:this.origin,mode:this.mode}},[t]):t}});var T=n(936),B=n(6635),I=n(5925);n(4807),n(7023),n(5654),n(779),n(8793);var Z=function(e,t,n,s){var a,i=arguments.length,r=i<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,n):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,n,s);else for(var o=e.length-1;o>=0;o--)(a=e[o])&&(r=(i<3?a(r):i>3?a(t,n,r):a(t,n))||r);return i>3&&r&&Object.defineProperty(t,n,r),r};let j=class extends r.ZP{constructor(){super(...arguments),this.config=nodecg.bundleConfig,this.tagScanned=!1,this.scannedData=null}get mapArr(){return Object.entries(this.bbpMap)}get activeRunInArr(){return this.runArray.find((e=>{var t;return e.id===(null===(t=this.activeRun)||void 0===t?void 0:t.id)}))}get allPlayersRun(){var e;return(null===(e=this.activeRunInArr)||void 0===e?void 0:e.teams.reduce(((e,t)=>e.concat(...t.players)),[]))||[]}get allScannedPlayers(){return Object.values(this.bbpMap).reduce(((e,t)=>e.concat(...t)),[])}get leftToScan(){return(0,B.differenceWith)(this.allPlayersRun,this.allScannedPlayers,((e,t)=>e.name.toLowerCase()===t.user.displayName.toLowerCase()))}get disableChanges(){return"stopped"!==this.timer.state}manualAssign(e,t){nodecg.sendMessage("bigButtonManualAssign",{btn:e,player:t})}reset(){nodecg.sendMessage("bigbuttonResetPlayers")}created(){nodecg.listenFor("bigbuttonTagScanned",(({state:e,data:t})=>{window.clearTimeout(this.tagScanTimeout),this.tagScanned=e||!0,this.scannedData=t,this.tagScanTimeout=window.setTimeout((()=>{this.tagScanned=!1,this.scannedData=null}),7e3)}))}};Z([g.State((e=>e.reps.timer))],j.prototype,"timer",void 0),Z([g.State((e=>e.reps.runDataArray))],j.prototype,"runArray",void 0),Z([g.State((e=>e.reps.runDataActiveRun))],j.prototype,"activeRun",void 0),Z([g.State((e=>e.reps.bigbuttonPlayerMap))],j.prototype,"bbpMap",void 0),j=Z([I.default],j);const M=j,L=(0,n(5440).Z)(M,(function(){var e=this,t=e._self._c;return e._self._setupProxy,e.config.event.online?t(T.Z,[t("span",{staticClass:"font-italic"},[e._v("\n    Not used for online only events.\n  ")])]):e.config.flagcarrier.enabled?t(T.Z,["boolean"!=typeof e.tagScanned&&["success_player","success_comm"].includes(e.tagScanned)?t(O,{attrs:{type:"success"}},["success_player"===e.tagScanned?[e._v("\n      "+e._s(e.scannedData.user.displayName)+" scanned in as player on button\n      "+e._s(e.scannedData.flagcarrier.id)+"\n    ")]:"success_comm"===e.tagScanned?[e._v("\n      "+e._s(e.scannedData.user.displayName)+" scanned in as commentator on button\n      "+e._s(e.scannedData.flagcarrier.id)+"\n    ")]:e._e()],2):"fail_player"===e.tagScanned?t(O,{attrs:{type:"error"}},[e._v("\n    "+e._s(e.scannedData.user.displayName)+" scanned in on button\n    "+e._s(e.scannedData.flagcarrier.id)+" but already used by another team!\n  ")]):e.tagScanned?t(O,[e._v("\n    "+e._s(e.scannedData.user.displayName)+" scanned in on button\n    "+e._s(e.scannedData.flagcarrier.id)+" but no action is needed.\n  ")]):t(O,{staticClass:"font-italic"},[e._v("\n    Scan notifications will appear here.\n  ")]),e._v(" "),e.activeRun&&e.activeRunInArr?t("div",[e.activeRun.teams.length?t("div",[e._v("\n      All players scanned!\n    ")]):t("div",[t("div",[t("span",{staticClass:"font-weight-bold"},[e._v("Players left to scan:")]),e._v(" "),e.leftToScan.length?t("span",[e._v(e._s(e.leftToScan.map((e=>e.name)).join(", ")))]):t("span",[e._v("All scanned")])]),e._v(" "),t("div",[t("span",{staticClass:"font-weight-bold"},[e._v("Players currently scanned:")]),e._v(" "),e.allScannedPlayers.length?t("span",[e._v(e._s(e.allScannedPlayers.map((e=>e.user.displayName)).join(", ")))]):t("span",[e._v("None")])])]),e._v(" "),t("div",{staticClass:"mt-2"},[t("span",{staticClass:"text-h6"},[e._v("Button to Player Mappings")]),e._v(" "),e.mapArr.length?e._l(e.mapArr,(function([n,s]){return t("div",{key:n},[s.length?[t("span",{staticClass:"font-weight-bold"},[e._v("Button "+e._s(n)+":")]),e._v(" "),t("span",[e._v(e._s(s.map((e=>e.user.displayName)).join(", ")))])]:e._e()],2)})):t("div",[e._v("No button to player mapping to show.")])],2),e._v(" "),t(f.Z,{staticClass:"mt-2",attrs:{block:"",disabled:e.disableChanges},on:{click:e.reset}},[e._v("\n      Reset all player tag scanning\n    ")]),e._v(" "),e._l(e.config.flagcarrier.availableButtons,(function(n){return t("div",{directives:[{name:"show",rawName:"v-show",value:e.leftToScan.length,expression:"leftToScan.length"}],key:n.id,staticClass:"mt-2"},[e._v("\n      Manually Assign to "+e._s(n.id)+" ("+e._s(n.name)+")"),t("br"),e._v(" "),e._l(e.leftToScan,(function(s){return t(f.Z,{key:s.id,on:{click:function(t){return e.manualAssign(n.id,s)}}},[e._v("\n        "+e._s(s.name)+"\n      ")])}))],2)}))],2):t("div",[e._v("\n    There is currently no active run available.\n  ")])],1):t(T.Z,[t("span",{staticClass:"font-italic"},[e._v("\n    Flagcarrier support is not enabled.\n  ")])])}),[],!1,null,null,null).exports;var z=n(8586);r.ZP.use(z.ZP);let N=class extends l.g4{get reps(){return this.context.rootState.ReplicantModule.reps}};N=function(e,t,n,s){var a,i=arguments.length,r=i<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,n):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,n,s);else for(var o=e.length-1;o>=0;o--)(a=e[o])&&(r=(i<3?a(r):i>3?a(t,n,r):a(t,n))||r);return i>3&&r&&Object.defineProperty(t,n,r),r}([(0,l.Yl)({name:"OurModule"})],N);const E=new z.yh({strict:!1,state:{},modules:{ReplicantModule:h,OurModule:N}}),F=E;(0,l.rT)(N,E),function(e){return t=this,n=void 0,a=function*(){Object.keys(u).forEach((t=>{u[t].on("change",(n=>{e.commit("ReplicantModule/setState",{name:t,val:n})}))})),yield NodeCG.waitForReplicants(...Object.keys(u).map((e=>u[e]))),p=(0,l.rT)(h,e)},new((s=void 0)||(s=Promise))((function(e,i){function r(e){try{l(a.next(e))}catch(e){i(e)}}function o(e){try{l(a.throw(e))}catch(e){i(e)}}function l(t){var n;t.done?e(t.value):(n=t.value,n instanceof s?n:new s((function(e){e(n)}))).then(r,o)}l((a=a.apply(t,n||[])).next())}));var t,n,s,a}(F).then((()=>{new r.ZP({vuetify:v.Z,store:F,el:"#App",render:e=>e(L)})}))},779:(e,t,n)=>{"undefined"!=typeof Reflect&&Reflect.getMetadata},9405:(e,t,n)=>{n.d(t,{Z:()=>s});const s=n(5803).ZP.extend().extend({name:"themeable",provide(){return{theme:this.themeableProvide}},inject:{theme:{default:{isDark:!1}}},props:{dark:{type:Boolean,default:null},light:{type:Boolean,default:null}},data:()=>({themeableProvide:{isDark:!1}}),computed:{appIsDark(){return this.$vuetify.theme.dark||!1},isDark(){return!0===this.dark||!0!==this.light&&this.theme.isDark},themeClasses(){return{"theme--dark":this.isDark,"theme--light":!this.isDark}},rootIsDark(){return!0===this.dark||!0!==this.light&&this.appIsDark},rootThemeClasses(){return{"theme--dark":this.rootIsDark,"theme--light":!this.rootIsDark}}},watch:{isDark:{handler(e,t){e!==t&&(this.themeableProvide.isDark=this.isDark)},immediate:!0}}})},9085:(e,t,n)=>{n.d(t,{Z:()=>i,d:()=>a});var s=n(5803);function a(e="value",t="input"){return s.ZP.extend({name:"toggleable",model:{prop:e,event:t},props:{[e]:{required:!1}},data(){return{isActive:!!this[e]}},watch:{[e](e){this.isActive=!!e},isActive(n){!!n!==this[e]&&this.$emit(t,n)}}})}const i=a()},2377:(e,t,n)=>{n.d(t,{Do:()=>c,Ee:()=>h,RB:()=>d,XP:()=>u,ji:()=>r,kb:()=>o,qw:()=>a,uZ:()=>p,vO:()=>i});let s=!1;try{if("undefined"!=typeof window){const e=Object.defineProperty({},"passive",{get:()=>{s=!0}});window.addEventListener("testListener",e,e),window.removeEventListener("testListener",e,e)}}catch(e){console.warn(e)}function a(e,t,n){const s=t.length-1;if(s<0)return void 0===e?n:e;for(let a=0;a<s;a++){if(null==e)return n;e=e[t[a]]}return null==e||void 0===e[t[s]]?n:e[t[s]]}function i(e,t,n){return null!=e&&t&&"string"==typeof t?void 0!==e[t]?e[t]:a(e,(t=(t=t.replace(/\[(\w+)\]/g,".$1")).replace(/^\./,"")).split("."),n):n}function r(e,t){const n={};for(let s=0;s<t.length;s++){const a=t[s];void 0!==e[a]&&(n[a]=e[a])}return n}function o(e,t="px"){return null==e||""===e?void 0:isNaN(+e)?String(e):`${Number(e)}${t}`}function l(e){return null!==e&&"object"==typeof e}const c=Object.freeze({enter:13,tab:9,delete:46,esc:27,space:32,up:38,down:40,left:37,right:39,end:35,home:36,del:46,backspace:8,insert:45,pageup:33,pagedown:34,shift:16});function d(e,t){const n=e.$vuetify.icons.component;if(t.startsWith("$")){const n=i(e,`$vuetify.icons.values.${t.split("$").pop().split(".").pop()}`,t);if("string"!=typeof n)return n;t=n}return null==n?t:{component:n,props:{icon:t}}}function u(e){return Object.keys(e)}function p(e,t=0,n=1){return Math.max(t,Math.min(n,e))}function h(e={},t={}){for(const n in t){const s=e[n],a=t[n];l(s)&&l(a)?e[n]=h(s,a):e[n]=a}return e}}},n={};function s(e){var a=n[e];if(void 0!==a)return a.exports;var i=n[e]={id:e,loaded:!1,exports:{}};return t[e].call(i.exports,i,i.exports,s),i.loaded=!0,i.exports}s.m=t,e=[],s.O=(t,n,a,i)=>{if(!n){var r=1/0;for(d=0;d<e.length;d++){for(var[n,a,i]=e[d],o=!0,l=0;l<n.length;l++)(!1&i||r>=i)&&Object.keys(s.O).every((e=>s.O[e](n[l])))?n.splice(l--,1):(o=!1,i<r&&(r=i));if(o){e.splice(d--,1);var c=a();void 0!==c&&(t=c)}}return t}i=i||0;for(var d=e.length;d>0&&e[d-1][2]>i;d--)e[d]=e[d-1];e[d]=[n,a,i]},s.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return s.d(t,{a:t}),t},s.d=(e,t)=>{for(var n in t)s.o(t,n)&&!s.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},s.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),s.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),s.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.nmd=e=>(e.paths=[],e.children||(e.children=[]),e),(()=>{var e={747:0};s.O.j=t=>0===e[t];var t=(t,n)=>{var a,i,[r,o,l]=n,c=0;if(r.some((t=>0!==e[t]))){for(a in o)s.o(o,a)&&(s.m[a]=o[a]);if(l)var d=l(s)}for(t&&t(n);c<r.length;c++)i=r[c],s.o(e,i)&&e[i]&&e[i][0](),e[i]=0;return s.O(d)},n=self.webpackChunk=self.webpackChunk||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})();var a=s.O(void 0,[965,821,291,635],(()=>s(1773)));a=s.O(a)})();